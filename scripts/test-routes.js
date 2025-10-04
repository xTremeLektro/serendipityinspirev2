#!/usr/bin/env node
"use strict";
const{spawn,spawnSync}=require("child_process"),fs=require("fs"),path=require("path");
if(typeof fetch!="function"){console.error("Node 18+ needed");process.exit(1);}
const a=path.join(process.cwd(),"src","app");
if(!fs.existsSync(a)){console.error(`Missing ${a}`);process.exit(1);}
const h=process.env.ROUTE_TEST_HOST||"127.0.0.1",p=+process.env.ROUTE_TEST_PORT||4010,w=+process.env.ROUTE_TEST_START_TIMEOUT||6e4,s=process.env.ROUTE_TEST_SKIP_BUILD==="1",n=process.platform==="win32"?"npx.cmd":"npx";
const f=()=>{const r=new Set,k=[],q=[{d:a,s:[]}];
for(;q.length;){const{d,s}=q.pop();for(const e of fs.readdirSync(d,{withFileTypes:!0})){ 
if(e.isDirectory()){
if(e.name==="admin"||e.name==="api"){k.push({r:"/"+s.concat(e.name).join("/"),x:`${e.name} skipped`});continue;}
q.push({d:path.join(d,e.name),s:s.concat(e.name)});continue;}
if(!e.isFile()||e.name!=="page.tsx")continue;
const c=s.filter((t)=>!(t.startsWith("(")&&t.endsWith(")")));
if(c.some((t)=>t.includes("["))){k.push({r:"/"+c.join("/"),x:"dynamic route needs params"});continue;}
if(c.includes("admin")){k.push({r:"/"+c.join("/"),x:"admin route"});continue;}
r.add(c.length?"/"+c.join("/"):"/");}}
return{routes:[...r].sort(),skipped:k};};
const b=()=>{console.log("next build (route tests)...");const g=spawnSync(n,["next","build"],{stdio:"inherit",cwd:process.cwd(),shell:process.platform==="win32"});if(g.status!==0)throw new Error(`next build failed (${g.status??"unknown"})`);};
const t=()=>{console.log(`next start -> http://${h}:${p}`);const g=spawn(n,["next","start","-H",h,"-p",String(p)],{cwd:process.cwd(),shell:process.platform==="win32"});g.on("error",(y)=>console.error("next start error:",y));return g;};
const y=(g)=>new Promise((u,v)=>{let l=!1;const o=[],m=()=>{g.stdout.off("data",d);g.stderr.off("data",d);g.off("exit",i);clearTimeout(z);},
d=(x)=>{const j=x.toString();o.push(j);process.stdout.write(j);if(!l&&/started server/i.test(j)){l=!0;m();u();}},
i=(x)=>{if(!l){l=!0;m();v(new Error(`next server exited early (${x??"unknown"})\n${o.join("")}`));}},
z=setTimeout(()=>{if(!l){l=!0;m();v(new Error(`Timed out waiting for Next.js (${w}ms)`));}},w);
g.stdout.on("data",d);g.stderr.on("data",d);g.once("exit",i);});
const R=async(r,E)=>{const L=[];for(const c of r){const U=new URL(c,E).toString();
try{const g=await fetch(U,{redirect:"manual"}),S=g.status<400;console.log(`${S?"PASS":"FAIL"} ${c} -> ${g.status} ${g.statusText??""}`.trim());L.push({route:c,status:g.status,ok:S});}
catch(g){console.log(`FAIL ${c} -> ${g.message}`);L.push({route:c,status:null,ok:!1});}}
return L;};
const O=(g)=>{if(!g||g.exitCode!==null||g.signalCode)return Promise.resolve();return new Promise((u)=>{const v=()=>u();
g.once("exit",v);g.kill("SIGINT");setTimeout(()=>{if(g.exitCode!==null||g.signalCode)return;process.platform==="win32"?spawnSync("taskkill",["/PID",String(g.pid),"/T","/F"],{stdio:"ignore"}):g.kill("SIGKILL");},3e3);});};
let C=null,D=!1;
process.on("SIGINT",async()=>{if(D)return;D=!0;console.log("\nSIGINT received, stopping Next.js...");await O(C);process.exit(1);});
(async()=>{const{routes:r,skipped:k}=f();
if(!r.length){console.warn("No public routes detected.");if(k.length){console.warn("Skipped:");for(const e of k)console.warn(`  - ${e.r} (${e.x})`);}return;}
console.log(`Testing ${r.length} public route(s):`);
for(const e of r)console.log(`  - ${e}`);
if(k.length){console.log("Skipped:");for(const e of k)console.log(`  - ${e.r} (${e.x})`);}
if(!s)b();else console.log("Skipping next build because ROUTE_TEST_SKIP_BUILD=1");
try{C=t();
await y(C);
const E=`http://${h}:${p}`;
console.log(`Checking routes against ${E}`);
const L=await R(r,E),F=L.filter((e)=>!e.ok);
if(F.length){
console.error(`Route checks failed for ${F.length} route(s).`);
for(const e of F)
console.error("  - "+e.route+": "+(e.status===null?"no response":"status "+e.status));
process.exitCode=1;}
else console.log("All public routes responded with status < 400.");
}catch(e){console.error(e);process.exitCode=1;}
finally{await O(C);C=null;}})().catch((e)=>{console.error(e);process.exit(1);});


