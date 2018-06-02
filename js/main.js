var data = null;
function readData(fileName) {
    d3.csv(fileName, function (error, rawData) {
        if (error) throw error;
        data = rawData.filter(function (d) {
            //Valid ID
            return validGridId(d["Grid ID"]);
        });
        handleData(data);
    });
}

var theOption1 = null;
var theOption2 = null;
var currentColumnName1 = '';
var currentColumnName2 = '';
var xContour = null;
var yContour = null;
var elm1Concentration = null;
var elm2Concentration = null;
var xScatter = null;
var contourTrace1 = null;
var contourTrace2 = null;
var scatterTrace1 = null;
var scatterTrace2 = null;

function handleData(data){
    populateSelectors(data);
    setContourX();
    setContourY();
    setElm1Concentration();
    setElm2Concentration();
    //Plot contour
    setContourTrace1();
    setContourTrace2();
    plotContour();
    //Plot scatter
    setScatterX();
    setScatterTrace1();
    setScatterTrace2();
    plotScatter();
}

function updateElement1(){
    currentColumnName1 = theOption1.val();
    setElm1Concentration();
    //Update Contour
    setContourTrace1();
    plotContour();
    //Update Scatter
    setScatterTrace1();
    plotScatter();
}
function updateElement2(){
    currentColumnName2 = theOption2.val();
    //Update Contour
    setElm2Concentration();
    setContourTrace2();
    plotContour();
    //Update Scatter
    setScatterTrace2();
    plotScatter();
}
function setContourX(){
    xContour = getGridNumberList(data);
}
function setContourY(){
    yContour = getGridLetterList(data);
}
function setScatterX(){
    xScatter = getStringColumn(data, 'Grid ID');
};
function setElm1Concentration(){
    elm1Concentration = getNumberColumn(data, currentColumnName1);
}
function setElm2Concentration(){
    elm2Concentration = getNumberColumn(data, currentColumnName2);
}

function setContourTrace1(){
    contourTrace1 = {
        x: xContour,
        y: yContour,
        z: elm1Concentration,
        type: 'contour',
        name: currentColumnName1,
        xaxis: 'x1',
        yaxis: 'y1',
        showscale: false
    };
}
function setContourTrace2(){
    contourTrace2 = {
        x: xContour,
        y: yContour,
        z: elm2Concentration,
        type: 'contour',
        name: currentColumnName2,
        xaxis: 'x2',
        yaxis: 'y2',
        showscale: false
    };
}

function setScatterTrace1(){
    scatterTrace1 = {
            x: xScatter,
            y: elm1Concentration,
            type:'scatter',
            name: currentColumnName1,
            scatters: {
                showlabels: true
            }
    }
}
function setScatterTrace2(){
    scatterTrace2 = {
        x: xScatter,
        y: elm2Concentration,
        type:'scatter',
        name: currentColumnName2
    }
}

function plotContour(){
    var contourData = [contourTrace1, contourTrace2];
    var contourLayout = {
        title: "Correlation " + currentColumnName1 + " vs. " + currentColumnName2,
        xaxis: {domain: [0, 0.45], anchor: 'y1', title: currentColumnName1},
        yaxis: {domain: [0, 1], anchor: 'x1'},
        xaxis2: {domain: [0.55, 1], anchor: 'y2', title: currentColumnName2},
        yaxis2: {domain: [0, 1], anchor: 'x2'}
    }
    Plotly.newPlot('box1', contourData, contourLayout);
}
function plotScatter(){
    var scatterData = [scatterTrace1, scatterTrace2];

    Plotly.newPlot('box2', scatterData);
}

function getGridLetterList(data) {
    var letterList = [];
    d3.map(data, function (d) {
        letterList.push(extractGridLetter(d["Grid ID"]));
    });
    return letterList;
}

function getGridNumberList(data) {
    var numberList = [];
    d3.map(data, function (d) {
        numberList.push(extractGridNumber(d["Grid ID"]));
    });
    return numberList;
}

function getStringColumn(data, columnName) {
    var column = [];
    d3.map(data, function (d) {
        column.push(d[columnName]);
    });
    return column;
}

function getNumberColumn(data, columnName) {
    var column = [];
    d3.map(data, function (d) {
        column.push(+d[columnName]);
    });
    return column;
}

function extractGridLetter(gridId) {
    return gridId.substr(0, 1);
}

function extractGridNumber(gridId) {
    return gridId.substr(1, 2);
}

function validGridId(id) {
    var re = /^[A-Z]\d\d$/g;
    return id != null && id.match(re) != null;
}
/*Handling the selection box*/
function createByJson(div, jsonData, name,selectedIndex ,changeHandler, width) {
    var msdd = $("#" +div).msDropDown({byJson: {data: jsonData, name: name, width: width}}).data("dd");
    msdd.set("selectedIndex", selectedIndex);
    var theOption = $("select[name='"+name+"']");
    theOption.change(changeHandler);
    return theOption;
}
function populateSelectors(){
    //headers
    var headers = d3.keys(data[0]);
    var elements = headers.filter( function(d){
        return d.indexOf('Concentration')!=-1;
    });
    //Create option 1
    var jsonData = [];
    for(var i = 0; i< elements.length; i++){
        jsonData.push({value: elements[i], text: elements[i]});
    }
    theOption1 = createByJson("option1Container", jsonData, "option1", 0, updateElement1);
    theOption2 = createByJson("option2Container", jsonData, "option2", 1, updateElement2);
    currentColumnName1 = theOption1.val();
    currentColumnName2 = theOption2.val();

}