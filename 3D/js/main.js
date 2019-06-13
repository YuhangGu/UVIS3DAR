/**
 * Created by Aero on 15/6/2019.
 */

var dataFlows;
var dataChord;
var dataChordT;
var dataChordC;


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





function visStart(mapCode) {

    switch (mapCode) {

        case 'TU':
            mapName = 'Utrecht';
            break;
        case 'AF':
        case 'BF':
            mapName = 'Friesland';
            break;
        case 'AG':
        case 'BG':
            mapName = 'Groningen';
            break;
    }



    loadData(function() {

        vis3DFlowMap();
    });

}