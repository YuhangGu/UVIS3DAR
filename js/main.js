/**
 * Created by Aero on 15/02/2017.
 */

var dataFlows;
var dataChord;
var dataChordT;
var dataChordC;


var flowsSet = [];
var cylinderODSet = [];

var cylinderODSetForGroupDirection = [];

var cylinderODSetForGroupNode = [];

var barODSet = [];
var pieODSet = [];

var selectedCityName = '';


//var typeOf3DFlow = "line";
var typeOf3DFlow = "tube";

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


function visStart(e) {

    loadData(function() {

        vis3DFlowMap();
    });


    $('input[name="municipality"]').change(function(e) {

        //cancelAnimationFrame(this.id);

        document.getElementById("map").removeChild(VIS.cssRenderer.domElement);
        document.getElementById("map").removeChild(VIS.glRenderer.domElement);

        if ($('input[name="municipality"]:checked').val() == "Utrecht") {
            citySelectedCurr = "Utrecht";
        }
        if ($('input[name="municipality"]:checked').val() == "Friesland") {

            citySelectedCurr = "Leeuwarden";
        }
        if ($('input[name="municipality"]:checked').val() == "Groningen") {

            citySelectedCurr = "Groningen";
        }


        loadData(function() {
            vis3DFlowMap();
        });


    });
}