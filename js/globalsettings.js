let data = null;
let avgData = null;
let profiles = ["Profile1", "Profile2", "Profile3"];
let newProfiles = ["Forest soil", "VegetableGardenSoil"];

let defaultProfileIndex = 0;
let svgId = "#corcoefGraph";
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
let digits = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
let columns = [
    'Grid ID',
    'Al Concentration',
    'Ca Concentration',
    'Cr Concentration',
    'Cu Concentration',
    'Fe Concentration',
    'K Concentration',
    'Mn Concentration',
    'Nb Concentration',
    'Ni Concentration',
    'Pb Concentration',
    'Rb Concentration',
    'S Concentration',
    'Si Concentration',
    'Sr Concentration',
    'Th Concentration',
    'Ti Concentration',
    'V Concentration',
    'Y Concentration',
    'Zn Concentration',
    'Zr Concentration'];
let allElements = [];
let defaultElementIndexes = [1, 0];
let theOptions = [];
let currentColumnNames = [];
let xContour = null;
let yContour = null;
let elmConcentrations = [];
let contourData = [];
let boxPlotData = [];
let curvePlotData = [];
let theProfile = null;
let opacitySliders = [];
let adjustedRSquaredScores = [0, 0];
let sliderHeight = 24;
let sliderWidth = 140;
let sliderMarginRight = 20;

let plotType = 'heatmap';
let plotTypeSelection = 'contour';

let plotMargins = {
    l: 20,
    r: 80,
    t: 50,
    b: 30,
    pad: 0,
    autoexpand: false
};

let graphNodeRadius = 12;
let mouseOverExpand = 6;
let selectionStrokeWidth = 3;
let force;
let maxLinkWidth = 2;
let minLinkWidth = 0.5;
let corScale;
let nodes_data = [];
let links_data = [];
let node;
let link;
let defaultThreshold = 0.75;
let linkStrengthPower = 10;
let selectionCounter = 0;
let selectionCircle;
let defaultMargin = 20;