/**
 * Created by Aero on 23/5/2019.
 */

var VIS = {
    //map plane in scene
    map_length: 2.8,
    map_width: 2.4,
    map_height: 2.4,

    projection: null,
    centerOnTexture: d3.map(),
    PositionsOD: d3.map(),

    scaleUtrecht: 300,
    centerUtrecht: [5.172803315737347, 52.095790056996094],

    scaleFriesland: 210,
    centerFriesland: [5.7, 53.15],

    scaleGroningen: 210,
    centerGroningen: [6.676474921549358, 53.251419501963163],

    ctx: null,
    texture: null,

    //max for graphic
    maxValueWidth: 0.01,
    maxValueZ: 1.8,


    classes: {
        "Utrecht" :[41, 121, 318],
        "Leeuwarden" :  [27, 89, 205],
        "Groningen": [25, 74, 187]
    }, 

}

function prepareVis(callback) {

    VIS.projection = createProjection();

    VIS.projectionBase = createProjectionBase();


    VIS.scaleHeight = createScaleQuantizeHeight();
    VIS.scaleWidth = createScaleQuantizeWidth();

    VIS.groupMapCityUI = createGroupforUI();

    function createProjection() {

        var center = null;
        var scale;

        if (citySelectedCurr == "Utrecht") {
            center = VIS.centerUtrecht;
            scale = VIS.scaleUtrecht;
        }
        if (citySelectedCurr == "Friesland") {
            center = VIS.centerFriesland;
            scale = VIS.scaleFriesland;
        }
        if (citySelectedCurr == "Groningen") {
            center = VIS.centerGroningen;
            scale = VIS.scaleGroningen;
        }

        return d3.geoStereographic()
            .scale(scale)
            .center(center)
            .translate([VIS.map_length / 2, VIS.map_width / 2])
            .rotate([0, 0])
            .clipAngle(180 - 1e-4)
            .clipExtent([
                [0, 0],
                [VIS.map_width, VIS.map_height]
            ])
            .precision(.1);
    }

    function createProjectionBase() {

        var center = null;
        var scale;

    

        if (citySelectedCurr == "Utrecht") {
            center = VIS.centerUtrecht;
            scale = VIS.scaleUtrecht;
        }
        if (citySelectedCurr == "Friesland") {
            center = VIS.centerFriesland;
            scale = VIS.scaleFriesland;
        }
        if (citySelectedCurr == "Groningen") {
            center = VIS.centerGroningen;
            scale = VIS.scaleGroningen;
        }

        return d3.geoStereographic()
            .scale(scale*1000)
            .center(center)
            .translate([VIS.map_length*1000 / 2, VIS.map_width*1000 / 2])
            .rotate([0, 0])
            .clipAngle(180 - 1e-4)
            .clipExtent([
                [0, 0],
                [VIS.map_width*1000, VIS.map_height*1000]
            ])
            .precision(.1);
    }


    function createColorScale() {

        return d3.scaleOrdinal(d3.schemePaired)
            .domain([0, 12])

    }

    function createTHREEComponents() {

        VIS.camera = new THREE.PerspectiveCamera(50, VIS.windowdiv_width / VIS.windowdiv_height, 0.1, 10000);
        VIS.camera.position.set(0, -3000, 3500);

        VIS.glRenderer = createGlRenderer();
        VIS.cssRenderer = createCssRenderer();

        VIS.raycaster = new THREE.Raycaster();
        VIS.mouse = new THREE.Vector2();


        document.getElementById("map").appendChild(VIS.cssRenderer.domElement);
        document.getElementById("map").appendChild(VIS.glRenderer.domElement);

        window.addEventListener('resize', onWindowResize, false);


        VIS.glScene = new THREE.Scene();
        VIS.cssScene = new THREE.Scene();

        addLights();
        addController();

        function createGlRenderer() {

            var glRenderer = new THREE.WebGLRenderer({ alpha: true });
            glRenderer.setClearColor(0x3D3252);
            glRenderer.setPixelRatio(window.devicePixelRatio);
            glRenderer.setSize(VIS.windowdiv_width, VIS.windowdiv_height);
            glRenderer.domElement.style.position = 'absolute';
            glRenderer.domElement.style.top = 0;
            glRenderer.shadowMap.enabled = true;
            glRenderer.shadowMap.type = THREE.PCFShadowMap;
            glRenderer.shadowMapAutoUpdate = true;

            //glRenderer.domElement.style.zIndex = 0;
            glRenderer.domElement.style.zIndex = 0;
            return glRenderer;
        }

        function onWindowResize() {

            VIS.camera.aspect = window.innerWidth / window.innerHeight;
            VIS.camera.updateProjectionMatrix();

            VIS.glRenderer.setSize(window.innerWidth, window.innerHeight);
            VIS.cssRenderer.setSize(window.innerWidth, window.innerHeight);

        }

        function createCssRenderer() {
            var cssRenderer = new THREE.CSS3DRenderer();
            cssRenderer.setSize(VIS.windowdiv_width, VIS.windowdiv_height);
            //VIS.glRenderer.domElement.style.zIndex = 0;
            cssRenderer.domElement.style.top = 0;

            cssRenderer.domElement.style.zIndex = 1;
            return cssRenderer;
        }

        function addLights() {

            var ambientLight = new THREE.AmbientLight(0xffffff);
            VIS.glScene.add(ambientLight);

            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1000, -2, 10).normalize();
            VIS.glScene.add(directionalLight);

        }

        function addController() {
            VIS.controls = new THREE.TrackballControls(VIS.camera);
            VIS.controls.rotateSpeed = 2;
            VIS.controls.minDistance = 30;
            VIS.controls.maxDistance = 8000;
        }

    }

    function createGroupforUI() {

        var mapDOM = document.createElement('div');
        mapDOM.setAttribute("id", "map_container");
        mapDOM.setAttribute("background-color", "transparent");


        //document.getElementById("map").appendChild(mapDOM);

        document.body.appendChild(mapDOM);

        //var map_container = document.getElementById("map_container");
        var cssObject = new THREE.CSS3DObject(mapDOM);
        cssObject.position.x = 0, cssObject.position.y = 0, cssObject.position.z = 0;
        cssObject.receiveShadow = true;
        //VIS.cssScene.add(cssObject);

        var svg = d3.select("#map_container").append("svg")
            .attr("width", VIS.map_length)
            .attr("height", VIS.map_width);

        return svg.append("g")
            .attr("class", "basemap3D");
    }


    function createScaleQuantizeHeight() {

        var obj = "VIS.classes." + citySelectedCurr;

        var array = [].concat(...dataFlows.matrix).filter(d => d != 0);

        array = array.sort((a, b) => { return a - b; });

        var extent = d3.extent(array);
        var mean = d3.mean(array);
        var arr_left = array.filter(function(d) { return d <= mean });
        var arr_right = array.filter(function(d) { return d > mean });
        var mean_left = d3.mean(arr_left);
        var mean_right = d3.mean(arr_right);

        //console.log(sub.arr, arr_left, arr_right)
        //var classes = [1, mean_left, mean, mean_right];

        var classes = [1];
        classes = classes.concat( eval(obj));

        console.log( citySelectedCurr,  eval(obj), classes);

        var rangeSpace = [0, 0.25, 0.5, 0.75, 1];
        rangeSpace = rangeSpace.map(d => d * VIS.maxValueZ)


        var scaleThreshold = d3.scaleThreshold().domain(classes).range(rangeSpace);

        return scaleThreshold;
    }

    function createScaleQuantizeWidth() {

        var obj = "VIS.classes." +citySelectedCurr;
        
        var array = [].concat(...dataFlows.matrix).filter(d => d != 0);

        array = array.sort((a, b) => { return a - b; });

        var extent = d3.extent(array);
        var mean = d3.mean(array);
        var arr_left = array.filter(function(d) { return d <= mean });
        var arr_right = array.filter(function(d) { return d > mean });
        var mean_left = d3.mean(arr_left);
        var mean_right = d3.mean(arr_right);

        //console.log(sub.arr, arr_left, arr_right)
        //var classes = [1, mean_left, mean, mean_right];

        var classes = [1];
        classes = classes.concat( eval(obj));

        var rangeSpace = [0, 0.2, 0.5, 0.8, 1];
        rangeSpace = rangeSpace.map(d => d * VIS.maxValueWidth)


        var scaleThreshold = d3.scaleThreshold().domain(classes).range(rangeSpace);

        return scaleThreshold;
    }

    setTimeout(callback, 100);
}


function getBaseMap() {

    var devicePixelRatio = 1;
    var canvas = document.createElement("CANVAS");
    canvas.width = VIS.map_length*1000 ;
    canvas.height = VIS.map_width*1000 ;
    var ctx = canvas.getContext('2d');

    ctx.scale(devicePixelRatio, devicePixelRatio);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var canvas_material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        //opacity: 0.9
    });

    var geometry = new THREE.PlaneGeometry(VIS.map_length, VIS.map_width);
    var mesh = new THREE.Mesh(geometry, canvas_material);

    //mesh.position.set(0, 0, 0);
    mesh.receiveShadow = true;

    initPathOnMap(initTextureMap);

    texture.needsUpdate = true;

    return mesh;

    function initPathOnMap(callback) {


        var path = d3.geoPath().projection(VIS.projection);

        VIS.groupMapCityUI.selectAll("path")
            .data(dataFlows.geo.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("opacity", 1.0)
            .attr("class", "basemap3Dpath")
            .attr("name", function(d) {
                var name = d.properties.GM_NAAM;
                var index = name.indexOf("|");
                if (index != -1) {
                    name = name.substr(0, index);
                }
                return name;
            });

        d3.selectAll(".basemap3Dpath").each(function(d) {
            var center = path.centroid(d);
            var named = d3.select(this).attr("name");
            VIS.centerOnTexture[named] = center;

            VIS.PositionsOD[named] = [
                center[0] - VIS.map_length / 2,
                VIS.map_width / 2 - center[1]
            ];
        });

        setTimeout(callback, 200);
    }

    function initTextureMap() {

        //console.log(ctx);

        var path = d3.geoPath().projection(VIS.projectionBase).context(ctx);
        dataFlows.geo.features.forEach(function(d) {

            ctx.fillStyle = "#ddeedd";

            ctx.strokeStyle = 'orange';
            ctx.lineWidth = 5;
            ctx.beginPath();
            path(d);

            ctx.fill();
            ctx.stroke();
        });


       dataFlows.geo.features.forEach(function(d, i) {
            var cityName = d.properties.GM_NAAM;
            ctx.fillStyle = "red";
            ctx.font = '40pt Arial';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(i + 1,
                    VIS.centerOnTexture[cityName][0]*1000 - 35,
                    VIS.centerOnTexture[cityName][1]*1000 + 35);

        });

        texture.needsUpdate = true;
    }

}

function getFlows( conf ) {
//     ['Utrecht', 'height', 'Out', 'A', 'map-training'],


    var flowsGroup = new THREE.Group();

    dataChord.forEach(function(flow) {

        var choosen_index = dataFlows.city.indexOf(conf[0]);

        if (flow.source.index === choosen_index || flow.target.index === choosen_index) {
            var flow = getMeshFromFlow(flow, 
                    choosen_index /*conf[0]*/, conf[1],  conf[2]);


            if (flow) {
                flowsGroup.add(flow);
            }
        }

    });

    return flowsGroup;
}


