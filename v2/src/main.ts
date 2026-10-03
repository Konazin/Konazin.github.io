import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLaptop } from './laptop';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

const copy = {
  pt: {
    skip:'Pular para a navegação de projetos', skipStatic:'Pular para os projetos', externalLinks:'Links externos', language:'Idioma', home:'Kona, início', chapterNav:'Ir para um projeto', domain:'SOFTWARE / LINUX / IA APLICADA',
    identity:'MIGUEL SOUSA / SOFTWARE E SISTEMAS', titleA:'EU CONSTRUO', titleB:'SOFTWARE OLHANDO', titleC:'PARA O QUE ACONTECE', titleD:'POR BAIXO DA INTERFACE.', heroIntro:'Tenho interesse em sistemas onde contexto, estado, persistência e execução precisam continuar compreensíveis quando as partes começam a interagir.', scroll:'ROLE PARA ACOMPANHAR A MÁQUINA ↓',
    pressureHeading:'SIMULAÇÃO / PRESSÃO DE MEMÓRIA', pressureObserve:'OBSERVAR → POLÍTICA → RECUPERAR', pressureHigh:'PRESSÃO ALTA / POLÍTICA AVALIA', pressureSafe:'PRESSÃO CONTROLADA / JOURNAL ATIVO',
    cpuPart:'CPU / EXECUÇÃO', cpuLead:'Um assistente de programação no terminal em que contexto, ferramentas e estado de sessão permanecem explícitos.', cpuDescription:'O projeto conecta modelos locais e APIs compatíveis a contexto selecionado pelo usuário, ferramentas para inspecionar código e sessões que podem ser retomadas. A parte importante não é apenas chamar um modelo, mas manter claro o que ele sabe, o que pode fazer e em qual estado a sessão está.', cpuRuntime:'Python / terminal', cpuModel:'Ollama / OpenAI-compatible', cpuContext:'selecionado pelo usuário', cpuTools:'read / tree / grep', cpuState:'sessões retomáveis', cpuNote:'Execução depende do contexto que chega até ela.',
    ramPart:'RAM / PRESSÃO DE MEMÓRIA', ramLead:'Um daemon Linux que observa pressão de memória antes de decidir se deve intervir.', ramDescription:'O sistema acompanha memória, swap e PSI e aplica políticas graduais sobre workloads usando cgroup v2. Simulação, opt-ins independentes, journal e rollback mantêm cada intervenção observável e reversível.', ramRuntime:'Rust / Linux', ramSignals:'memory / swap / PSI', ramControl:'cgroup v2', ramPolicy:'gradual / dry-run', ramRecovery:'journal / rollback', ramNote:'O problema não é apenas quanto de memória está sendo usado, mas como o sistema chega até esse estado.',
    ssdPart:'SSD / PERSISTÊNCIA', ssdLead:'Aplicação mobile em que sessões e histórico continuam disponíveis sem depender da rede.', ssdDescription:'SQLite mantém os dados do produto localmente. Exportação, validação e restauração de backup fazem parte do mesmo modelo de persistência, em vez de serem tratados como recursos separados adicionados depois.', ssdRuntime:'Expo / React Native', ssdStorage:'SQLite', ssdState:'sessões / histórico', ssdNetwork:'não obrigatório', ssdRecovery:'backup validado', ssdNote:'Persistência só fica interessante quando o estado precisa sobreviver ao uso real.',
    displayPart:'DISPLAY / PIPELINE VISUAL', displayLead:'Um fluxo que transforma briefing e contexto de marca em uma sequência visual reproduzível.', displayDescription:'O processo separa estrutura, direção visual e geração para que cada execução preserve decisões anteriores e produza assets que possam ser revisados. O objetivo não é apenas gerar uma imagem, mas deixar o caminho até ela explícito.', displayInput:'brief / brand context', displayStructure:'slide sequence', displayDirection:'visual specification', displayOutput:'PNG / manifest / HTML', displayStack:'Python / FastAPI / React', displayNote:'Uma saída visual é mais útil quando também é possível reconstruir as decisões que produziram ela.',
    repo:'VER CÓDIGO', systemHeading:'O comportamento aparece nas relações entre as partes.', systemSequence:'HARDWARE <b>→</b> SIGNAL <b>→</b> STATE <b>→</b> SOFTWARE', closeTitle:'Meu trabalho costuma começar onde a interface deixa de explicar o sistema.', closeCopy:'Software, sistemas Linux e IA aplicada. Projetos diferentes, geralmente guiados pelas mesmas perguntas sobre estado, controle, persistência e comportamento.', currentSite:'Site atual ↗'
  },
  en: {
    skip:'Skip to project navigation', skipStatic:'Skip to projects', externalLinks:'External links', language:'Language', home:'Kona, home', chapterNav:'Jump to a project', domain:'SOFTWARE / LINUX / APPLIED AI',
    identity:'MIGUEL SOUSA / SOFTWARE & SYSTEMS', titleA:'I BUILD', titleB:'SOFTWARE BY LOOKING', titleC:'AT WHAT HAPPENS', titleD:'BENEATH THE INTERFACE.', heroIntro:'I am interested in systems where context, state, persistence, and execution stay understandable as the parts begin to interact.', scroll:'SCROLL TO FOLLOW THE MACHINE ↓',
    pressureHeading:'SIMULATION / MEMORY PRESSURE', pressureObserve:'OBSERVE → POLICY → RECOVER', pressureHigh:'PRESSURE RISING / POLICY EVALUATES', pressureSafe:'PRESSURE CONTROLLED / JOURNAL ACTIVE',
    cpuPart:'CPU / EXECUTION', cpuLead:'A terminal coding assistant that keeps context, tools, and session state explicit.', cpuDescription:'The project connects local models and compatible APIs to user-selected context, tools for inspecting code, and resumable sessions. The point is not only to call a model, but to keep clear what it knows, what it can do, and what state the session is in.', cpuRuntime:'Python / terminal', cpuModel:'Ollama / OpenAI-compatible', cpuContext:'user-selected', cpuTools:'read / tree / grep', cpuState:'resumable sessions', cpuNote:'Execution depends on the context it receives.',
    ramPart:'RAM / MEMORY PRESSURE', ramLead:'A Linux daemon that observes memory pressure before deciding whether to intervene.', ramDescription:'It tracks memory, swap, and PSI, then applies gradual policies to workloads through cgroup v2. Simulation, independent opt-ins, a journal, and rollback keep each intervention observable and reversible.', ramRuntime:'Rust / Linux', ramSignals:'memory / swap / PSI', ramControl:'cgroup v2', ramPolicy:'gradual / dry-run', ramRecovery:'journal / rollback', ramNote:'The question is not only how much memory is in use, but how the system reached that state.',
    ssdPart:'SSD / PERSISTENCE', ssdLead:'A mobile app where sessions and history remain available without a network connection.', ssdDescription:'SQLite keeps product data on the device. Backup export, validation, and restore belong to the same persistence model instead of being treated as separate features added later.', ssdRuntime:'Expo / React Native', ssdStorage:'SQLite', ssdState:'sessions / history', ssdNetwork:'not required', ssdRecovery:'validated backup', ssdNote:'Persistence matters when state has to survive real use.',
    displayPart:'DISPLAY / VISUAL PIPELINE', displayLead:'A workflow that turns a brief and brand context into a repeatable visual sequence.', displayDescription:'The process separates structure, visual direction, and generation so each run carries previous decisions forward and produces reviewable assets. The goal is not only to generate an image, but to make the path to it explicit.', displayInput:'brief / brand context', displayStructure:'slide sequence', displayDirection:'visual specification', displayOutput:'PNG / manifest / HTML', displayStack:'Python / FastAPI / React', displayNote:'A visual output is more useful when the decisions behind it can be reconstructed.',
    repo:'VIEW CODE', systemHeading:'Behavior appears in the relationships between parts.', systemSequence:'HARDWARE <b>→</b> SIGNAL <b>→</b> STATE <b>→</b> SOFTWARE', closeTitle:'My work often starts where the interface stops explaining the system.', closeCopy:'Software, Linux systems, and applied AI. Different projects, often guided by the same questions about state, control, persistence, and behavior.', currentSite:'Current site ↗'
  }
} as const;
type Language = keyof typeof copy;
type Phase = 'hero' | 'cpu' | 'ram' | 'ssd' | 'display' | 'system';
const root = document.documentElement;
root.classList.remove('no-js'); root.classList.add('has-js');
const experience = document.querySelector<HTMLElement>('.experience')!;
const canvas = document.querySelector<HTMLCanvasElement>('#world')!;
const fallback = document.querySelector<HTMLElement>('#scene-fallback')!;
const panels = [...document.querySelectorAll<HTMLElement>('.project-detail')];
const progress = document.querySelector<HTMLElement>('#stage-progress')!;
const stageLabel = document.querySelector<HTMLElement>('#stage-label')!;
const pressureFill = document.querySelector<HTMLElement>('#pressure-fill')!;
const pressureState = document.querySelector<HTMLElement>('#pressure-state')!;
const anchorSvg = document.querySelector<SVGSVGElement>('#anchor-lines')!;
const anchorPath = document.querySelector<SVGPathElement>('#anchor-path')!;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 700px)');
let language: Language = 'pt';
let phase: Phase = 'hero';
let refreshScreen: (() => void) | undefined;
let staticStory = reduceMotion.matches || new URLSearchParams(location.search).has('static');
if (staticStory) root.classList.add('reduced-motion');
if (!staticStory) document.querySelector<HTMLAnchorElement>('.skip-link')!.href = '#chapter-nav';
else document.querySelector<HTMLElement>('.skip-link')!.textContent = copy.pt.skipStatic;
function translate(next: Language) {
  language = next; root.lang = next === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(element => { const key = element.dataset.i18n as keyof typeof copy.pt; element.innerHTML = copy[next][key]; });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach(element => { const key = element.dataset.i18nAria as keyof typeof copy.pt; element.setAttribute('aria-label', copy[next][key]); });
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === next)));
  if(staticStory) document.querySelector<HTMLElement>('.skip-link')!.textContent = copy[next].skipStatic;
  document.title = next === 'pt' ? 'Kona — Do sinal ao sistema' : 'Kona — From signal to system';
  document.querySelector('meta[name="description"]')?.setAttribute('content', next === 'pt' ? 'Miguel Sousa (Kona): software, sistemas Linux e IA aplicada.' : 'Miguel Sousa (Kona): software, Linux systems, and applied AI.');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', next === 'pt' ? 'Uma desmontagem interativa de projetos de software, sistemas e IA aplicada.' : 'An interactive teardown of software, systems, and applied AI projects.');
  stageLabel.textContent = labels[next][phase];
  pressureState.textContent = experience.dataset.pressure === 'high' ? copy[next].pressureHigh : copy[next].pressureSafe;
  refreshScreen?.();
}
document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(button => button.addEventListener('click', () => translate(button.dataset.lang as Language)));
const labels = {
  pt: { hero:'00 / EXTERIOR', cpu:'01 / CPU', ram:'02 / RAM', ssd:'03 / SSD', display:'04 / DISPLAY', system:'05 / SISTEMA' },
  en: { hero:'00 / EXTERIOR', cpu:'01 / CPU', ram:'02 / RAM', ssd:'03 / SSD', display:'04 / DISPLAY', system:'05 / SYSTEM' }
} as const;
translate(language);
function setPhase(next: Phase) {
  if (next === phase && !staticStory) return;
  phase = next; experience.dataset.phase = next; stageLabel.textContent = labels[language][next];
  panels.forEach(panel => { const active = staticStory || panel.dataset.project === next; panel.classList.toggle('is-active', active); panel.inert = !active; panel.setAttribute('aria-hidden', String(!active)); });
}
let trigger: ScrollTrigger | undefined;
const fallbackMode = () => {
  trigger?.kill();
  staticStory = true; root.classList.add('reduced-motion', 'no-webgl'); canvas.hidden = true; fallback.hidden = false;
  const skip=document.querySelector<HTMLAnchorElement>('.skip-link')!; skip.href='#projetos'; skip.textContent=copy[language].skipStatic;
  setPhase('hero');
};
let renderer: THREE.WebGLRenderer | undefined;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile.matches, alpha: true, powerPreference: 'low-power' }); }
catch { fallbackMode(); }
if (renderer) {
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#e3e7d7', '#101713', 2.2));
  const key = new THREE.DirectionalLight('#f2f3e6', 3.8); key.position.set(-3, 8, 6); scene.add(key);
  const rim = new THREE.DirectionalLight('#a0b963', 2.2); rim.position.set(5, 5, -4); scene.add(rim);
  const camera = new THREE.PerspectiveCamera(39, 1, .08, 70);
  const target = new THREE.Vector3();
  const laptop = createLaptop(); scene.add(laptop.root);
  refreshScreen = () => laptop.setScreen(phase==='hero'||phase==='system'?'boot':phase, 0, language);
  const keys = [
    {p:0, pos:[3.5,3.35,9.8], at:[0,1.1,0], root:[0,-.46,0], yaw:-.24, scale:1.55, fov:39},
    {p:.18, pos:[1.25,4.7,7.2], at:[0,.2,0], root:[0,-.4,0], yaw:.08, scale:1.52, fov:39},
    {p:.30, pos:[-1.8,3.25,5.1], at:[-1.3,.45,.15], root:[-1.12,-.38,0], yaw:-.12, scale:1.48, fov:40},
    {p:.46, pos:[-2.65,2.4,4.3], at:[-1.2,.08,-.55], root:[.12,-.5,0], yaw:.24, scale:1.55, fov:43},
    {p:.62, pos:[3.8,3.7,7.8], at:[1.55,1.1,1.5], root:[-.1,-.5,0], yaw:-.16, scale:1.45, fov:42},
    {p:.68, pos:[.1,2.7,8.15], at:[0,2.35,-1.42], root:[0,-.25,0], yaw:0, scale:1.45, fov:40},
    {p:.78, pos:[.1,2.7,8.15], at:[0,2.35,-1.42], root:[0,-.25,0], yaw:0, scale:1.45, fov:40},
    {p:.88, pos:[.35,13.1,2.7], at:[0,.1,0], root:[0,-.22,0], yaw:0, scale:1.4, fov:40},
    {p:1, pos:[.39,13.14,2.66], at:[.015,.08,0], root:[.012,-.215,.008], yaw:.004, scale:1.4, fov:40}
  ];
  const smooth = (v: number) => { const x = Math.max(0, Math.min(1, v)); return x*x*(3-2*x); };
  const windowed = (p: number, a: number, b: number, c: number, d: number) => smooth((p-a)/(b-a)) * (1-smooth((p-c)/(d-c)));
  const lerp = (a: number, b: number, t: number) => a+(b-a)*t;
  const vec = (v: number[], a: number[], b: number[], t: number) => { for (let i=0;i<3;i++) v[i]=lerp(a[i],b[i],t); };
  const projected = new THREE.Vector3();
  let currentProgress = 0;
  let lastScreen: Phase | '' = '';
  let finalPose: { camera:THREE.Vector3; target:THREE.Vector3; rootY:number; cpuY:number; ramX:number; ssdY:number } | undefined;
  function update(p: number) {
    currentProgress = p;
    let i = 0; while (i < keys.length-2 && p > keys[i+1].p) i++;
    const a = keys[i], b = keys[i+1], t = smooth((p-a.p)/(b.p-a.p));
    const cp = [0,0,0], ct = [0,0,0], rp = [0,0,0]; vec(cp,a.pos,b.pos,t); vec(ct,a.at,b.at,t); vec(rp,a.root,b.root,t);
    camera.position.set(cp[0],cp[1],cp[2]); target.set(ct[0],ct[1],ct[2]); camera.lookAt(target);
    camera.fov = lerp(a.fov,b.fov,t) + (mobile.matches ? 13 : 0); camera.updateProjectionMatrix();
    laptop.root.position.set(rp[0],rp[1],rp[2]); laptop.root.rotation.y=lerp(a.yaw,b.yaw,t); laptop.root.scale.setScalar(lerp(a.scale,b.scale,t));
    const open = smooth((p-.09)/.11);
    const interior = windowed(p,.18,.25,.70,.78);
    laptop.deck.position.set(0,.65*open+4.3*interior,.24*open); laptop.bottom.position.set(0,-.65*open,.1*open);
    laptop.battery.position.set(0,-.9*open,1.15*open); laptop.motherboard.position.set(-.15*open,-.35*open,0);
    laptop.cooling.position.set(1.15*open,-.25*open,-.35*open);
    const cpu = windowed(p,.19,.28,.36,.44);
    laptop.cpu.position.set(-.15*cpu,-.015+1.08*cpu,-.12+.68*cpu); laptop.cpu.scale.setScalar(1+.72*cpu);
    laptop.cpu.rotation.set(-.12*cpu,0,.035*cpu);
    laptop.cpuTraces.visible = p>.19 && p<.43; laptop.cpuTraces.position.y=.53*cpu;
    const ram = windowed(p,.37,.45,.53,.61);
    laptop.ram.position.set(1.4*ram,.72*ram,-.2*ram); laptop.ram.scale.setScalar(1+1.6*ram);
    laptop.memoryTraffic.visible = ram>.12;
    const pressure = p>.42 && p<.58 ? Math.sin((p-.42)/.16*Math.PI) : 0;
    laptop.memoryTraffic.scale.y=1+Math.max(0,pressure)*3.3;
    laptop.memoryTraffic.position.y=pressure*.18;
    pressureFill.style.transform=`scaleX(${Math.max(.12,pressure)})`;
    experience.style.setProperty('--pressure',pressure.toFixed(2));
    const pressureMode = pressure > .57 ? 'high' : 'controlled';
    if(experience.dataset.pressure !== pressureMode){experience.dataset.pressure=pressureMode;pressureState.textContent=pressureMode==='high'?copy[language].pressureHigh:copy[language].pressureSafe;}
    const ssd = windowed(p,.54,.63,.7,.78);
    laptop.ssd.position.set(.56+1.35*ssd,-.045+1.2*ssd,.81+1.2*ssd); laptop.ssd.rotation.y=-.18*ssd; laptop.ssd.scale.setScalar(1+2.05*ssd);
    laptop.storageRecords.visible=ssd>.1; laptop.storageRecords.position.y=.24*ssd;
    const display = smooth((p-.66)/.08), top = smooth((p-.78)/.10);
    laptop.lid.position.set(0,.22+.68*open+.32*display,-1.68-.35*display-2.3*top);
    laptop.lid.scale.setScalar(1+.18*display); laptop.lid.rotation.x=-1.42*top;
    laptop.lid.position.y+=1.0*top;
    laptop.deck.position.set(-4.5*top,laptop.deck.position.y+.65*top,laptop.deck.position.z+1.2*top);
    laptop.bottom.position.set(4.5*top,laptop.bottom.position.y-.35*top,laptop.bottom.position.z+.7*top);
    laptop.motherboard.position.y+=.3*top;
    laptop.cpu.position.x-=1.0*top; laptop.ram.position.x-=1.75*top; laptop.ssd.position.x+=1.75*top; laptop.battery.position.z+=.9*top;
    const next: Phase = p<.23?'hero':p<.42?'cpu':p<.58?'ram':p<.68?'ssd':p<.78?'display':'system';
    if(next!==phase) setPhase(next);
    if(next!==lastScreen || next==='ram') { laptop.setScreen(next==='hero'||next==='system'?'boot':next, pressure, language); lastScreen=next; }
    progress.style.transform=`scaleX(${p})`;
    if(next==='cpu' || next==='ram' || next==='ssd' || next==='display') {
      const part = next==='cpu'?laptop.cpu:next==='ram'?laptop.ram:next==='ssd'?laptop.ssd:laptop.lid;
      part.getWorldPosition(projected); projected.project(camera);
      const x=(projected.x*.5+.5)*innerWidth, y=(-projected.y*.5+.5)*innerHeight;
      const panel=document.querySelector<HTMLElement>(`.project-detail[data-project="${next}"]`)!;
      const rect=panel.getBoundingClientRect(); const endX=rect.left+rect.width*(rect.left>innerWidth/2?.06:.94), endY=rect.top+Math.min(90,rect.height*.2);
      anchorSvg.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);
      anchorPath.setAttribute('d',`M${x.toFixed(1)},${y.toFixed(1)} L${lerp(x,endX,.55).toFixed(1)},${y.toFixed(1)} L${endX.toFixed(1)},${endY.toFixed(1)}`);
      anchorSvg.style.opacity=projected.z>1?'0':'1';
    } else anchorSvg.style.opacity='0';
    if(p>=.82)finalPose={camera:camera.position.clone(),target:target.clone(),rootY:laptop.root.position.y,cpuY:laptop.cpu.position.y,ramX:laptop.ram.position.x,ssdY:laptop.ssd.position.y};
  }
  function resize() { const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight; renderer!.setPixelRatio(Math.min(devicePixelRatio,mobile.matches?1.1:1.5)); renderer!.setSize(w,h,false); camera.aspect=w/h; update(currentProgress); }
  let raf=0, running=false;
  function draw(){
    if(currentProgress>=.84&&finalPose){
      const drift=Math.sin(performance.now()*.00038)*.012;
      camera.position.copy(finalPose.camera).add(new THREE.Vector3(drift*.7,drift*.4,0));camera.lookAt(finalPose.target);
      laptop.root.position.y=finalPose.rootY+drift*.16;laptop.root.rotation.x=drift*.025;
      laptop.cpu.position.y=finalPose.cpuY+drift;laptop.ram.position.x=finalPose.ramX+drift*.55;laptop.ssd.position.y=finalPose.ssdY-drift*.7;
    }
    renderer!.render(scene,camera); if(running) raf=requestAnimationFrame(draw);
  }
  function renderWhileVisible(visible:boolean){
    if(visible && !running){running=true;draw();}
    else if(!visible && running){running=false;cancelAnimationFrame(raf);}
  }
  resize(); canvas.style.opacity='1'; fallback.style.opacity='0';
  canvas.addEventListener('webglcontextlost', event=>{event.preventDefault(); renderWhileVisible(false); fallbackMode();});
  addEventListener('resize',resize,{passive:true}); mobile.addEventListener('change',resize);
  if(!staticStory){
    const observer=new IntersectionObserver(([entry])=>renderWhileVisible(entry.isIntersecting && !document.hidden));
    observer.observe(experience);
    document.addEventListener('visibilitychange',()=>renderWhileVisible(!document.hidden && experience.getBoundingClientRect().bottom>0 && experience.getBoundingClientRect().top<innerHeight));
    trigger = ScrollTrigger.create({trigger:experience,start:'top top',end:()=>`+=${innerHeight*10}`,pin:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>update(self.progress)});
    const jumpPoints = {cpu:.31,ram:.47,ssd:.61,display:.73};
    document.querySelectorAll<HTMLAnchorElement>('[data-jump]').forEach(link=>link.addEventListener('click',event=>{
      event.preventDefault(); const p=jumpPoints[link.dataset.jump as keyof typeof jumpPoints];
      scrollTo({top:trigger!.start+(trigger!.end-trigger!.start)*p,behavior:'smooth'});
    }));
    document.querySelector('.scroll-cue')?.addEventListener('click',()=>scrollTo({top:innerHeight*1.6,behavior:'smooth'}));
    ScrollTrigger.refresh();
  } else { update(0); renderer.render(scene,camera); setPhase('hero'); }
}
