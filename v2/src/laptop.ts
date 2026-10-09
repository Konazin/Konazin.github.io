import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const material = (color: string, roughness = 0.68, metalness = 0.2) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const shell = material('#30342e', .36, .55);
const shellEdge = material('#5a5f54', .34, .62);
const graphite = material('#171a17', .5, .24);
const keycap = material('#353a33', .5, .28);
const keyLegend = new THREE.MeshBasicMaterial({ color: '#a4aa97' });
const board = material('#41624c', .63, .22);
const boardEdge = material('#668065', .48, .31);
const dimmBoard = material('#779d66', .5, .28);
const dimmChip = material('#b5c99b', .4, .24);
const ssdBoard = material('#5a8b5a', .46, .32);
const chip = material('#202a20', .42, .3);
const packageMat = material('#39483a', .46, .3);
const metal = material('#969b8d', .27, .74);
const cpuHeatSpreader = material('#c8cec2', .24, .55);
const copper = material('#b28a54', .3, .72);
const solder = material('#d0ad67', .31, .7);
const green = new THREE.MeshStandardMaterial({ color: '#c4ee48', emissive: '#526e18', emissiveIntensity: .55, roughness: .42 });
const trackpointMat = material('#e45543', .34, .22);

function box(parent: THREE.Object3D, name: string, size: [number, number, number], position: [number, number, number], color: THREE.Material, radius = .035) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 3, Math.min(radius, Math.min(...size) * .44)), color);
  mesh.name = name;
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}
function cylinder(parent: THREE.Object3D, name: string, radius: number, length: number, position: [number, number, number], color: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 20), color);
  mesh.name = name; mesh.rotation.z = Math.PI / 2; mesh.position.set(...position); parent.add(mesh); return mesh;
}
function line(parent: THREE.Object3D, points: THREE.Vector3[], color: THREE.ColorRepresentation | THREE.LineBasicMaterial, opacity = 1) {
  const lineMaterial = color instanceof THREE.Material ? color : new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
  const mesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial);
  parent.add(mesh); return mesh;
}
function outline(parent: THREE.Object3D, geometry: THREE.BufferGeometry, position: THREE.Vector3, color = '#c4ee48') {
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 22), new THREE.LineBasicMaterial({ color, transparent: true, opacity: .8 }));
  edges.position.copy(position); parent.add(edges); return edges;
}

export type LaptopParts = {
  root: THREE.Group; physical: THREE.Group; lid: THREE.Group; deck: THREE.Group; bottom: THREE.Group;
  battery: THREE.Group; motherboard: THREE.Group; cpu: THREE.Group; ram: THREE.Group; ssd: THREE.Group; cooling: THREE.Group;
  cpuTraces: THREE.Group; memoryTraffic: THREE.Group; storageRecords: THREE.Group;
  setScreen: (mode: 'boot' | 'cpu' | 'ram' | 'ssd' | 'overview', pressure?: number, language?: 'pt' | 'en') => void;
};

export function createLaptop(): LaptopParts {
  const root = new THREE.Group(); root.name = 'K/CORE — industrial notebook';
  const physical = new THREE.Group(); physical.name = 'physical hardware'; root.add(physical);

  const bottom = new THREE.Group(); bottom.name = 'lower chassis'; physical.add(bottom);
  box(bottom, 'CNC lower shell', [5.55, .24, 3.58], [0, 0, 0], shell, .14);
  box(bottom, 'front palm-rest lip', [5.43, .12, .11], [0, -.02, 1.77], shellEdge, .045);
  box(bottom, 'rear hinge rail', [5.1, .16, .15], [0, .08, -1.72], graphite, .045);
  for (const x of [-2.35, 2.35]) for (const z of [-1.42, 1.42]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .035, 20), graphite);
    foot.position.set(x, -.13, z); bottom.add(foot);
  }
  for (const x of [-2.28, 2.28]) {
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .025, 16), metal);
    screw.position.set(x, .125, 1.42); bottom.add(screw);
  }
  // Side I/O openings give the silhouette readable detail without external textures.
  for (const z of [-.72, -.22, .3, .75]) {
    box(bottom, 'left-side port recess', [.035, .12, .27], [-2.77, .015, z], graphite, .012);
    box(bottom, 'right-side port recess', [.035, .12, .27], [2.77, .015, z], graphite, .012);
  }
  box(bottom, 'USB-A tongue', [.012, .035, .14], [-2.79, .025, -.22], copper, .006);
  box(bottom, 'USB-C tongue', [.012, .022, .12], [2.79, .025, .3], metal, .006);
  for (let i = 0; i < 9; i++) box(bottom, 'rear exhaust slot', [.24, .02, .035], [-1.02 + i * .255, .126, -1.71], graphite, .008);

  const deck = new THREE.Group(); deck.name = 'keyboard and input deck'; physical.add(deck);
  box(deck, 'keyboard deck plate', [5.48, .15, 3.46], [0, .17, 0], shellEdge, .12);
  box(deck, 'keyboard well', [4.78, .055, 1.58], [0, .265, -.55], graphite, .07);
  const rows = 6, cols = 13, keyCount = rows * cols;
  const keyGeometry = new RoundedBoxGeometry(.278, .064, .184, 2, .024);
  const keyInstances = new THREE.InstancedMesh(keyGeometry, keycap, keyCount);
  keyInstances.name = 'sculpted keyboard keycaps';
  const legends = new THREE.InstancedMesh(new THREE.BoxGeometry(.07, .006, .012), keyLegend, keyCount);
  legends.name = 'key legends';
  const transform = new THREE.Object3D(); let index = 0;
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    const x = -2.22 + col * .37 + (row === 5 && col > 8 ? .12 : 0);
    const z = -1.14 + row * .235;
    const width = row === 5 && col === 6 ? .62 : .278;
    transform.position.set(x, .313, z); transform.scale.set(width / .278, 1, 1); transform.updateMatrix(); keyInstances.setMatrixAt(index, transform.matrix);
    transform.position.set(x - .055, .35, z - .035); transform.scale.set(1, 1, 1); transform.updateMatrix(); legends.setMatrixAt(index, transform.matrix);
    index++;
  }
  deck.add(keyInstances, legends);
  box(deck, 'glass touchpad', [1.24, .025, .72], [0, .264, .94], material('#252923', .2, .35), .1);
  const touchpadLine = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-.57, .28, .66), new THREE.Vector3(.57, .28, .66), new THREE.Vector3(.57, .28, 1.22), new THREE.Vector3(-.57, .28, 1.22)
  ]), new THREE.LineBasicMaterial({ color: '#697066', transparent: true, opacity: .65 })); deck.add(touchpadLine);
  const trackpoint = new THREE.Mesh(new THREE.SphereGeometry(.078, 18, 12), trackpointMat);
  trackpoint.scale.y = .68; trackpoint.position.set(-.37, .37, -.43); trackpoint.name = 'red pointing stick'; deck.add(trackpoint);
  for (const [i,x] of [-.42, 0, .42].entries()) box(deck, `trackpoint click ${i + 1}`, [.34, .035, .12], [x, .28, .48], graphite, .04);
  for (const x of [-2.25, 2.25]) for (let i = 0; i < 12; i++) {
    const hole = new THREE.Mesh(new THREE.SphereGeometry(.018, 8, 6), graphite);
    hole.position.set(x, .266, -.35 + i * .075); deck.add(hole);
  }

  const lid = new THREE.Group(); lid.name = 'display assembly'; lid.position.set(0, .22, -1.68); physical.add(lid);
  box(lid, 'beveled display lid', [5.5, 3.34, .16], [0, 1.72, 0], shell, .16);
  box(lid, 'inner display bezel', [5.14, 2.99, .035], [0, 1.72, .093], graphite, .11);
  box(lid, 'anti-glare display glass', [4.91, 2.77, .018], [0, 1.72, .12], material('#111711', .18, .08), .075);
  const screenCanvas = document.createElement('canvas'); screenCanvas.width = 1024; screenCanvas.height = 576;
  const screenContext = screenCanvas.getContext('2d')!;
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.88, 2.74), new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }));
  screen.name = 'project-specific live display'; screen.position.set(0, 1.72, .141); lid.add(screen);
  let lastScreen = '';
  function setScreen(mode: 'boot' | 'cpu' | 'ram' | 'ssd' | 'overview', pressure = 0, language: 'pt' | 'en' = 'pt') {
    const signature = `${mode}:${Math.round(pressure * 8)}:${language}`; if (signature === lastScreen) return; lastScreen = signature;
    const g = screenContext, w = 1024, h = 576, lime = '#bfeb55', dim = '#61705d', pale = '#dce5d3';
    g.fillStyle = '#101510'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c1e970'; g.fillRect(0, 0, 7, h);
    g.fillStyle = lime; g.font = 'bold 17px monospace'; g.fillText('K/CORE', 31, 31);
    const titles = { pt: { boot:'SISTEMA / ABERTO', cpu:'ZEROCODING / TERMINAL', ram:'FENRIR / OBSERVAÇÃO', ssd:'TRAINING APP / LOCAL', overview:'SISTEMA / VISÃO GERAL' }, en: { boot:'SYSTEM / OPEN', cpu:'ZEROCODING / TERMINAL', ram:'FENRIR / OBSERVATION', ssd:'TRAINING APP / LOCAL', overview:'SYSTEM / OVERVIEW' } };
    g.fillStyle = '#96a58d'; g.font = '13px monospace'; g.fillText(titles[language][mode], 180, 31);
    g.fillStyle = '#26352a'; g.fillRect(28, 48, 965, 1);
    const label = (value: string, x: number, y: number, size = 20, color = pale) => { g.fillStyle = color; g.font = `${size}px monospace`; g.fillText(value, x, y); };
    const rail = (x1: number, y1: number, x2: number, y2: number, color = lime) => { g.strokeStyle = color; g.lineWidth = 2; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y1); g.lineTo(x2, y2); g.stroke(); };
    const t = language === 'pt';
    if (mode === 'boot') {
      label(t ? 'DO SINAL AO SISTEMA' : 'FROM SIGNAL TO SYSTEM', 53, 154, 34, lime);
      label(t ? 'placa  →  contexto  →  estado' : 'board  →  context  →  state', 56, 211, 20);
      g.strokeStyle = '#61705d'; g.lineWidth = 2; g.beginPath(); g.moveTo(58, 279); g.lineTo(248, 279); g.lineTo(302, 332); g.lineTo(846, 332); g.stroke();
      [[248,279],[302,332],[487,332],[674,332],[846,332]].forEach(([x,y], i) => { g.fillStyle = i === 4 ? lime : '#82927a'; g.fillRect(x-4,y-4,8,8); });
      label('CPU     RAM     SSD     DISPLAY', 58, 390, 17, '#9cb593');
    } else if (mode === 'cpu') {
      label('> zerocoding --project ./workspace', 46, 96, 21, lime);
      label(t ? 'modelo: ollama / compatível' : 'model: ollama / compatible', 47, 145, 17);
      ['context  ./src + project notes','read     src/main.py','grep     "session" ./src','session  resume  --id 04'].forEach((s, i) => {
        label(s, 57, 211 + i * 57, 17, i === 3 ? lime : pale);
        g.fillStyle = i === 3 ? '#344b30' : '#1a241b'; g.fillRect(43, 178 + i * 57, 5, 20);
      });
      g.fillStyle = '#314333'; g.fillRect(710, 132, 236, 306);
      label(t ? 'ESCOPO' : 'SCOPE', 733, 167, 14, '#a9bf9d');
      ['project files','selected paths','tool results','session state'].forEach((s, i) => { g.fillStyle = '#9fb38f'; g.fillRect(735, 200+i*48, 5, 5); label(s, 751, 205+i*48, 14); });
      label(t ? 'AGUARDANDO ENTRADA' : 'WAITING FOR INPUT', 53, 505, 13, '#879886');
    } else if (mode === 'ram') {
      label(t ? 'PRESSÃO DE MEMÓRIA' : 'MEMORY PRESSURE', 48, 98, 19, lime);
      const amount = Math.round(pressure * 11) + 3;
      for (let i = 0; i < 14; i++) { g.fillStyle = i < amount ? (pressure > .57 ? '#ce8660' : '#9cbd69') : '#253329'; g.fillRect(53 + i * 61, 123, 43, 41); }
      label(`${Math.round(18 + pressure*76)}%  ${t?'PRESSÃO':'PRESSURE'}`, 55, 196, 16, pressure > .57 ? '#e2a47f' : pale);
      const rows = [t?'browser':'browser',t?'worker':'worker',t?'serviço':'service',t?'jogo':'game'];
      rows.forEach((name, i) => { const y=251+i*49; label(name.toUpperCase(),57,y,14,'#aec09f'); g.fillStyle=i<2&&pressure>.57?'#805840':'#38493a'; g.fillRect(222,y-16,Math.min(370,72+i*58+pressure*185),13); label(i===1&&pressure>.57?'PSI ↑':'cgroup v2',655,y,13,i===1&&pressure>.57?'#e2a47f':'#8ea08a'); });
      rail(57, 479, 724, 479, pressure > .57 ? '#d79b73' : '#718c65');
      label(pressure > .57 ? (t?'dry-run → política':'dry-run → policy') : (t?'observação → política gradual':'observe → gradual policy'), 57, 520, 15, pressure > .57 ? '#e2a47f' : pale);
      label(pressure > .75 ? (t?'SIMULAÇÃO':'SIMULATION') : 'PSI / SWAP', 760, 520, 14, lime);
    } else if (mode === 'ssd') {
      label(t ? 'ESTADO LOCAL / SQLITE' : 'LOCAL STATE / SQLITE', 48, 97, 19, lime);
      label('SESSION_ID       SET_ID        UPDATED', 55, 146, 13, '#a5ba9b');
      [['S-014','upper-body','today 08:42'],['S-013','mobility','yesterday'],['S-012','recovery','29 sep']].forEach((row,i) => {
        const y=187+i*50; g.fillStyle=i===0?'#1e2d21':'#151d17'; g.fillRect(48,y-22,600,35);
        label(row[0],62,y,14,pale); label(row[1],183,y,14,'#a7b49f'); label(row[2],390,y,14,'#82917e');
      });
      g.fillStyle='#283b2a'; g.fillRect(715,122,230,233); g.strokeStyle='#718c65'; g.strokeRect(715,122,230,233);
      label(t?'CÓPIA LOCAL':'LOCAL BACKUP',738,159,14,lime);
      label('sqlite.db',738,202,18); label(t?'VALIDADO':'VALIDATED',738,245,13,'#a6c286');
      rail(747, 271, 747, 318, lime); label(t?'RESTORE':'RESTORE',765,305,13,pale);
      label(t?'exportar → validar → restaurar':'export → validate → restore', 53, 450, 16, pale);
      label(t?'rede: opcional':'network: optional', 53, 493, 13, '#879886');
    } else {
      label(t ? 'TRÊS PROJETOS / UM FIO CONDUTOR' : 'THREE PROJECTS / ONE THREAD', 47, 94, 17, lime);
      const stages = t ? ['BACKEND','SISTEMA','ESTADO','RECUPERAÇÃO'] : ['BACKEND','SYSTEM','STATE','RECOVERY'];
      stages.forEach((s, i) => {
        const x = 57 + i * 228, y = 177;
        label('0' + (i + 1), x, y, 13, '#82927a');
        label(s, x, y + 34, 17, i === 3 ? lime : pale);
        g.fillStyle = i === 3 ? '#546844' : '#26352a';
        g.fillRect(x, y + 58, 166, 7);
        if (i < 3) rail(x + 170, y + 61, x + 205, y + 61, dim);
      });
      label(t ? 'CONTEXTO  /  PERSISTÊNCIA  /  CONTROLE' : 'CONTEXT  /  PERSISTENCE  /  CONTROL', 57, 373, 16, '#9cae98');
      label('PYTHON  /  RUST  /  EXPO', 57, 500, 13, lime);
    }
    screenTexture.needsUpdate = true;
  }
  setScreen('boot');
  box(lid, 'status light', [.16,.028,.012], [-2.04, 2.92, .145], green, .006);
  for (const x of [-.42, .42]) {
    const cameraLens = new THREE.Mesh(new THREE.SphereGeometry(.033, 12, 8), graphite); cameraLens.position.set(x, 3.27, .115); lid.add(cameraLens);
  }
  for (const x of [-1.66, 1.66]) {
    cylinder(lid, 'hinge barrel', .09, 1.1, [x, .1, -.03], metal);
    cylinder(lid, 'hinge collar', .12, .15, [x + (x > 0 ? -.58 : .58), .1, -.03], graphite);
  }

  const motherboard = new THREE.Group(); motherboard.name = 'motherboard / system architecture'; physical.add(motherboard);
  const boardGeometry = new RoundedBoxGeometry(4.04, .15, 2.36, 3, .11);
  const boardMesh = new THREE.Mesh(boardGeometry, board); boardMesh.name = 'motherboard substrate'; boardMesh.position.set(0,-.12,-.04); motherboard.add(boardMesh);
  outline(motherboard, boardGeometry, new THREE.Vector3(0,-.12,-.04), '#a9c883');
  // Routed buses follow the component zones rather than repeating decorative parallel lines.
  const traceY = -.034;
  const routes = [
    [[-.18,traceY,-.12],[-.42,traceY,-.12],[-.58,traceY,-.28],[-.58,traceY,-.62]],
    [[.18,traceY,-.12],[.45,traceY,-.12],[.62,traceY,-.3],[.62,traceY,-.64]],
    [[-.12,traceY,.12],[-.12,traceY,.44],[.12,traceY,.68],[.58,traceY,.68]],
    [[.15,traceY,.05],[.48,traceY,.05],[.68,traceY,.28],[.68,traceY,.76]],
    [[-.38,traceY,-.12],[-.82,traceY,-.12],[-1.25,traceY,-.4],[-1.72,traceY,-.4]],
    [[.38,traceY,-.12],[.86,traceY,-.12],[1.35,traceY,-.42],[1.72,traceY,-.42]],
    [[-.54,traceY,-.55],[-.95,traceY,-.55],[-1.42,traceY,-.82],[-1.88,traceY,-.82]],
    [[.54,traceY,.56],[.95,traceY,.56],[1.38,traceY,.84],[1.88,traceY,.84]],
    [[-.12,traceY,.45],[-.52,traceY,.72],[-.88,traceY,.72],[-1.62,traceY,.98]],
    [[.12,traceY,.45],[.45,traceY,.79],[.94,traceY,.79],[1.58,traceY,.98]],
    [[-1.1,traceY,-.84],[-1.1,traceY,-.98],[-.52,traceY,-1.04],[.3,traceY,-1.04],[1.05,traceY,-.86]],
    [[-1.62,traceY,.05],[-1.2,traceY,.05],[-.95,traceY,.28],[-.62,traceY,.28]],
    [[1.68,traceY,.16],[1.28,traceY,.16],[1.08,traceY,-.03],[.78,traceY,-.03]],
    [[-.25,traceY,.24],[-.45,traceY,.47],[-.76,traceY,.47]],
    [[.3,traceY,-.32],[.58,traceY,-.55],[.91,traceY,-.55]]
  ];
  routes.forEach((route,i)=>line(motherboard,route.map(([x,y,z])=>new THREE.Vector3(x,y,z)),i%4===0?'#c4a060':'#8ba27d',i%4===0?.84:.84));
  const vias = new THREE.InstancedMesh(new THREE.CylinderGeometry(.024,.024,.012,10),copper,58);
  vias.name='plated motherboard vias'; const viaTransform=new THREE.Object3D();
  for(let i=0;i<58;i++){const x=-1.82+(i%14)*.27,z=-1.01+Math.floor(i/14)*.47;viaTransform.position.set(x,-.03,z);viaTransform.scale.setScalar(i%5===0?1.35:1);viaTransform.updateMatrix();vias.setMatrixAt(i,viaTransform.matrix);}
  motherboard.add(vias);

  // CPU socket, pressure frame and power phases stay on the board as the package lifts away.
  const socketCenterZ=-.12;
  box(motherboard,'LGA socket carrier',[1.22,.085,1.02],[0,-.012,socketCenterZ],graphite,.065);
  box(motherboard,'socket contact bed',[1.04,.025,.84],[0,.038,socketCenterZ],packageMat,.025);
  const socketPads=new THREE.InstancedMesh(new THREE.BoxGeometry(.026,.012,.026),solder,196);
  socketPads.name='LGA contact field'; const socketTransform=new THREE.Object3D();let socketIndex=0;
  for(let row=0;row<14;row++)for(let col=0;col<14;col++){
    socketTransform.position.set(-.49+col*.075,.058,socketCenterZ-.39+row*.06);socketTransform.updateMatrix();socketPads.setMatrixAt(socketIndex++,socketTransform.matrix);
  }
  socketPads.count=socketIndex; motherboard.add(socketPads);
  for(const x of [-.61,.61]) box(motherboard,'CPU retention rail',[.075,.075,.94],[x,.047,socketCenterZ],metal,.018);
  for(const z of [socketCenterZ-.47,socketCenterZ+.47]) box(motherboard,'CPU retention bridge',[1.21,.055,.065],[0,.047,z],shellEdge,.018);
  const latch=cylinder(motherboard,'socket retention cam',.035,.22,[-.69,.06,socketCenterZ],metal); latch.rotation.z=Math.PI/2;
  for(let phase=0;phase<4;phase++){
    const x=-.91+phase*.18,z=.53;
    box(motherboard,`VRM choke ${phase+1}`,[.15,.13,.17],[x,.015,z],graphite,.02);
    box(motherboard,`VRM ferrite top ${phase+1}`,[.1,.018,.12],[x,.087,z],shellEdge,.012);
    box(motherboard,`VRM MOSFET ${phase+1}`,[.105,.065,.1],[x+.09,-.003,z-.17],chip,.012);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,.13,12),metal);cap.position.set(x-.075,.015,z-.17);motherboard.add(cap);
  }
  for(let i=0;i<8;i++){
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.085,10),solder);cap.position.set(-1.68+i*.11,-.005,.98);motherboard.add(cap);
  }
  // Edge I/O, display flex, M.2 socket and a small wireless daughterboard.
  for(const [x,z] of [[-1.68,-.82],[-1.72,-.42],[1.72,-.42],[1.61,.98]] as [number,number][]){
    box(motherboard,'shielded board connector',[.28,.11,.17],[x,-.005,z],graphite,.018);
    for(let i=0;i<5;i++)box(motherboard,'connector contact',[.025,.012,.045],[x-.08+i*.04,.054,z+.035],copper,.005);
  }
  const antennaCable=new THREE.CatmullRomCurve3([new THREE.Vector3(1.35,-.015,.91),new THREE.Vector3(1.55,.012,.77),new THREE.Vector3(1.42,.012,.54),new THREE.Vector3(1.65,.012,.36)]);
  motherboard.add(new THREE.Mesh(new THREE.TubeGeometry(antennaCable,24,.018,6,false),shellEdge));
  box(motherboard,'wireless daughterboard',[.54,.055,.31],[1.49,-.005,.82],boardEdge,.025);
  box(motherboard,'wireless controller',[.22,.065,.18],[1.49,.035,.82],chip,.02);
  box(motherboard,'M.2 edge socket',[.18,.085,.52],[-.57,-.006,.81],graphite,.02);
  for(let i=0;i<10;i++)box(motherboard,'M.2 socket contact',[.035,.014,.025],[-.65+i*.018,.042,.81],solder,.004);
  const standoff=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.04,16),metal);standoff.position.set(1.58,-.006,.81);motherboard.add(standoff);
  for(const x of [-.98,.98]){
    box(motherboard,'display cable header',[.42,.075,.17],[x,-.005,-1.03],graphite,.018);
    for(let i=0;i<8;i++)box(motherboard,'display header pin',[.018,.035,.018],[x-.14+i*.04,.045,-1.03],copper,.003);
  }
  for(const x of [-.98,.98]){
    const cable=new THREE.CatmullRomCurve3([new THREE.Vector3(x,-.03,-1.02),new THREE.Vector3(x*1.12,-.01,-1.19),new THREE.Vector3(x*1.2,.005,-1.42),new THREE.Vector3(x*1.27,.02,-1.56)]);
    const flex=new THREE.Mesh(new THREE.TubeGeometry(cable,24,.026,6,false),graphite);flex.name='display hinge flex cable';physical.add(flex);
  }

  const cpu = new THREE.Group(); cpu.name = 'CPU / ZeroCoding'; physical.add(cpu); cpu.position.set(0,-.015,socketCenterZ);
  const cpuSubstrate=new RoundedBoxGeometry(1.02,.1,.82,3,.045);
  const cpuBase=new THREE.Mesh(cpuSubstrate,packageMat);cpuBase.name='processor organic substrate';cpuBase.position.set(0,.057,0);cpu.add(cpuBase);
  outline(cpu,cpuSubstrate,new THREE.Vector3(0,.057,0),'#6f8963');
  const cpuLands=new THREE.InstancedMesh(new THREE.BoxGeometry(.024,.012,.024),solder,120);
  cpuLands.name='processor land grid array';const landTransform=new THREE.Object3D();let landIndex=0;
  for(let row=0;row<10;row++)for(let col=0;col<12;col++){
    if(row===0||row===9||col===0||col===11||((row+col)%4===0)){landTransform.position.set(-.43+col*.078,.002,-.34+row*.076);landTransform.updateMatrix();cpuLands.setMatrixAt(landIndex++,landTransform.matrix);}
  }
  cpuLands.count=landIndex;cpu.add(cpuLands);
  for(let i=0;i<9;i++){
    const x=-.38+i*.095;
    line(cpu,[new THREE.Vector3(x,.11,-.37),new THREE.Vector3(x,.11,-.3),new THREE.Vector3(x*.62,.11,-.24)],i%3===0?'#b28a54':'#718768',.88);
    line(cpu,[new THREE.Vector3(x,.11,.37),new THREE.Vector3(x,.11,.3),new THREE.Vector3(x*.62,.11,.24)],i%3===0?'#b28a54':'#718768',.88);
  }
  for(const x of [-.39,-.26,.26,.39])for(const z of [-.3,.3])box(cpu,'processor decoupling capacitor',[.07,.055,.07],[x,.13,z],chip,.015);
  box(cpu,'nickel plated heat spreader',[.73,.115,.59],[0,.172,0],cpuHeatSpreader,.07);
  box(cpu,'heat spreader etched mark',[.28,.004,.018],[0,.232,-.19],graphite,.004);
  box(cpu,'heat spreader etched code',[.16,.004,.012],[0,.232,-.15],shellEdge,.003);
  box(cpu,'heat spreader index',[.065,.006,.045],[.28,.232,.19],copper,.01);

  const battery = new THREE.Group(); battery.name='battery / local-first power'; physical.add(battery);
  box(battery,'battery shell',[3.55,.3,.73],[0,-.15,1.15],graphite,.09);
  for (let i=0;i<5;i++) box(battery,`battery cell seam ${i+1}`,[.025,.2,.61],[-1.42+i*.71,-.12,1.15],shellEdge,.008);
  const batteryLed = new THREE.Mesh(new THREE.SphereGeometry(.035,10,8),green); batteryLed.position.set(1.55,.02,1.15); battery.add(batteryLed);

  const ram = new THREE.Group(); ram.name='RAM / Fenrir memory pressure'; physical.add(ram);
  for (let module=0;module<2;module++) {
    const z=-.82+module*.62;
    box(motherboard,`SO-DIMM socket ${module+1}`,[1.96,.085,.18],[-.57,-.006,z+.205],graphite,.018);
    for(let clip of [-.99,.99]){
      box(motherboard,'SO-DIMM retention clip',[.075,.1,.11],[-.57+clip,.005,z+.205],shellEdge,.018);
      box(motherboard,'slot guide',[.09,.045,.065],[-.57+clip,.052,z+.205],metal,.012);
    }
    const moduleGroup=new THREE.Group();moduleGroup.name=`SO-DIMM ${module+1}`;moduleGroup.position.set(-.57,0,z);ram.add(moduleGroup);
    const profile=new THREE.Shape();
    profile.moveTo(-.91,-.21);profile.lineTo(.91,-.21);profile.lineTo(.91,.21);profile.lineTo(.105,.21);profile.lineTo(.105,.135);profile.lineTo(-.105,.135);profile.lineTo(-.105,.21);profile.lineTo(-.91,.21);profile.closePath();
    const pcbGeometry=new THREE.ExtrudeGeometry(profile,{depth:.1,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.012,bevelThickness:.008});
    const pcb=new THREE.Mesh(pcbGeometry,dimmBoard);pcb.name=`keyed DIMM substrate ${module+1}`;pcb.rotation.x=Math.PI/2;pcb.position.y=.05;moduleGroup.add(pcb);
    for(let i=0;i<26;i++){
      const x=-.83+i*.066;
      if(Math.abs(x)<.13)continue;
      box(moduleGroup,'gold DIMM edge contact',[.043,.014,.018],[x,.006,.19],solder,.003);
    }
    for(let i=0;i<8;i++){
      const x=-.74+i*.21;
      box(moduleGroup,'DRAM package',[.16,.072,.145],[x,.093,-.035],dimmChip,.018);
      box(moduleGroup,'DRAM package mark',[.065,.003,.012],[x,.131,-.035],shellEdge,.002);
      for(const zSide of [-.12,.055])box(moduleGroup,'package solder pads',[.04,.012,.018],[x,.056,zSide],copper,.003);
    }
    for(let i=0;i<5;i++)line(moduleGroup,[new THREE.Vector3(-.84+i*.42,.055,-.17),new THREE.Vector3(-.65+i*.32,.055,-.17),new THREE.Vector3(-.55+i*.28,.055,-.12)],'#77916c',.85);
  }

  const ssd = new THREE.Group(); ssd.name='SSD / Training App persistence'; physical.add(ssd); ssd.position.set(.56,-.045,.81);
  const drive=box(ssd,'M.2 2280 NVMe PCB',[2.24,.07,.45],[0,.035,0],ssdBoard,.035);
  outline(ssd,drive.geometry,new THREE.Vector3(0,.035,0),'#c4ee70');
  for(let i=0;i<25;i++){
    if(i===11||i===12)continue;
    box(ssd,'M.2 gold edge finger',[.018,.012,.025],[-1.134,.044,-.18+i*.015],solder,.002);
  }
  for(let i=0;i<4;i++){
    const x=-.64+i*.36;
    box(ssd,'NAND storage package',[.26,.085,.29],[x,.113,-.015],chip,.018);
    box(ssd,'NAND package marking',[.12,.003,.013],[x,.158,-.015],shellEdge,.002);
    for(const z of [-.12,.1])for(let pin=0;pin<4;pin++)box(ssd,'NAND solder terminations',[.03,.014,.018],[x-.09+pin*.06,.066,z],copper,.003);
  }
  box(ssd,'NVMe controller package',[.28,.09,.27],[.83,.115,-.015],metal,.025);
  box(ssd,'controller shield label',[.14,.003,.012],[.83,.163,-.015],graphite,.002);
  box(ssd,'M.2 key notch',[.08,.02,.06],[-1.106,.025,.22],graphite,.008);
  const retentionRing=new THREE.Mesh(new THREE.TorusGeometry(.065,.012,6,24),solder);retentionRing.rotation.x=Math.PI/2;retentionRing.position.set(1.02,.075,0);ssd.add(retentionRing);
  const retentionScrew=new THREE.Mesh(new THREE.CylinderGeometry(.042,.042,.025,12),metal);retentionScrew.position.set(1.02,.075,0);ssd.add(retentionScrew);
  line(ssd,[new THREE.Vector3(-.85,.076,-.1),new THREE.Vector3(-.35,.076,-.1),new THREE.Vector3(-.12,.076,.11),new THREE.Vector3(.47,.076,.11)],'#a78754',.92);

  const cooling = new THREE.Group(); cooling.name='thermal module'; physical.add(cooling);
  box(cooling,'blower lower shroud',[1.22,.095,1.02],[1.48,-.04,-.08],graphite,.12);
  const fanBase=new THREE.Mesh(new THREE.CylinderGeometry(.49,.49,.11,40),chip);fanBase.name='horizontal centrifugal blower housing';fanBase.position.set(1.48,.015,-.08);cooling.add(fanBase);
  const fanCavity=new THREE.Mesh(new THREE.TorusGeometry(.43,.045,10,48),shellEdge);fanCavity.rotation.x=Math.PI/2;fanCavity.position.set(1.48,.08,-.08);cooling.add(fanCavity);
  const bladeGeometry=new RoundedBoxGeometry(.075,.02,.3,2,.012);
  const impeller=new THREE.Group();impeller.name='blower impeller vanes';impeller.position.set(1.48,.09,-.08);cooling.add(impeller);
  for(let i=0;i<9;i++){
    const angle=i*Math.PI*2/9, radius=.27;
    const blade=new THREE.Mesh(bladeGeometry,metal);blade.name=`centrifugal blower vane ${i+1}`;
    blade.position.set(Math.sin(angle)*radius,0,Math.cos(angle)*radius);blade.rotation.y=angle+.28;impeller.add(blade);
  }
  const fanHub=new THREE.Mesh(new THREE.CylinderGeometry(.145,.145,.12,24),metal);fanHub.name='blower motor hub';fanHub.position.set(1.48,.105,-.08);cooling.add(fanHub);
  const hubCap=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.014,20),shellEdge);hubCap.position.set(1.48,.17,-.08);cooling.add(hubCap);
  const pipeA=cylinder(cooling,'copper heat pipe A',.045,1.86,[.47,.055,-.08],copper);pipeA.rotation.z=Math.PI/2;pipeA.rotation.y=.025;
  const pipeB=cylinder(cooling,'copper heat pipe B',.032,1.63,[.56,.037,.13],solder);pipeB.rotation.z=Math.PI/2;pipeB.rotation.y=.025;
  box(cooling,'fin-stack plenum',[.24,.13,.84],[-.49,.025,-.08],graphite,.025);
  for(let i=0;i<11;i++)box(cooling,'copper radiator fin',[.024,.13,.8],[-.69+i*.042,.045,-.08],metal,.006);

  const cpuTraces = new THREE.Group(); cpuTraces.name = 'processor traces becoming an agent flow'; physical.add(cpuTraces);
  const traceMaterial = new THREE.LineBasicMaterial({ color: '#c4ee48', transparent: true, opacity: .9 });
  const flowRoutes=[
    [[.36,.08,-.34],[.72,.08,-.34],[.91,.08,-.57],[1.2,.08,-.57],[1.43,.08,-.32],[2.28,.08,-.32]],
    [[.38,.08,-.15],[.88,.08,-.15],[1.07,.08,-.04],[1.34,.08,-.04],[1.58,.08,.13],[2.28,.08,.13]],
    [[.38,.08,.08],[.72,.08,.08],[.94,.08,.31],[1.22,.08,.31],[1.42,.08,.47],[2.28,.08,.47]],
    [[.29,.08,.29],[.53,.08,.29],[.77,.08,.56],[1.02,.08,.56],[1.26,.08,.73],[2.28,.08,.73]]
  ];
  flowRoutes.forEach((route,i)=>{
    line(cpuTraces,route.map(([x,y,z])=>new THREE.Vector3(x,y,z)),traceMaterial);
    for(let pad=0;pad<5;pad++){
      const [x,y,z]=route[Math.min(pad+1,route.length-1)];
      const via=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.018,10),i===0?green:copper);via.position.set(x,y+.012,z);cpuTraces.add(via);
    }
    box(cpuTraces,`illuminated bus ${i+1}`,[.96,.022,.028],[1.8,.08,route[route.length-1][2]],green,.006);
    box(cpuTraces,`agent stage ${i+1}`,[.2,.065,.11],[2.34,.08,route[route.length-1][2]],i===0?green:packageMat,.012);
  });
  cpuTraces.visible = false;
  const memoryTraffic = new THREE.Group(); memoryTraffic.name = 'processes contest memory lanes'; ram.add(memoryTraffic);
  for (let i = 0; i < 18; i++) {
    const module=i<9?0:1, slot=i%9, z=-.82+module*.62;
    box(memoryTraffic,`resident page ${i+1}`,[.075,.045,.11],[-1.27+slot*.17,.16,z],i>12?copper:green,.008);
  }
  memoryTraffic.visible = false;
  const storageRecords = new THREE.Group(); storageRecords.name = 'persistent blocks from SSD'; ssd.add(storageRecords);
  for (let i = 0; i < 5; i++) {
    box(storageRecords,`SQLite record ${i+1}`,[.12,.025,.28],[-.7+i*.32,.2,.11],i===4?green:metal,.01);
    box(storageRecords,`record index ${i+1}`,[.025,.025,.035],[-.7+i*.32,.2,-.08],i===4?copper:shellEdge,.006);
  }
  storageRecords.visible = false;
  return {root,physical,lid,deck,bottom,battery,motherboard,cpu,ram,ssd,cooling,cpuTraces,memoryTraffic,storageRecords,setScreen};
}
