/**
 * Created by Aero on 23/11/2018.
 */

var INTERSECTED;
var citySelectedCurr = "ALL";

var representationCurr = $('input[name="layercontrol"]:checked').val();


if ($('input[name="municipality"]:checked').val() == "Utrecht") {
    citySelectedCurr = "Utrecht";
}
if ($('input[name="municipality"]:checked').val() == "Friesland") {

    citySelectedCurr = "Leeuwarden";
}
if ($('input[name="municipality"]:checked').val() == "Groningen") {

    citySelectedCurr = "Groningen";
}

var dataEncoded = $('input[name="datacontrol"]:checked').val();


// all the city gl objects
var glMapObjectsArr = [];

var glMapZs = null;
var glMapPositions = null;
var VIS = {
    //DOM features
    windowdiv_width: $(document.body).width(),
    windowdiv_height: $(document.body).height(),

    //map plane in scene
    map_length: 2.4,
    map_width: 1.8,
    map_height: 1.8,

    //UI
    //groupMapCityUI: null,

    //projectionScale : 230000,

    projection: null,
    centerOnTexture: d3.map(),
    PositionsOD: d3.map(),

    //scaleUtrecht: 300000,
    scaleUtrecht: 400,
    centerUtrecht: [5.172803315737347, 52.095790056996094],

    scaleFriesland: 210000,
    //centerFriesland: [5.866845438150408, 53.097469997029293],
    centerFriesland: [5.7, 53.15],

    scaleGroningen: 280000,
    centerGroningen: [6.676474921549358, 53.251419501963163],

    //THREE Components
    camera: null,
    glScene: null,
    cssScene: null,
    glRenderer: null,
    cssRenderer: null,
    controls: null,
    dragControls: null,

    raycaster: null,
    mouse: null,


    // 3D graphic
    unitline3D: 120,

    ctx: null,
    texture: null,

    label_ctx: null,
    labeltexture: null,


    //max in dataset
    maxAngle: 0,

    maxTotalFlowValue: 0,
    maxSingleFlowValue: 0,
    //scale & color
    linerScaleWidth: null,
    linerScaleValue2Z: null,
    linerScaleAngle2Z: null,
    linerScaleAngle2ZDouble: null,

    scaleHeight: null,

    linerScaleGlMapZ: null,
    //maxGLMapZ: 100,

    //max for graphic
    maxValueWidth: 0.01,
    maxValueZ: 1.8,

    angle2heightZ: 1,
    color: null,


}

function prepareVis(callback) {

    VIS.projection = createProjection();

    VIS.projectionBase = createProjectionBase();

    VIS.color = createColorScale();


    VIS.scaleHeight = createScaleQuantizeHeight();
    VIS.scaleWidth = createScaleQuantizeWidth();

    VIS.groupMapCityUI = createGroupforUI();

    $('input[name="layercontrol"]').change(function(e) {
        updateFlowMap(citySelectedCurr);
    });

    $('input[name="datacontrol"]').change(function(e) {
        updateFlowMap(citySelectedCurr);
    });


    function createProjection() {

        var center = null;
        var scale;

        var cityChoosen = "Utrecht";

        if (cityChoosen == "Utrecht") {
            center = VIS.centerUtrecht;
            scale = VIS.scaleUtrecht;
        }
        if (cityChoosen == "Friesland") {
            center = VIS.centerFriesland;
            scale = VIS.scaleFriesland;
        }
        if (cityChoosen == "Groningen") {
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

        var cityChoosen = "Utrecht";

        if (cityChoosen == "Utrecht") {
            center = VIS.centerUtrecht;
            scale = VIS.scaleUtrecht;
        }
        if (cityChoosen == "Friesland") {
            center = VIS.centerFriesland;
            scale = VIS.scaleFriesland;
        }
        if (cityChoosen == "Groningen") {
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

        var array = [].concat(...dataFlows.matrix).filter(d => d != 0);

        array = array.sort((a, b) => { return a - b; });

        var extent = d3.extent(array);
        var mean = d3.mean(array);
        var arr_left = array.filter(function(d) { return d <= mean });
        var arr_right = array.filter(function(d) { return d > mean });
        var mean_left = d3.mean(arr_left);
        var mean_right = d3.mean(arr_right);

        //console.log(sub.arr, arr_left, arr_right)
        var classes = [1, mean_left, mean, mean_right];

        var rangeSpace = [0, 0.25, 0.5, 0.75, 1];
        rangeSpace = rangeSpace.map(d => d * VIS.maxValueZ)


        var scaleThreshold = d3.scaleThreshold().domain(classes).range(rangeSpace);

        return scaleThreshold;
    }

    function createScaleQuantizeWidth() {

        var array = [].concat(...dataFlows.matrix).filter(d => d != 0);

        array = array.sort((a, b) => { return a - b; });

        var extent = d3.extent(array);
        var mean = d3.mean(array);
        var arr_left = array.filter(function(d) { return d <= mean });
        var arr_right = array.filter(function(d) { return d > mean });
        var mean_left = d3.mean(arr_left);
        var mean_right = d3.mean(arr_right);

        //console.log(sub.arr, arr_left, arr_right)
        var classes = [1, mean_left, mean, mean_right];

        var rangeSpace = [0, 0.2, 0.5, 0.8, 1];
        rangeSpace = rangeSpace.map(d => d * VIS.maxValueWidth)


        var scaleThreshold = d3.scaleThreshold().domain(classes).range(rangeSpace);

        return scaleThreshold;
    }

    setTimeout(callback, 100);
}


function getBaseMap() {

    var devicePixelRatio = 1;
    VIS.canvas = document.createElement("CANVAS");
    VIS.canvas.width = VIS.map_length*1000 ;
    VIS.canvas.height = VIS.map_width*1000 ;
    VIS.ctx = VIS.canvas.getContext('2d');
    VIS.ctx.scale(devicePixelRatio, devicePixelRatio);
    VIS.texture = new THREE.Texture(VIS.canvas);
    VIS.texture.needsUpdate = true;


    var canvas_material = new THREE.MeshBasicMaterial({
        map: VIS.texture,
        side: THREE.DoubleSide,
        //opacity: 0.9
    });

    var geometry = new THREE.PlaneGeometry(VIS.map_length, VIS.map_width);
    var mesh = new THREE.Mesh(geometry, canvas_material);

    //mesh.position.set(0, 0, 0);
    mesh.receiveShadow = true;

    initPathOnMap(initTextureMap);

    VIS.texture.needsUpdate = true;

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
                var name = d.properties.Gemeentena;
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

        //console.log(VIS.ctx);

        var path = d3.geoPath().projection(VIS.projectionBase).context(VIS.ctx);
        dataFlows.geo.features.forEach(function(d) {

            VIS.ctx.fillStyle = "#ddeedd";

            VIS.ctx.strokeStyle = 'orange';
            VIS.ctx.lineWidth = 5;
            VIS.ctx.beginPath();
            path(d);

            VIS.ctx.fill();
            VIS.ctx.stroke();
        });


       dataFlows.geo.features.forEach(function(d, i) {
            var cityName = d.properties.Gemeentena;
            VIS.ctx.fillStyle = "red";
            VIS.ctx.font = '40pt Arial';
            VIS.ctx.textAlign = "center";
            VIS.ctx.textBaseline = "middle";
            VIS.ctx.fillText(i + 1,
                    VIS.centerOnTexture[cityName][0]*1000 - 35,
                    VIS.centerOnTexture[cityName][1]*1000 + 35);

        });

        VIS.texture.needsUpdate = true;
    }

}

function getFlows() {

    var flowsGroup = new THREE.Group();

    dataChord.forEach(function(flow) {

        var choosen_index = dataFlows.city.indexOf("Utrecht")

        if (flow.source.index === choosen_index || flow.target.index === choosen_index) {
            var flow = getMeshFromFlow(flow, choosen_index);
            if (flow) {
                flowsGroup.add(flow);
            }
        }

    });

    return flowsGroup;
}


function updateFlowMap(selectedCity) {


    updateLegend($('input[name="layercontrol"]:checked').val());

    if (selectedCity === "ALL") {
        draw3DFlows(SHOW_ALL_FLOWS);
    } else {
        draw3DFlows(dataFlows.city.indexOf(selectedCity));
    }

    function draw3DFlows(choosen_index) {

        clearScene();

        dataChord.forEach(function(flow, flow_index) {

            if (choosen_index === SHOW_ALL_FLOWS) {
                var flow = getMeshFromFlow(flow, choosen_index, flow_index);
                if (flow) {
                    flowsSet.push(flow);
                    VIS.glScene.add(flow);
                }

            } else if (flow.source.index === choosen_index || flow.target.index === choosen_index) {
                var flow = getMeshFromFlow(flow, choosen_index, flow_index);
                if (flow) {
                    flowsSet.push(flow);
                    VIS.glScene.add(flow);
                }
            }

        });

        update_old();

    }

    function clearScene() {
        flowsSet.forEach(function(d) {
            if (d.type === "Group") {

                d.children.forEach(function(t) {
                    t.material.dispose();
                    t.geometry.dispose();
                });
                for (let i = d.children.length - 1; i >= 0; i--) {
                    d.remove(d.children[i]);
                }
            }
            VIS.glScene.remove(d);
        });
    }


    function updateLegend(representationCurr) {

        legendSet.forEach(function(d) {
            if (d.type === "Group") {

                d.children.forEach(function(t) {
                    t.material.dispose();
                    t.geometry.dispose();
                });
                for (let i = d.children.length - 1; i >= 0; i--) {
                    d.remove(d.children[i]);
                }
            }
            VIS.glScene.remove(d);
        });


        var legend = creatLegends(representationCurr);
        legendSet.push(legend);
        VIS.glScene.add(legend);
    }

}


function update_old() {

    TWEEN.update();

    VIS.controls.update();
    VIS.glRenderer.render(VIS.glScene, VIS.camera);
    VIS.cssRenderer.render(VIS.cssScene, VIS.camera);

    requestAnimationFrame(update);
}
