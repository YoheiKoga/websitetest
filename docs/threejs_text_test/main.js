var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var controls = new THREE.OrbitControls(camera);

var axis = new THREE.AxisHelper(1000);
var light = new THREE.DirectionalLight(0xb4e7f2, 1.5);

light.position.set(1,1,1);
light.target.position.set(0,0,0);

scene.add(axis);
scene.add(light);
scene.add(light.target);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(100, 50, 200);


var loader = new THREE.FontLoader();
loader.load('helvetiker_regular.typeface.json', function(font){
	var textGeometry = new THREE.TextGeometry("Hello Three.js!", {
		font: font,
		size: 20,
		height: 5,
		curveSegments: 12
	});
	var materials = [
		new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
		new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
	];
	var textMesh = new THREE.Mesh(textGeometry, materials);
	scene.add(textMesh);
});

var render = function () {
	requestAnimationFrame(render);
	controls.update();
	renderer.setClearColor(0xaabbcc, 1.0);
	renderer.render(scene, camera);
};

render();