var scene, camera, renderer;
var controls, axes;
var spotLight;
var spotLightShadowHelper;
var spotLightHelper;
var stats;
var cube, sphere, plane;

// var gui;
// var datControls;

function init() {

    // rendererを追加
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 4000);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    axes = new THREE.AxisHelper(200);

    stats = initStats();

    camera.position.set(-60, 60, 60);
    scene.add(axes);

    //////////////////////////////////////////////// Light
    // spotlight
    spotLight = new THREE.SpotLight(0xffffff, 1.0);
    spotLight.position.set(-30, 20, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(spotLightHelper);
    spotLightShadowHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    // scene.add(spotLightShadowHelper);

    // ambientlight
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    ambientLight.position.set(0,1,0);
    scene.add(ambientLight);
    


    ////////////////////////// オブジェクトを追加
    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, -2, 0)
    plane.receiveShadow = true;
    scene.add(plane);

    plane.name = "plane-1";

    var boxGeometry = new THREE.BoxBufferGeometry(5, 5, 5);
    var edges = new THREE.EdgesGeometry(boxGeometry);
    // var boxMaterial = new THREE.MeshLambertMaterial({ color: 0xff33dd, wireframe: true });
    // box = new THREE.Mesh(boxGeometry, boxMaterial);
    var lineBox = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({ color: 0xff55dd }));
    lineBox.position.set(0, 2, 0);


    scene.add(lineBox);


    ////////////////////////////// fogを追加
    // scene.fog = new THREE.Fog(0xaa0055, 0.015, 200);
    // scene.fog = new THREE.FogExp2(0xffffff, 0.015);

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

    ///////////////////////////// dat.gui使用

    var objectControls = new function(){
        this.rotationSpeed = 0;
        this.cubeRotationX = 0;
        this.cubeRotationY = 0;
        this.cubeRotationZ = 0;

        this.numberOfObjects = scene.children.length;

        this.removeCube = function() {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length - 1];
            //if (lastObject instanceof THREE.Mesh) {
            if (lastObject instanceof THREE.Mesh && lastObject.name != "plane-1") {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };

        this.addCube = function () {
            var cubeSize1 = Math.ceil((Math.random() * 3));
            var cubeSize2 = Math.ceil((Math.random() * 3));
            var cubeSize3 = Math.ceil((Math.random() * 3));
            var cubeGeometry = new THREE.BoxGeometry(cubeSize1, cubeSize2, cubeSize3);
            var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.name = "cube-" + scene.children.length;

            // position the cube randomly in the scene

            cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

            scene.add(cube);
            this.numberOfObjects = scene.children.length;
            //console.log(cube);
        };

        this.outputObjects = function () {
            console.log(scene.children);
        }

        this.overrideMaterial = function() {
            scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff});
        }
    };

    var gui = new dat.GUI();
    // var datControls = {
    //     rotationSpeed: 0.02,
    // }

    // gui.add( objectControls, 'rotationSpeed', 0, 0.5);
    // gui.add( objectControls, 'cubeRotationX', 0, 0.5);
    // gui.add( objectControls, 'cubeRotationY', 0, 0.5);
    // gui.add( objectControls, 'cubeRotationZ', 0, 0.5);
    // gui.add( objectControls, 'addCube');
    // gui.add( objectControls, 'removeCube');
    // gui.add( objectControls, 'outputObjects');
    // gui.add( objectControls, 'numberOfObjects').listen();
    // gui.add( objectControls, 'overrideMaterial');
    gui.open();

    animate();

    var step = 0;
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        stats.update();

        lineBox.rotation.x += 0.01;

        //plane.rotation.z += objectControls.rotationSpeed;

        // scene.traverse(function (e) {
        //     if (e instanceof THREE.Mesh && e != plane) {
        //         e.rotation.x += objectControls.cubeRotationX;
        //         e.rotation.y += objectControls.cubeRotationY;
        //         e.rotation.z += objectControls.cubeRotationZ;
        //     }
        // });

        renderer.render(scene, camera);
    }



}



///////////////////////////// ブラウザリサイズ関数
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


init();


// resizeイベントが起きた時(つまりブラウザをリサイズした時)に発火する仕組み
// 試しに第一引数を 'click' にすると、画面をクリックした時に onResize関数 が発火するようになる
window.addEventListener('resize', onResize, false);