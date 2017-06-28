var camera, scene, lightDirectional, lightAmbient, lightPoint, renderer;
var geometry, material, mesh;

threeStart();

function initThree() {
	width = document.getElementById('canvas-frame').clientWidth;
	height = document.getElementById('canvas-frame').clientHeight;
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(width, height);
	renderer.setClearColor(0x00aaff, 1.0);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById('canvas-frame').appendChild(renderer.domElement);
}

function initCamera() {
	camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
	camera.position.x = 100;
	camera.position.y = 100;
	camera.position.z = 100;
	camera.up.x = 0;
	camera.up.y = 0;
	camera.up.z = 1;
	camera.lookAt({x:0, y:0, z:0})
	var controls = new THREE.OrbitControls(camera);
	controls.update();
}

function initScene() {
	scene = new THREE.Scene();
}

function initLight() {
	lightDirectional = new THREE.DirectionalLight(0xffffff, 1.0);
	lightDirectional.position.set(0, 0, 200);
	lightDirectional.castShadow = true;

	//////////////////////////// set up shadow properties for the light
	lightDirectional.shadow.camera.position.set(100, 0, 1000)
	lightDirectional.shadow.mapSize.width = 512;
	lightDirectional.shadow.mapSize.height = 512;
	lightDirectional.shadow.camera.near = 0;
	lightDirectional.shadow.camera.far = 500;
	lightDirectional.shadow.camera.top = 250;
	lightDirectional.shadow.camera.bottom = -250;
	lightDirectional.shadow.camera.left = 250;
	lightDirectional.shadow.camera.right = -250;

	
	scene.add(lightDirectional);

	////////////////////////////// ambient light
	lightAmbient = new THREE.AmbientLight(0x555555);
	scene.add(lightAmbient);


	/////////////////////////// helper for the shadow camera
	var helper = new THREE.CameraHelper(lightDirectional.shadow.camera);
	scene.add(helper);
}



var cubeMaterial, cubeGeometry, cubeMesh;
var planeMaterial, planeGeometry, planeMesh;
var sphereMaterial, sphereGeometry, sphereMesh;
var groundMaterial, groundGeometry, groundMesh;

function objects() {

	////////////////////// Cube Object
	cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
	cubeMaterial = new THREE.MeshLambertMaterial({
		color: 0xff0000,
		ambient: 0xff0000,
		wireframe: false
	});
	cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cubeMesh.castShadow=true;
	scene.add(cubeMesh);
	cubeMesh.position.set(0, 0, 0);

	groundGeometry = new THREE.BoxGeometry(1000, 1000, 1);
	groundMaterial = new THREE.MeshLambertMaterial({
		color: 0xaaaaaa,
		ambient: 0xaaaaaa
	});

	groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
	groundMesh.receiveShadow=true;
	scene.add(groundMesh);
	groundMesh.position.set(0, 0, -30)

}

var t=0;
function animate() {

    requestAnimationFrame(animate);
    cubeMesh.rotation.x += 0.01;

    renderer.render(scene, camera);
}

function threeStart() {

	initThree();
	initCamera();
	initScene();
	initLight();

	objects();
	animate();

	renderer.clear();
	renderer.render(scene, camera)
}















