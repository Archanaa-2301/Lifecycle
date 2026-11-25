import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  ArrowLeft, ArrowRight, Bell, ChevronDown, ChevronRight, CircleHelp,
  Eye, Layers3, Maximize2, Minus, Plus, RotateCcw, Search, Sun, Fuel, Wind,
  CheckCircle2, CarFront, Gauge, MousePointer2
} from 'lucide-react';
import type { PageId, Vehicle } from '../types/lifex';
import './VehicleOverview3DPage.css';
import { runSelectionFlight } from '../utils/selectionMotion';

type Props = { vehicle: Vehicle; onNavigate: (page: PageId) => void; onSelectComponent: (index: number, name: string) => void };
type SystemItem = { name: string; detail: string; icon: string };
const SYSTEMS: SystemItem[] = [
  { name: 'Engine', detail: 'Power generation and intake', icon: 'engine' },
  { name: 'Transmission', detail: 'Gearbox and driveline', icon: 'transmission' },
  { name: 'Braking System', detail: 'Disc, caliper and ABS', icon: 'brakes' },
  { name: 'Suspension', detail: 'Springs, dampers and links', icon: 'suspension' },
  { name: 'Steering System', detail: 'Steering rack and column', icon: 'steering' },
  { name: 'Electrical & Electronics', detail: 'Battery, ECU and harness', icon: 'electrical' },
  { name: 'HVAC System', detail: 'Climate control assembly', icon: 'hvac' },
  { name: 'Fuel System', detail: 'Fuel tank, pump and lines', icon: 'fuel' },
  { name: 'Exhaust System', detail: 'Emission control and muffler', icon: 'exhaust' },
  { name: 'Body & Structure', detail: 'Body shell and chassis', icon: 'body' },
];

const INNOVA_HOTSPOTS = [
  { label: 'HVAC System', system: 'HVAC System', x: 48, y: 39, lx: 48, ly: 22 },
  { label: 'Body & Structure', system: 'Body & Structure', x: 66, y: 35, lx: 77, ly: 23 },
  { label: 'Engine', system: 'Engine', x: 29, y: 48, lx: 17, ly: 37 },
  { label: 'Steering System', system: 'Steering System', x: 43, y: 40, lx: 54, ly: 31 },
  { label: 'Electrical & Electronics', system: 'Electrical & Electronics', x: 59, y: 45, lx: 69, ly: 35 },
  { label: 'Transmission', system: 'Transmission', x: 57, y: 60, lx: 48, ly: 72 },
  { label: 'Front Suspension', system: 'Suspension', x: 47, y: 66, lx: 36, ly: 78 },
  { label: 'Rear Suspension', system: 'Suspension', x: 83, y: 49, lx: 88, ly: 60 },
  { label: 'Braking System', system: 'Braking System', x: 48, y: 76, lx: 37, ly: 87 },
  { label: 'Fuel System', system: 'Fuel System', x: 73, y: 60, lx: 82, ly: 70 },
  { label: 'Exhaust System', system: 'Exhaust System', x: 68, y: 68, lx: 67, ly: 83 },
];

function makeMaterial(color: number, metalness = 0.25, roughness = 0.42) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}
function addBox(parent: THREE.Group, name: string, size: [number, number, number], pos: [number, number, number], color: number, component?: string, material?: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material || makeMaterial(color));
  mesh.name = name; mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true;
  if (component) mesh.userData.component = component;
  parent.add(mesh); return mesh;
}
function createVehicleModel() {
  const root = new THREE.Group();
  const paint = new THREE.MeshPhysicalMaterial({ color: 0xd7dde3, metalness: 0.48, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.16 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x55758d, metalness: 0.18, roughness: 0.16, transparent: true, opacity: 0.62, clearcoat: 1 });
  const black = makeMaterial(0x101720, 0.32, 0.32);
  const chrome = makeMaterial(0xc5d0dc, 0.92, 0.16);
  const rubber = makeMaterial(0x101216, 0.02, 0.8);
  const alloy = makeMaterial(0xb9c4cf, 0.88, 0.2);
  const blue = new THREE.MeshStandardMaterial({ color: 0x168de0, metalness: 0.55, roughness: 0.25, emissive: 0x063d69, emissiveIntensity: 0.24 });

  const body = new THREE.Group(); body.name = 'body'; body.userData.component = 'Body & Structure'; root.add(body);
  // Smooth lower MPV body shell: front is +Z, rear is -Z.
  const lower = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), paint);
  lower.name = 'Rounded lower body'; lower.scale.set(1.08, 0.48, 2.18); lower.position.set(0, 0.94, 0.02);
  lower.castShadow = true; lower.receiveShadow = true; lower.userData.component = 'Body & Structure'; body.add(lower);

  // Curved one-piece cabin silhouette with a sloped windscreen and rear roofline.
  const cabinShape = new THREE.Shape();
  cabinShape.moveTo(-1.96, 1.08);
  cabinShape.quadraticCurveTo(-2.02, 1.16, -1.98, 1.48);
  cabinShape.lineTo(-1.91, 1.78);
  cabinShape.quadraticCurveTo(-1.84, 2.10, -1.55, 2.18);
  cabinShape.lineTo(0.62, 2.18);
  cabinShape.quadraticCurveTo(0.88, 2.17, 1.04, 1.98);
  cabinShape.lineTo(1.48, 1.43);
  cabinShape.quadraticCurveTo(1.62, 1.27, 1.58, 1.08);
  cabinShape.closePath();
  const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, { depth: 1.78, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.075, bevelThickness: 0.075, curveSegments: 16 });
  cabinGeo.translate(0, 0, -0.89);
  cabinGeo.rotateY(Math.PI / 2);
  const cabin = new THREE.Mesh(cabinGeo, paint);
  cabin.name = 'Curved cabin shell'; cabin.castShadow = true; cabin.receiveShadow = true; cabin.userData.component = 'Body & Structure'; body.add(cabin);

  // Roof cap, front/rear glass and side windows with rounded edges.
  const roof = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 20), paint);
  roof.name = 'Roof contour'; roof.scale.set(0.88, 0.11, 1.08); roof.position.set(0, 2.28, -0.03); roof.userData.component = 'Body & Structure'; body.add(roof);
  const addWindow = (name: string, size: [number,number,number], pos: [number,number,number], rot: [number,number,number] = [0,0,0]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(...size, 6, 4, 6), glass);
    m.name = name; m.position.set(...pos); m.rotation.set(...rot); m.userData.component = 'Body & Structure'; body.add(m);
  };
  addWindow('Front windshield', [1.52,0.62,0.055], [0,1.84,1.22], [-0.34,0,0]);
  addWindow('Rear windshield', [1.48,0.58,0.055], [0,1.82,-1.65], [0.3,0,0]);
  [-1,1].forEach(side => {
    addWindow('Front side window', [0.055,0.62,0.92], [side*1.005,1.82,0.55]);
    addWindow('Middle side window', [0.055,0.62,0.78], [side*1.005,1.82,-0.32]);
    addWindow('Rear side window', [0.055,0.58,0.52], [side*0.985,1.79,-1.18]);
    // pillars and lower side sill
    [-0.83,-0.02,0.82].forEach(z => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.045,0.78,12), black);
      pillar.name='Window pillar'; pillar.position.set(side*1.005,1.80,z); pillar.userData.component='Body & Structure'; body.add(pillar);
    });
    const sill = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.16,2.45,2,2,8), black);
    sill.position.set(side*1.02,0.78,-0.03); sill.name='Side sill'; sill.userData.component='Body & Structure'; body.add(sill);
  });

  // Front fascia, grille, chrome details and lamps.
  const grille = new THREE.Mesh(new THREE.BoxGeometry(1.22,0.28,0.09,4,2,2), black);
  grille.position.set(0,0.98,2.12); grille.name='Front grille'; grille.userData.component='Body & Structure'; body.add(grille);
  const grilleBar = new THREE.Mesh(new THREE.BoxGeometry(1.42,0.045,0.055), chrome);
  grilleBar.position.set(0,1.16,2.16); body.add(grilleBar);
  [-0.76,0.76].forEach(x => {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.48,0.15,0.12,4,2,2), new THREE.MeshStandardMaterial({color:0xeaf7ff,emissive:0x8acfff,emissiveIntensity:0.75,metalness:0.2,roughness:0.18}));
    lamp.position.set(x,1.30,1.96); lamp.name='LED headlamp'; lamp.userData.component='Body & Structure'; body.add(lamp);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.42,0.2), new THREE.MeshStandardMaterial({color:0xc51e32,emissive:0x4b0710,emissiveIntensity:0.3}));
    tail.position.set(x*1.23,1.26,-2.03); tail.name='Rear lamp'; tail.userData.component='Body & Structure'; body.add(tail);
  });
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.05,0.2,0.22,6,2,2), black);
  bumper.position.set(0,0.58,2.04); bumper.name='Front bumper'; bumper.userData.component='Body & Structure'; body.add(bumper);

  // Four realistic wheel assemblies with tyres, alloy rims, hubs, brakes and suspension.
  const brakeGroup = new THREE.Group(); brakeGroup.name='brakes'; brakeGroup.userData.component='Braking System'; root.add(brakeGroup);
  const suspensionGroup = new THREE.Group(); suspensionGroup.name='suspension'; suspensionGroup.userData.component='Suspension'; root.add(suspensionGroup);
  for (const x of [-1.02,1.02]) for (const z of [-1.42,1.42]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.46,0.46,0.24,48,1), rubber);
    wheel.rotation.z=Math.PI/2; wheel.position.set(x,0.58,z); wheel.name='Tyre'; wheel.castShadow=true; wheel.userData.component='Braking System'; brakeGroup.add(wheel);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.315,0.315,0.255,40,1), alloy);
    rim.rotation.z=Math.PI/2; rim.position.copy(wheel.position); rim.name='Alloy wheel'; rim.userData.component='Braking System'; brakeGroup.add(rim);
    const rimLip = new THREE.Mesh(new THREE.TorusGeometry(0.285,0.022,10,40), chrome);
    rimLip.rotation.y=Math.PI/2; rimLip.position.set(x*1.145,0.58,z); rimLip.name='Alloy rim lip'; rimLip.userData.component='Braking System'; brakeGroup.add(rimLip);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.105,0.105,0.27,24), chrome);
    hub.rotation.z=Math.PI/2; hub.position.copy(wheel.position); brakeGroup.add(hub);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.245,0.245,0.275,36), makeMaterial(0x8795a3,0.8,0.25));
    disc.rotation.z=Math.PI/2; disc.position.copy(wheel.position); disc.name='Brake disc'; disc.userData.component='Braking System'; brakeGroup.add(disc);
    const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.075,0.62,16), blue);
    spring.position.set(x*0.82,0.98,z); spring.name='Damper'; spring.userData.component='Suspension'; suspensionGroup.add(spring);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.1,0.65), chrome);
    arm.position.set(x*0.82,0.48,z); arm.name='Suspension control arm'; arm.userData.component='Suspension'; suspensionGroup.add(arm);
  }

  const engine = new THREE.Group(); engine.name='engine'; engine.userData.component='Engine'; root.add(engine);
  const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(0.82,0.48,0.72,4,3,4), blue);
  engineBlock.position.set(0,1.14,1.36); engineBlock.name='Engine block'; engineBlock.userData.component='Engine'; engine.add(engineBlock);
  const engineTop = new THREE.Mesh(new THREE.BoxGeometry(0.68,0.12,0.48,3,2,3), chrome);
  engineTop.position.set(0,1.43,1.34); engineTop.name='Intake manifold'; engineTop.userData.component='Engine'; engine.add(engineTop);

  const transmission = new THREE.Group(); transmission.name='transmission'; transmission.userData.component='Transmission'; root.add(transmission);
  const gearbox = new THREE.Mesh(new THREE.SphereGeometry(1,24,16), makeMaterial(0x8da0b2,0.75,0.28));
  gearbox.scale.set(0.38,0.27,0.48); gearbox.position.set(0,0.78,0.48); gearbox.name='Transmission casing'; gearbox.userData.component='Transmission'; transmission.add(gearbox);

  const electrical = new THREE.Group(); electrical.name='electrical'; electrical.userData.component='Electrical & Electronics'; root.add(electrical);
  const battery = new THREE.Mesh(new THREE.BoxGeometry(0.42,0.3,0.32,3,2,2), blue);
  battery.position.set(-0.58,1.05,-0.92); battery.name='Battery'; battery.userData.component='Electrical & Electronics'; electrical.add(battery);

  const hvac = new THREE.Group(); hvac.name='hvac'; hvac.userData.component='HVAC System'; root.add(hvac);
  const hvacUnit = new THREE.Mesh(new THREE.BoxGeometry(0.56,0.22,0.34,3,2,2), makeMaterial(0x40b8d6,0.4,0.3));
  hvacUnit.position.set(0,1.18,0.12); hvacUnit.name='HVAC module'; hvacUnit.userData.component='HVAC System'; hvac.add(hvacUnit);

  const steering = new THREE.Group(); steering.name='steering'; steering.userData.component='Steering System'; root.add(steering);
  const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.2,0.03,12,32), black);
  steeringWheel.position.set(-0.4,1.63,0.78); steeringWheel.rotation.x=0.35; steeringWheel.name='Steering wheel'; steeringWheel.userData.component='Steering System'; steering.add(steeringWheel);
  const steeringRack = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,1.1,16), chrome);
  steeringRack.rotation.z=Math.PI/2; steeringRack.position.set(0,0.62,1.1); steeringRack.name='Steering rack'; steeringRack.userData.component='Steering System'; steering.add(steeringRack);

  // Mirrors, door handles and roof rails add recognizable MPV details.
  [-1,1].forEach(side => {
    const mirror = new THREE.Mesh(new THREE.SphereGeometry(0.13,20,14), black);
    mirror.scale.set(1.25,0.7,0.9); mirror.position.set(side*1.08,1.55,0.88); mirror.name='Side mirror'; mirror.userData.component='Body & Structure'; body.add(mirror);
    [-0.72,0.18].forEach(z => {
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.045,0.035), chrome);
      handle.position.set(side*1.07,1.25,z); handle.name='Door handle'; handle.userData.component='Body & Structure'; body.add(handle);
    });
  });
  return root;
}


function makeMarkerLabel(text: string, selected = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 420; canvas.height = 92;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const radius = 20;
  ctx.fillStyle = selected ? '#075ee8' : 'rgba(255,255,255,0.97)';
  ctx.strokeStyle = '#1674f5';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(radius, 4); ctx.lineTo(300, 4); ctx.quadraticCurveTo(316, 4, 316, 20);
  ctx.lineTo(316, 66); ctx.quadraticCurveTo(316, 82, 300, 82); ctx.lineTo(radius, 82);
  ctx.quadraticCurveTo(4, 82, 4, 66); ctx.lineTo(4, 20); ctx.quadraticCurveTo(4, 4, radius, 4);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = selected ? '#ffffff' : '#102b56';
  ctx.font = '700 29px Arial';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 23, 47, 365);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function addComponentMarkers(root: THREE.Group) {
  const markers: Array<{ name: string; label: string; position: [number, number, number]; labelOffset: [number, number, number] }> = [
    { name: 'Engine', label: '01  ENGINE', position: [0.72, 1.12, 1.55], labelOffset: [1.12, 0.55, 0] },
    { name: 'Transmission', label: '02  TRANSMISSION', position: [0.72, 0.78, 0.34], labelOffset: [1.15, -0.08, 0] },
    { name: 'Braking System', label: '03  BRAKES', position: [1.12, 0.58, 1.42], labelOffset: [1.02, -0.38, 0] },
    { name: 'Suspension', label: '04  SUSPENSION', position: [1.12, 0.86, -1.42], labelOffset: [1.12, 0.16, 0] },
    { name: 'Steering System', label: '05  STEERING', position: [0.48, 1.48, 0.82], labelOffset: [-1.28, 0.72, 0] },
    { name: 'Electrical & Electronics', label: '06  ELECTRICAL', position: [-0.48, 1.08, -0.92], labelOffset: [-1.28, 0.24, 0] },
    { name: 'HVAC System', label: '07  HVAC', position: [0.08, 1.42, -0.12], labelOffset: [-1.24, -0.24, 0] },
    { name: 'Body & Structure', label: '08  BODY', position: [0.08, 2.24, -0.62], labelOffset: [0.10, 0.72, 0] }
  ];

  markers.forEach((marker, index) => {
    const group = new THREE.Group();
    group.name = `component-marker-${index + 1}`;
    group.userData.component = marker.name;
    group.userData.markerLabel = marker.label;
    group.position.set(...marker.position);

    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x087bff, emissiveIntensity: 0.8, metalness: 0.12, roughness: 0.18 })
    );
    pin.name = `${marker.name} marker`;
    pin.userData.component = marker.name;
    group.add(pin);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.022, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0x1685ff })
    );
    halo.name = `${marker.name} marker halo`;
    halo.userData.component = marker.name;
    group.add(halo);

    const labelPosition = new THREE.Vector3(...marker.labelOffset);
    const stemPoints = [new THREE.Vector3(0, 0.08, 0), labelPosition.clone().add(new THREE.Vector3(0, -0.12, 0))];
    const stem = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(stemPoints),
      new THREE.LineBasicMaterial({ color: 0x1685ff, transparent: true, opacity: 0.95, depthTest: false })
    );
    stem.userData.component = marker.name;
    group.add(stem);

    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeMarkerLabel(marker.label), transparent: true, depthTest: false }));
    label.name = `${marker.name} label`;
    label.userData.component = marker.name;
    label.position.copy(labelPosition);
    label.scale.set(1.52, 0.34, 1);
    group.add(label);
    root.add(group);
  });
}

const ComponentIcon = ({ name }: { name: string }) => {
  const common = { size: 17, strokeWidth: 1.8 };
  if (name === 'Engine') return <Gauge {...common}/>;
  if (name === 'Body & Structure') return <CarFront {...common}/>;
  if (name === 'Electrical & Electronics') return <Sun {...common}/>;
  if (name === 'HVAC System') return <CircleHelp {...common}/>;
  if (name === 'Fuel System') return <Fuel {...common}/>;
  if (name === 'Exhaust System') return <Wind {...common}/>;
  if (name === 'Suspension') return <Layers3 {...common}/>;
  if (name === 'Steering System') return <RotateCcw {...common}/>;
  if (name === 'Braking System') return <CheckCircle2 {...common}/>;
  return <Layers3 {...common}/>;
};

export const VehicleOverview3DPage: React.FC<Props> = ({ vehicle, onNavigate, onSelectComponent }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneApiRef = useRef<{ controls?: OrbitControls; camera?: THREE.PerspectiveCamera; renderer?: THREE.WebGLRenderer; scene?: THREE.Scene; model?: THREE.Group; resize?: () => void; frame?: number } | null>(null);
  const [activeSystem, setActiveSystem] = useState('Suspension');
  const [viewMode, setViewMode] = useState<'3d'|'xray'|'exploded'>('3d');
  const [modelReady, setModelReady] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(false);
  const vehicleLabel = vehicle.name.replace(/^(Toyota|Tata Motors|Other)\s+/i, '') || 'Innova';
  const oemLabel = vehicle.brand || 'Toyota';
  const isToyotaInnova = /toyota/i.test(`${vehicle.brand || ''} ${vehicle.name || ''}`) && /innova/i.test(vehicle.name || '');
  useEffect(() => {
    if (isToyotaInnova) { setModelReady(true); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(5.8, 3.7, 7.3);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.07;
    controls.enableRotate = true; controls.enableZoom = true; controls.enablePan = false;
    controls.minDistance = 5.2; controls.maxDistance = 19;
    controls.minPolarAngle = 0.08; controls.maxPolarAngle = Math.PI - 0.08;
    controls.target.set(0, 1.12, 0); controls.saveState();
    controls.autoRotate = false; controls.autoRotateSpeed = 1.15;
    controls.rotateSpeed = 0.9; controls.zoomSpeed = 1.05;
    scene.add(new THREE.HemisphereLight(0xeaf5ff, 0x536274, 2.1));
    const key = new THREE.DirectionalLight(0xffffff, 3.1); key.position.set(5, 8, 6); key.castShadow = true; scene.add(key);
    const fill = new THREE.DirectionalLight(0x8acfff, 1.5); fill.position.set(-6, 4, -5); scene.add(fill);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(5.2, 64), new THREE.MeshBasicMaterial({ color: 0xeaf3ff, transparent: true, opacity: 0.48 }));
    ground.rotation.x = -Math.PI/2; ground.position.y = 0.03; scene.add(ground);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.018, 8, 120), new THREE.MeshBasicMaterial({ color: 0x64b5ff, transparent: true, opacity: 0.62 }));
    ring.rotation.x = Math.PI/2; ring.position.y = 0.045; scene.add(ring);
    const model = createVehicleModel(); addComponentMarkers(model); scene.add(model);
    const resize = () => { const rect = canvas.getBoundingClientRect(); const w = Math.max(1, rect.width); const h = Math.max(1, rect.height); renderer.setSize(w, h, false); camera.aspect = w/h; camera.updateProjectionMatrix(); };
    controls.update();
    resize(); const observer = new ResizeObserver(resize); observer.observe(canvas);
    let running = true;
    const animate = () => { if (!running) return; controls.update(); renderer.render(scene, camera); sceneApiRef.current!.frame = requestAnimationFrame(animate); };
    sceneApiRef.current = { controls, camera, renderer, scene, model, resize };
    setModelReady(true); animate();
    const onCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pointer = new THREE.Vector2(((event.clientX-rect.left)/rect.width)*2-1, -((event.clientY-rect.top)/rect.height)*2+1);
      const raycaster = new THREE.Raycaster(); raycaster.setFromCamera(pointer,camera);
      const hits = raycaster.intersectObject(model,true);
      const hit = hits.find(h => h.object.userData.component);
      if (hit?.object.userData.component) {
        const componentName = String(hit.object.userData.component);
        const componentIndex = SYSTEMS.findIndex(item => item.name === componentName);
        const target = document.querySelector<HTMLElement>('.selected-system-card');
        runSelectionFlight(canvas, { title: componentName, subtitle: 'VEHICLE SYSTEM', imageSrc: '/images/innova-cutaway-highres.png', targetElement: target, duration: 900, onComplete: () => { setActiveSystem(componentName); if (componentIndex >= 0) onSelectComponent(componentIndex, componentName); } });
      }
    };
    canvas.addEventListener('click', onCanvasClick);
    return () => { running = false; if (sceneApiRef.current?.frame) cancelAnimationFrame(sceneApiRef.current.frame); observer.disconnect(); canvas.removeEventListener('click',onCanvasClick); controls.dispose(); renderer.dispose(); scene.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); const mats=Array.isArray(o.material)?o.material:[o.material]; mats.forEach(m=>{ const mapped = m as THREE.Material & { map?: THREE.Texture | null }; if (mapped.map) mapped.map.dispose(); m.dispose(); }); } }); sceneApiRef.current = null; };
  }, [isToyotaInnova]);

  useEffect(() => {
    const model = sceneApiRef.current?.model; if (!model) return;
    const exploded = viewMode === 'exploded';
    const offsets: Record<string, [number, number, number]> = {
      body: [0, exploded ? 0.42 : 0, 0], brakes: [0, exploded ? -0.18 : 0, 0],
      suspension: [0, exploded ? -0.42 : 0, 0], engine: [0, exploded ? 0.82 : 0, exploded ? 0.35 : 0],
      transmission: [0, exploded ? -0.48 : 0, 0], electrical: [exploded ? -0.28 : 0, exploded ? 0.48 : 0, 0],
      hvac: [0, exploded ? 0.66 : 0, 0], steering: [exploded ? -0.48 : 0, exploded ? 0.3 : 0, 0]
    };
    model.children.forEach(child => {
      const offset = offsets[child.name];
      if (offset) child.position.set(...offset);
      if (child.name.startsWith('component-marker-')) {
        const selected = child.userData.component === activeSystem;
        child.scale.setScalar(selected ? 1.14 : 1);
        child.children.forEach(markerPart => {
          if (markerPart instanceof THREE.Sprite) {
            const spriteMaterial = markerPart.material as THREE.SpriteMaterial;
            if (spriteMaterial.map) spriteMaterial.map.dispose();
            spriteMaterial.map = makeMarkerLabel(String(child.userData.markerLabel || ''), selected);
            spriteMaterial.needsUpdate = true;
          }
          if (markerPart instanceof THREE.Mesh && markerPart.name.endsWith('marker')) {
            const markerMaterial = markerPart.material as THREE.MeshStandardMaterial;
            markerMaterial.emissive.setHex(selected ? 0x00aaff : 0x087bff);
            markerMaterial.emissiveIntensity = selected ? 1.35 : 0.85;
          }
        });
      }
    });
    model.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const material = object.material as THREE.MeshStandardMaterial;
      if (!material || !('emissive' in material)) return;
      const component = object.userData.component;
      const selected = component === activeSystem;
      // Keep the exterior paint silver when the body is selected; highlight only the marker.
      const bodyShell = component === 'Body & Structure';
      material.emissive = new THREE.Color(selected && !bodyShell ? 0x087bd4 : 0x000000);
      material.emissiveIntensity = selected && !bodyShell ? 0.34 : 0.015;
      if (viewMode === 'xray' && bodyShell) { material.transparent = true; material.opacity = 0.22; }
      else if (bodyShell) { material.opacity = 1; material.transparent = false; }
    });
  }, [activeSystem, viewMode, modelReady]);

  const zoom = (factor: number) => {
    if (isToyotaInnova) return;
    const api=sceneApiRef.current; if (!api?.camera || !api.controls) return;
    const direction=api.camera.position.clone().sub(api.controls.target);
    const nextDistance = THREE.MathUtils.clamp(direction.length() * factor, 5.2, 19);
    direction.setLength(nextDistance); api.camera.position.copy(api.controls.target).add(direction); api.controls.update();
  };
  const resetView = () => {
    if (isToyotaInnova) return;
    const api=sceneApiRef.current; if (!api?.camera || !api.controls) return;
    api.camera.position.set(5.8,3.7,7.3); api.controls.target.set(0,1.12,0);
    api.controls.autoRotate=false; setAutoRotateEnabled(false); api.controls.update();
    if(api.model) api.model.rotation.set(0,0,0);
  };
  const toggleAutoRotate = () => {
    if (isToyotaInnova) return;
    const c=sceneApiRef.current?.controls; if(!c) return;
    c.autoRotate=!c.autoRotate; setAutoRotateEnabled(c.autoRotate);
  };
  const selectSystem = (name: string, index: number, source: HTMLButtonElement) => {
    runSelectionFlight(source, {
      title: name,
      subtitle: 'VEHICLE SYSTEM SELECTED',
      imageSrc: '/images/innova-cutaway-highres.png',
      targetElement: document.querySelector<HTMLElement>('.selected-system-card'),
      duration: 900,
      onComplete: () => {
        setActiveSystem(name);
        onSelectComponent(index, name);
        // Rear Suspension is the supported component hierarchy in this workflow;
        // selecting it directly opens that hierarchy without an extra Next button.
        if (name.toLowerCase() === 'rear suspension') onNavigate(11);
      },
    });
  };

  return <div className="lifex-3d-page lifex-page-enter">

    <main className="lifex-3d-main">

      <nav className="lifex-3d-steps" aria-label="Project repository steps">
        {['Select OEM','Select Vehicle','Vehicle Overview','Component Selection','Knowledge Access'].map((step,i)=><React.Fragment key={step}><div className={`step ${i<2?'complete':''} ${i===2?'active':''}`}><span>{i<2?'✓':i+1}</span>{step}</div>{i<4&&<i/>}</React.Fragment>)}
      </nav>
      <div className="lifex-3d-title-row"><div><div className="eyebrow">PROJECT REPOSITORY / STEP 03</div><h1>Vehicle Overview <em>— {oemLabel} {vehicleLabel}</em></h1><p>Explore the vehicle in 3D, rotate the model and select a system to inspect its components.</p></div><div className="vehicle-id"><span>SELECTED VEHICLE</span><b>{oemLabel} · {vehicleLabel}</b><small>{vehicle.year} · {vehicleLabel.toLowerCase().includes('innova') ? 'MPV' : vehicle.category} · {vehicle.powertrain}</small></div></div>
      <section className="lifex-3d-workspace">
        <aside className="lifex-3d-vehicle-path">
          <div className="path-label">OEM TO VEHICLE</div>
          <div className="path-card oem-card"><div className="toyota-mark"><img src={`/oem-logos/${(vehicle.brand || "Other").toLowerCase()}.svg`} alt={`${oemLabel} logo`} onError={(e) => { e.currentTarget.src = "/oem-logos/toyota.svg"; }} /></div><b>{oemLabel.toUpperCase()}</b><small>ORIGINAL EQUIPMENT MANUFACTURER</small></div>
          <div className="path-arrow"><span/></div>
          <div className="path-card model-card"><img src="/images/innova-xray-reference.png" alt="Innova vehicle thumbnail"/><div><b>{vehicleLabel}</b><small>{vehicle.category === 'SUV' ? 'MPV' : vehicle.category}</small><span><CheckCircle2/> Selected vehicle</span></div></div>
          <div className="path-note"><span className="note-dot"/> OEM and vehicle selection confirmed</div>
        </aside>
        <section className="lifex-3d-viewer-panel">
          <div className="viewer-topline"><div><span className="live-dot"/> {'INTERACTIVE 3D MODEL'}</div><span className="viewer-mode-label"><CarFront/> INTERACTIVE VIEW</span></div>
          {activeSystem === 'Suspension' && <div className="rear-hierarchy-pointer" aria-label="Rear Suspension points to the component hierarchy"><span>COMPONENT HIERARCHY</span><i/><ArrowLeft/></div>}
          <div className={`lifex-3d-canvas-wrap mode-${viewMode} ${isToyotaInnova ? 'has-sketchfab-model' : ''}`}>
            {isToyotaInnova ? (
              <div className={`innova-reference-stage mode-${viewMode}`} aria-label="Toyota Innova Crysta with interactive engineering system markers">
                <img className="innova-reference-image" src="/images/innova-cutaway-highres.png" alt="Toyota Innova Crysta semi-transparent engineering cutaway showing internal vehicle systems" onLoad={() => setModelReady(true)} />
                <svg className="innova-hotspot-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {INNOVA_HOTSPOTS.map((spot) => <line key={`${spot.label}-line`} x1={spot.x} y1={spot.y} x2={spot.lx} y2={spot.ly} />)}
                </svg>
                <div className="innova-hotspots">
                  {INNOVA_HOTSPOTS.map((spot, index) => {
                    const selected = activeSystem === spot.system;
                    const selectMarkedSystem = (event: React.MouseEvent<HTMLButtonElement>) => {
                      const systemIndex = SYSTEMS.findIndex(item => item.name === spot.system);
                      const isRear = spot.label === 'Rear Suspension';
                      runSelectionFlight(event.currentTarget, {
                        title: spot.label,
                        subtitle: 'MARKED VEHICLE SYSTEM',
                        imageSrc: '/images/innova-cutaway-highres.png',
                        targetElement: document.querySelector<HTMLElement>(isRear ? '.lifex-3d-vehicle-path' : '.selected-system-card'),
                        targetLabel: isRear ? 'COMPONENT HIERARCHY' : 'SELECTED SYSTEM',
                        duration: 960,
                        onComplete: () => { setActiveSystem(spot.system); if (systemIndex >= 0) onSelectComponent(systemIndex, spot.system); if (isRear) onNavigate(11); },
                      });
                    };
                    return <React.Fragment key={spot.label}>
                      <button type="button" className={`innova-hotspot-pin ${selected ? 'selected' : ''} ${spot.label === 'Rear Suspension' ? 'rear-suspension-target' : ''}`} style={{ left: `${spot.x}%`, top: `${spot.y}%`, animationDelay: `${index * 95}ms` }} onClick={selectMarkedSystem} aria-label={`Select ${spot.label}`} title={`Select ${spot.label}`} />
                      <button type="button" className={`innova-hotspot-label ${selected ? 'selected' : ''} ${spot.label === 'Rear Suspension' ? 'rear-suspension-target' : ''}`} style={{ left: `${spot.lx}%`, top: `${spot.ly}%`, animationDelay: `${index * 95 + 70}ms` }} onClick={selectMarkedSystem}>{spot.label}{spot.label === 'Rear Suspension' && <span className="hotspot-open-indicator">OPEN</span>}</button>
                    </React.Fragment>;
                  })}
                </div>
                <div className="innova-image-caption"><b>TOYOTA INNOVA CRYSTA</b><span>SELECT A MARKED VEHICLE SYSTEM · REAR SUSPENSION OPENS COMPONENT HIERARCHY</span></div>
              </div>
            ) : <canvas ref={canvasRef} aria-label={`Interactive rotatable 3D ${oemLabel} ${vehicleLabel} engineering model`}/>}
            {!isToyotaInnova && <><div className="canvas-label"><span>{oemLabel.toUpperCase()}</span><b>{vehicleLabel.toUpperCase()}</b><small>INTERACTIVE 3D ENGINEERING MODEL</small></div>
            {showHint&&<button className="drag-hint" onClick={()=>setShowHint(false)}><MousePointer2/> Drag to rotate 360° <span>×</span></button>}
            <div className="canvas-corner">360° ROTATABLE VIEW</div>
            <button className="fullscreen-btn" onClick={()=>{const el=canvasRef.current?.parentElement;if(el?.requestFullscreen) void el.requestFullscreen();}} aria-label="Fullscreen"><Maximize2/></button></>}
          </div>
          {isToyotaInnova ? (
            <div className="viewer-footnote innova-interaction-note"><span><i/> MARKERS POP IN SEQUENCE</span><span>TOUCH REAR SUSPENSION TO OPEN</span><span>ALL OTHER SYSTEM MARKERS HIGHLIGHT ON SELECTION</span></div>
          ) : (
            <><div className="viewer-controls"><button className={autoRotateEnabled ? 'control-active' : ''} onClick={toggleAutoRotate}><RotateCcw/> Auto rotate</button><button onClick={()=>zoom(0.84)}><Plus/> Zoom in</button><button onClick={()=>zoom(1.18)}><Minus/> Zoom out</button><button onClick={resetView}><RotateCcw/> Reset view</button></div><div className="viewer-footnote"><span><i/> DRAG TO ROTATE 360°</span><span>ZOOM WITH CONTROLS</span><span>CLICK A BLUE MARKER TO SELECT</span></div></>
          )}
        </section>
        <aside className="lifex-3d-systems">
          <div className="systems-heading">
            <span className="eyebrow">VEHICLE ARCHITECTURE</span>
            <h2>Select a component</h2>
            <p className="systems-intro">Choose a vehicle system to carry into component exploration.</p>
          </div>
          <div className="systems-list">
            {SYSTEMS.map((system, index) => (
              <button type="button" key={system.name} className={activeSystem === system.name ? 'active' : ''} onClick={(event) => selectSystem(system.name, index, event.currentTarget)} aria-pressed={activeSystem === system.name}>
                <span className="system-icon"><ComponentIcon name={system.name}/></span>
                <span className="system-copy"><b>{system.name}</b><small>{system.detail}</small></span>
                <ChevronRight className="system-chevron"/>
              </button>
            ))}
          </div>
          <div className="selected-system-card">
            <span className="selected-system-icon"><ComponentIcon name={activeSystem}/></span>
            <div><small>ACTIVE SYSTEM</small><b>{activeSystem}</b></div>
            <span className="selected-check"><CheckCircle2/></span>
          </div>
        </aside>
      </section>
      <footer className="lifex-3d-footer"><button className="back-btn" onClick={()=>onNavigate(5)}><ArrowLeft/> Back: Select Vehicle</button><div className="footer-status"><span className="live-dot"/> VEHICLE SYSTEMS READY <span>·</span> TOUCH A MARKER ON THE INNOVA</div><div className="footer-status rear-direct-hint">REAR SUSPENSION MARKER OPENS COMPONENT HIERARCHY <ArrowRight/></div></footer>
    </main>
  </div>;
};
