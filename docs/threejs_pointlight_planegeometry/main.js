var scene, camera, renderer;
var controls, axes;
var spotLight;
var spotLightShadowHelper;
var spotLightHelper;
var stats;
var cube, sphere, plane;

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

    camera.position.set(-60, 60, 60);
    scene.add(axes);

    //////////////////////////////////////////////// Light
    /// pointlight
    var pointColor = "#ccffcc";
    var pointLight = new THREE.PointLight(pointColor);
    pointLight.distance = 100;
    pointLight.position.set(0, 50, 0);
    scene.add(pointLight);

    var pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelper);

    var sphereLight = new THREE.SphereGeometry(0.2);
    var sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
    var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
    sphereLightMesh.castShadow = true;
    sphereLightMesh.position = new THREE.Vector3(3, 0, 3);
    scene.add(sphereLightMesh);
    


    ////////////////////////// オブジェクトを追加
    var planeGeometry = new THREE.PlaneGeometry(60, 20, 2, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    // plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane = new THREE.Mesh();
    plane.material = planeMaterial;
    // plane.geometry = planeGeometry;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, -2, 0)
    plane.receiveShadow = true;
    scene.add(plane);

    function setGeoVal() {
        plane.geometry.dispose();
        plane.geometry = new THREE.PlaneGeometry(objectControls.width, objectControls.height, objectControls.widthsegments, objectControls.heightsegments);
    }


    //////////////////////////////// dat.gui
    var invert = 1;
    var phase = 0;

    var objectControls = new function () {
        this.rotationSpeed = 0.02;
        this.pointColor = pointColor;
        this.intensity = 1;
        this.distance = 100;

        this.width = 60;
        this.height = 60;
        this.widthsegments = 10;
        this.heightsegments = 10;
    };

    var gui = new dat.GUI();


    var planeFolder = gui.addFolder('planeGeometry')
    planeFolder.add(objectControls, 'width', 10, 100).onChange(setGeoVal);
    planeFolder.add(objectControls, 'height', 10, 100).onChange(setGeoVal);
    planeFolder.add(objectControls, 'widthsegments', 1, 20).step(1).onChange(setGeoVal);
    planeFolder.add(objectControls, 'heightsegments', 1, 20).step(1).onChange(setGeoVal);
    setGeoVal();

 
    gui.addColor(objectControls, 'pointColor').onChange(function (e) {
        pointLight.color = new THREE.Color(e);
    });
    gui.add(objectControls, 'intensity', 0, 3).onChange(function (e) {
        pointLight.intensity = e;
    });
    gui.add(objectControls, 'distance', 0, 100).onChange(function (e) {
        pointLight.distance = e;
    });




    animate();

    var step = 0;
    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        /// move the light simulation
        if (phase > 2 * Math.PI) {
            invert = invert * -1;
            phase -= 2 * Math.PI;
        } else {
            phase += objectControls.rotationSpeed;
        }
        sphereLightMesh.position.z = (7 * (Math.sin(phase)));
        sphereLightMesh.position.x = (7 * (Math.cos(phase)));
        sphereLightMesh.position.y = 5;

        if (invert < 0) {
            var pivot = 7;
            sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
        }

        pointLight.position.copy(sphereLightMesh.position);

        renderer.render(scene, camera);
    }
}


init();
