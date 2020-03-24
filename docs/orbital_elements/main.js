// once everything is loaded, we run Three.js stuff.
function init() {

    var stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer();

    ///////// sampleコード通りに第二引数に1.0を指定したらなぜか背景が黄色になってしまったので無くした
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    // 第二引数にrenderer.domElementを指定しないとdat.GUI操作時にcameraも動いてしまう
    var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);


    // create the AxisHelper
    var axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.x = -10;
    axesHelper.position.y = 3;
    axesHelper.position.z = -10;

    scene.add(axesHelper);

    // create the ground plane
    var equatorialPlaneGeometry = new THREE.PlaneGeometry(60, 60, 1, 1);
    var equatorialPlaneMaterial = new THREE.MeshLambertMaterial({color: 0xf92672, transparent: true, opacity: 0.15});
    var equatorialPlane = new THREE.Mesh(equatorialPlaneGeometry, equatorialPlaneMaterial);
    equatorialPlane.receiveShadow = true;

    // parameter of the equatorialPlane
    equatorialPlane.rotation.x = -0.5 * Math.PI;
    equatorialPlane.position.x = 0;
    equatorialPlane.position.y = 0;
    equatorialPlane.position.z = 0;

    scene.add(equatorialPlane);

    /**
     * add Earth
    */
    var earthGeometry = new THREE.SphereGeometry(8, 20, 20);
    var earthMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    var earth = new THREE.Mesh(earthGeometry, earthMaterial);

    // position of the Earth
    earth.position.x = 0;
    earth.position.y = 0;
    earth.position.z = 0;
    earth.castShadow = true;

    scene.add(earth);



    /**
     * add a satellite into satelliteGroup
     */
    // create satellite group
    var satelliteGroup = new THREE.Group();
    satelliteGroup.rotation.z = 45 * Math.PI/180;
    // satelliteGroup.rotation.z = controls.satelliteInclination * Math.PI/180;
    scene.add(satelliteGroup);

    var satelliteAxesHelper = new THREE.AxesHelper(5);
    satelliteGroup.add(satelliteAxesHelper);

    // create satellite
    var satelliteGeometry = new THREE.SphereGeometry(2, 10, 10);
    var satelliteMaterial = new THREE.MeshLambertMaterial({color: 0x49483e});
    var satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);

    satellite.position.x = 15;
    satelliteGroup.add(satellite);

    // create satellite orbital surface plane
    var satelliteOrbitalPlaneGeometry = new THREE.PlaneGeometry(60, 60, 1, 1);
    var satelliteOrbitalPlaneMaterial = new THREE.MeshLambertMaterial({color: 0x9fc1f0, transparent: true, opacity: 0.15});
    var satelliteOrbitalPlane = new THREE.Mesh(satelliteOrbitalPlaneGeometry, satelliteOrbitalPlaneMaterial);

    satelliteOrbitalPlane.rotation.x = -0.5 * Math.PI;
    satelliteGroup.add(satelliteOrbitalPlane);




    /**
     * add camera
     */
    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    // call the render function
    var step = 0;

    var controls = new function () {
        this.rotationSpeed = 6.00;
        this.timeDelta = 1/(24*360)
        this.satelliteInclination = 45;
    };

    var gui = new dat.GUI();

    gui.add(controls, 'rotationSpeed', 0, 8);
    gui.add(controls, 'satelliteInclination', 0, 180);

    render();

    function render() {
        stats.update();
        // rotate the earth around its axes
        // earth.rotation.x += controls.rotationSpeed;
        earth.rotation.y += controls.rotationSpeed * controls.timeDelta;
        // earth.rotation.z += controls.rotationSpeed;

        // satellite revolution
        step += controls.rotationSpeed * 16 * controls.timeDelta;
        satellite.position.x = ( 15 * (Math.cos(step)));
        satellite.position.z = ( 15 * (Math.sin(step)));
        // satelliteGroup.rotation.z = ( 15 * (Math.sin(step)));

        satelliteGroup.rotation.z = controls.satelliteInclination * Math.PI/180;

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function initStats() {

        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(stats.domElement);

        return stats;
    }
}
window.onload = init;