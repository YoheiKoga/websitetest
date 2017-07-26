var scene, camera, renderer;
var controls, axes;
var spotLight;
var spotLightShadowHelper;
var spotLightHelper;
var stats;
var cube, sphere;

var gui;
var datControls;

function init() {

    // rendererを追加
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 4000);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls = new THREE.OrbitControls(camera);
    axes = new THREE.AxisHelper(200);

    stats = initStats();

    camera.position.set(-30, 40, 30);
    // camera.lookAt(scene.position);   // OrbitControlsを使用する場合は不要
    scene.add(axes);

    spotLight = new THREE.SpotLight(0xffffff, 1.0);
    spotLight.position.set(-10, 20, -5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);
    spotLightShadowHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    scene.add(spotLightShadowHelper);


    ////////////////////////// オブジェクトを追加
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, -2, 0)
    plane.receiveShadow = true;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        wireframe: false
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff,
        wireframe: false
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);



    renderer.render(scene, camera);



    ////////////////////////////// stats.js使用
    function initStats() {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById("Stats-output").appendChild(stats.domElement);
        return stats;
    }


 


}

var step = 0;
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    stats.update();

    cube.rotation.x += datControls.rotationSpeed;

    // step += datControls.bouncingSpeed;

    // sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));
    // sphere.position.x = 20 + (10 * Math.cos(step));


    //spotLightHelper.update();
    //spotLightShadowHelper.update();
    renderer.render(scene, camera);

}

///////////////////////////// dat.gui使用
function initGUI() {
    gui = new dat.GUI();
    datControls = {
        rotationSpeed: 0.02
    }
    gui.add( datControls, 'rotationSpeed', 0, 0.5).onChange( function ( val ) {
        cube.rotation.x += val;
        // render();
        // animate();
    });
    gui.open();
}

init();
initGUI();

animate();
