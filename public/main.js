// import the Three.js module:
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import Stats from "three/addons/libs/stats.module";
import { XRButton } from "three/addons/webxr/XRButton.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { Timer } from "three/addons/misc/Timer.js";


const overlay = document.getElementById("overlay")

// add a stats view to the page to monitor performance:
const stats = new Stats();
document.body.appendChild(stats.dom);

// create a renderer with better than default quality:
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
// make it fill the page
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
//renderer.shadowMap.enabled = true;
// create and add the <canvas>
document.body.appendChild(renderer.domElement);
document.body.appendChild(XRButton.createButton(renderer));
document.body.appendChild(VRButton.createButton(renderer));

// make an indepenent camera for VR:
let camera_vr = new THREE.PerspectiveCamera();

// create a perspective camera
const camera = new THREE.PerspectiveCamera(
  75, // this camera has a 75 degree field of view in the vertical axis
  window.innerWidth / window.innerHeight, // the aspect ratio matches the size of the window
  0.05, // anything less than 5cm from the eye will not be drawn
  100 // anything more than 100m from the eye will not be drawn
);
// position the camera
// the X axis points to the right
// the Y axis points up from the ground
// the Z axis point out of the screen toward you
camera.position.y = 0.7; // average human eye height is about 1.5m above ground
camera.position.z = 5; // let's stand 2 meters back

//const orbitControls = new OrbitControls(camera, renderer.domElement);
const controls = new PointerLockControls(camera, renderer.domElement);

// update camera & renderer when page resizes:
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  // bugfix: don't resize renderer if in VR
  if (!renderer.xr.isPresenting)
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//added/////////////////////////////////////////////////////////////////////////////////////////////
// Pointer lock requires a user action to start, e.g. click on canvas to start pointerlock:
renderer.domElement.addEventListener("click", function () {
	controls.lock();
});
let Forward = false;
let Backward = false;
let Right = false;
let Left = false;
let Ctrl = false;
let Shift = false;
let Alt = false;
const dir = new THREE.Vector3();
const vel = new THREE.Vector3();

//if key is pressed
const onKeyDown = (e) => {
switch (e.code) {
	case "KeyW":
	Forward = true;
	break;
	case "KeyA":
	Left = true;
	break;
	case "KeyS":
	Backward = true;
	break;
	case "KeyD":
	Right = true;
	break;
	case "ControlLeft":
	Ctrl = true;
	break;
	case "ShiftLeft":
	Shift = true;
	break;

	//temp for codepen
	case "AltLeft":
	Alt = true;
	break;
}
};

//If key is not pressed
const onKeyUp = (e) => {
switch (e.code) {
	case "KeyW":
	Forward = false;
	break;
	case "KeyA":
	Left = false;
	break;
	case "KeyS":
	Backward = false;
	break;
	case "KeyD":
	Right = false;
	break;
	case "ControlLeft":
	Ctrl = false;
	break;
	case "ShiftLeft":
	Shift = false;
	break;

	//temp for code pen
	case "AltLeft":
	Alt = false;
	break;
}
};

let touchstartY = 0;
let touchendY = 0;
let flickJoystickInterval = 100;
let prevJoystickTime = 0;
function checkDirection() {
//if swiped up. launch ball
if (
	touchendY + 100 < touchstartY &&
	performance.now() - prevJoystickTime > flickJoystickInterval
) {
	// Temporary!
	let newTargetPosition = target.position.clone();
	newTargetPosition.y += 0.1;
	moveSphere(newTargetPosition);
	sphereOnHand = false;
	//sphere on ground
	let diff = newTargetPosition.clone().sub(camera.position);
	sphereDist = diff.length();
	console.log("Up");
}
}

//if on mobile, displays joysticks
if (onMobile == true) {
//Right joystick to move around
let joystickR = nipplejs.create({
	zone: document.getElementById("jRight"),
	mode: "static",
	position: { left: "90%", top: "90%" },
	color: "blue"
});

//Right joystick to look around
joystickR.on("move", function (evt, data) {
	// DO EVERYTHING
	console.log(evt, data);
	nav.lookx = data.vector.y;
	nav.looky = -data.vector.x;
});

//Left joystick to walk around
let joystickL = nipplejs.create({
	zone: document.getElementById("jLeft"),
	mode: "static",
	position: { left: "10%", top: "90%" },
	color: "red"
});

joystickL.on("end", function (evt, data) {
	dir.z = 0;
	dir.x = 0;
});

joystickL.on("move", function (evt, data) {
	dir.z = data.vector.y;
	dir.x = data.vector.x;
});
}
//////////////////////////////////////////////////////////////////////////////////////////////
// Create ghost head with reflective material
const ghostGeometry = new THREE.SphereGeometry(2, 16, 16);
const ghostMaterial = new THREE.MeshStandardMaterial({
  color: "#99ccff",
  roughness: 0.2,
  metalness: 0.5
});
const ghostHead = new THREE.Mesh(ghostGeometry, ghostMaterial);
ghostHead.position.set(0, 0, 0); // Set the initial height of the ghost

// Create eyes
const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(-0.5, 0, -1.8);
//ghostHead.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.position.set(0.5, 0, -1.8);
//ghostHead.add(rightEye);

// Create hands with reflective material
const handGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const handMaterial = new THREE.MeshStandardMaterial({
  color: "#99ccff",
  roughness: 0.2,
  metalness: 0.5
});

const leftHand = new THREE.Mesh(handGeometry, handMaterial);
leftHand.position.set(-1, -1, -3.5);
//ghostHead.add(leftHand);

const rightHand = new THREE.Mesh(handGeometry, handMaterial);
rightHand.position.set(1, -1, -3.5);
//ghostHead.add(rightHand);

const avatarGroup = new THREE.Group();
avatarGroup.add(ghostHead);
avatarGroup.add(leftEye);
avatarGroup.add(rightEye);
avatarGroup.add(leftHand);
avatarGroup.add(rightHand);
avatarGroup.scale.set(0.3, 0.3, 0.3);
avatarGroup.position.set(
  camera.position.x,
  camera.position.y,
  camera.position.z + 0.7
);
scene.add(avatarGroup);
/////////////////////////////////////////////////////////////////////////////////////////////////
const sphereColor = 0xf7e09a;
const planeColor = 0x4d4f4f;

const plane_geo = new THREE.PlaneGeometry(10, 10);
const plane_mat = new THREE.MeshStandardMaterial({
  color: planeColor,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(plane_geo, plane_mat);
plane.rotateX(Math.PI / 2);
scene.add(plane);
raycastingObjects.push(plane);
let grid = new THREE.GridHelper(10, 10);
// scene.add(grid);

const hemlight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
scene.add(hemlight);

const sphere1_geo = new THREE.SphereGeometry(0.1, 32, 16);
const sphere1_mat = new THREE.MeshStandardMaterial({
  color: sphereColor,
  emissive: sphereColor,
  emissiveIntensity: 0.5
});
const sphere1 = new THREE.Mesh(sphere1_geo, sphere1_mat);

let sphere1Pos = new THREE.Vector3(0, -0.3, -0.5);
const pointLight1 = new THREE.PointLight(sphereColor, 1);
pointLight1.position.copy(camera.position.clone().add(sphere1Pos));
pointLight1.add(sphere1);
scene.add(pointLight1);

const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

// const pointer = new THREE.Vector2();

// function onPointerMove(event) {
//   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//   pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }

// point light animation
let targetPosition = new THREE.Vector3(0, 0, 0);
let startPosition;
let animationTime = 0;
let sphereDist;
let comeback = false;
let sphereOnHand = true;

function moveSphere(newTargetPosition) {
  targetPosition = newTargetPosition;
  startPosition = pointLight1.position.clone();
  animationTime = 0;
}
function onPointerClick(event) {
  const intersects = raycaster.intersectObjects(raycastingObjects);

  if (intersects.length > 0) {
    let newTargetPosition = intersects[0].point;
    newTargetPosition.y += 0.1;
    moveSphere(newTargetPosition);
    sphereOnHand = false;
    //sphere on ground
    let diff = newTargetPosition.clone().sub(camera.position);
    sphereDist = diff.length();
  }
}
const circleRadius = 0.05;
const circleSegments = 32;
const circleGeometry = new THREE.SphereGeometry(circleRadius, circleSegments);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const target = new THREE.Mesh(circleGeometry, circleMaterial);
target.rotateX(Math.PI / 2);
scene.add(target);

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

// Helper functions

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function rgbToHex(r, g, b) {
  return (r << 16) | (g << 8) | b;
}

function hexToRgb(hex) {
  let r = (hex >> 16) & 0xff;
  let g = (hex >> 8) & 0xff;
  let b = hex & 0xff;
  return [r, g, b];
}

// Tree

const radiusDecay = 2 / 3;
const heightDecayMin = 0.1;
const heightDecayMax = 1.2;
const maxBranches = 5;
const maxSpreadness = Math.PI / 4;
const minSpreadness = Math.PI / 8;
const colorFactor = 1.2;
let trees = [];
let firstTree = true;

class Tree extends THREE.Group {
  constructor(
    radius,
    height,
    depth,
    growSpeed = 0.1,
    minBranches = 5,
    minBranchHeight = -1,
    maxBranchHeight = 1,
    color = 0xffffff
  ) {
    super();
    this.radius = radius;
    this.height = height;
    this.growSpeed = growSpeed;
    this.depth = depth;
    this.minBranches = minBranches;
    this.minBranchHeight = minBranchHeight;
    this.maxBranchHeight = maxBranchHeight;
    this.color = color;

    if (this.depth == 0) {
      const leaf_geo = new THREE.SphereGeometry(height, 32, 32);
      const leaf_mat = new THREE.MeshStandardMaterial({ color: this.color });
      this.trunk = new THREE.Mesh(leaf_geo, leaf_mat);
      this.trunk.scale.x = 0;
      this.trunk.scale.y = 0;
      this.trunk.scale.z = 0;
      this.add(this.trunk);
      this.branched = true;
    } else {
      const trunk_geo = new THREE.CylinderGeometry(
        radius * radiusDecay,
        radius,
        height,
        32
      );
      const trunk_mat = new THREE.MeshStandardMaterial({ color: this.color });
      this.trunk = new THREE.Mesh(trunk_geo, trunk_mat);
      this.trunk.scale.y = 0;
      this.add(this.trunk);
      this.branched = false;
    }
  }

  grow() {
    this.children.forEach((branch) => {
      if (branch instanceof Tree) {
        branch.grow();
      }
    });
    if (this.trunk.scale.y >= 1) {
      if (!this.branched && this.depth > 0) {
        let n = getRandomInt(this.minBranches, maxBranches);
        let spreadness = getRandom(minSpreadness, maxSpreadness);
        this.addBranches(n, spreadness);
      }
    } else {
      this.trunk.scale.y = Math.min(this.trunk.scale.y + this.growSpeed, 1);
      if (this.depth == 0) {
        this.trunk.scale.x = Math.min(this.trunk.scale.x + this.growSpeed, 1);
        this.trunk.scale.z = Math.min(this.trunk.scale.x + this.growSpeed, 1);
      } else {
        this.trunk.position.y = Math.min(
          this.trunk.position.y + (this.height * this.growSpeed) / 2,
          this.height / 2
        );
      }
    }
  }

  addBranches(n, spreadness) {
    let theta = -Math.PI / 2;
    for (let i = 0; i < n; i++) {
      let heightDecay = getRandom(heightDecayMin, heightDecayMax);
      let branchHeight = Math.max(
        Math.min(this.height * heightDecay, this.maxBranchHeight),
        this.minBranchHeight
      );

      let [r, g, b] = hexToRgb(this.color);
      r = Math.min(255, r * colorFactor);
      g = Math.min(255, g * colorFactor);
      b = Math.min(255, b * colorFactor);
      let branchColor = rgbToHex(r, g, b);

      let branch = new Tree(
        this.radius * radiusDecay,
        branchHeight,
        this.depth - 1,
        this.growSpeed,
        1,
        this.minBranchHeight,
        this.maxBranchHeight,
        branchColor
      );
      branch.rotateOnAxis(new THREE.Vector3(0, 1, 0), theta);

      branch.rotateOnAxis(new THREE.Vector3(1, 0, 0), -spreadness);
      branch.rotateOnAxis(new THREE.Vector3(0, 0, 1), spreadness);

      branch.position.y += this.height;
      theta += (2 * Math.PI) / n;
      this.add(branch);
    }
    this.branched = true;
  }
}

const controllerModelFactory = new XRControllerModelFactory();

// getting 2 controllers:
let controller = renderer.xr.getController(0);
scene.add(controller);

let controller2 = renderer.xr.getController(1);
scene.add(controller2);

// for each controller:
const controllerGrip = renderer.xr.getControllerGrip(0);
controllerGrip.add(
  controllerModelFactory.createControllerModel(controllerGrip)
);
scene.add(controllerGrip);
const controllerGrip2 = renderer.xr.getControllerGrip(1);
controllerGrip2.add(
  controllerModelFactory.createControllerModel(controllerGrip2)
);
scene.add(controllerGrip2);

raycaster.setFromXRController(controller);

// adding event handlers for the controllers:
controller.addEventListener("selectstart", function (event) {
  const controller = event.target;
  // do a ray intersection:
  getIntersections(controller);
});
controller.addEventListener("selectend", function (event) {
  const controller = event.target;
  // etc.
});
controller2.addEventListener("selectstart", function (event) {
  const controller2 = event.target;
  // do a ray intersection:
  getIntersections(controller);
});
controller2.addEventListener("selectend", function (event) {
  const controller2 = event.target;
  // etc.
});

// call this in the 'selectstart' event, but also call it in animate()
// so that it continuously updates while moving the controller around
function getIntersections(controller) {
  controller.updateMatrixWorld();
  raycaster.setFromXRController(controller);
  let intersections = raycaster.intersectObjects(scene.children);
  // etc.
}

// events for getting/losing controllers:
// adding controller models:
controller.addEventListener("connected", function (event) {});
controller.addEventListener("disconnected", function () {});
////////////////////////////////////////////////////////////////////////////////////////////////
let prevTime = performance.now();
//////////////////////////////////////////////////////////////////////////////////////////////////

const clock = new THREE.Clock();

const scene = new THREE.Scene();

// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

const MAX_NUM_SPHERES = 100
const geometry = new THREE.SphereGeometry( 0.1, 32, 16 ); 
const material = new THREE.MeshStandardMaterial( { color: 0xffffff } ); 
const sphere = new THREE.InstancedMesh( geometry, material, MAX_NUM_SPHERES ); 
scene.add( sphere );

function updateSceneFromServer(shared) {
	let count = Math.min(shared.clients.length, MAX_NUM_SPHERES)

	let mat = new THREE.Matrix4()
	let color = new THREE.Color()
	for (let i=0; i < count; i++) {
		let client = shared.clients[i]

		mat.setPosition((client.x-0.5)*2, (1.5-client.y)*2, 0)
		color.setHSL(client.hue*2, 1, 0.5)

		sphere.setMatrixAt(i, mat)
		sphere.setColorAt(i, color)
	}
	sphere.count = count
	sphere.instanceMatrix.needsUpdate = true;
}

function animate(timestamp) {
	// monitor our FPS:
	stats.begin();
	
	// get current timing:
	const dt = clock.getDelta();
	const t = clock.getElapsedTime();

	//////////////////////////////////////////////////////////////////////////////////////////////
	const delta = (timestamp - prevTime) / 1000;

  if (!onMobile) {
    dir.z = Number(Forward) - Number(Backward);
    dir.x = Number(Right) - Number(Left);

    //when pointer is showing
    if (controls.isLocked) {
      vel.z -= vel.z * 80.0 * delta;
      vel.x -= vel.x * 80.0 * delta;
      //move WS
      if (Forward || Backward) {
        vel.z -= dir.z * 150 * delta;
      }
      //move AD
      if (Left || Right) {
        vel.x -= dir.x * 150 * delta;
      }
      //crouch
      //WARNING: bugs out if ctrl + wasd occurs because it is the same as many shortcuts for codepen so I added alt temporarily
      if (Ctrl == true && Alt == true) {
        camera.position.y = 0.5;
        vel.z -= dir.z * 20 * delta;
        vel.x -= dir.x * 20 * delta;
      } else {
        camera.position.y = 0.8;
        vel.z -= dir.z * 150 * delta;
        vel.x -= dir.x * 150 * delta;
      }
      //run
      if (Shift) {
        vel.z -= dir.z * 300 * delta;
        vel.x -= dir.x * 300 * delta;
      }

      controls.moveForward(-vel.z * delta);
      controls.moveRight(-vel.x * delta);
    }
  } else {
    //move Up & Down
    vel.z = -dir.z * 150 * delta;

    //move Left & Right
    vel.x = -dir.x * 100 * delta;

    if (dir.z == 0) {
      vel.z = 0;
    }
    if (dir.x == 0) {
      vel.x = 0;
    }

    if (nav.lookx) console.log(nav.lookx);

    camera.rotation.x = nav.lookx;
    camera.rotation.y = nav.looky;
    camera.updateMatrixWorld();

    controls.moveForward(-vel.z * delta);
    controls.moveRight(-vel.x * delta);
  }

  //get sphere distance from camera
  let sphereDiff = pointLight1.position.clone().sub(camera.position);
  if (sphereDiff.length() - sphereDist > 2) {
    pointLight1.intensity = 1;
    let zAxis = new THREE.Vector3(0, 0, -1);
    let forward = new THREE.Vector3();
    controls.getDirection(forward);
    forward.normalize();
    let right = forward.clone().cross(camera.up).normalize();
    moveSphere(
      camera.position
        .clone()
        .add(camera.up.clone().multiplyScalar(sphere1Pos.y))
        .add(right.multiplyScalar(sphere1Pos.x))
        .add(forward.multiplyScalar(-sphere1Pos.z))
    );
    comeback = true;
  }
  if (comeback) {
    let zAxis = new THREE.Vector3(0, 0, -1);
    let forward = new THREE.Vector3();
    controls.getDirection(forward);
    forward.normalize();
    let right = forward.clone().cross(camera.up).normalize();
    targetPosition = camera.position
      .clone()
      .add(camera.up.clone().multiplyScalar(sphere1Pos.y))
      .add(right.multiplyScalar(sphere1Pos.x))
      .add(forward.multiplyScalar(-sphere1Pos.z));
  }

  // update the picking ray with the camera and eye position
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

  const intersects = raycaster.intersectObjects(raycastingObjects);

  for (let i = 0; i < intersects.length; i++) {
    target.position.copy(intersects[i].point);
    // intersects[ i ].object.material.color.set( 0xff0000 );
  }

  //animate pointlight
  animationTime += 0.02;
  if (animationTime >= 1) {
    animationTime = 1;
    if (comeback) {
      comeback = false;
      sphereOnHand = true;
    }
  }
  if (firstTree && !sphereOnHand && animationTime >= 1) {
    pointLight1.intensity = 10;
    const tree = new Tree(0.1, 0.5, 4, 0.05, 3, 0.1, 0.3, 0x755707); // gray = 0xB0B0B0
    tree.position.x = targetPosition.x;
    tree.position.z = targetPosition.z;
    trees.push(tree);
    scene.add(tree);
    firstTree = false;
  }
  if (startPosition) {
    let diff = targetPosition.clone().sub(startPosition);
    pointLight1.position.copy(
      diff.multiplyScalar(easeOutCubic(animationTime)).add(startPosition)
    );
  }

  let zAxis = new THREE.Vector3(0, 0, -1);
  let forward = new THREE.Vector3();
  controls.getDirection(forward);
  forward.normalize();
  let right = forward.clone().cross(camera.up).normalize();
  
  avatarGroup.position.copy(
    camera.position
      .clone()
      .add(forward.clone().multiplyScalar(-0.7))
  );
  avatarGroup.rotation.copy(camera.rotation);
  
  if (sphereOnHand) {

    pointLight1.position.copy(
      camera.position
        .clone()
        .add(camera.up.clone().multiplyScalar(sphere1Pos.y))
        .add(right.clone().multiplyScalar(sphere1Pos.x))
        .add(forward.clone().multiplyScalar(-sphere1Pos.z))
    );
    firstTree = true;
  }

  for (let i = 0; i < trees.length; i++) {
    let diff = trees[i].position.clone().sub(pointLight1.position);
    if (diff.length() < 2 && !sphereOnHand) {
      trees[i].grow();
    }
  }

  prevTime = timestamp;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  
	// now draw the scene:
	renderer.render(scene, camera);

	// monitor our FPS:
	stats.end();
}
renderer.setAnimationLoop(animate);

//////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("click", onPointerClick);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
////////////////////////////////////////////////////////////////////////////////////////////////////
  
/////////////////////////////////////////

// connect to websocket at same location as the web-page host:
const addr = location.origin.replace(/^http/, 'ws')
console.log("connecting to", addr)

// this is how to create a client socket in the browser:
let socket = new WebSocket(addr);
socket.binaryType = 'arraybuffer';

// let's know when it works:
socket.onopen = function() { 
	// or document.write("websocket connected to "+addr); 
	console.log("websocket connected to "+addr); 
}
socket.onerror = function(err) { 
	console.error(err); 
}
socket.onclose = function(e) { 
	console.log("websocket disconnected from "+addr); 

	// a useful trick:
	// if the server disconnects (happens a lot during development!)
	// after 2 seconds, reload the page to try to reconnect:
	setTimeout(() => location.reload(), 2000)
}

document.addEventListener("pointermove", e => {
    // is the socket available?
    if (socket.readyState !== WebSocket.OPEN) return;

	// we can send any old string:
    //socket.send("boo!")
	// or send an object:
	socket.send(JSON.stringify({
		what: "pointermove",
		x: e.clientX / window.innerWidth,
		y: e.clientY / window.innerHeight,
	}))
});

let last_msg_t = clock.getElapsedTime();

socket.onmessage = function(msg) {

	if (msg.data instanceof ArrayBuffer) {

		let t = clock.getElapsedTime();

		let fps = Math.round( 1/(t - last_msg_t) )

		let mbps = ((msg.data.byteLength * 8) * fps) / 1024 / 1024

		overlay.innerText = "ws received arraybuffer of " + msg.data.byteLength + " bytes at " + Math.round( 1/(t - last_msg_t) ) + " fps, which is " + Math.round(mbps) + " mbps \n"
		last_msg_t = t

	} else if (msg.data.toString().substring(0,1) == "{") {
    	//updateSceneFromServer(JSON.parse(msg.data))
	} else {
		console.log("received", msg.data);
	}
}