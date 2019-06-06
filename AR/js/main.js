var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1, markerRoot2;

var mesh1;


var dataChordC;


function visARstart() {

    initTHREEComponets();
    loadData(function () {
        prepareVis(function () {
            initialize();
            animate();
        });

    });

}

function initTHREEComponets() {
    scene = new THREE.Scene();

    let ambientLight = new THREE.AmbientLight("#f0f0f0", 0.5);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);

    camera = new THREE.Camera();

    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    renderer.setSize(1600, 1200);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';
    document.body.appendChild(renderer.domElement);

}

function initialize() {


    clock = new THREE.Clock();
    deltaTime = 0;
    totalTime = 0;

    ////////////////////////////////////////////////////////////
    // setup arToolkitSource
    ////////////////////////////////////////////////////////////

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    });

    function onResize() {
        arToolkitSource.onResize();
        arToolkitSource.copySizeTo(renderer.domElement);
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
        }
    }

    arToolkitSource.init(function onReady() {
        onResize()
    });

    // handle resize event
    window.addEventListener('resize', function () {
        onResize()
    });

    ////////////////////////////////////////////////////////////
    // setup arToolkitContext
    ////////////////////////////////////////////////////////////

    // create atToolkitContext
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    });

    // copy projection matrix to camera when initialization complete
    arToolkitContext.init(function onCompleted() {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    ////////////////////////////////////////////////////////////
    // setup markerRoots
    ////////////////////////////////////////////////////////////

    let loader = new THREE.TextureLoader();
    let texture = loader.load('images/border.png');

    let patternArray = ["letterA", "letterB", "letterC", "letterD", "letterF", "kanji", "hiro"];
    let colorArray = [0xff0000, 0xff8800, 0xffff00, 0x00cc00, 0x0000ff, 0xcc00ff, 0xcccccc];
    for (let i = 0; i < 7; i++) {


        if (i == 6) {

            let markerRoot = new THREE.Group();


            scene.add(markerRoot);

            let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
                type: 'pattern',
                patternUrl: "data/" + patternArray[i] + ".patt",
            });

            var baseMap = getBaseMap();

            //baseMap.rotation.set(new THREE.Vector3( 0,  Math.PI/2,  0))
            //baseMap.position.set(0,0.5,0)

            //baseMap.rotation.set(new THREE.Vector3( 0,  0,  0))

            baseMap.rotation.set(-Math.PI/2,0, 0)

            markerRoot.add(baseMap);


            var flows = getFlows();

            flows.rotation.set(-Math.PI/2,0, 0);

            markerRoot.add(flows);




        }else {

            let markerRoot = new THREE.Group();
            scene.add(markerRoot);

            let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
                type: 'pattern',
                patternUrl: "data/" + patternArray[i] + ".patt",
            });

            let mesh = new THREE.Mesh(
                new THREE.CubeGeometry(1.25, 1.25, 1.25),
                new THREE.MeshBasicMaterial({color: colorArray[i], map: texture, transparent: true, opacity: 0.5})
            );


            mesh.position.y = 1.25 / 2;
            markerRoot.add(mesh);


        }


    }


}


function update() {
    // update artoolkit on every frame
    if (arToolkitSource.ready !== false)
        arToolkitContext.update(arToolkitSource.domElement);
}


function render() {
    renderer.render(scene, camera);
}


function animate() {
    requestAnimationFrame(animate);
    deltaTime = clock.getDelta();
    totalTime += deltaTime;
    update();
    render();
}
