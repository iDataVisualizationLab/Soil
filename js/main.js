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
var theOptions = [];
var currentColumnNames = [];
var xContour = null;
var yContour = null;
var elmConcentrations = [];
var xScatter = null;
var contourTraces = [];
var scatterTraces = [];
/*Handling data after loading*/
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
        if(d[columnName].indexOf('<LOD')!=-1){
            column.push(0);
        }else{
            column.push(+d[columnName]);
        }
    });
    return column;
}
function validGridId(id) {
    var re = /^[A-Z]\d\d$/g;
    return id != null && id.match(re) != null;
}
function handleData(data){
    populateSelectors(data);
    setContourX();
    setContourY();
    setElmConcentration(0);
    setElmConcentration(1);
    //Plot contour
    setContourTrace(0);
    setContourTrace(1);
    plotContour();
    //Plot scatter
    setScatterX();
    setScatterTrace(0);
    setScatterTrace(1);
    plotScatter();
    //Update correlation
    updateCorrelation();
}

/*functions to get information for the contours*/
function extractGridLetter(gridId) {
    return gridId.substr(0, 1);
}
function extractGridNumber(gridId) {
    return gridId.substr(1, 2);
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
function setContourX(){
    xContour = getGridNumberList(data);
}
function setContourY(){
    yContour = getGridLetterList(data);
}
function setElmConcentration(index){
    elmConcentrations[index] = getNumberColumn(data, currentColumnNames[index]);
}
function setContourTrace(index){
    contourTraces[index] = {
        x: xContour,
        y: yContour,
        z: elmConcentrations[index],
        type: 'contour',
        name: currentColumnNames[index],
        xaxis: 'x'+(index + 1),
        yaxis: 'y' + (index + 1),
        showscale: (index==0)? true : false
    };
}
function plotContour(){
    var contourLayout = {
        title: "Correlation " + currentColumnNames[0] + " vs. " + currentColumnNames[1],
        xaxis: {domain: [0, 0.45], anchor: 'y1', title: currentColumnNames[0]},
        yaxis: {domain: [0, 1], anchor: 'x1'},
        xaxis2: {domain: [0.55, 1], anchor: 'y2', title: currentColumnNames[1]},
        yaxis2: {domain: [0, 1], anchor: 'x2'}
    }
    Plotly.newPlot('box1', contourTraces, contourLayout);
}

/*Functions to set information for the scatter plots*/
function setScatterX(){
    xScatter = getStringColumn(data, 'Grid ID');
};
function setScatterTrace(index){
    scatterTraces[index] = {
            x: xScatter,
            y: elmConcentrations[index],
            type:'scatter',
            name: currentColumnNames[index],
    }
}
function plotScatter(){
    Plotly.newPlot('box2', scatterTraces);
}
/*Creating the the selection box*/
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
    theOptions[0] = createByJson("option1Container", jsonData, "option1", 0, updateElement1);
    theOptions[1] = createByJson("option2Container", jsonData, "option2", 1, updateElement2);
    currentColumnNames[0] = theOptions[0].val();
    currentColumnNames[1] = theOptions[1].val();
}
/*Updating data when the option changes*/
function updateElement1(){
    updateElement(0);
}
function updateElement2(){
    updateElement(1);
}
function updateElement(index){
    currentColumnNames[index] = theOptions[index].val();
    setElmConcentration(index);
    //Update Contour
    setContourTrace(index);
    plotContour();
    //Update Scatter
    setScatterTrace(index);
    plotScatter();
    //Update the correlation
    updateCorrelation();
}
function updateCorrelation(){
    var corcoef = pearsonCorcoef(elmConcentrations[0], elmConcentrations[1]);
    $("#corcoef").text("The correlation coefficient is: " + Math.round(corcoef*1000)/1000);
}