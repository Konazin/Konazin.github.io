import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLaptop } from './laptop';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

const copy = {
  pt: {
    skip:'Pular para a navegação de projetos', skipStatic:'Pular para os projetos', externalLinks:'Links externos', githubExternal:'GitHub (abre em nova aba)', linkedinExternal:'LinkedIn (abre em nova aba)', footerLinkedIn:'Falar no LinkedIn (abre em nova aba)', language:'Idioma', home:'Kona — Alone and Unafraid, início', chapterNav:'Ir para um projeto', projectsRegion:'Projetos', domain:'BACKEND / SISTEMAS / IA APLICADA',
    identity:'MIGUEL SOUSA / BACKEND & SISTEMAS', titleA:'EU CONSTRUO', titleB:'SOFTWARE OLHANDO', titleC:'PARA O QUE ACONTECE', titleD:'POR BAIXO DA INTERFACE.', heroIntro:'Desenvolvo software com foco em backend e sistemas: APIs, persistência, Linux e IA aplicada quando o problema pede.', heroCta:'VER PROJETOS', scroll:'ROLE PARA ACOMPANHAR A MÁQUINA ↓',
    pressureHeading:'OBSERVAÇÃO / PRESSÃO DE MEMÓRIA', pressureObserve:'OBSERVAR → SIMULAR → RECUPERAR', pressureHigh:'SIMULAÇÃO / INTERVENÇÃO BLOQUEADA POR PADRÃO', pressureSafe:'MODO OBSERVAÇÃO / SEM ALTERAÇÃO',
    cpuPart:'CPU / EXECUÇÃO', cpuLead:'Assistente de programação experimental para terminal, com contexto explícito e sessões locais.', cpuDescription:'MVP em Python com Ollama local e APIs compatíveis, habilidades Markdown, sessões locais e comandos para ler e buscar no projeto. Arquivos não são carregados automaticamente; edição, shell e ciclos autônomos ainda não estão implementados.', cpuRuntime:'Python / Rich TUI', cpuModel:'Ollama / APIs compatíveis', cpuContext:'adicionado pela pessoa', cpuTools:'read / tree / grep', cpuState:'sessões locais',
    ramPart:'RAM / PRESSÃO DE MEMÓRIA', ramLead:'Daemon Linux para observar pressão de memória e simular políticas reversíveis por sessão.', ramDescription:'Observação e simulação são o padrão; mudanças exigem opt-ins independentes. O controle experimental altera apenas memory.low por sessão, com journal e rollback; não encerra ou congela processos nem ajusta sysctls.', ramRuntime:'Rust / Linux', ramSignals:'memory / swap / PSI', ramControl:'cgroup v2', ramPolicy:'observe / dry-run', ramRecovery:'journal / rollback',
    ssdPart:'SSD / PERSISTÊNCIA', ssdLead:'App mobile local-first para treinos, com sessões e histórico disponíveis offline.', ssdDescription:'App Expo/React Native com SQLite no dispositivo, sessões e histórico offline, além de exportação, validação e restauração de backups. API Java/PostgreSQL e cliente web são opcionais, fora do runtime mobile padrão.', ssdRuntime:'Expo / React Native', ssdStorage:'SQLite local', ssdState:'sessões / histórico', ssdNetwork:'não exigida', ssdRecovery:'backup validado',
    repo:'VER CÓDIGO', cpuRepoLink:'Abrir o repositório ZeroCoding no GitHub (nova aba)', ramRepoLink:'Abrir o repositório Fenrir no GitHub (nova aba)', ssdRepoLink:'Abrir o repositório Training App no GitHub (nova aba)', contactLinkedIn:'FALAR NO LINKEDIN ↗', systemHeading:'Três projetos, um fio condutor: sistemas compreensíveis.', systemSequence:'BACKEND <b>→</b> SISTEMA <b>→</b> ESTADO <b>→</b> RECUPERAÇÃO', closeTitle:'Backend, Linux e aplicações completas.', closeCopy:'Foco em backend e sistemas, com interfaces web e mobile quando o produto pede. Cada projeto explora contexto, estado, persistência ou controle.'
  },
  en: {
    skip:'Skip to project navigation', skipStatic:'Skip to projects', externalLinks:'External links', githubExternal:'GitHub (opens in a new tab)', linkedinExternal:'LinkedIn (opens in a new tab)', footerLinkedIn:'Contact on LinkedIn (opens in a new tab)', language:'Language', home:'Kona — Alone and Unafraid, home', chapterNav:'Jump to a project', projectsRegion:'Projects', domain:'BACKEND / SYSTEMS / APPLIED AI',
    identity:'MIGUEL SOUSA / BACKEND & SYSTEMS', titleA:'I BUILD', titleB:'SOFTWARE BY LOOKING', titleC:'AT WHAT HAPPENS', titleD:'BENEATH THE INTERFACE.', heroIntro:'I build software focused on backend and systems: APIs, persistence, Linux, and applied AI where it fits.', heroCta:'VIEW PROJECTS', scroll:'SCROLL TO FOLLOW THE MACHINE ↓',
    pressureHeading:'OBSERVATION / MEMORY PRESSURE', pressureObserve:'OBSERVE → SIMULATE → RECOVER', pressureHigh:'SIMULATION / INTERVENTION DISABLED BY DEFAULT', pressureSafe:'OBSERVE MODE / NO MUTATION',
    cpuPart:'CPU / EXECUTION', cpuLead:'An experimental terminal coding assistant with explicit context and local sessions.', cpuDescription:'A Python MVP with local Ollama and compatible APIs, Markdown skills, local sessions, and project read/search commands. Files are not loaded automatically; editing, shell commands, and autonomous loops are not implemented.', cpuRuntime:'Python / Rich TUI', cpuModel:'Ollama / compatible APIs', cpuContext:'explicitly added', cpuTools:'read / tree / grep', cpuState:'local sessions',
    ramPart:'RAM / MEMORY PRESSURE', ramLead:'A Linux daemon for observing memory pressure and simulating reversible per-session policies.', ramDescription:'Observation and simulation are defaults; changes require independent opt-ins. Experimental control only changes per-session memory.low, with a journal and rollback; it does not kill or freeze processes or change sysctls.', ramRuntime:'Rust / Linux', ramSignals:'memory / swap / PSI', ramControl:'cgroup v2', ramPolicy:'observe / dry-run', ramRecovery:'journal / rollback',
    ssdPart:'SSD / PERSISTENCE', ssdLead:'A local-first training app with sessions and history available offline.', ssdDescription:'An Expo/React Native app with on-device SQLite, offline sessions and history, and backup export, validation, and restore. The Java/PostgreSQL API and web client are optional and outside the standard mobile runtime.', ssdRuntime:'Expo / React Native', ssdStorage:'on-device SQLite', ssdState:'sessions / history', ssdNetwork:'not required', ssdRecovery:'validated backup',
    repo:'VIEW CODE', cpuRepoLink:'Open the ZeroCoding repository on GitHub (new tab)', ramRepoLink:'Open the Fenrir repository on GitHub (new tab)', ssdRepoLink:'Open the Training App repository on GitHub (new tab)', contactLinkedIn:'CONTACT ON LINKEDIN ↗', systemHeading:'Three projects, one thread: systems that stay understandable.', systemSequence:'BACKEND <b>→</b> SYSTEM <b>→</b> STATE <b>→</b> RECOVERY', closeTitle:'Backend, Linux, and complete applications.', closeCopy:'Focused on backend and systems, with web and mobile interfaces when the product calls for them. Each project explores context, state, persistence, or control.'
  }
} as const;
type Language = keyof typeof copy;
type Phase = 'hero' | 'cpu' | 'ram' | 'ssd' | 'system';
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
  pt: { hero:'00 / EXTERIOR', cpu:'01 / CPU', ram:'02 / RAM', ssd:'03 / SSD', system:'04 / SISTEMA' },
  en: { hero:'00 / EXTERIOR', cpu:'01 / CPU', ram:'02 / RAM', ssd:'03 / SSD', system:'04 / SYSTEM' }
} as const;
translate(language);
function setPhase(next: Phase) {
  if (next === phase && !staticStory) return;
  phase = next; experience.dataset.phase = next; stageLabel.textContent = labels[language][next];
  document.querySelectorAll<HTMLAnchorElement>('.chapter-jump [data-jump]').forEach(link => {
    if(link.dataset.jump===next) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  });
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
if (staticStory) { canvas.hidden = true; fallback.hidden = false; }
else {
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile.matches, alpha: true, powerPreference: 'low-power' }); }
  catch { fallbackMode(); }
}
if (renderer) {
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#e3e7d7', '#101713', 2.2));
  const key = new THREE.DirectionalLight('#f2f3e6', 3.8); key.position.set(-3, 8, 6); scene.add(key);
  const rim = new THREE.DirectionalLight('#a0b963', 2.2); rim.position.set(5, 5, -4); scene.add(rim);
  const camera = new THREE.PerspectiveCamera(39, 1, .08, 70);
  const target = new THREE.Vector3();
  const laptop = createLaptop(); scene.add(laptop.root);
  refreshScreen = () => laptop.setScreen(phase==='hero'?'boot':phase==='system'?'overview':phase, 0, language);
  const keys = [
    {p:0, pos:[0,5.1,16], at:[0,1.55,0], root:[2.4,-.15,0], yaw:-.18, scale:1.05, fov:43},
    {p:.18, pos:[0,5.1,16], at:[0,1.55,0], root:[-3.35,-.15,0], yaw:.04, scale:1.05, fov:43},
    {p:.30, pos:[0,5.1,16], at:[0,1.55,0], root:[-3.35,-.15,0], yaw:-.08, scale:1.05, fov:43},
    {p:.46, pos:[0,5.1,16], at:[0,1.55,0], root:[2.8,-.15,0], yaw:.12, scale:1.05, fov:43},
    {p:.62, pos:[0,5.1,16], at:[0,1.55,0], root:[2.8,-.15,0], yaw:-.12, scale:1.05, fov:43},
    {p:.68, pos:[0,5.1,16], at:[0,1.55,0], root:[2.8,-.15,0], yaw:0, scale:1.05, fov:43},
    {p:.78, pos:[0,5.1,16], at:[0,1.55,0], root:[0,-.15,0], yaw:0, scale:1.05, fov:43},
    {p:.88, pos:[0,5.1,16], at:[0,1.55,0], root:[0,-.15,0], yaw:0, scale:1.05, fov:43},
    {p:1, pos:[0,5.1,16], at:[0,1.55,0], root:[0,-.15,0], yaw:0, scale:1.05, fov:43}
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
    camera.position.set(cp[0],mobile.matches?5.4:cp[1],mobile.matches?13.5:cp[2]); target.set(ct[0],mobile.matches?.4:ct[1],ct[2]); camera.lookAt(target);
    camera.fov = lerp(a.fov,b.fov,t) + (mobile.matches ? 13 : 0); camera.updateProjectionMatrix();
    laptop.root.position.set(mobile.matches?0:rp[0],mobile.matches?rp[1]+2.4:rp[1],rp[2]); laptop.root.rotation.y=lerp(a.yaw,b.yaw,t); laptop.root.scale.setScalar(lerp(a.scale,b.scale,t)*(mobile.matches?.72:lerp(1.25,1.08,smooth(p/.18))));
    const open = smooth((p-.09)/.11);
    const interior = windowed(p,.18,.24,.74,.80);
    laptop.deck.position.set(0,.65*open+1.65*interior,.24*open); laptop.bottom.position.set(0,-.12*open,.02*open);
    laptop.battery.position.set(0,-.2*open,.2*open); laptop.motherboard.position.set(-.15*open,.45*interior-.12*open,0);
    laptop.cooling.position.set(1.15*open,.3*interior-.12*open,-.2*open);
    const cpu = windowed(p,.18,.29,.35,.44);
    laptop.cpu.position.set(-.15*cpu,-.015+1.42*cpu,-.12+.3*cpu); laptop.cpu.scale.setScalar(1+.5*cpu);
    laptop.cpu.rotation.set(-.12*cpu,0,.035*cpu);
    laptop.cpuTraces.visible = p>.19 && p<.43; laptop.cpuTraces.position.y=.53*cpu;
    const ram = windowed(p,.36,.47,.52,.62);
    laptop.ram.position.set(.25*ram,1.55*ram,-.2*ram); laptop.ram.scale.setScalar(1+.5*ram);
    laptop.memoryTraffic.visible = ram>.12;
    const pressure = p>.42 && p<.58 ? Math.sin((p-.42)/.16*Math.PI) : 0;
    laptop.memoryTraffic.scale.y=1+Math.max(0,pressure)*3.3;
    laptop.memoryTraffic.position.y=pressure*.18;
    pressureFill.style.transform=`scaleX(${Math.max(.12,pressure)})`;
    experience.style.setProperty('--pressure',pressure.toFixed(2));
    const pressureMode = pressure > .57 ? 'high' : 'controlled';
    if(experience.dataset.pressure !== pressureMode){experience.dataset.pressure=pressureMode;pressureState.textContent=pressureMode==='high'?copy[language].pressureHigh:copy[language].pressureSafe;}
    const ssd = windowed(p,.55,.65,.70,.80);
    laptop.ssd.position.set(.56+.25*ssd,-.045+1.48*ssd,.81+.2*ssd); laptop.ssd.rotation.y=-.18*ssd; laptop.ssd.scale.setScalar(1+.4*ssd);
    laptop.storageRecords.visible=ssd>.1; laptop.storageRecords.position.y=.24*ssd;
    laptop.lid.position.set(0,.22+.68*open+1.65*interior,-1.68-.18*interior);
    const next: Phase = p<.23?'hero':p<.42?'cpu':p<.58?'ram':p<.78?'ssd':'system';
    if(next!==phase) setPhase(next);
    if(next!==lastScreen || next==='ram') { laptop.setScreen(next==='hero'?'boot':next==='system'?'overview':next, pressure, language); lastScreen=next; }
    progress.style.transform=`scaleX(${p})`;
    if(next==='cpu' || next==='ram' || next==='ssd') {
      const part = next==='cpu'?laptop.cpu:next==='ram'?laptop.ram:laptop.ssd;
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
    trigger = ScrollTrigger.create({trigger:experience,start:'top top',end:()=>`+=${innerHeight*7.5}`,pin:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>update(self.progress)});
    const jumpPoints = {cpu:.31,ram:.50,ssd:.68} as const;
    const jumpLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-jump]')];
    function visitProject(project: keyof typeof jumpPoints, behavior: ScrollBehavior = 'smooth') {
      const p=jumpPoints[project];
      scrollTo({top:trigger!.start+(trigger!.end-trigger!.start)*p,behavior});
    }
    function restoreLocation() {
      const link=jumpLinks.find(item=>item.hash===location.hash);
      if(link){visitProject(link.dataset.jump as keyof typeof jumpPoints);return;}
      if(!location.hash || location.hash==='#inicio'){scrollTo({top:0,behavior:'smooth'});return;}
      document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'smooth'});
    }
    jumpLinks.forEach(link=>link.addEventListener('click',event=>{
      event.preventDefault();
      const project=link.dataset.jump as keyof typeof jumpPoints;
      if(location.hash!==link.hash)history.pushState({portfolioProject:project},'',link.hash);
      visitProject(project);
    }));
    window.addEventListener('popstate',()=>setTimeout(restoreLocation,0));
    document.querySelector('.scroll-cue')?.addEventListener('click',()=>scrollTo({top:innerHeight*1.6,behavior:'smooth'}));
    ScrollTrigger.refresh();
    if(location.hash)requestAnimationFrame(()=>requestAnimationFrame(restoreLocation));
  }
} else setPhase('hero');
