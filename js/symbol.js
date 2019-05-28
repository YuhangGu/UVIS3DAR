/**
 * Created by Aero on 24/11/2018.
 */

function getMeshFromFlow(flow, choosen_index, flow_index) {


    var representation = $('input[name="layercontrol"]:checked').val();

    dataEncoded = $('input[name="datacontrol"]:checked').val();


    switch (representation) {


        case 'height':
            //return createSemiCircleTubes(flow, dataEncoded, choosen_index);
            return createTubes3DHeight(flow, dataEncoded, choosen_index);
            break;

        case 'width':
            return createSemiCircleTubes(flow, dataEncoded, choosen_index);
            break;

        case 'width-2':
            return createRibbons(flow, dataEncoded, choosen_index);
            break;

            /*
            case '3Dheight':
                return createTubes3DHeight(flow);
                break;

            case 'line':
                return createSemiCircle(flow);
                break;
                */

    }
}

function createSemiCircleTubes(flow, dataEncoded, choosen_index) {

    var color_Out = "#CC3300";
    var color_In = "#0099CC";

    var group = new THREE.Group();

    switch (dataEncoded) {


        case "all":

            var meshS2T = getHalfFlowMesh(flow.source,
                VIS.linerScaleWidth(flow.source.value),
                color_Out );

            var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.target.value),
                color_In );

            group.add(meshS2T);
            group.add(meshT2S);
            return group;

            break;

        case "out":

            if (choosen_index === flow.source.index) {
                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.source.value),
                    color_Out );

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.source.value),
                    color_Out );

                group.add(meshS2T);
                group.add(meshT2S);
                return group;

            } else if (choosen_index === flow.target.index) {
                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.target.value),
                   color_Out );

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.target.value),
                     color_Out );

                group.add(meshS2T);
                group.add(meshT2S);
                return group;
            } else {
                return null;
            }

            break;

        case "in":
            if (choosen_index === flow.source.index) {

                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.target.value),
                    color_In );

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.target.value),
                     color_In );

                group.add(meshS2T);
                group.add(meshT2S);
                return group;
            } else if (choosen_index === flow.target.index) {

                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.source.value),
                     color_In);

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.source.value),
                    color_In );

                group.add(meshS2T);
                group.add(meshT2S);
                return group;
            } else {
                return null;
            }

            break;


        case "sum":

            var color = "#31656a";

            var width = VIS.linerScaleWidth(flow.source.value) + VIS.linerScaleWidth(flow.target.value);
            var meshS2T = getHalfFlowMesh(flow.source, width, color);

            var meshT2S = getHalfFlowMesh(flow.target, width, color);


            group.add(meshS2T);
            group.add(meshT2S);
            return group;

            break;

    }

    function getHalfFlowMesh(item, width, color) {

        var origin = VIS.PositionsOD[dataFlows.city[item.index]],
            destination = VIS.PositionsOD[dataFlows.city[item.subindex]];


        var radius = Math.sqrt((destination[1] - origin[1]) * (destination[1] - origin[1]) +
            (destination[0] - origin[0]) * (destination[0] - origin[0])) / 2;


        var path = new THREE.CurvePath();


        for (var i = 1; i < 26; i++) {

            var j = (i - 1) / 50;
            var k = i / 50;

            path.add(new THREE.LineCurve3(
                new THREE.Vector3(
                    origin[0] + j * destination[0] - j * origin[0],
                    origin[1] + j * destination[1] - j * origin[1],
                    radius * 2 * Math.sqrt(j - j * j)
                ),

                new THREE.Vector3(
                    origin[0] + k * destination[0] - k * origin[0],
                    origin[1] + k * destination[1] - k * origin[1],
                    radius * 2 * Math.sqrt(k - k * k)
                )));

        }

        var tubeGeometry = new THREE.TubeBufferGeometry(path, 20, width, 8, false);


        var meshS2T = new THREE.Mesh(tubeGeometry,
            new THREE.MeshBasicMaterial({ color: color }));
        meshS2T.doubleSided = true;

        return meshS2T;
    }
}

function createSemiCircleTubes_bak(flow, dataEncoded, choosen_index) {

    var group = new THREE.Group();

    switch (dataEncoded) {


        case "all":

            var meshS2T = getHalfFlowMesh(flow.source,
                VIS.linerScaleWidth(flow.source.value),
                VIS.color(dataFlows.city[flow.source.index]));

            var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.target.value),
                VIS.color(dataFlows.city[flow.target.index]));

            group.add(meshS2T);
            group.add(meshT2S);
            return group;

            break;

        case "out":

            if (choosen_index === -5) {
                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.source.value),
                    VIS.color(dataFlows.city[flow.source.index]));

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.target.value),
                    VIS.color(dataFlows.city[flow.target.index]));

                group.add(meshS2T);
                group.add(meshT2S);
                return group;

            }
            if (choosen_index === flow.source.index) {
                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.source.value),
                    VIS.color(dataFlows.city[flow.target.index]));

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.source.value),
                    VIS.color(dataFlows.city[flow.target.index]));

                group.add(meshS2T);
                group.add(meshT2S);
                return group;

            } else if (choosen_index === flow.target.index) {
                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.target.value),
                    VIS.color(dataFlows.city[flow.source.index]));

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.target.value),
                    VIS.color(dataFlows.city[flow.source.index]));

                group.add(meshS2T);
                group.add(meshT2S);
                return group;
            } else {
                return null;
            }

            break;

        case "in":

            if (choosen_index === -5) {
                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.source.value),
                    VIS.color(dataFlows.city[flow.source.index]));

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.target.value),
                    VIS.color(dataFlows.city[flow.target.index]));


                group.add(meshS2T);
                group.add(meshT2S);
                return group;

            }
            if (choosen_index === flow.source.index) {

                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.target.value),
                    VIS.color(dataFlows.city[flow.target.index]));

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.target.value),
                    VIS.color(dataFlows.city[flow.target.index]));

                group.add(meshS2T);
                group.add(meshT2S);
                return group;
            } else if (choosen_index === flow.target.index) {

                var meshS2T = getHalfFlowMesh(flow.source,
                    VIS.linerScaleWidth(flow.source.value),
                    VIS.color(dataFlows.city[flow.source.index]));

                var meshT2S = getHalfFlowMesh(flow.target, VIS.linerScaleWidth(flow.source.value),
                    VIS.color(dataFlows.city[flow.source.index]));

                group.add(meshS2T);
                group.add(meshT2S);
                return group;
            } else {
                return null;
            }

            break;


        case "sum":

            var color = "#31656a";

            var width = VIS.linerScaleWidth(flow.source.value) + VIS.linerScaleWidth(flow.target.value);
            var meshS2T = getHalfFlowMesh(flow.source, width, color);

            var meshT2S = getHalfFlowMesh(flow.target, width, color);


            group.add(meshS2T);
            group.add(meshT2S);
            return group;

            break;


        case "res":

            if (choosen_index === -5) {

                var width = VIS.linerScaleWidth(Math.abs(flow.source.value - flow.target.value));
                var color = flow.source.value > flow.target.value ?
                    VIS.color(dataFlows.city[flow.source.index]) :
                    VIS.color(dataFlows.city[flow.target.index]);

                var meshS2T = getHalfFlowMesh(flow.source, width, color);

                var meshT2S = getHalfFlowMesh(flow.target, width, color);

                group.add(meshS2T);
                group.add(meshT2S);
                return group;

            } else if (choosen_index === flow.source.index) {
                var width = VIS.linerScaleWidth(Math.abs(flow.source.value - flow.target.value));
                var color = flow.source.value > flow.target.value ?
                    "#ff1811" :
                    "#4eb01f";

                var meshS2T = getHalfFlowMesh(flow.source, width, color);

                var meshT2S = getHalfFlowMesh(flow.target, width, color);

                group.add(meshS2T);
                group.add(meshT2S);
                return group;

            } else if (choosen_index === flow.target.index) {

                var width = VIS.linerScaleWidth(Math.abs(flow.source.value - flow.target.value));
                var color = flow.target.value > flow.source.value ?
                    "#ff1811" :
                    "#4eb01f";
                var meshS2T = getHalfFlowMesh(flow.source, width, color);
                var meshT2S = getHalfFlowMesh(flow.target, width, color);
                group.add(meshS2T);
                group.add(meshT2S);
                return group;
            } else {
                return null;
            }

            break;



            var color = "#31656a";

            var width = VIS.linerScaleWidth(flow.source.value) + VIS.linerScaleWidth(flow.target.value);
            var meshS2T = getHalfFlowMesh(flow.source, width, color);

            var meshT2S = getHalfFlowMesh(flow.target, width, color);


            group.add(meshS2T);
            group.add(meshT2S);
            return group;

            break;



    }

    function getHalfFlowMesh(item, width, color) {

        var origin = VIS.PositionsOD[dataFlows.city[item.index]],
            destination = VIS.PositionsOD[dataFlows.city[item.subindex]];


        var radius = Math.sqrt((destination[1] - origin[1]) * (destination[1] - origin[1]) +
            (destination[0] - origin[0]) * (destination[0] - origin[0])) / 2;


        var path = new THREE.CurvePath();


        for (var i = 1; i < 26; i++) {

            var j = (i - 1) / 50;
            var k = i / 50;

            path.add(new THREE.LineCurve3(
                new THREE.Vector3(
                    origin[0] + j * destination[0] - j * origin[0],
                    origin[1] + j * destination[1] - j * origin[1],
                    radius * 2 * Math.sqrt(j - j * j)
                ),

                new THREE.Vector3(
                    origin[0] + k * destination[0] - k * origin[0],
                    origin[1] + k * destination[1] - k * origin[1],
                    radius * 2 * Math.sqrt(k - k * k)
                )));

        }

        var tubeGeometry = new THREE.TubeBufferGeometry(path, 20, width, 8, false);


        var meshS2T = new THREE.Mesh(tubeGeometry,
            new THREE.MeshBasicMaterial({ color: color }));
        meshS2T.doubleSided = true;

        return meshS2T;
    }
}

function createRibbons(flow, dataEncoded, choosen_index) {

    var color_Out = "#CC3300";
    var color_In = "#0099CC";

    var group = new THREE.Group();

    switch (dataEncoded) {

        case "all":

            var meshS2T = new THREE.Mesh(createRibbonGeometry(flow.source, VIS.linerScaleWidth(flow.source.value)),
                new THREE.MeshBasicMaterial({ color: color_Out }));
            meshS2T.doubleSided = true;
            group.add(meshS2T);

            var meshT2S = new THREE.Mesh(createRibbonGeometry(flow.target, VIS.linerScaleWidth(flow.target.value)),
                new THREE.MeshBasicMaterial({ color: color_In }));
            meshT2S.doubleSided = true;
            group.add(meshT2S);

            return group;


            break;

        case "out":

            if (choosen_index === flow.source.index) {

                var meshS2T = new THREE.Mesh(createRibbonGeometry(flow.source, VIS.linerScaleWidth(flow.source.value)),
                    new THREE.MeshBasicMaterial({ color: color_Out }));
                meshS2T.doubleSided = true;
                group.add(meshS2T);
                return group;

            } else if (choosen_index === flow.target.index) {

                var meshT2S = new THREE.Mesh(createRibbonGeometry(flow.target, VIS.linerScaleWidth(flow.target.value)),
                    new THREE.MeshBasicMaterial({ color: color_Out }));
                meshT2S.doubleSided = true;
                group.add(meshT2S);
                return group;
            } else {
                return null;
            }

            break;

        case "in":

            if (choosen_index === flow.source.index) {

                var meshS2T = new THREE.Mesh(createRibbonGeometry(flow.target, VIS.linerScaleWidth(flow.target.value)),
                    new THREE.MeshBasicMaterial({ color: color_In }));
                meshS2T.doubleSided = true;
                group.add(meshS2T);
                return group;

            } else if (choosen_index === flow.target.index) {

                var meshT2S = new THREE.Mesh(createRibbonGeometry(flow.source, VIS.linerScaleWidth(flow.source.value)),
                    new THREE.MeshBasicMaterial({ color: color_In }));
                meshT2S.doubleSided = true;
                group.add(meshT2S);
                return group;
            } else {
                return null;
            }

            break;


        case "res":

            var width = VIS.linerScaleWidth(Math.abs(flow.source.value - flow.target.value));
            var color = flow.source.value > flow.target.value ?
                VIS.color(dataFlows.city[flow.source.index]) : VIS.color(dataFlows.city[flow.target.index]);
            var geo = flow.source.value > flow.target.value ?
                createRibbonGeometry(flow.source, width) :
                createRibbonGeometry(flow.target, width);

            var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: color }));
            mesh.doubleSided = true;
            group.add(mesh);
            return group;
            break;

    }

    function createRibbonGeometry(item, width) {

        var origin = VIS.PositionsOD[dataFlows.city[item.index]],
            destination = VIS.PositionsOD[dataFlows.city[item.subindex]];

        var radius = Math.sqrt((destination[1] - origin[1]) * (destination[1] - origin[1]) +
            (destination[0] - origin[0]) * (destination[0] - origin[0])) / 2;

        var geometry = new THREE.Geometry();

        var angle = Math.asin((destination[1] - origin[1]) / radius / 2);


        if (destination[0] > origin[0] && destination[1] > origin[1]) {
            // I
        }
        if (destination[0] < origin[0] && destination[1] > origin[1]) {
            // II
            angle = Math.PI - angle;
        }
        if (destination[0] < origin[0] && destination[1] < origin[1]) {
            // III
            angle = Math.PI - angle;
        }
        if (destination[0] > origin[0] && destination[1] < origin[1]) {
            // IV
            angle = 2 * Math.PI + angle;
        }

        var dx = width * Math.sin(angle),
            dy = width * Math.cos(angle),
            d_arrow_x = 2 * dx,
            d_arrow_y = 2 * dy;

        for (var i = 0; i < 51; i++) {

            var j = i / 50;

            geometry.vertices.push(
                new THREE.Vector3(origin[0] + j * destination[0] - j * origin[0],
                    origin[1] + j * destination[1] - j * origin[1],
                    radius * 2 * Math.sqrt(j - j * j)));

            if (i > 25) {

                var k = (25 - (i - 25)) / 25;
                geometry.vertices.push(
                    new THREE.Vector3(origin[0] + j * destination[0] - j * origin[0] + k * d_arrow_x + dx,
                        origin[1] + j * destination[1] - j * origin[1] - k * d_arrow_y - dy,
                        radius * 2 * Math.sqrt(j - j * j)));

            } else {
                geometry.vertices.push(
                    new THREE.Vector3(origin[0] + j * destination[0] - j * origin[0] + dx,
                        origin[1] + j * destination[1] - j * origin[1] - dy,
                        radius * 2 * Math.sqrt(j - j * j)));
            }

        }


        var point_num = geometry.vertices.length / 2;


        for (var i = 1; i < point_num; i++) {

            geometry.faces.push(new THREE.Face3(2 * i - 1, 2 * i - 2, 2 * i));
            geometry.faces.push(new THREE.Face3(2 * i - 1, 2 * i, 2 * i + 1));

            geometry.faces.push(new THREE.Face3(2 * i, 2 * i - 1, 2 * i + 1));
            geometry.faces.push(new THREE.Face3(2 * i, 2 * i - 2, 2 * i - 1));

        }



        for (var i = 1; i < point_num; i++) {

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((i - 1) / point_num, 0),
                new THREE.Vector2((i - 1) / point_num, 1),
                new THREE.Vector2(i / point_num, 1)
            ]);
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((i - 1) / point_num, 0),
                new THREE.Vector2(i / point_num, 1),
                new THREE.Vector2(i / point_num, 0)
            ]);

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(i / point_num, 1),
                new THREE.Vector2((i - 1) / point_num, 0),
                new THREE.Vector2(i / point_num, 0)
            ]);
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(i / point_num, 1),
                new THREE.Vector2((i - 1) / point_num, 1),
                new THREE.Vector2((i - 1) / point_num, 0)
            ]);
        }

        geometry.uvsNeedUpdate = true;

        return geometry;

    }


}

function createTubes3DHeight(flow, dataEncoded, choosen_index) {

    var group = new THREE.Group();


    var color_Out = "#CC3300";
    var color_In = "#0099CC";

    switch (dataEncoded) {

        case "all":

            var meshS2T = flowParts(flow.source, color_Out);
            var meshT2S = flowParts(flow.target, color_In);

            group.add(meshS2T);
            group.add(meshT2S);

            return group;


            break;

        case "out":

            if (choosen_index === flow.source.index) {
                var meshS2T = flowParts(flow.source, color_Out);
                group.add(meshS2T);
                return group;

            } else if (choosen_index === flow.target.index) {

                var meshT2S = flowParts(flow.target, color_Out);
                group.add(meshT2S);
                return group;
            } else {
                return null;
            }

            break;

        case "in":

            if (choosen_index === flow.source.index) {

                var meshT2S = flowParts(flow.target, color_In);
                group.add(meshT2S);
                return group;

            } else if (choosen_index === flow.target.index) {

                var meshS2T = flowParts(flow.source, color_In);
                group.add(meshS2T);
                return group;
            } else {
                return null;
            }

            break;

    }


    function flowParts(item, color) {

        var origin = VIS.PositionsOD[dataFlows.city[item.index]],
            destination = VIS.PositionsOD[dataFlows.city[item.subindex]];

        var width = VIS.linerScaleWidth(item.value);

        var tubeRadius =  VIS.linerScaleWidth.range()[1]/2;

        var dreaction = 1;

        var spline = new THREE.CatmullRomCurve3(createCurveArray(origin, destination, dreaction,
            width, VIS.unitline3D / 3));

        var tubeGeometry = new THREE.TubeBufferGeometry(spline, 20, tubeRadius, 8, false);

        var mesh = new THREE.Mesh(tubeGeometry,
            new THREE.MeshBasicMaterial({ color: color }));

        mesh.doubleSided = true;

        return mesh;
    }

}

function createCurveArray(point_start, point_end, dreaction, step_Z, unit) {

    var interpoint = new THREE.Vector3((point_start[0] + point_end[0]) / 2,
        (point_start[1] + point_end[1]) / 2,
        dreaction * step_Z * unit);

    return [new THREE.Vector3(point_start[0], point_start[1], 0),
        interpoint,
        new THREE.Vector3(point_end[0], point_end[1], 0)
    ];

}