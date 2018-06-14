var data = null;
$("#page").css("visibility", "hidden");

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

var allElements = [];
var defaultElementIndexes = [0, 1];
var theOptions = [];
var currentColumnNames = [];
var xContour = null;
var yContour = null;
var elmConcentrations = [];
var contourData = [];

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
        } else {
            column.push(+d[columnName]);
        }
    });
    return column;
}

function validGridId(id) {
    var re = /^[A-Z]\d\d$/g;
    return id != null && id.match(re) != null;
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
    //Plot contour
    setContourData(0);
    setContourData(1);
    plotContour(0);
    plotContour(1);
    populateSelectors(data);
    //Plot scatter
    plotScatter();
    //draw the correlation graph
    drawGraph();
    //Handling the loader spinner
    d3.select(".loader").style("opacity", 1.0).transition().duration(1000).style("opacity", 1e-6).remove();
    d3.select("#page").style("visibility", "visible").style("opacity", 0).transition().duration(5000).style("opacity", 1.0);
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

function setContourData(index) {
    contourData[index] = [{
        x: xContour,
        y: yContour,
        z: elmConcentrations[index],
        type: 'contour',
        name: currentColumnNames[index],
        showscale: true
    }];
}

function plotContour(index) {
    var contourLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: {
            l: 30,
            r: 80,
            t: 30,
            b: 30,
            pad: 0,
            autoexpand: false
        },
        font: {
            family: "Georgia,Times,serif"
        }
    }
    Plotly.newPlot('contour' + (index + 1), contourData[index], contourLayout);
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
        line:{
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
        }
    }
    Plotly.newPlot('scatterPlot', scatterTraces, layout);
}

function getCurrentCorrelation() {
    var corcoef = pearsonCorcoef(elmConcentrations[0], elmConcentrations[1]);
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
    //Reset the selection circles of the correlation graph.
    resetSelectionCircles();
}

/*Section for the force directed layout of the correlation graph*/
let graphNodeRadius = 12;
let mouseOverExpand = 4;
let selectionStrokeWidth = 3;
var force;
let maxLinkWidth = 2;
let minLinkWidth = 0.5;
var corScale;
var nodes_data = [];
var links_data = [];
let svgId = "#corcoefGraph";
var node;
var link;
let defaultThreshold = 0.75;
let linkStrengthPower = 8;
var selectionCounter = 0;
var selectionCircle;

function valueToIndex(nodes_data, value) {
    for (var i = 0; i < nodes_data.length; i++) {
        if (nodes_data[i].value === value) {
            return i;
        }
    }
}

function getGraphSize() {
    var svg = d3.select(svgId);
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
        .force("charge", d3.forceManyBody().strength(-100).distanceMin(4 * graphNodeRadius))
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
            var corcoef = pearsonCorcoef(u, v);
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
        .attr("fill", "#ffffff")
        .attr("r", graphNodeRadius);

    // <image id="img" clip-path="url(#circleView)" x="15" y="15"/>
    var plot = g.append("g")
        .selectAll("image")
        .data(nodes_data)
        .enter()
        .append("image")
        .attr("id", (d) => {
            return "img" + d.index;
        })
        .attr("clip-path", (d) => {
            return "url(#clipPath" + d.index + ")"
        })
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

//<editor-fold desc="Section for the slider">*/
var sliderHeight = 35;
var sliderWidth = 140;
var sliderMarginRight = 20;

function drawThresholdSlider(svg) {
    let corThreshold = d3.sliderHorizontal()
        .min(0)
        .max(1.0)
        .width(sliderWidth)
        .tickFormat(d3.format('.4'))
        .ticks(3)
        .default(defaultThreshold)
        .on('onchange', onThreshold);
    let graphSize = getGraphSize();
    let graphWidth = graphSize[0];
    let graphHeight = graphSize[1];
    let sliderX = graphWidth - sliderWidth - sliderMarginRight;//120 = 100 for the width and 20 for the margin.
    let sliderY = graphHeight - sliderHeight;//40 is the height of the slider
    var g = svg.append("g")
        .attr("transform", "translate(" + sliderX + "," + sliderY + ")");

    g.append("text")
        .attr("text-anchor", "start")
        .text("alignment-baseline", "ideographic")
        .attr("dy", "-.71em")
        .text("Correlation threshold");
    g.call(corThreshold);
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
