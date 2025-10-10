#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const APP_ROOT = path.join(process.cwd(), 'src', 'app')
const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 4010
const DEFAULT_START_TIMEOUT = 60_000
const NEXT_BIN = process.platform === 'win32' ? 'npx.cmd' : 'npx'

function requireNode18() {
  if (typeof fetch !== 'function') {
    console.error('This script requires Node.js 18 or newer (global fetch not found).')
    process.exit(1)
  }
}

function ensureAppRootExists() {
  if (!fs.existsSync(APP_ROOT)) {
    console.error(`Missing Next.js app directory at ${APP_ROOT}`)
    process.exit(1)
  }
}

function collectPublicRoutes() {
  const discovered = new Set()
  const skipped = []
  const stack = [{ dir: APP_ROOT, segments: [] }]

  while (stack.length > 0) {
    const { dir, segments } = stack.pop()

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name === 'admin' || entry.name === 'api') {
          skipped.push({ route: `/${segments.concat(entry.name).join('/')}`, reason: `${entry.name} skipped` })
          continue
        }

        stack.push({ dir: path.join(dir, entry.name), segments: segments.concat(entry.name) })
        continue
      }

      if (!entry.isFile() || entry.name !== 'page.tsx') {
        continue
      }

      const routeSegments = segments.filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')))

      if (routeSegments.some((segment) => segment.includes('['))) {
        skipped.push({ route: `/${routeSegments.join('/')}`, reason: 'dynamic route needs params' })
        continue
      }

      if (routeSegments.includes('admin')) {
        skipped.push({ route: `/${routeSegments.join('/')}`, reason: 'admin route' })
        continue
      }

      const route = routeSegments.length ? `/${routeSegments.join('/')}` : '/'
      discovered.add(route)
    }
  }

  return { routes: [...discovered].sort(), skipped }
}

function runNextBuild() {
  console.log('Running `next build` before route tests...')
  const result = spawnSync(NEXT_BIN, ['next', 'build'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: process.platform === 'win32',
  })

  if (result.status !== 0) {
    throw new Error(`next build failed (${result.status ?? 'unknown'})`)
  }
}

function startNextServer(host, port) {
  console.log(`Starting Next.js -> http://${host}:${port}`)
  const child = spawn(NEXT_BIN, ['next', 'start', '-H', host, '-p', String(port)], {
    cwd: process.cwd(),
    shell: process.platform === 'win32',
  })

  child.on('error', (error) => {
    console.error('next start error:', error)
  })

  return child
}

function waitForServerReady(child, timeoutMs) {
  return new Promise((resolve, reject) => {
    let ready = false
    const buffer = []

    const cleanup = () => {
      child.stdout.off('data', handleData)
      child.stderr.off('data', handleData)
      child.off('exit', handleExit)
      clearTimeout(timer)
    }

    const handleData = (chunk) => {
      const text = chunk.toString()
      buffer.push(text)
      process.stdout.write(text)

      if (!ready && /started server/i.test(text)) {
        ready = true
        cleanup()
        resolve()
      }
    }

    const handleExit = (code) => {
      if (!ready) {
        ready = true
        cleanup()
        reject(new Error(`Next.js server exited prematurely (${code ?? 'unknown'})\n${buffer.join('')}`))
      }
    }

    const timer = setTimeout(() => {
      if (!ready) {
        ready = true
        cleanup()
        reject(new Error(`Timed out waiting for Next.js server to start (${timeoutMs}ms)`))
      }
    }, timeoutMs)

    child.stdout.on('data', handleData)
    child.stderr.on('data', handleData)
    child.once('exit', handleExit)
  })
}

async function fetchRouteStatuses(routes, baseUrl) {
  const results = []

  for (const route of routes) {
    const url = new URL(route, baseUrl).toString()

    try {
      const response = await fetch(url, { redirect: 'manual' })
      const ok = response.status < 400
      console.log(`${ok ? 'PASS' : 'FAIL'} ${route} -> ${response.status} ${response.statusText ?? ''}`.trim())
      results.push({ route, status: response.status, ok })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.log(`FAIL ${route} -> ${message}`)
      results.push({ route, status: null, ok: false })
    }
  }

  return results
}

function stopNextServer(child) {
  if (!child || child.exitCode !== null || child.signalCode) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const finish = () => resolve()

    child.once('exit', finish)
    child.kill('SIGINT')

    setTimeout(() => {
      if (child.exitCode !== null || child.signalCode) {
        return
      }

      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
      } else {
        child.kill('SIGKILL')
      }
    }, 3_000)
  })
}

function registerSigintHandler(nextProcessRef) {
  let shuttingDown = false

  process.on('SIGINT', async () => {
    if (shuttingDown) {
      return
    }

    shuttingDown = true
    console.log('\nSIGINT received, stopping Next.js...')
    await stopNextServer(nextProcessRef.current)
    process.exit(1)
  })
}

async function main() {
  requireNode18()
  ensureAppRootExists()

  const host = process.env.ROUTE_TEST_HOST || DEFAULT_HOST
  const port = Number(process.env.ROUTE_TEST_PORT ?? DEFAULT_PORT)
  const startTimeout = Number(process.env.ROUTE_TEST_START_TIMEOUT ?? DEFAULT_START_TIMEOUT)
  const skipBuild = process.env.ROUTE_TEST_SKIP_BUILD === '1'

  const { routes, skipped } = collectPublicRoutes()

  if (routes.length === 0) {
    console.warn('No public routes detected.')
    if (skipped.length > 0) {
      console.warn('Skipped:')
      for (const entry of skipped) {
        console.warn(`  - ${entry.route} (${entry.reason})`)
      }
    }
    return
  }

  console.log(`Testing ${routes.length} public route(s):`)
  for (const route of routes) {
    console.log(`  - ${route}`)
  }

  if (skipped.length > 0) {
    console.log('Skipped:')
    for (const entry of skipped) {
      console.log(`  - ${entry.route} (${entry.reason})`)
    }
  }

  if (!skipBuild) {
    runNextBuild()
  } else {
    console.log('Skipping `next build` because ROUTE_TEST_SKIP_BUILD=1')
  }

  const nextProcessRef = { current: null }
  registerSigintHandler(nextProcessRef)

  try {
    nextProcessRef.current = startNextServer(host, port)
    await waitForServerReady(nextProcessRef.current, startTimeout)

    const baseUrl = `http://${host}:${port}`
    console.log(`Checking routes against ${baseUrl}`)

    const results = await fetchRouteStatuses(routes, baseUrl)
    const failures = results.filter((result) => !result.ok)

    if (failures.length > 0) {
      console.error(`Route checks failed for ${failures.length} route(s).`)
      for (const failure of failures) {
        const statusText = failure.status === null ? 'no response' : `status ${failure.status}`
        console.error(`  - ${failure.route}: ${statusText}`)
      }
      process.exitCode = 1
    } else {
      console.log('All public routes responded with status < 400.')
    }
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  } finally {
    await stopNextServer(nextProcessRef.current)
    nextProcessRef.current = null
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
