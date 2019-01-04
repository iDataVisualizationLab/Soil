var data = null;
let profiles = ["Profile1.csv", "Profile2.csv", "Profile3.csv"];
let defaultProfileIndex = 0;
let svgId = "#corcoefGraph";
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
let digits = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
function loadProfiles() {

    var data = profiles.map(d => {
        return {
            value: d,
            text: d
        }
    });
    theProfile = createByJson("profileContainerDiv", data, "optionprofile", defaultProfileIndex, changeProfile);
    changeProfile({target: {value: profiles[defaultProfileIndex]}});
}

loadProfiles();

function changeProfile(event) {
    //Clean the graph layout
    d3.select(".loader").style("display", "block").style("opacity", 1.0);
    d3.select("#page").style("visibility", "hidden");
    d3.select(svgId).selectAll("*").remove();
    readData("data/" + event.target.value);
}

function readData(fileName) {
    d3.csv(fileName, function (error, rawData) {
        if (error) throw error;
        data = rawData.filter(function (d) {
            //Valid ID
            return validGridId(d["Grid ID"]);
        });
        let valueRanges = {
            'Cu Concentration': [11, 26],
            'Cr Concentration': [29, 62]
        }
        //Add data for the three formulas
        let alAW = 26.9815385,
            oAW = 15.999,
            siAW = 28.085,
            feAW = 55.845,
            tiAW = 47.867,
            Al2O3AW = alAW * 2 + oAW * 3,
            alRatio = alAW * 2 / Al2O3AW,
            siO2AW = siAW + 2 * oAW,
            siRatio = siAW / siO2AW,
            Fe2O3AW = feAW * 2 + oAW * 3,
            feRatio = feAW * 2 / Fe2O3AW,
            tiO2AW = tiAW + 2 * oAW,
            tiRatio = tiAW / tiO2AW;

        data.map(row => {
            //Calculate Ruxton weathering index
            let si = (row["Si Concentration"] === "<LOD") ? 0 : +row["Si Concentration"],
                al = (row["Al Concentration"] === "<LOD") ? 0 : +row["Al Concentration"],
                al2o3 = al / alRatio,
                sio2 = si / siRatio;
            let RI = sio2 / al2o3;
            row["RI Concentration"] = RI + "";
            //Desilication index
            let fe = (row["Fe Concentration"] === "<LOD") ? 0 : +row["Fe Concentration"],
                ti = (row["Ti Concentration"] === "<LOD") ? 0 : +row["Ti Concentration"],
                fe2o3 = fe/feRatio,
                tio2 = ti/tiRatio;
            let DI = sio2 / (al2o3 + fe2o3 + tio2);
            row["DI Concentration"] = DI + "";
            // Elemental ratio of elements resistant to weathering
            let zr = (row["Zr Concentration"] === "<LOD") ? 0 : +row["Zr Concentration"];
            let SR = ti / zr;
            row["SR Concentration"] = SR + "";
            //Set min max values
            let keys = d3.keys(valueRanges);
            keys.forEach(key =>{
                let value = +row[key];
                if(value < valueRanges[key][0]){
                    value = valueRanges[key][0];
                } else if(value > valueRanges[key][1]){
                    value = valueRanges[key][1];
                }
                row[key] = value + '';
            });
            return row;
        });
        handleData(data);
    });
}

var allElements = [];
var defaultElementIndexes = [4, 1];
var theOptions = [];
var currentColumnNames = [];
var xContour = null;
var yContour = null;
var elmConcentrations = [];
var contourData = [];
var boxPlotData = [];
var theProfile;
var opacitySliders = [];

/*Handling data after loading*/
function getColumn(data, columnName) {
    var column = [];
    d3.map(data, function (d) {
        column.push(d[columnName]);
    });
    return column;
}

function getNumberColumn(data, columnName) {
    var column = [];
    d3.map(data, function (d) {
        if (d[columnName].indexOf('<LOD') != -1) {
            column.push(0);
        } else if(!d[columnName]){
            column.push(null);
        }
        else {
            column.push(+d[columnName]);
        }
    });
    return column;
}

function validGridId(id) {
    var re = /^[A-Z]\d\d$/g;
    return id != null && id.match(re) != null;
}

function plotTypeChange() {
    if ($("#contourPlotTypeS").is(":checked")) {
        plotTypeSelection = 'contours';
        plotType = 'contour';
    }
    if ($("#contourPlotTypeR").is(":checked")) {
        plotTypeSelection = 'contourr';
        plotType = 'heatmap';
    }
    if ($("#heatmapPlotType").is(":checked")) {
        plotTypeSelection = 'heatmap';
        plotType = 'heatmap';
    }
    plotGridMaps();
}

function plotGridMaps() {
    //Plot contour
    setContourData(0);
    setContourData(1);
    plotContour(0);
    plotContour(1);
}

function handleData(data) {

    allElements = getAllElements();
    //Set the two default current elements
    currentColumnNames[0] = allElements[defaultElementIndexes[0]].value;
    currentColumnNames[1] = allElements[defaultElementIndexes[1]].value;
    setContourX();
    setContourY();
    setElmConcentration(0);
    setElmConcentration(1);
    plotGridMaps();
    populateSelectors(data);
    //Plot scatter
    plotScatter();
    //draw the correlation graph
    drawGraph();
    //Plot the box plots
    plotBoxPlots();
    //Handling the loader spinner
    d3.select(".loader").style("opacity", 1.0).transition().duration(1000).style("opacity", 1e-6).style("display", "none");
    d3.select("#page").style("visibility", "visible").style("opacity", 1e-6).transition().duration(5000).style("opacity", 1.0);
}

//<editor-fold desc="functions to get information for the contours">
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

function setContourX() {
    xContour = getGridNumberList(data);
}

function setContourY() {
    yContour = getGridLetterList(data);
}

function setElmConcentration(index) {
    elmConcentrations[index] = getNumberColumn(data, currentColumnNames[index]);
}

let plotType = 'heatmap';
let plotTypeSelection = 'contourr';
let colors5 =  ["#4A8FC2", "#A6C09D", "#FAFA7C", "#EC9248", "#D63128"];
let colorScales = {
    'Al Concentration': {values: [1.6*10000, 2.7*10000, 3.9*10000, 5.1*10000, 6.3*10000, 7.9*10000], colors: colors5},
    'Ca Concentration': {values: [-1*10000, 0.8*10000, 2.5*10000, 4.5*10000, 10*10000, 23*10000], colors: colors5},
    'Cr Concentration': {values: [29, 38, 42, 46, 50, 62], colors: colors5},
    'Cu Concentration': {values: [11, 17, 20, 22, 24, 26], colors: colors5},
    'Fe Concentration': {values: [0.8*10000, 1.2*10000, 1.6*10000, 2.0*10000, 2.4*10000, 3.0*10000], colors: colors5},
    'K Concentration': {values: [0.4*10000, 0.8*10000, 1.1*10000, 1.3*10000, 1.5*10000, 1.7*10000], colors: colors5},
    'Mn Concentration': {values:[130, 240, 320, 370, 420, 636], colors: colors5},
    'Nb Concentration': {values:[6.4, 10.0, 13.3, 15.8, 18, 20.3], colors: colors5},
    'Ni Concentration': {values:[15, 16, 22, 26, 30, 35], colors: colors5},
    'Pb Concentration': {values:[7.7, 12, 15, 17, 19, 21.3], colors: colors5},
    'Rb Concentration': {values:[26, 45, 65, 77, 86, 95], colors: colors5},
    'S Concentration': {values:[125, 150, 170, 210, 250, 291], colors: colors5},
    ' Concentration': {values: [8*10000, 12*10000, 16*10000, 20*10000, 24*10000, 28*10000], colors: colors5},
    'Sr Concentration': {values:[65, 85, 105, 125, 150, 331], colors: colors5},
    'Th Concentration': {values:[9.7, 11.2, 12.6, 13.6, 15.2, 16.9], colors: colors5},
    'Ti Concentration': {values: [0.13*10000, 0.20*10000,0.28 *10000, 0.32*10000, 0.36*10000, 0.40*10000], colors: colors5},
    'V Concentration': {values:[48, 56, 64, 68, 72, 77], colors: colors5},
    'Y Concentration': {values:[8.7, 14, 18, 22, 26, 30], colors: colors5},
    'Zn Concentration': {values:[24, 40, 54, 62, 67, 74], colors: colors5},
    'Zr Concentration': {values:[134, 220, 260, 280, 300, 370], colors: colors5},
}
function smoothenData(contourData){
    let t = [];
    let x = [];
    let y = [];
    //Remove outliers
    let q95 = ss.quantile(contourData.z, 0.95);
    let q05 = ss.quantile(contourData.z, 0.05);
    for (let i = 0; i < contourData.z.length ; i++) {
        if(contourData.z[i] <= q95 && contourData.z[i] >= q05){
            t.push(contourData.z[i]);
            x.push(digits.indexOf(contourData.x[i]));
            y.push(letters.indexOf(contourData.y[i]));
        }
    }
    // var model = "exponential";
    let model = "spherical";
    // let model = "gaussian";
    let sigma2 = 0, alpha = 100;
    let variogram = kriging.train(t, x, y, model, sigma2, alpha);
    //Now interpolate data (step) at a point
    contourData.z = [];
    contourData.x = [];
    contourData.y = [];
    let step = 0.05;
    for (let i = 0; i < digits.length; i=i+step) {
        for (let j = 0; j < letters.length; j = j+step) {
            contourData.x.push(i);
            contourData.y.push(j);
            contourData.z.push(kriging.predict(i, j, variogram))
        }
    }
}
function setContourData(index) {

    let columnName = currentColumnNames[index]
    let colorScale = 'Portland';
    if(colorScales[columnName]){
        colorScale = [];
        let valueScale = d3.scaleLinear().domain(d3.extent(colorScales[columnName].values)).range([0, 1]);
        for (let i = 0; i < colorScales[columnName].values.length-1; i++) {
            colorScale.push([valueScale(colorScales[columnName].values[i]), colorScales[columnName].colors[i]]);
            colorScale.push([valueScale(colorScales[columnName].values[i+1]), colorScales[columnName].colors[i]])
        }
    }
    contourData[index] = [{
        x: xContour,
        y: yContour,
        z: elmConcentrations[index],
        type: plotType,
        name: currentColumnNames[index],
        showscale: true,
        colorscale: colorScale,
        line: {
            smoothing: 0.5,
            color: 'rgba(0, 0, 0,0)'
        },
        colorbar: {
            tickfont: {
                color: 'white'
            },
            ticks: colorScales[columnName]
        },
        connectgaps: true,
    }];
    if(plotTypeSelection!='heatmap'){
        smoothenData(contourData[index][0]);
    }
}


let plotMargins = {
    l: 20,
    r: 80,
    t: 50,
    b: 30,
    pad: 0,
    autoexpand: false
};

function plotContour(index) {
    var contourLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: plotMargins,
        xaxis: {
            gridcolor: '#bdbdbd',
            linecolor: '#636363',
            // showticklabels: true,
            // autotick: false,
            tickvals: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5],
            ticktext: digits,
            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            }
        },
        yaxis: {
            gridcolor: '#bdbdbd',
            linecolor: '#636363',
            // showticklabels: true,
            // autotick: false,
            tickvals: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5],
            ticktext: letters,
            tickfont: {
                family: "Impact",
                size: 12,
                color: "white"
            }
        },
        font: {
            family: "Georgia,Times,serif"
        },
        shapes: d3.range(1, 11, 1)
            .map(makeLineVert)
            .concat(d3.range(0, 13, 1)
                .map(makeLineHoriz)
            ),//For displayinbg the gridlines
    }
    Plotly.newPlot('contour' + (index + 1), contourData[index], contourLayout);
    //Now draw the threshold slider if it is not drawn
    d3.select("#plotOpacity" + (index + 1)).select("svg").selectAll("*").remove();
    opacitySliders[index] = drawThresholdSlider(d3.select("#plotOpacity" + (index + 1)).select("svg"), "Plot opacity", onOpacityThreshold);

    function makeLineVert(x) {
        return {
            type: 'line',
            xref: 'x',
            yref: 'paper',
            x0: x,
            y0: 0,
            x1: x,
            y1: 1,
            line: {
                color: '#636363',
                width: 1
            }
        };
    }

    function makeLineHoriz(y) {
        return {
            type: 'line',
            xref: 'paper',
            yref: 'y',
            x0: 0,
            y0: y,
            x1: 1,
            y1: y,
            line: {
                color: '#636363',
                width: 1
            }
        };
    }
}

function setBoxPlotData(index) {
    boxPlotData[index] = [{
        x: elmConcentrations[index],
        y: yContour,
        type: 'box',
        name: currentColumnNames[index],
        boxmean: false,
        orientation: 'h'
    }];
}

function plotBoxPlot(index) {
    var layout = {
        paper_bgcolor: 'rgba(255,266,255,.75)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: currentColumnNames[index],
        margin: plotMargins,
        xaxis: {
            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            }
        },
        yaxis: {

            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            }
        },
        boxmode: 'group'
    };

    Plotly.newPlot('boxPlot' + (index + 1), boxPlotData[index], layout);
}

function plotBoxPlots() {
    setBoxPlotData(0);
    plotBoxPlot(0);
    setBoxPlotData(1);
    plotBoxPlot(1);
}

function plotScatter() {
    //Do the sorting.
    var scatterData = data.map(function (d) {
        var result = {};
        result[currentColumnNames[0]] = (d[currentColumnNames[0]].indexOf('<LOD') != -1) ? 0 : +d[currentColumnNames[0]];
        result[currentColumnNames[1]] = (d[currentColumnNames[1]].indexOf('<LOD') != -1) ? 0 : +d[currentColumnNames[1]];
        return result;
    });
    scatterData.sort(function (a, b) {
        return a[currentColumnNames[0]] - b[currentColumnNames[0]];
    });

    var xData = getColumn(scatterData, currentColumnNames[0]);
    var yData = getColumn(scatterData, currentColumnNames[1]);
    var model = linearRegiression(xData, yData);
    var yPredictedData = predict(xData, model);
    var scatterTraces = [{
        x: xData,
        y: yData,
        type: 'scatter',
        mode: 'markers',
        name: 'data',
        marker: {
            color: "black"
        }
    }, {
        x: xData,
        y: yPredictedData,
        type: 'scatter',
        mode: 'lines',
        name: 'regression',
        line: {
            color: "rgb(200, 0, 200)"
        }
    }
    ];

    var layout = {
        title: currentColumnNames[0].split(" ")[0] + " vs. " + currentColumnNames[1].split(" ")[0] + " correlation: " + getCurrentCorrelation(),
        xaxis: {
            title: currentColumnNames[0]
        },
        yaxis: {
            title: currentColumnNames[1]
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            family: "Georgia,Times,serif"
        },
        margin: {
            l: 80,
            r: 80,
            t: 70,
            b: 80,
            pad: 0,
            autoexpand: false
        }
    }
    Plotly.newPlot('scatterPlot', scatterTraces, layout);
}

function getCurrentCorrelation() {
    var corcoef = ss.sampleCorrelation(elmConcentrations[0], elmConcentrations[1]);
    return Math.round(corcoef * 1000) / 1000;
}

//</editor-fold>
/*Creating the the selection box*/
function createByJson(div, jsonData, name, selectedIndex, changeHandler, width) {
    var msdd = $("#" + div).msDropDown({byJson: {data: jsonData, name: name, width: width}}).data("dd");
    msdd.set("selectedIndex", selectedIndex);
    var theOption = $("select[name='" + name + "']");
    theOption.change(changeHandler);
    return theOption;
}

function getAllElements() {
    var headers = d3.keys(data[0]);
    var elements = headers.filter(function (d) {
        return d.indexOf('Concentration') != -1;
    });
    //Create option 1
    var jsonData = [];
    for (var i = 0; i < elements.length; i++) {
        jsonData.push({value: elements[i], text: elements[i]});
    }
    jsonData.sort((a, b) => {
        return a.text.localeCompare(b.text);
    });
    return jsonData;
}

function populateSelectors() {
    //headers
    theOptions[0] = createByJson("option1Container", allElements, "option1", defaultElementIndexes[0], updateElement1);
    theOptions[1] = createByJson("option2Container", allElements, "option2", defaultElementIndexes[1], updateElement2);
}

/*Updating data when the option changes*/
function updateElement1() {
    updateElement(0);
}

function updateElement2() {
    updateElement(1);
}

function updateElement(index) {
    currentColumnNames[index] = theOptions[index].val();
    setElmConcentration(index);
    //Update Contour
    setContourData(index);
    plotContour(index);
    //Update Scatter
    plotScatter();
    //Update the box plot
    setBoxPlotData(index);
    plotBoxPlot(index);
    //Reset the selection circles of the correlation graph.
    resetSelectionCircles();
}

/*Section for the force directed layout of the correlation graph*/
let graphNodeRadius = 12;
let mouseOverExpand = 6;
let selectionStrokeWidth = 3;
var force;
let maxLinkWidth = 2;
let minLinkWidth = 0.5;
var corScale;
var nodes_data = [];
var links_data = [];
var node;
var link;
let defaultThreshold = 0.75;
let linkStrengthPower = 10;
var selectionCounter = 0;
var selectionCircle;
let defaultMargin = 20;

function getGraphSize(svg) {
    if (!svg) {
        svg = d3.select(svgId);
    }
    var width = svg.node().getBoundingClientRect().width;
    var height = svg.node().getBoundingClientRect().height;
    return [width, height];
}

function createForce() {
    var graphSize = getGraphSize(),
        width = graphSize[0],
        height = graphSize[1];
    var myForce = d3.forceSimulation()
        .velocityDecay(0.5)
        .alphaDecay(0)
        .force("charge", d3.forceManyBody().strength(-80).distanceMin(4 * graphNodeRadius))
        .force("collision", d3.forceCollide(2 * graphNodeRadius).strength(1))
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2));

    force = myForce;
    return myForce;
}

function getNodes() {
    nodes_data = getAllElements();
    return nodes_data;
}

function setLinkData(threshold) {
    nodes_data = force.nodes();
    var links = [];
    for (var i = 0; i < nodes_data.length - 1; i++) {
        var u = getNumberColumn(data, nodes_data[i].value)
        for (var j = i + 1; j < nodes_data.length; j++) {
            var v = getNumberColumn(data, nodes_data[j].value);
            var corcoef = ss.sampleCorrelation(u, v);
            var type = (corcoef >= 0) ? "positive" : "negative"
            var corcoefabs = Math.abs(Math.round(corcoef * 1000) / 1000);
            if (corcoefabs >= threshold) {
                links.push({source: nodes_data[i], target: nodes_data[j], type: type, value: corcoefabs});
            }
        }
    }
    links_data = [];
    links.forEach(e => {
        links_data.push(e)
    });
    return links;
}

function getCorScale(links_data) {

    var maxCor = d3.max(links_data, function (d) {
        return d.value;
    });
    var minCor = d3.min(links_data, function (d) {
        return d.value;
    });
    //Make the scales before filtering
    var corScale = d3.scaleLinear().domain([minCor, maxCor]).range([minLinkWidth, maxLinkWidth]);
    return corScale;
}

//<editor-fold desc="Draw the force directed graph">
function drawGraph() {
    var svg = d3.select(svgId);
    var graphSize = getGraphSize();
    var width = graphSize[0];
    var height = graphSize[0];

    force = createForce();

    nodes_data = getNodes();
    force.nodes(nodes_data);

    setLinkData(defaultThreshold);
    corScale = getCorScale(links_data);
    force.force("link", d3.forceLink(links_data).strength(Math.pow(defaultThreshold, linkStrengthPower)));

    var g = svg.append("g");

    //Links
    link = g.append("g")
        .selectAll("line")
        .data(links_data)
        .enter().append("line")
        .attr("stroke-width", linkWidth)
        .style("stroke", linkColor);

    var node = g.append("defs")
        .selectAll("clipPath")
        .data(nodes_data)
        .enter()
        .append("clipPath")
        .attr("id", (d) => {
            return "clipPath" + d.index;
        })
        .append("circle")
        .attr("fill", "black")
        .attr("r", graphNodeRadius);

    var plot = g.append("g")
        .selectAll("image")
        .data(nodes_data)
        .enter()
        .append("image")
        .attr("id", (d) => {
            return "img" + d.index;
        })
        .attr("clip-path", (d) => "url(#clipPath" + d.index + ")")
        .on("click", (d) => {
            selectionCounter = selectionCounter % 2;
            $("#option" + (selectionCounter + 1) + "Container").msDropDown().data("dd").setIndexByValue(d.value);
            updateElement(selectionCounter);
            selectionCounter += 1;

        }).on("mouseover", (d) => {
            d3.select("#clipPath" + d.index + " circle").attr("r", graphNodeRadius + mouseOverExpand);
            d3.select("#circle" + d.index).attr("r", graphNodeRadius + mouseOverExpand);
            d3.select("#label" + d.index).attr("dy", graphNodeRadius + mouseOverExpand);
        }).on("mouseout", (d) => {
            d3.select("#clipPath" + d.index + " circle").attr("r", graphNodeRadius);
            d3.select("#circle" + d.index).attr("r", graphNodeRadius);
            d3.select("#label" + d.index).attr("dy", graphNodeRadius);
        });

    selectionCircle = g.append("g")
        .selectAll("circle")
        .data(nodes_data)
        .enter()
        .append("circle")
        .attr("id", (d) => "circle" + d.index)
        .attr("r", graphNodeRadius)
        .attr("stroke-width", selectionStrokeWidth)
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("visibility", (d) => (d.value === currentColumnNames[0] || (d.value === currentColumnNames[1])) ? "visible" : "hidden");


    //Plot to the images
    generateNodesWithSVGData((graphNodeRadius + mouseOverExpand) * 2, (graphNodeRadius + mouseOverExpand) * 2, nodes_data);
    //Lablel
    var label = g.append("g")
        .selectAll("text")
        .data(nodes_data)
        .enter().append("text")
        .attr("class", "elementText")
        .text((d) => {
            return d.text.split(" ")[0];
        })
        .attr("id", (d) => "label" + d.index)
        .attr("dy", graphNodeRadius);

    force.on("tick", tickHandler);

    function tickHandler() {
        if (node) {
            node
                .attr("cx", function (d) {
                    return d.x = boundX(d.x);
                })
                .attr("cy", function (d) {
                    return d.y = boundY(d.y);
                });
        }
        if (plot) {
            plot
                .attr("x", (d) => {
                    return d.x - graphNodeRadius - mouseOverExpand;
                })
                .attr("y", (d) => {
                    return d.y - graphNodeRadius - mouseOverExpand;
                })
        }
        if (selectionCircle) {
            selectionCircle.attr("cx", (d) => d.x);
            selectionCircle.attr("cy", (d) => d.y);
        }
        //update link positions
        if (link) {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
        }


        //update label positions
        if (label) {
            label
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y + 2;
                });
        }
    }

    //Handling drag
    var dragHandler = d3.drag()
        .on("start", dragStart)
        .on("drag", dragDrag)
        .on("end", dragEnd);

    dragHandler(plot);

    function dragStart(d) {
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragDrag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnd(d) {
        d.fx = null;
        d.fy = null;
    }

    //Handling zoom
    var zoomHandler = d3.zoom()
        .on("zoom", zoomActions);

    zoomHandler(svg);

    function zoomActions() {
        g.attr("transform", d3.event.transform);
    }

    function boundX(x) {
        return (x > width - graphNodeRadius * 2) ? width - graphNodeRadius * 2 : (x < graphNodeRadius * 2 ? graphNodeRadius * 2 : x);
    }

    function boundY(y) {
        return (y > height - graphNodeRadius * 2) ? height - graphNodeRadius * 2 : (y < graphNodeRadius * 2 ? graphNodeRadius * 2 : y);
    }

    //Now draw the threshold slider
    drawThresholdSlider(svg);
}

function resetSelectionCircles() {
    selectionCircle.attr("visibility", (d) => (d.value === currentColumnNames[0] || (d.value === currentColumnNames[1])) ? "visible" : "hidden");
}

function linkColor(d) {
    return d.type == 'positive' ? 'green' : 'red';
}

function linkWidth(d) {
    return corScale(d.value);
}

//</editor-fold>

//<editor-fold desc="Section for the slider">*/
function onThreshold(threshold) {
    links_data = setLinkData(threshold);
    link = link.data(links_data);
    link.exit().remove();
    var newLink = link.enter().append("line");
    link = link.merge(newLink);
    //Update the values
    link.attr("stroke-width", linkWidth)
        .style("stroke", linkColor);

    force.force("link", d3.forceLink(links_data).strength(Math.pow(threshold, linkStrengthPower)));
    force.restart();
}

function onOpacityThreshold(threshold) {
    //synchronize the two sliders
    opacitySliders[0].value(threshold);
    opacitySliders[1].value(threshold);
    d3.selectAll(".contour").selectAll(".cartesianlayer").style("opacity", threshold);

}

var sliderHeight = 24;
var sliderWidth = 140;
var sliderMarginRight = 20;

function drawThresholdSlider(svg, label, thresholdHandler) {
    if (!thresholdHandler) {
        thresholdHandler = onThreshold;
    }
    if (!label) {
        label = "Correlation threshold";
    }
    let corThreshold = d3.sliderHorizontal()
        .min(0)
        .max(1.0)
        .width(sliderWidth)
        .tickFormat(d3.format('.4'))
        .ticks(3)
        .default(defaultThreshold)
        .on('onchange', thresholdHandler);
    let graphSize = getGraphSize(svg);
    let graphWidth = graphSize[0];
    let graphHeight = graphSize[1];
    let sliderX = graphWidth - sliderWidth - sliderMarginRight;
    let sliderY = graphHeight - sliderHeight;
    var g = svg.append("g")
        .attr("transform", "translate(" + sliderX + "," + sliderY + ")");

    g.append("text")
        .attr("text-anchor", "start")
        .text("alignment-baseline", "ideographic")
        .attr("dy", "-.4em")
        .text(label);
    g.call(corThreshold);
    return corThreshold;
}

//</editor-fold>
//<editor-fold desc = "Section for the image generator">
/*Section for the image on the graph nodes*/
function generateNodesWithSVGData(imgWidth, imgHeight, nodes_data) {
    var xContour = getGridNumberList(data);
    var yContour = getGridLetterList(data);

    var layout = {
        displayModeBar: false,
        xaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false
        },
        yaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false
        },
        margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 0,
            pad: 0,
            autoexpand: false
        }
    };

    nodes_data.forEach(function (d) {
        var aDiv = document.createElement("div");
        var z = getNumberColumn(data, d.value);
        var contourData = [
            {
                x: xContour,
                y: yContour,
                z: z,
                type: 'contour',
                showscale: false
            }
        ];
        Plotly.plot(aDiv, contourData, layout).then(
            function (gd) {
                Plotly.toImage(gd, {format: 'svg', width: imgWidth, height: imgHeight}).then(function (svgData) {
                    //d.svgData = svgData;
                    d3.select("#img" + d.index).attr("xlink:href", svgData);
                });
            }
        );
    });
}

//</editor-fold>
