/**
 * Created by Aero on 08/03/2017.
 */

function loadData(callback){

    var DATA_PATH = "../data/mData-" + $('input[name="municipality"]:checked').val() + ".json";


    d3.json( DATA_PATH)
        .then(function(data){

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

    setTimeout(callback, 200);
}
