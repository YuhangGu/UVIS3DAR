/**
 * Created by Aero on 08/03/2017.
 */


var mapName;

function loadData(callback){

    var DATA_PATH = "../data/mData-" + mapName + ".json";
    //console.log(mapName)


    d3.json( DATA_PATH)
        .then(function(data){

            dataFlows = data;

            var chord = d3.chord()
                .padAngle(0)
                .sortSubgroups(d3.descending);


            // from - to
            dataChord = chord(data.matrix);
        } );


    var loader = new THREE.FontLoader();

    loader.load( '../data/helvetiker_regular.typeface.json', function ( fontObj ) {
        font = fontObj;
    } );

    setTimeout(callback, 200);
}
