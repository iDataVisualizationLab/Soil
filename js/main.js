//<editor-fold desc="colors">
let contourColorScales = {
    Profile1: p1ColorScales,
    Profile2: p2ColorScales,
    Profile3: p3ColorScales,
    others: p1ColorScales
};
//Default color scales
let colorScales = contourColorScales[profiles[defaultProfileIndex]];
//The level color scale index (0, 1, 2 for 5 levels, 10 levels, and 20 levels correspondingly).
let colorLevelsScaleIndex = 2;
//</editor-fold>

loadProfiles();
toggleGraphTopMenu();

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

function changeProfile(event) {
    //Clean the graph layout
    d3.select(".loader").style("display", "block").style("opacity", 1.0);
    d3.select("#page").style("visibility", "hidden");
    d3.select(svgId).selectAll("*").remove();
    let profile = event.target.value;
    //Change the profile background.
    //TODO: Update this if we have image and color scheme of the profile
    if (profiles.indexOf(profile) >= 0) {
        d3.selectAll('.contourRoundedBorder').style('background-image', `url("data/images/${profile}.png")`);
        //Change the color profile.
        colorScales = contourColorScales[profile];
    } else {//new profiles
        d3.selectAll('.contourRoundedBorder').style('background-image', null);
        colorScales = contourColorScales['others'];
    }
    readData("data/" + profile);
}

function readData(fileName) {
    d3.csv(fileName + "Avg.csv", function (error, rawAvgData) {
        avgData = rawAvgData;
        if (error) throw error;
        d3.csv(fileName + ".csv", function (error, rawData) {
            if (error) throw error;

            data = rawData.filter(function (d) {
                //Valid ID
                return validGridId(d["Grid ID"]);
            });


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
            data = data.map(row => {
                //Use only 20 elements
                let temp = {};
                columns.forEach(c => {
                    temp[c] = row[c];
                });
                row = temp;

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
                    fe2o3 = fe / feRatio,
                    tio2 = ti / tiRatio;
                let DI = sio2 / (al2o3 + fe2o3 + tio2);
                row["DI Concentration"] = DI + "";
                // Elemental ratio of elements resistant to weathering
                let zr = (row["Zr Concentration"] === "<LOD") ? 0 : +row["Zr Concentration"];
                let SR = ti / zr;
                row["SR Concentration"] = SR + "";
                return row;
            });
            handleData(data);
        });
    });

}

/*Handling data after loading*/
function getColumn(data, columnName) {
    if (data.length <= 0 || data[0][columnName] === undefined) {
        return null;
    }
    let column = [];
    d3.map(data, function (d) {
        column.push(d[columnName]);
    });
    return column;
}

function getNumberColumn(data, columnName) {
    if (data.length <= 0 || data[0][columnName] === undefined) {
        return null;
    }
    let column = [];
    d3.map(data, function (d) {
        if (d[columnName].indexOf('<LOD') != -1) {
            column.push(0);
        } else if (!d[columnName]) {
            column.push(null);
        } else {
            column.push(+d[columnName]);
        }
    });
    return column;
}

function validGridId(id) {
    let re = /^[A-Z]\d\d$/g;
    return id != null && id.match(re) != null;
}

function validGridIdNewProfiles(id) {
    let re = /^[A-Z]\d-\d{1,2}$/g;
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

function colorScaleChange() {
    colorLevelsScaleIndex = document.getElementById("colorScaleSelect").selectedIndex;
    plotGridMaps();
}

function toggleGraphTopMenu() {
    if ($("#toggleGraphTopMenu").is(":checked")) {
        d3.selectAll(".modebar").style("opacity", 1);
    } else {
        d3.selectAll(".modebar").style("opacity", 0);
    }
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
    //Plot the cureve plots
    plotCurvePlots();
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
    let letterList = [];
    d3.map(data, function (d) {
        letterList.push(extractGridLetter(d["Grid ID"]));
    });
    return letterList;
}

function getGridNumberList(data) {
    let numberList = [];
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

function smoothenData(contourData) {
    let t = [];
    let x = [];
    let y = [];
    //Remove outliers
    let q95 = ss.quantile(contourData.z, 0.95);
    let q05 = ss.quantile(contourData.z, 0.05);
    for (let i = 0; i < contourData.z.length; i++) {
        if (contourData.z[i] <= q95 && contourData.z[i] >= q05) {
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
    for (let i = 0; i < digits.length; i = i + step) {
        for (let j = 0; j < letters.length; j = j + step) {
            contourData.x.push(i);
            contourData.y.push(j);
            contourData.z.push(kriging.predict(i, j, variogram))
        }
    }
}

function getContourColorScale(columnName) {
    let colorScale = 'Portland';
    let selectedColorScales = colorScales[colorLevelsScaleIndex];
    if (selectedColorScales[columnName]) {
        colorScale = [];
        let valueScale = d3.scaleLinear().domain(d3.extent(selectedColorScales[columnName].values)).range([0, 1]);
        for (let i = 0; i < selectedColorScales[columnName].values.length - 1; i++) {
            colorScale.push([valueScale(selectedColorScales[columnName].values[i]), selectedColorScales[columnName].colors[i]]);
            colorScale.push([valueScale(selectedColorScales[columnName].values[i + 1]), selectedColorScales[columnName].colors[i]])
        }
    }
    return colorScale;
}

function setContourData(index) {

    let columnName = currentColumnNames[index]
    let colorScale = getContourColorScale(columnName);
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
    if (plotTypeSelection != 'heatmap') {
        smoothenData(contourData[index][0]);
    }
}


function plotContour(index) {
    let contourLayout = {
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
    let layout = {
        paper_bgcolor: 'rgba(255,266,255,.75)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: currentColumnNames[index],
        margin: {
            l: 20,
            r: 80,
            t: 50,
            b: 76,
            pad: 0,
            autoexpand: false
        },
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

function setCurvePlotData(index) {
    let x = getNumberColumn(avgData, currentColumnNames[index]);
    if (x == null) x = [];
    let y = getColumn(avgData, 'Depth').map(d => +d.split('-')[1]);
    if (y == null) y = [];
    let x1 = x.slice(0, 13);//First 13 is for 10cm, the last are for the 6 levels
    let x2 = x.slice(13);
    let y1 = y.slice(0, 13);//First 13 is for 10cm, the last are for the 6 levels
    let y2 = y.slice(13);
    adjustedRSquaredScores[index] = calculateAdjustedRSquared(x1, y1, x2, y2);
    curvePlotData[index] = [{
        x: x1,
        y: y1,
        type: 'scatter',
        name: '10cm',
        mode: 'lines',
        line: {shape: 'spline'}
    }, {
        x: x2,
        y: y2,
        type: 'scatter',
        name: 'Horizon',
        mode: 'lines',
        line: {shape: 'spline'}
    }
    ];
}

function calculateAdjustedRSquared(x1, y1, x2, y2) {
    if (x1.length === 0) {
        return 0;
    }
    let result;
    let points = x2.map((v, i) => [v, y2[i]]);
    var line = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveCardinal);

    var tempSvg = document.createElement('svg');
    tempSvg = d3.select(tempSvg);
    var tempPath = tempSvg.append("svg:path").attr("d", line(points));
    var tpNode = tempPath.node();
    let prevY = 0;
    let currY = 0;
    let x2Interpolated = [];
    let y2Interpolated = [];
    let counter = 0;
    let totalLength = tpNode.getTotalLength();
    let step = 0.01;
    var curlen = 0;
    while (curlen <= totalLength + step) {
        prevY = currY;
        let point = getXY(curlen);
        currY = point[1];
        if (prevY < y1[counter] && currY >= y1[counter]) {
            x2Interpolated.push(point[0]);
            y2Interpolated.push(point[1]);
            counter += 1;
        }
        curlen += step;
    }

    function getXY(len) {
        var point = tpNode.getPointAtLength(len);
        return [point.x, point.y];
    }

    let sse = ss.sum(x2Interpolated.map((x2v, i) => (x1[i] - x2v) * (x1[i] - x2v)));
    let mx1 = ss.mean(x1);
    let sst = ss.sum(x1.map((x1v) => (x1v - mx1) * (x1v - mx1)));
    result = 1 - (sse / sst);
    return result;
}

function plotCurvePlot(index) {

    let layout = {
        paper_bgcolor: 'rgba(255,266,255,.75)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: currentColumnNames[index] + ", R-Squared:" + adjustedRSquaredScores[index].toFixed(3),
        margin: {
            l: 120,
            r: 120,
            t: 50,
            b: 76,
            autoexpand: false
        },
        xaxis: {
            showgrid: true,
            zeroline: false,
            showline: true,
            autotick: true,
            autorange: true,
            showticklabels: true,
            ticklen: 4,
            tickwidth: 2,
            tickcolor: '#000',
            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            },

        },
        yaxis: {
            showgrid: true,
            zeroline: false,
            showline: true,
            autotick: true,
            showticklabels: true,
            ticklen: 4,
            tickwidth: 2,
            tickcolor: '#000',
            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            },
            range: [140, 0]
        },
        legend: {
            "orientation": "h",
            bgcolor: 'rgba(0, 0, 0, 0)'
        }

    };

    Plotly.newPlot('curvePlot' + (index + 1), curvePlotData[index], layout);
    //Then remove the clip-path, since this clipath is cutting off the curves
    d3.select(`#curvePlot${index + 1}`).select('.plot').attr('clip-path', '');
    //Add toggle button
    addToggleAxesButton(index);
}

function plotCurvePlots() {
    setCurvePlotData(0);
    plotCurvePlot(0);
    setCurvePlotData(1);
    plotCurvePlot(1);

}

function addToggleAxesButton(index) {
    let htmlString =
        '<a id="toggleAxesBtn" rel="tooltip" class="modebar-btn" data-title="Toggle axes" data-toggle="false" data-gravity="n">' +
        '<svg width="16" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">' +
        '<g><g><path d="M846.7,153.7c-191.2-191.5-501.5-191.7-693-0.4c-191.5,191.2-191.7,501.5-0.4,693c191.2,191.5,501.5,191.7,693,0.4C1037.7,655.5,1037.9,345.2,846.7,153.7z M568.4,810.9c0,7.6-6.1,13.7-13.7,13.7H445.3c-7.6,0-13.7-6.1-13.7-13.7V404.6c0-7.6,6.1-13.7,13.7-13.7h109.5c7.6,0,13.7,6.1,13.7,13.7V810.9z M500,334.1c-43.8,0-79.4-35.6-79.4-79.4c0-43.8,35.6-79.4,79.4-79.4c43.8,0,79.4,35.6,79.4,79.4C579.4,298.5,543.8,334.1,500,334.1z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>' +
        '</svg>' +
        '</a>';
    let theElm = createElementFromHTML(htmlString);
    //Select the div
    let theDiv = d3.select(`#curvePlot${index + 1}`);
    //Set the opacity = 1 by default. Because by default there is no opacity attribute so we can't change it
    theElm.addEventListener('click', () => {
        //Process the toggling here.
        let theXAxisText = theDiv.select('.xaxislayer-above');
        let theYAxisText = theDiv.select('.yaxislayer-above');
        let theXLinesAbove = theDiv.select('.xlines-above.crisp');
        let theYLinesAbove = theDiv.select('.ylines-above.crisp');
        if (theXAxisText.attr("opacity") === null || +theXAxisText.attr("opacity") === 1) {
            theXAxisText.attr("opacity", 0);
            theYAxisText.attr("opacity", 0);
            theXLinesAbove.attr("opacity", 0);
            theYLinesAbove.attr("opacity", 0);
        } else {
            theXAxisText.attr("opacity", 1);
            theYAxisText.attr("opacity", 1);
            theXLinesAbove.attr("opacity", 1);
            theYLinesAbove.attr("opacity", 1);
        }
    }, false);
    let downloadBtn = theDiv.select('[data-title="Download plot as a png"]');
    if (!downloadBtn.empty()) {
        downloadBtn.node().parentNode.insertBefore(theElm, downloadBtn.node());
    }
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function plotScatter() {
    //Do the sorting.
    let scatterData = data.map(function (d) {
        let result = {};
        result[currentColumnNames[0]] = (d[currentColumnNames[0]].indexOf('<LOD') != -1) ? 0 : +d[currentColumnNames[0]];
        result[currentColumnNames[1]] = (d[currentColumnNames[1]].indexOf('<LOD') != -1) ? 0 : +d[currentColumnNames[1]];
        return result;
    });
    scatterData.sort(function (a, b) {
        return a[currentColumnNames[0]] - b[currentColumnNames[0]];
    });

    let xData = getColumn(scatterData, currentColumnNames[0]);
    let yData = getColumn(scatterData, currentColumnNames[1]);
    let model = linearRegiression(xData, yData);
    let yPredictedData = predict(xData, model);
    let scatterTraces = [{
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

    let layout = {
        title: currentColumnNames[0].split(" ")[0] + " vs. " + currentColumnNames[1].split(" ")[0] + ", correlation: " + getCurrentCorrelation(),
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
    let corcoef = ss.sampleCorrelation(elmConcentrations[0], elmConcentrations[1]);
    return Math.round(corcoef * 1000) / 1000;
}

//</editor-fold>
/*Creating the the selection box*/
function createByJson(div, jsonData, name, selectedIndex, changeHandler, width) {
    let msdd = $("#" + div).msDropDown({byJson: {data: jsonData, name: name, width: width}}).data("dd");
    msdd.set("selectedIndex", selectedIndex);
    let theOption = $("select[name='" + name + "']");
    theOption.change(changeHandler);
    return theOption;
}

function getAllElements() {
    let headers = d3.keys(data[0]);
    let elements = headers.filter(function (d) {
        return d.indexOf('Concentration') !== -1;
    });
    //Create option 1
    let jsonData = [];
    for (let i = 0; i < elements.length; i++) {
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
    //Update the curve plot
    setCurvePlotData(index);
    plotCurvePlot(index);
    //Reset the selection circles of the correlation graph.
    resetSelectionCircles();
}


