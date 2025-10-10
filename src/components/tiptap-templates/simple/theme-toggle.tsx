'use client'

import * as React from "react"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"

// --- Icons ---
import { MoonStarIcon } from "@/components/tiptap-icons/moon-star-icon"
import { SunIcon } from "@/components/tiptap-icons/sun-icon"

const STORAGE_KEY = "tiptap-theme"

function getInitialMode(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "dark" || stored === "light") {
    return stored === "dark"
  }

  if (document.documentElement.classList.contains("dark")) {
    return true
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(getInitialMode)

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (event: MediaQueryListEvent) => {
      const storedPreference = window.localStorage.getItem(STORAGE_KEY)
      if (storedPreference === "dark" || storedPreference === "light") {
        return
      }
      setIsDarkMode(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = () =>
    setIsDarkMode((isDark) => {
      const nextMode = !isDark
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, nextMode ? "dark" : "light")
      }
      return nextMode
    })

  return (
    <Button
      onClick={toggleDarkMode}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      data-style="ghost"
    >
      {isDarkMode ? (
        <MoonStarIcon className="tiptap-button-icon" />
      ) : (
        <SunIcon className="tiptap-button-icon" />
      )}
    </Button>
  )
}
