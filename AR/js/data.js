/**
 * Created by Aero on 08/03/2017.
 */

var dataFlows;
var dataChord;


var citySelectedCurr ;

//var flowsSet = [];
//var legendSet = [];

//const SHOW_ALL_FLOWS = -5;
//var font = null;

function loadData(dataPathName, callback){

    var dataPath = "./data/mData-" + dataPathName + ".json";

    citySelectedCurr =  dataPathName;

    d3.json( dataPath)
        .then(function(data){

            dataFlows = data;
            var chord = d3.chord()
                .padAngle(0)
                .sortSubgroups(d3.descending);

            dataChord = chord(data.matrix);
        } );

    setTimeout(callback, 1000);
}
