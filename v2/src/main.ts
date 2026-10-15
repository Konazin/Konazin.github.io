import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import { createLaptop, poseLaptop } from './laptop';
import { copy } from './copy';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

type Language = keyof typeof copy;
type Phase = 'hero' | 'map' | 'cpu' | 'ram' | 'ssd';
type Part = 'cpu' | 'ram' | 'ssd';
type Rect = { l: number; r: number; t: number; b: number };

const PHASES: Phase[] = ['hero', 'map', 'cpu', 'ram', 'ssd'];
/** Scroll progress (0–1 over the pinned stretch) at which each scene takes over. */
const PHASE_AT = [0, .17, .37, .57, .77];
/** Where a jump link parks the scroll inside each scene. */
const JUMP: Record<Phase, number> = { hero: 0, map: .27, cpu: .47, ram: .67, ssd: .9 };
const HASH: Record<string, Phase> = { '#inicio': 'hero', '#mapa': 'map', '#cpu-project': 'cpu', '#ram-project': 'ram', '#ssd-project': 'ssd' };
const STAGE: Record<Language, Record<Phase, string>> = {
  pt: { hero: '00 / EXTERIOR', map: '01 / MAPA', cpu: '02 / CPU', ram: '03 / RAM', ssd: '04 / SSD' },
  en: { hero: '00 / EXTERIOR', map: '01 / MAP', cpu: '02 / CPU', ram: '03 / RAM', ssd: '04 / SSD' }
};
const META: Record<Language, { title: string; description: string; ogDescription: string }> = {
  pt: { title: 'Miguel Sousa (Kona) — Desenvolvimento de Software & Backend', description: 'Miguel Sousa (Kona): desenvolvimento de software com base forte em backend, Linux, APIs e segurança.', ogDescription: 'Desenvolvimento de software com base forte em backend, Linux, APIs e segurança.' },
  en: { title: 'Miguel Sousa (Kona) — Software Development & Backend', description: 'Miguel Sousa (Kona): software development with a strong backend foundation, Linux, APIs, and security.', ogDescription: 'Software development with a strong backend foundation, Linux, APIs, and security.' }
};

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const root = document.documentElement;
root.classList.remove('no-js'); root.classList.add('has-js');
const experience = $('.experience');
const canvas = $<HTMLCanvasElement>('#world');
const topbar = $('.topbar');
const uis = [...document.querySelectorAll<HTMLElement>('.ui')];
const railSteps = [...document.querySelectorAll<HTMLElement>('.progress-rail li')];
const stageLabel = $('#stage-label');
const pressureFill = $('#pressure-fill');
const pressureState = $('#pressure-state');
const anchorSvg = document.querySelector<SVGSVGElement>('#anchor-lines')!;
const anchorPaths: Record<Part, SVGPathElement> = { cpu: document.querySelector<SVGPathElement>('#anchor-cpu')!, ram: document.querySelector<SVGPathElement>('#anchor-ram')!, ssd: document.querySelector<SVGPathElement>('#anchor-ssd')! };
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 820px)');

let language: Language = 'pt';
let phase: Phase = 'hero';
let refreshScreen: (() => void) | undefined;
let staticStory = reduceMotion.matches || new URLSearchParams(location.search).has('static');
if (staticStory) root.classList.add('reduced-motion');

const screenMode = (p: Phase) => (p === 'hero' ? 'boot' : p === 'map' ? 'overview' : p);

function translate(next: Language) {
  language = next; root.lang = next === 'pt' ? 'pt-BR' : 'en';
  const dict = copy[next] as Record<string, string>;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => { const value = dict[el.dataset.i18n!]; if (value !== undefined) el.innerHTML = value; });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach(el => { const value = dict[el.dataset.i18nAria!]; if (value !== undefined) el.setAttribute('aria-label', value); });
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === next)));
  const meta = META[next]; document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.ogDescription);
  stageLabel.textContent = STAGE[next][phase];
  pressureState.textContent = experience.dataset.pressure === 'high' ? dict.pressureHigh : dict.pressureSafe;
  refreshScreen?.();
}
document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(button => button.addEventListener('click', () => translate(button.dataset.lang as Language)));
translate(language);

// The CV button only appears once a PDF is actually published next to the page.
fetch('./cv.pdf', { method: 'HEAD' }).then(response => {
  if (response.ok && !(response.headers.get('content-type') || '').includes('text/html')) document.querySelectorAll('[data-cv]').forEach(el => el.removeAttribute('hidden'));
}).catch(() => { /* offline or no PDF: keep the button hidden */ });

function setPhase(next: Phase) {
  phase = next; experience.dataset.phase = next; stageLabel.textContent = STAGE[language][next];
  const index = PHASES.indexOf(next);
  railSteps.forEach((step, i) => { step.classList.toggle('is-done', i <= index); step.classList.toggle('is-current', i === index); });
  uis.forEach(ui => { const active = staticStory || ui.dataset.ui === next; ui.classList.toggle('is-active', active); ui.inert = !active; });
  document.querySelectorAll<HTMLAnchorElement>('.chapter-pills a').forEach(link => { if (link.dataset.jump === next) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
}

let trigger: ScrollTrigger | undefined;
const fallbackMode = () => {
  trigger?.kill(); staticStory = true; root.classList.add('reduced-motion', 'no-webgl'); canvas.hidden = true;
  setPhase('hero');
};

let renderer: THREE.WebGLRenderer | undefined;
if (staticStory) { canvas.hidden = true; }
else {
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile.matches, alpha: true, powerPreference: 'low-power' }); }
  catch { fallbackMode(); }
}

/** Render at least 1.5x on desktop: a 1080p monitor (dpr 1) otherwise shows the model and the screen text soft. */
const renderRatio = () => (mobile.matches ? Math.min(devicePixelRatio, 1.5) : Math.min(Math.max(devicePixelRatio, 1.5), 2));
const smooth = (v: number) => { const x = Math.max(0, Math.min(1, v)); return x * x * (3 - 2 * x); };
const windowed = (p: number, a: number, b: number, c: number, d: number) => smooth((p - a) / (b - a)) * (1 - smooth((p - c) / (d - c)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function addLights(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight('#e3e7d7', '#101713', 2.2));
  const key = new THREE.DirectionalLight('#f2f3e6', 3.8); key.position.set(-3, 8, 6); scene.add(key);
  const rim = new THREE.DirectionalLight('#a0b963', 2.2); rim.position.set(5, 5, -4); scene.add(rim);
}

if (renderer) {
  const gl = renderer;
  const scene = new THREE.Scene(); addLights(scene);
  const camera = new THREE.PerspectiveCamera(32, 1, .08, 70);
  const laptop = createLaptop(); scene.add(laptop.root);
  laptop.lid.rotation.x = -.08;
  refreshScreen = () => laptop.setScreen(screenMode(phase), pressureNow, language);

  const YAW: Array<[number, number]> = [[0, -.42], [.17, -.36], [.37, -.3], [.57, -.22], [.77, -.34], [1, -.34]];
  const yawAt = (p: number) => { let i = 0; while (i < YAW.length - 2 && p > YAW[i + 1][0]) i++; const [a, ya] = YAW[i], [b, yb] = YAW[i + 1]; return lerp(ya, yb, smooth((p - a) / (b - a))); };

  let currentProgress = 0, pressureNow = 0, lastScreen = '';
  const fitBox = new THREE.Box3(), tmpBox = new THREE.Box3(), fitSphere = new THREE.Sphere(), corner = new THREE.Vector3();
  const fitDir = new THREE.Vector3(0, 5, 13).normalize();
  let fitBand: Rect | undefined;

  /** Bounding box of what is actually visible (hidden helper groups would inflate it). */
  function measure(obj: THREE.Object3D) {
    if (!obj.visible) return;
    const geometry = (obj as THREE.Mesh).geometry as THREE.BufferGeometry | undefined;
    if (geometry) { if (!geometry.boundingBox) geometry.computeBoundingBox(); tmpBox.copy(geometry.boundingBox!).applyMatrix4(obj.matrixWorld); fitBox.union(tmpBox); }
    for (const child of obj.children) measure(child);
  }
  function projectedBounds() {
    camera.updateMatrixWorld(); let minX = 1, maxX = -1, minY = 1, maxY = -1;
    for (let i = 0; i < 8; i++) {
      corner.set(i & 1 ? fitBox.max.x : fitBox.min.x, i & 2 ? fitBox.max.y : fitBox.min.y, i & 4 ? fitBox.max.z : fitBox.min.z).project(camera);
      minX = Math.min(minX, corner.x); maxX = Math.max(maxX, corner.x); minY = Math.min(minY, corner.y); maxY = Math.max(maxY, corner.y);
    }
    return { minX, maxX, minY, maxY };
  }

  const rectOf = (selector: string) => document.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
  /** The free area (viewport px) the notebook may occupy in the current scene: between the copy and the spec column on desktop, between the top controls and the text sheet on mobile. */
  function freeBand(): Rect {
    const top = topbar.getBoundingClientRect().bottom;
    const progressTop = rectOf('.progress').top;
    if (mobile.matches) {
      if (phase === 'hero') return { l: 0, r: innerWidth, t: top + 8, b: rectOf('.ui-hero .hero-copy').top - 8 };
      if (phase === 'map') return { l: 0, r: innerWidth, t: rectOf('.ui-map .map-copy').bottom + 8, b: rectOf('#callout-cpu').top - 8 };
      return { l: 0, r: innerWidth, t: rectOf(`.ui-chapter[data-ui=${phase}] .chapter-pills`).bottom + 8, b: rectOf(`.ui-chapter[data-ui=${phase}] .chapter-sheet`).top - 8 };
    }
    const gap = 24;
    const lefts = phase === 'hero' ? ['.ui-hero .hero-copy', '.ui-hero .hero-intro'] : phase === 'map' ? ['.ui-map .map-copy', '#callout-cpu'] : [`.ui-chapter[data-ui=${phase}] .chapter-copy`];
    const rights = phase === 'hero' ? ['.ui-hero .parts-index'] : phase === 'map' ? ['#callout-ram', '#callout-ssd'] : [`.ui-chapter[data-ui=${phase}] .spec-column`];
    return { l: Math.max(...lefts.map(s => rectOf(s).right)) + gap, r: Math.min(...rights.map(s => rectOf(s).left)) - gap, t: top + 12, b: progressTop - 12 };
  }

  /** Dolly the camera until the visible model fits the free band, then shift the view so it sits as close to the page centre as the band allows. */
  function fit(ease: number) {
    if (fitBox.isEmpty()) return;
    const view = canvas.getBoundingClientRect(), w = view.width || innerWidth, h = view.height || innerHeight;
    const raw = freeBand(), next: Rect = { l: raw.l - view.left, r: raw.r - view.left, t: raw.t - view.top, b: raw.b - view.top };
    if (!fitBand || ease >= 1) fitBand = { ...next }; else for (const k of ['l', 'r', 't', 'b'] as const) fitBand[k] += (next[k] - fitBand[k]) * ease;
    const bandW = Math.max(160, fitBand.r - fitBand.l), bandH = Math.max(140, fitBand.b - fitBand.t);
    camera.fov = mobile.matches ? 36 : 30; camera.aspect = w / h; camera.clearViewOffset(); camera.updateProjectionMatrix();
    fitBox.getBoundingSphere(fitSphere);
    let distance = fitSphere.radius / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2);
    const place = () => { camera.position.copy(fitSphere.center).addScaledVector(fitDir, distance); camera.lookAt(fitSphere.center); camera.updateMatrixWorld(); };
    let b = projectedBounds();
    for (let i = 0; i < 3; i++) {
      place(); b = projectedBounds();
      distance *= Math.max(((b.maxX - b.minX) / 2 * w) / (bandW * .97), ((b.maxY - b.minY) / 2 * h) / (bandH * .96));
    }
    place(); b = projectedBounds();
    const modelW = (b.maxX - b.minX) / 2 * w;
    const cx = ((b.minX + b.maxX) / 2 * .5 + .5) * w, cy = (-(b.minY + b.maxY) / 2 * .5 + .5) * h;
    const targetX = mobile.matches ? w / 2 : Math.min(Math.max(w / 2, fitBand.l + modelW / 2), fitBand.r - modelW / 2);
    camera.setViewOffset(w, h, cx - targetX, cy - (fitBand.t + bandH / 2), w, h);
  }

  const partRef: Record<Part, { object: THREE.Object3D; local: THREE.Vector3 }> = {
    cpu: { object: laptop.cpu, local: new THREE.Vector3(0, .17, 0) },
    ram: { object: laptop.ram, local: new THREE.Vector3(-1.3, .1, -.31) },
    ssd: { object: laptop.ssd, local: new THREE.Vector3(0, .12, 0) }
  };
  const probe = new THREE.Vector3();
  /** Leader lines from the 3D parts to their callouts (map) or to the spec sheet (chapters). */
  function updateAnchors() {
    const view = canvas.getBoundingClientRect(), w = view.width || innerWidth, h = view.height || innerHeight;
    anchorSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const draw = (part: Part, target: DOMRect | null) => {
      const path = anchorPaths[part];
      if (!target || mobile.matches) { path.style.opacity = '0'; return; }
      probe.copy(partRef[part].local); partRef[part].object.localToWorld(probe); probe.project(camera);
      const x = (probe.x * .5 + .5) * w, y = (-probe.y * .5 + .5) * h;
      const toRight = target.left - view.left > x, ex = (toRight ? target.left : target.right) - view.left, ey = target.top - view.top + Math.min(30, target.height / 2);
      const dir = toRight ? 1 : -1;
      path.setAttribute('d', `M${x.toFixed(1)},${y.toFixed(1)} L${(ex - dir * 36).toFixed(1)},${y.toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)}`);
      path.style.opacity = probe.z > 1 ? '0' : '1';
    };
    if (phase === 'map') (['cpu', 'ram', 'ssd'] as const).forEach(part => draw(part, rectOf(`#callout-${part}`)));
    else (['cpu', 'ram', 'ssd'] as const).forEach(part => draw(part, part === phase ? rectOf(`.ui-chapter[data-ui=${part}] .spec-sheet`) : null));
  }

  function update(p: number) {
    currentProgress = p;
    const open = smooth((p - .02) / .12), interior = smooth((p - .06) / .13);
    const cpuLift = windowed(p, .31, .39, .51, .57), ramLift = windowed(p, .57, .65, .71, .77), ssdLift = smooth((p - .77) / .08);
    laptop.root.rotation.y = yawAt(p);
    poseLaptop(laptop, { open, interior, cpu: cpuLift, ram: ramLift, ssd: ssdLift });
    pressureNow = p > .6 && p < .74 ? Math.sin((p - .6) / .14 * Math.PI) : 0;
    { const grow = 1 + pressureNow * 3.3; laptop.memoryTraffic.scale.y = grow; laptop.memoryTraffic.position.y = .1375 * (1 - grow); } // grow upward from the chips
    pressureFill.style.transform = `scaleX(${Math.max(.12, pressureNow)})`;
    experience.style.setProperty('--pressure', pressureNow.toFixed(2));
    const pressureMode = pressureNow > .57 ? 'high' : 'controlled';
    if (experience.dataset.pressure !== pressureMode) {
      experience.dataset.pressure = pressureMode;
      pressureState.textContent = (copy[language] as Record<string, string>)[pressureMode === 'high' ? 'pressureHigh' : 'pressureSafe'];
    }

    let index = 0; PHASE_AT.forEach((at, i) => { if (p >= at) index = i; });
    const next = PHASES[index];
    if (next !== phase) setPhase(next);
    laptop.setHighlight(next === 'map' ? ['cpu', 'ram', 'ssd'] : next === 'hero' ? [] : [next]);
    const signature = `${next}:${Math.round(pressureNow * 8)}`;
    if (signature !== lastScreen) { laptop.setScreen(screenMode(next), pressureNow, language); lastScreen = signature; }
    laptop.root.updateMatrixWorld(true); fitBox.makeEmpty(); measure(laptop.root);
  }

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    gl.setPixelRatio(renderRatio()); gl.setSize(w, h, false);
    camera.aspect = w / h; fitBand = undefined; update(currentProgress); fit(1); updateAnchors();
  }
  let raf = 0, running = false;
  function draw() {
    fit(.18); updateAnchors(); gl.render(scene, camera);
    if (running) raf = requestAnimationFrame(draw);
  }
  function renderWhileVisible(visible: boolean) {
    if (visible && !running) { running = true; draw(); }
    else if (!visible && running) { running = false; cancelAnimationFrame(raf); }
  }
  setPhase('hero'); resize(); canvas.style.opacity = '1';
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); renderWhileVisible(false); fallbackMode(); });
  addEventListener('resize', resize, { passive: true }); mobile.addEventListener('change', resize);
  // The notebook screen is a canvas texture: redraw it once the page fonts are really available.
  if (document.fonts) Promise.all(['400', '500', '700'].map(w => document.fonts.load(`${w} 16px "JetBrains Mono"`))).then(() => { laptop.setScreen(screenMode(phase), pressureNow, language, true); fitBand = undefined; fit(1); });

  if (!staticStory) {
    // rAF already pauses in hidden tabs, so visibility in the viewport is the only condition to render.
    new IntersectionObserver(entries => renderWhileVisible(entries[entries.length - 1].isIntersecting)).observe(experience);
    trigger = ScrollTrigger.create({ trigger: experience, start: 'top top', end: () => `+=${innerHeight * 5}`, pin: true, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: self => update(self.progress) });
    const visit = (target: Phase, behavior: ScrollBehavior = 'smooth') => scrollTo({ top: trigger!.start + (trigger!.end - trigger!.start) * JUMP[target], behavior });
    const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-jump]')];
    links.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      visit(link.dataset.jump as Phase);
    }));
    const restore = () => {
      const target = HASH[location.hash];
      if (target) { visit(target); return; }
      if (!location.hash) { scrollTo({ top: 0, behavior: 'smooth' }); return; }
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    };
    addEventListener('popstate', () => setTimeout(restore, 0));
    ScrollTrigger.refresh();
    if (location.hash) requestAnimationFrame(() => requestAnimationFrame(restore));
  }
} else setPhase('hero');

/** Closing scene: a second, lightweight renderer where the notebook shuts its lid as the section scrolls in. */
function initContact() {
  const contactCanvas = $<HTMLCanvasElement>('#contact-canvas');
  if (staticStory || !renderer) { contactCanvas.hidden = true; return; }
  let gl: THREE.WebGLRenderer;
  try { gl = new THREE.WebGLRenderer({ canvas: contactCanvas, antialias: !mobile.matches, alpha: true, powerPreference: 'low-power' }); }
  catch { contactCanvas.hidden = true; return; }
  const scene = new THREE.Scene(); addLights(scene);
  const camera = new THREE.PerspectiveCamera(30, 600 / 420, .1, 60);
  const laptop = createLaptop(); laptop.root.rotation.y = -.55; scene.add(laptop.root);
  camera.position.set(0, 6.4, 12.5); camera.lookAt(0, .7, 0);
  let closed = 0, running = false, raf = 0;
  // The closed lid rests on the keycaps (y .47) instead of hovering above them.
  const apply = () => { laptop.lid.rotation.x = lerp(-.08, 1.545, closed); laptop.lid.position.y = lerp(.22, .47, closed); };
  const resizeContact = () => { const w = contactCanvas.clientWidth || 600, h = contactCanvas.clientHeight || 420; gl.setPixelRatio(renderRatio()); gl.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const frame = () => { apply(); gl.render(scene, camera); if (running) raf = requestAnimationFrame(frame); };
  resizeContact(); addEventListener('resize', resizeContact, { passive: true });
  new IntersectionObserver(entries => { const entry = entries[entries.length - 1]; if (entry.isIntersecting && !running) { running = true; frame(); } else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf); } }).observe(contactCanvas);
  // Ends when the section's bottom meets the viewport bottom, which the last section always reaches (a fixed 'top 20%' never completed on tall screens).
  ScrollTrigger.create({ trigger: '#contato', start: 'top 85%', end: 'bottom bottom', scrub: true, onUpdate: self => { closed = smooth(Math.min(1, self.progress * 1.15)); } });
  contactCanvas.addEventListener('webglcontextlost', event => { event.preventDefault(); running = false; contactCanvas.hidden = true; });
}
initContact();
