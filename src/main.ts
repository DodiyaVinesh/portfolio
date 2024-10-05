import {
  BasicShadowMap,
  DirectionalLight,
  DynamicDrawUsage,
  IcosahedronGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineLoop,
  Matrix4,
  Object3D,
  PerspectiveCamera,
  Plane,
  Quaternion,
  Raycaster,
  ReinhardToneMapping,
  RingGeometry,
  Scene,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { CustomMeshPhysicalShader } from "./worker/custom_meshphysical.glsl";
import "./style.css";

const physicsWorker = new Worker(
  new URL("./worker/worker-physics.js", import.meta.url),
  { type: "module" }
);
const regularFont = new FontFace(
  "Poppins",
  'url("/assets/fonts/poppins-v20-latin/regular.woff2") format("woff2"), url("/assets/fonts/poppins-v20-latin/regular.ttf") format("truetype")',
  { weight: "400" }
);
const boldFont = new FontFace(
  "Poppins",
  'url("/assets/fonts/poppins-v20-latin/800.woff2") format("woff2"), url("/assets/fonts/poppins-v20-latin/800.ttf") format("truetype")',
  { weight: "800" }
);
const regularFontPromise = regularFont.load();
const boldFontPromise = boldFont.load();

// html text effects
let nameInterval: number | undefined;
let orignalName = "VINESH DODIYA";
let allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nameElement = document.getElementById("myname") as HTMLElement;

function textEffect() {
  let iteration = 0;
  clearInterval(nameInterval);

  nameInterval = window.setInterval(() => {
    nameElement.innerText = orignalName
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return letter;
        }
        return allLetters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iteration >= orignalName.length) {
      clearInterval(nameInterval);
    }

    iteration += 1 / 3;
  }, 30);
}
nameElement.addEventListener("mouseover", textEffect);

// toggle button handler
const toggleIcon = document.getElementById("toggleIcon") as HTMLButtonElement;
const getInTouch = document.getElementById("getInTouch") as HTMLButtonElement;
getInTouch.addEventListener("click", () => {
  toggleIcon.focus();
  toggleIcon.click();
});
toggleIcon.addEventListener("click", () => {
  toggleIcon.classList.toggle("active");
});
toggleIcon.addEventListener("blur", () => {
  toggleIcon.classList.remove("active");
});

// tech list load
const techs = [
  {
    src: "assets/images/techs/html.webp",
    alt: "HTML - HyperText Markup Language",
    title: "HTML",
  },
  {
    src: "assets/images/techs/css.webp",
    alt: "CSS - Cascading Style Sheets",
    title: "CSS",
  },
  {
    src: "assets/images/techs/javascript.webp",
    alt: "JavaScript - Programming Language",
    title: "JavaScript",
  },
  {
    src: "assets/images/techs/jquery.webp",
    alt: "jQuery - JavaScript Library",
    title: "jQuery",
  },
  {
    src: "assets/images/techs/react.webp",
    alt: "React - JavaScript Library for Building User Interfaces",
    title: "React",
  },
  {
    src: "assets/images/techs/angular.webp",
    alt: "Angular - Web Application Framework",
    title: "Angular",
  },
  {
    src: "assets/images/techs/bootstrap.webp",
    alt: "Bootstrap - Front-end Framework for Responsive Design",
    title: "Bootstrap",
  },
  {
    src: "assets/images/techs/sass.webp",
    alt: "SASS - Syntactically Awesome Style Sheets",
    title: "SASS",
  },
  {
    src: "assets/images/techs/typescript.webp",
    alt: "TypeScript - Superset of JavaScript",
    title: "TypeScript",
  },
  {
    src: "assets/images/techs/vscode.webp",
    alt: "Visual Studio Code - Source Code Editor",
    title: "VsCode",
  },
  {
    src: "assets/images/techs/node.webp",
    alt: "Node.js - JavaScript Runtime Environment",
    title: "Node.JS",
  },
  {
    src: "assets/images/techs/npm.webp",
    alt: "NPM - Node Package Manager",
    title: "NPM",
  },
  {
    src: "assets/images/techs/mongodb.webp",
    alt: "MongoDB - NoSQL Database",
    title: "Mongodb",
  },
  {
    src: "assets/images/techs/mysql.webp",
    alt: "MySQL - Relational Database Management System",
    title: "MySQL",
  },
  {
    src: "assets/images/techs/postgreSQL.webp",
    alt: "PostgreSQL - Object-Relational Database",
    title: "PostgreSQL",
  },
  {
    src: "assets/images/techs/redis.webp",
    alt: "Redis - In-Memory Data Structure Store",
    title: "Redis",
  },
  {
    src: "assets/images/techs/firebase.webp",
    alt: "Firebase - Mobile and Web Application Development Platform",
    title: "Firebase",
  },
  {
    src: "assets/images/techs/socketIO.webp",
    alt: "Socket.IO - Real-time Web Applications",
    title: "SocketIO",
  },
  {
    src: "assets/images/techs/playwright.webp",
    alt: "Playwright - Web Testing Framework",
    title: "Playwright",
  },
  {
    src: "assets/images/techs/selenium.webp",
    alt: "Selenium - Automated Web Testing",
    title: "Selenium",
  },
  {
    src: "assets/images/techs/three.webp",
    alt: "Three.js - JavaScript 3D Library",
    title: "Three.JS",
  },
  {
    src: "assets/images/techs/discordjs.webp",
    alt: "Discord.js - JavaScript Library for Discord API",
    title: "DiscordJS",
  },
  {
    src: "assets/images/techs/postman.webp",
    alt: "Postman - API Development Environment",
    title: "Postman",
  },
  {
    src: "assets/images/techs/bitbucket.webp",
    alt: "Bitbucket - Git Repository Management",
    title: "BitBucket",
  },
  {
    src: "assets/images/techs/github.webp",
    alt: "GitHub - Code Hosting Platform",
    title: "GitHub",
  },
  {
    src: "assets/images/techs/docker.webp",
    alt: "Docker - Containerization Platform",
    title: "Docker",
  },
  {
    src: "assets/images/techs/k8s.webp",
    alt: "Kubernetes - Container Orchestration System",
    title: "Kubernetes",
  },
];

const techsContainer = document.querySelector(".techs") as HTMLElement;
techs.forEach((tech) => {
  const techDiv = document.createElement("div");
  techDiv.className = "tech";

  const img = document.createElement("img");
  img.src = tech.src;
  img.alt = tech.alt;
  img.title = tech.title;

  techDiv.appendChild(img);
  techsContainer.appendChild(techDiv);
});

// after everything loaded remove loader
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([regularFontPromise, boldFontPromise]);
  document.fonts.add(regularFont);
  document.fonts.add(boldFont);
  document.body.classList.remove("loading");
  textEffect();
});
// ====================================================================

// three.js ->
const isNarrowScreen =
  !!navigator.platform.match(/iPhone|iPod/) ||
  !!window.matchMedia("(max-width: 736px)").matches;

const shaders = {
  physical: CustomMeshPhysicalShader,
};

const container = document.querySelector(".canvas-container") as HTMLElement;
function getHeight() {
  return container.offsetHeight || window.innerHeight;
}

console.log(container);

interface Skin {
  material: any;
  uniforms?: any;
  fragment?: string;
  vertex?: string;
  update(target?: any): void;
}

class PBRSkin implements Skin {
  material: any;
  uniforms = UniformsUtils.clone(shaders.physical.uniforms);
  vertex = shaders.physical.vertexShader;
  fragment = shaders.physical.fragmentShader;

  constructor() {
    this.uniforms.uTime = { value: 1.0 };
    this.uniforms.uRandom = { value: Math.random() };
    this.uniforms.uScale = { value: 0.001 };

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertex,
      fragmentShader: this.fragment,
      lights: true,
    });
    this.material.extensions.derivatives = true;
  }

  update(target: any) {
    this.uniforms.uTime.value += 0.01;
    this.uniforms.uScale.value =
      target.scale.x * Math.max(1 - scrollPercent, 0.25);
    if (target.scale.x <= 0.001) {
      this.uniforms.uRandom.value = Math.random();
    }
  }
}

var scene = new Scene();
var camera = new PerspectiveCamera(10, window.innerWidth / getHeight(), 10, 50);
camera.position.z = 30;

var renderer = new WebGLRenderer({
  alpha: true,
  premultipliedAlpha: false,
  powerPreference: "high-performance",
  precision: "lowp",
  depth: false,
  antialias: true,
});
renderer.setSize(window.innerWidth, getHeight());
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = BasicShadowMap;
renderer.toneMapping = ReinhardToneMapping;
renderer.toneMappingExposure = 3;
// renderer.physicallyCorrectLights = true;

// Check if WebGL2 context is available
let gl = renderer.getContext(); // Automatically grabs WebGL2 if available, else falls back to WebGL1

if (gl instanceof WebGLRenderingContext) {
  const ext = gl.getExtension("OES_standard_derivatives");
  if (!ext) {
    console.warn("OES_standard_derivatives extension is not supported.");
  } else {
    console.log("OES working fine");
  }
} else if (gl instanceof WebGL2RenderingContext) {
  console.log("Using WebGL2, no need for OES_standard_derivatives.");
}

container.appendChild(renderer.domElement);

function map(
  value: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number
): number {
  return min2 + ((value - min1) * (max2 - min2)) / (max1 - min1);
}

const dt = 1 / 60,
  N = Math.round(map(window.innerWidth, 300, 2000, 5, 30));
let physicsData = {
  positions: new Float32Array(N * 3),
  quaternions: new Float32Array(N * 4),
  scales: new Float32Array(N * 4),
};
let geometryData = {
  positions: new Float32Array(N * 3),
  quaternions: new Float32Array(N * 4),
  scales: new Float32Array(N * 4),
};

let sendTime: number;
let create = false;
let needsupdate = true;
physicsWorker.onmessage = function (e) {
  physicsData.positions = e.data.positions;
  physicsData.quaternions = e.data.quaternions;
  physicsData.scales = e.data.scales;

  geometryData.positions.set(physicsData.positions);
  geometryData.quaternions.set(physicsData.quaternions);
  geometryData.scales.set(physicsData.scales);

  needsupdate = true;
  setTimeout(updateWorker, Math.max(dt * 1000 - (Date.now() - sendTime), 0));
};

function updateWorker() {
  if (!needsupdate) {
    return;
  }
  needsupdate = false;

  sendTime = Date.now();
  physicsWorker.postMessage(
    {
      create: create,
      N: spheres.length,
      dt: dt,
      positions: physicsData.positions,
      quaternions: physicsData.quaternions,
      scales: physicsData.scales,
      mouse: move,
    },
    [
      physicsData.positions.buffer,
      physicsData.quaternions.buffer,
      physicsData.scales.buffer,
    ]
  );
  create = false;
}

const spheresCenter = new Object3D();
scene.add(spheresCenter);
let spheres: any[] = [];

var geometry = new InstancedBufferGeometry();
var ballGeometry = new IcosahedronGeometry(1, 3);

for (const key in ballGeometry.attributes) {
  geometry.setAttribute(key, ballGeometry.attributes[key]);
}

if (ballGeometry.index) {
  geometry.setIndex(ballGeometry.index);
}

var randomData = new Float32Array(N).map((_) => Math.random());
let instanceRandomAttribute = new InstancedBufferAttribute(randomData, 1);
geometry.setAttribute("instanceRandom", instanceRandomAttribute);
var scaleData = new Float32Array(N).map(
  (_s, i) => geometryData.scales[i * 4 + 4]
);
let instanceScaleAttribute = new InstancedBufferAttribute(
  scaleData,
  1
).setUsage(DynamicDrawUsage);
geometry.setAttribute("instanceScale", instanceScaleAttribute);
let material = new PBRSkin().material;
let mesh = new InstancedMesh(geometry, material, spheres.length);
let mouseGeometry = new RingGeometry(1.25, 1.3);

// Create the LineLoop
let mouseBall = new LineLoop(
  mouseGeometry,
  new LineBasicMaterial({
    color: getComputedStyle(document.documentElement)
      .getPropertyValue("--c-primary")
      .trim(),
  })
);

if (!isNarrowScreen) {
  scene.add(mouseBall);
}

function makeSphere() {
  create = true;
  spheres.push(1);
}

var topLight = new DirectionalLight(0xffffff, 3);
topLight.color.setHSL(0.1, 1, 0.95);
topLight.position.set(-1, 1.75, 1);
topLight.position.multiplyScalar(2);
scene.add(topLight);
topLight.castShadow = true;
topLight.shadow.mapSize.width = topLight.shadow.mapSize.height = 2048;
var d = 4;
topLight.shadow.camera.left = -d;
topLight.shadow.camera.right = d;
topLight.shadow.camera.top = d;
topLight.shadow.camera.bottom = -d;
topLight.shadow.camera.far = 8;

let timeSinceLast = 0;
let maxTime = 5;
var doc = document.documentElement;
var cachedClientHeight = doc.clientHeight;
var cachedScrollHeight = doc.scrollHeight;

const planeNormal = new Vector3(0, 0, 1);
const plane = new Plane(planeNormal, 0);

const raycaster = new Raycaster();
let mouse = new Vector2(0, -2);
let mouseTarget = new Vector2(0, 0);
let mouseScaleTarget = new Vector3();
let mosueOverLink = false;
let move = new Vector3();

var scrollPercent = 0;
var targetScollPercent =
  doc.scrollTop / (cachedScrollHeight - cachedClientHeight);

// initiatl postion if not narrow screen:
if (!isNarrowScreen) {
  mouseTarget.set(0.5, 0);
}

var tmpM = new Matrix4();
let offset = new Vector3();
let orientation = new Quaternion();
let scale = new Vector3();
let time = 0;
var animate = function () {
  time += 0.01;
  timeSinceLast++;
  requestAnimationFrame(animate);

  if (spheres.length < N && timeSinceLast > maxTime) {
    makeSphere();
    timeSinceLast = 0;
    scene.remove(mesh);
    mesh = new InstancedMesh(geometry, material, spheres.length);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  spheres.forEach((_s, i) => {
    offset.set(
      geometryData.positions[3 * i + 0],
      geometryData.positions[3 * i + 1],
      geometryData.positions[3 * i + 2]
    );
    orientation.set(
      geometryData.quaternions[4 * i + 0],
      geometryData.quaternions[4 * i + 1],
      geometryData.quaternions[4 * i + 2],
      geometryData.quaternions[4 * i + 3]
    );
    scale.setScalar(geometryData.scales[4 * i + 0]);
    tmpM.compose(offset, orientation, scale);
    mesh.setMatrixAt(i, tmpM);

    instanceScaleAttribute.setX(i, geometryData.scales[4 * i + 3] / 4);
  });
  instanceScaleAttribute.needsUpdate = true;
  geometry.setAttribute("instanceScale", instanceScaleAttribute);
  mesh.instanceMatrix.needsUpdate = true;

  targetScollPercent =
    doc.scrollTop / (cachedScrollHeight - cachedClientHeight);
  scrollPercent += (targetScollPercent - scrollPercent) * 0.01;

  if (isNarrowScreen) {
    mouseTarget.set(Math.cos(time * Math.PI) * 0.25, Math.cos(time) * 0.5);
  }

  mouse.lerp(mouseTarget, 0.15);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, move);
  mouseBall.position.copy(move);

  mouseScaleTarget.setScalar(
    mosueOverLink ? 0.25 + mouse.distanceToSquared(mouseTarget) * 0.5 : 0.1
  );
  mouseBall.rotateZ(-0.2 * mouseBall.scale.x);

  mouseBall.scale.lerp(mouseScaleTarget, 0.06);

  renderer.render(scene, camera);
};

updateWorker();
animate();

window.onresize = function () {
  var windowAspect = window.innerWidth / getHeight();
  cachedClientHeight = doc.clientHeight;
  cachedScrollHeight = doc.scrollHeight;
  camera.aspect = windowAspect;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, getHeight());
};

if (window.PointerEvent) {
  document.addEventListener("pointermove", onmove, false);
} else {
  document.addEventListener("mousemove", onmove, false);
}

function onmove(e: any) {
  if (isNarrowScreen) {
    mouseTarget.set(0, 0);
    return e;
  } else {
    mosueOverLink = !!(e.target.nodeName.toLowerCase() == "a");
    mouseTarget.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / getHeight()) * 2 + 1
    );
  }
}
