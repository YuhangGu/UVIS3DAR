/**
 * Created by Aero on 08/03/2017.
 */

var dataFlows;
var dataChord;
var dataChordT;


var flowsSet = [];
var legendSet = [];

const SHOW_ALL_FLOWS = -5;
var font = null;

const DEGS_TO_RADS = Math.PI / 180,
    UNIT_SIZE = 100;

const DIGIT_0 = 48,
    DIGIT_9 = 57,
    COMMA = 44,
    SPACE = 32,
    PERIOD = 46,
    MINUS = 45;


function loadData(callback){

    //var DATA_PATH = "../data/mData-" + $('input[name="municipality"]:checked').val() + ".json";

    var DATA_PATH = "./data/mData-Utrecht.json";


    //console.log(DATA_PATH)

    d3.json( DATA_PATH)
        .then(function(data){

            //console.log(data)

            dataFlows = data;

            var chord = d3.chord()
                .padAngle(0)
                .sortSubgroups(d3.descending);


            // from - to
            dataChord = chord(data.matrix);

            //Transposing

            /*
            var matrix_T = data.matrix;
            matrix_T = matrix_T[0].map((col, i) => matrix_T.map(row => row[i]));

            dataChordT = chord(matrix_T);


            var matrix_C  = data.matrix.slice();

            matrix_C = matrix_C.map(function (row , i) {

                return row.map(function (cell,j) {
                    return cell+ matrix_T[i][j];
                })
            });

            dataChordC = chord(matrix_C);
            */
        } );


    var loader = new THREE.FontLoader();

    loader.load( '../data/helvetiker_regular.typeface.json', function ( fontObj ) {
        font = fontObj;
    } );

    setTimeout(callback, 1000);
}
