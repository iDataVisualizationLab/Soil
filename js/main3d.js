function main() {
    //<editor-fold desc="variables">
    let renderer, scene, camera, bgCube, stepHandle, gui;
    let elementInfo1;
    let elementInfo2;
    let nextElementIdx = 0;
    let chartPaddings = {
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 40,
        paddingBottom: 40
    };
    let colorOptions = ['categorical', 'interpolation'];
    let orderOptions = ['at the cut point', 'average horizontal cut', 'average vertical cut', 'none'];
    let viewOptions = {
        orderOption: 0,
        orderOptionText: 'at the cut point',
        colorOption: 1,//0 use categorical scale + intensity, 1 use scale interpolation.
        colorOptionText: 'interpolation'
    };
    let highlightedElementColor = 'gray';
    let orbitControls, dragControls;
    let verticalPlane, horizontalPlane;
    let verticalPlaneName = "verticalPlane";
    let horizontalPlaneName = "horizontalPlane";
    let stepHandleName = "stepHandle";
    let stepHandlerMargin = 2;
    let stepMargin = 2;
    let verticalChart;
    let horizontalChart;
    let elementColorScale;
    let pointSize = 0.05;
    let elementPlaneStepSize = 1;
    let pointClouds = [];
    let texts = [];
    let width, height, cameraViewWidth, cameraViewHeight, chartWidth, chartHeight;


    let bgCubeSize = {x: 4.6, y: 6.0, z: 1};
    let profileMargin = {left: 0.3, top: 0.5, right: 0.8, bottom: 0.8};

    let profileSize = {
        x: bgCubeSize.x - profileMargin.left - profileMargin.right,
        y: bgCubeSize.y - profileMargin.top - profileMargin.bottom,
        z: 1
    };
    let profilePosition = {
        x: -((bgCubeSize.x - profileSize.x) / 2 - profileMargin.left),
        y: (bgCubeSize.y - profileSize.y) / 2 - profileMargin.top,
        z: bgCubeSize.z / 2
    };
    let profileMinMax = {
        minX: -(bgCubeSize.x / 2) + profileMargin.left,
        maxX: (bgCubeSize.x / 2) - profileMargin.right,
        minY: -(bgCubeSize.y / 2) + profileMargin.bottom,
        maxY: (bgCubeSize.y / 2) - profileMargin.top
    }

    //</editor-fold>

    function setSizes() {
        width = window.innerWidth;
        height = window.innerHeight;

        chartHeight = height / 2;
        chartWidth = 10 * chartHeight / 13;
        cameraViewWidth = width - chartWidth;
        cameraViewHeight = height;


        let container1 = document.getElementById('container1');
        let container2 = document.getElementById('container2');
        let verticalChartContainer = document.getElementById('verticalChartContainer');
        let horizontalChartContainer = document.getElementById('horizontalChartContainer');
        let detailChart1 = document.getElementById('detailChart1');
        let detailChart2 = document.getElementById('detailChart2');


        let detailChartHeight = chartHeight - chartPaddings.paddingTop - chartPaddings.paddingBottom;
        let detailChartWidth = chartWidth - chartPaddings.paddingLeft - chartPaddings.paddingRight;
        let detailChartMargin = (cameraViewWidth - 2 * detailChartWidth) / 3;
        let detailChartTop1 = height - detailChartHeight - chartPaddings.paddingBottom;
        let detailChartTop2 = detailChartTop1;
        let detailChartLeft1 = detailChartMargin;
        let detailChartLeft2 = detailChartWidth + detailChartMargin * 2;


        d3.select(container1)
            .style('position', 'absolute')
            .style("left", "0px")
            .style("top", "0px")
            .style("width", cameraViewWidth + "px")
            .style("height", cameraViewHeight + "px");
        d3.select(container2).style('position', 'absolute')
            .style("left", `${cameraViewWidth}px`)
            .style("top", "0px")
            .style("width", chartWidth + "px")
            .style("height", cameraViewHeight + "px");
        d3.select(verticalChartContainer)
            .style('position', 'absolute')
            .style('left', '0px')
            .style('top', "0px")
            .style('width', chartWidth + "px")
            .style('height', chartHeight + "px");
        d3.select(horizontalChartContainer)
            .style('position', 'absolute')
            .style('left', '0px')
            .style('top', chartHeight + "px")
            .style('width', chartWidth + "px")
            .style('height', chartHeight + "px");

        d3.select(detailChart1)
            .style('position', 'absolute')
            .style('left', detailChartLeft1 + 'px')
            .style('top', detailChartTop1 + 'px')
            .style('width', detailChartWidth + "px")
            .style('height', detailChartHeight + "px")
            .style('border', '1px solid black')
        d3.select(detailChart2)
            .style('position', 'absolute')
            .style('left', detailChartLeft2 + 'px')
            .style('top', detailChartTop2 + 'px')
            .style('width', detailChartWidth + "px")
            .style('height', detailChartHeight + "px")
            .style('border', '1px solid black')

        //Redraw the charts in new size
    }

    //Load data
    readData("data/" + "Profile1", handleData);

    function sortPointCloudsAsIdxs(sortedIdxs) {
        let sortedPointClouds = [];
        sortedIdxs.forEach(idx => {
            sortedPointClouds.push(pointClouds[idx]);
        });
        pointClouds = sortedPointClouds;
    }

    function updatePointCloudPositions() {
        //Update point clouds position.
        for (let i = 0; i < pointClouds.length; i++) {
            pointClouds[i].position.set(profilePosition.x, profilePosition.y, profilePosition.z + i * elementPlaneStepSize + stepMargin);
        }
    }


    function handleData(data) {

        if (!contourDataProducer) {
            contourDataProducer = new ContourDataProducer(data);
        }

        elementColorScale = d3.scaleOrdinal().domain(contourDataProducer.allElements).range(d3.schemeCategory20);

        let numElms = contourDataProducer.allElements.length;
        // let numElms = 2;

        //Call the 3d part.
        init();
        hideLoader();
        animate();

        function setupScene() {
            let bgGeometry = new THREE.BoxGeometry(bgCubeSize.x, bgCubeSize.y, bgCubeSize.z);
            let bgMaterial = [
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color(1, 1, 1)
                }),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color(1, 1, 1)
                }),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color(1, 1, 1)
                }),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color(1, 1, 1)
                }),
                new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load('data/images/Profile1.png'),
                    // opacity: 0.5,
                    // transparent: true
                }),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color(1, 1, 1)
                })
            ];

            //The background cube
            bgCube = new THREE.Mesh(bgGeometry, bgMaterial);
            bgCube.position.set(0, 6, -numElms * elementPlaneStepSize);
            scene.add(bgCube);

            const aspect = (cameraViewWidth / cameraViewHeight);
            //
            camera = new THREE.PerspectiveCamera(60, aspect, 1, 100);

            //
            camera.position.set(20, bgCube.position.y, bgCube.position.z / 2);
            debugger
            camera.lookAt(0, bgCube.position.y, bgCube.position.z / 2);
            // camera.lookAt(-10, -10, bgCube.position.z / 2);

            //The cutting planes
            let planeMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(1, 1, 1)
            });


            let vpg = new THREE.BoxBufferGeometry(0.1, bgCubeSize.y + 0.2, bgCubeSize.z + 0.2);
            verticalPlane = new THREE.Mesh(vpg, planeMaterial.clone());
            verticalPlane.position.set(profilePosition.x, 0, 0);//This is relative to the Cube (since we are adding it to the cube)
            verticalPlane.name = verticalPlaneName;
            bgCube.add(verticalPlane);

            let hpg = new THREE.BoxBufferGeometry(bgCubeSize.x + 0.2, 0.1, bgCubeSize.z + 0.2);
            horizontalPlane = new THREE.Mesh(hpg, planeMaterial);
            horizontalPlane.position.set(0, profilePosition.y, 0);//This is relative to the Cube (since we are adding it to the cube)
            horizontalPlane.name = horizontalPlaneName;
            bgCube.add(horizontalPlane);


            //Setup the text
            let container1 = d3.select("#container1");
            for (let i = 0; i < numElms; i++) {
                let d3c = null;
                //TODO: This section changes the color options for the element plains
                if (viewOptions.colorOption === 0) {
                    d3c = d3.color(elementColorScale(contourDataProducer.allElements[i]));
                }
                pointClouds[i] = generatePointcloudForElmIdx(i, d3c, pointSize);
                pointClouds[i].name = contourDataProducer.allElements[i];
                //Change color scheme
                pointClouds[i].scale.set(profileSize.x, profileSize.y, profileSize.z);
                pointClouds[i].position.set(profilePosition.x, profilePosition.y, profilePosition.z + i * elementPlaneStepSize + stepMargin);
                bgCube.add(pointClouds[i]);

                //Setup the text
                let xy = pointCloud2TextCoordinate(pointClouds[i], camera, cameraViewWidth, cameraViewHeight);
                texts[i] = container1.append("div").attr("id", 'elmText' + i).style('position', 'absolute').style("left", xy.x + "px").style("top", xy.y + "px");
                texts[i].append('text').text(pointClouds[i].name);
            }

            //Set two elements as default

            elementInfo1 = setupElementScene1(pointClouds[0]);

            elementInfo2 = setupElementScene2(pointClouds[1]);

            //Set the handle for step size.
            let stepHandleGemoetry = new THREE.SphereBufferGeometry(0.2, 50, 50);
            let stepHandleMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('steelblue')});
            stepHandle = new THREE.Mesh(stepHandleGemoetry, stepHandleMaterial);
            stepHandle.name = stepHandleName;
            stepHandle.position.set(profilePosition.x, profilePosition.y, profilePosition.z + (numElms - 1) * elementPlaneStepSize + stepMargin + stepHandlerMargin);
            bgCube.add(stepHandle);

            let aLight = new THREE.AmbientLight(new THREE.Color(0.7, 0.7, 0.7), 1.0);
            scene.add(aLight);


        }

        function updateTextPositions() {
            texts.forEach((txt, i) => {
                let xy = pointCloud2TextCoordinate(pointClouds[i], camera, cameraViewWidth, cameraViewHeight);
                texts[i].text(pointClouds[i].name);
                texts[i].style('position', 'absolute').style("left", xy.x + "px").style("top", (xy.y - 10) + "px");
            });
        }

        function pointCloud2TextCoordinate(object, camera, width, height) {
            let pos = new THREE.Vector3();

            pos = pos.setFromMatrixPosition(object.matrixWorld);
            pos.x = pos.x - profileSize.x / 2;
            pos.y = pos.y + profileSize.y / 2;
            pos.z = pos.z + profileSize.z / 2;
            pos.project(camera);

            let widthHalf = width / 2;
            let heightHalf = height / 2;

            pos.x = (pos.x * widthHalf) + widthHalf;
            pos.y = -(pos.y * heightHalf) + heightHalf;
            pos.z = 0;
            return {x: pos.x, y: pos.y};
        }

        //Cut data
        function collectHorizontalCutData() {
            return collectCutData('horizontal');
        }

        function collectVerticalCutData() {
            return collectCutData('vertical');
        }

        function collectCutData(type) {
            //Collect cutting data.
            //Note that: Since x and y positions are the same for all graph, we hoist below lines out of the loop and take these values for the first one (index zero for custom data)
            let customData = pointClouds[0].geometry.customData;
            let yValues = Array.from(new Set(customData.gridData.y));
            let yIdx = d3.bisectLeft(yValues, customData.yScale.invert(((horizontalPlane.position.y - profilePosition.y) / profileSize.y)));
            let yVal = yValues[yIdx];
            let xValues = Array.from(new Set(customData.gridData.x));
            let xIdx = d3.bisectLeft(xValues, customData.xScale.invert(((verticalPlane.position.x - profilePosition.x) / profileSize.x)));
            let xVal = xValues[xIdx];
            let cutVal = type === 'horizontal' ? xVal : yVal;
            let val = type === 'horizontal' ? yVal : xVal;
            let cutData = {
                traces: [],
                type: type,
                cutValue: cutVal,
            };

            for (let i = 0; i < numElms; i++) {
                let cutElmData = {};
                customData = pointClouds[i].geometry.customData;
                let xVals = [];
                let yVals = [];
                let zVals = [];
                let values = type === 'horizontal' ? customData.gridData.y : customData.gridData.x;

                values.forEach((v, i) => {
                    if (v === val) {
                        xVals.push(customData.gridData.x[i]);
                        yVals.push(customData.gridData.y[i]);
                        zVals.push(customData.gridData.z[i]);
                    }
                });
                cutElmData.x = xVals;
                cutElmData.y = yVals;
                cutElmData.z = zVals;
                cutElmData.zScale = customData.zScale;//Store this scale (this is a scale all over the grid, not just this cut point)
                cutElmData.elementName = pointClouds[i].name;
                //TODO: If we take this individually, then each element has a different color scale
                if (viewOptions.colorOption === 1) {
                    cutElmData.colorScale = customData.gridData.colorScale;
                }
                cutData.traces.push(cutElmData);

            }
            //In both cases, z value becomes y.
            let chartData = cutData.traces.map((trace, traceIdx) => {
                return {
                    //If it is horizontal then the chart data we will put x for the x component, otherwise we put y for the x component
                    x: type === 'vertical' ? trace.z.map(z => trace.zScale(z)) : trace.x,
                    y: type === 'vertical' ? trace.y : trace.z.map(z => trace.zScale(z)),
                    series: trace.elementName,
                    type: 'area',
                    colorScale: trace.colorScale
                }
            });

            let sortedIdxs;
            let sortedChartData = [];
            if (viewOptions.orderOption === 0) { //Sort at the cut point
                if (type === 'horizontal') {
                    //Sort by the xIdx
                    let yValuesAtXIdx = chartData.map(d => d.y[xIdx]);
                    sortedIdxs = argSort(yValuesAtXIdx);
                } else {
                    //Sort by the yIdx
                    let xValuesAtYIdx = chartData.map(d => d.x[yIdx]);
                    sortedIdxs = argSort(xValuesAtYIdx);
                }
            } else if (viewOptions.orderOption === 1) {// Average horizontal cut
                if (type === 'horizontal') {
                    //Sort by the xIdx
                    let avgValues = chartData.map(d => d3.mean(d.y));
                    sortedIdxs = argSort(avgValues);
                }
            } else if (viewOptions.orderOption === 2) {// Average vertical cut
                if (type === 'vertical') {
                    //Sort by the xIdx
                    let avgValues = chartData.map(d => d3.mean(d.x));
                    sortedIdxs = argSort(avgValues);
                }
            }

            if (sortedIdxs) {//if there is sorted results
                sortedIdxs.reverse();
                for (let i = 0; i < sortedIdxs.length; i++) {
                    sortedChartData.push(chartData[sortedIdxs[i]]);
                }
                //TODO: Below two lines help also to sort the plane positions => Should separate these to a different place.
                sortPointCloudsAsIdxs(sortedIdxs);
                updatePointCloudPositions();
                chartData = sortedChartData;
            }


            cutData.traces = chartData;
            return cutData;
        }

        function updateChartByIdxs(sortedIdxs) {
            let sortedVerticalData = [];
            let sortedHorizontalData = [];
            sortedIdxs.forEach(idx => {
                sortedVerticalData.push(verticalChart.data[idx]);
                sortedHorizontalData.push(horizontalChart.data[idx]);
            });
            verticalChart.update(sortedVerticalData);
            horizontalChart.update(sortedHorizontalData);
        }

        function drawChart(cutData) {
            let type = cutData.type;
            let chartData = cutData.traces;
            let cutValue = cutData.cutValue;

            let annotations = type === 'horizontal' ? {
                'xLine': {
                    valueType: 'value',
                    x: cutValue,
                    color: horizontalChart ? horizontalChart.settings.annotations.xLine.color : 'gray',//Take current color
                    strokeWidth: 3
                }
            } : {
                'yLine': {
                    valueType: 'value',
                    y: cutValue,
                    color: verticalChart ? verticalChart.settings.annotations.yLine.color : 'gray',
                    strokeWidth: 3
                }
            };

            let theChart = type === 'horizontal' ? horizontalChart : verticalChart;
            if (!theChart) {
                let chartContainer = document.getElementById(`${type}ChartContainer`);
                debugger
                let chartSettings = {
                    noSvg: false,
                    showAxes: true,
                    width: chartWidth,
                    height: chartHeight,
                    ...chartPaddings,
                    colorScale: elementColorScale,
                    stepMode: {
                        chartSize: 50, // Height for each chart
                    },
                    annotations: annotations,
                    orientation: type,
                };
                //Config scales, we need to use one scale for all.
                let chartContentHeight = chartSettings.height - chartSettings.paddingTop - chartSettings.paddingBottom;
                let chartContentWidth = chartSettings.width - chartSettings.paddingLeft - chartSettings.paddingRight;
                chartSettings.stepMode.stepScale = d3.scaleLinear().domain([0, 1]).range([0, chartSettings.stepMode.chartSize]);

                //xScale and yScale here are actually for the z values, only set it depending on the orientation
                if (type === 'vertical') {
                    chartSettings.xScale = d3.scaleLinear().domain([0, 1]).range([0, chartContentWidth]);
                    chartSettings.yTickValues = Array.from(new Array(13), (_, i) => 0.5 + i);
                    chartSettings.yTickLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].reverse();
                    chartSettings.xAxisLabel = {text: "Element distributions"};
                    chartSettings.yAxisLabel = {text: "Horizons"};
                } else {
                    chartSettings.yScale = d3.scaleLinear().domain([0, 1]).range([chartContentHeight, 0]);
                    chartSettings.xTickValues = Array.from(new Array(10), (_, i) => 0.5 + i);
                    chartSettings.xTickLabels = Array.from(new Array(10), (_, i) => 1 + i);
                    chartSettings.xAxisLabel = {text: "Vertical slices"};
                    chartSettings.yAxisLabel = {text: "Element distributions"};
                }


                theChart = new LineChart(chartContainer, chartData, chartSettings);
                theChart.plot();
                if (type === 'vertical') {
                    verticalChart = theChart;//Store for next use
                } else {
                    horizontalChart = theChart;//Store for next use
                }

            } else {
                theChart.updateAnnotations(annotations);
                theChart.update(chartData);
            }
        }

        //<editor-fold desc="framework tasks">

        function init() {
            setSizes();

            let container1 = document.getElementById('container1');

            scene = new THREE.Scene();
            scene.background = new THREE.Color(1, 1, 1);


            gui = new dat.GUI({autoPlace: true});
            gui.domElement.id = 'gui';

            let folder = gui.addFolder('View options');

            folder.add(viewOptions, 'orderOptionText', orderOptions)
                .name('order')
                .onChange(function (value) {
                    switch (value) {
                        case orderOptions[0]: //At the cut point
                            viewOptions.orderOption = 0;
                            break;
                        case orderOptions[1]: //Average horizontal
                            viewOptions.orderOption = 1;
                            break;
                        case orderOptions[2]: //Average vertical
                            viewOptions.orderOption = 2;
                            break;
                        case orderOptions[3]: //None
                            viewOptions.orderOption = 3;
                            break;
                    }
                    //TODO: Change order options.
                    if (value !== 'none') {
                        updateCharts();//Update chart also updates the plane positions
                    }
                });

            //
            setupScene();

            //
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(cameraViewWidth, cameraViewHeight);
            container1.appendChild(renderer.domElement);
            d3.select(container1).select('canvas').style('outline', 'none');


            //
            window.addEventListener('resize', onWindowResize, false);

            //
            orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
            orbitControls.target.set(0, 0, bgCube.position.z / 2);
            orbitControls.update();

            //<editor-fold desc="For the drag controls">

            //Get the highlight color for the hover

            let highlightedElementColorV3 = pointClouds[0].geometry.attributes.color.clone();
            highlightedElementColorV3.array = highlightedElementColorV3.array.slice();//Deep copy for the array value
            let highlightedElementColorD3 = d3.color(highlightedElementColor);
            highlightedElementColorD3.r = highlightedElementColorD3.r / 255;
            highlightedElementColorD3.g = highlightedElementColorD3.g / 255;
            highlightedElementColorD3.b = highlightedElementColorD3.b / 255;
            for (let i = 0; i < highlightedElementColorV3.array.length; i += 3) {
                highlightedElementColorV3.array[i] = highlightedElementColorD3.r;
                highlightedElementColorV3.array[i + 1] = highlightedElementColorD3.g;
                highlightedElementColorV3.array[i + 2] = highlightedElementColorD3.b;
            }

            let prevColor;
            let prevObject;
            let elementPos;

            //cut planes drag controls
            let verticalPlanePos;
            let horizontalPlanePos;

            dragControls = new THREE.DragControls([verticalPlane, horizontalPlane, stepHandle, ...pointClouds], camera, renderer.domElement);
            //Add event listener to highlight dragged objects
            dragControls.addEventListener('hoveron', function (event) {
                if (event.object.name === verticalPlaneName || event.object.name === horizontalPlaneName || event.object.name === stepHandleName) {//Two planes + step handle
                    event.object.material.emissive.set(0xaa0000);
                    //Update annotations + disable highlight of trace series
                    if (event.object.name === verticalPlaneName) {
                        horizontalChart.settings.annotations.xLine.color = 'pink';
                    }
                    if (event.object.name === horizontalPlaneName) {
                        verticalChart.settings.annotations.yLine.color = 'pink';
                    }
                    verticalChart.highlightTraceSeries();
                    horizontalChart.highlightTraceSeries();
                } else { //Must be the element plain
                    //Reset prev object values => this step is to assure that we rest the previous one before setting any other one.
                    if (prevObject && prevColor) {
                        prevObject.geometry.attributes.color = prevColor;
                    }
                    //Set now
                    prevObject = event.object;
                    prevColor = prevObject.geometry.attributes.color.clone();
                    prevColor.array = prevColor.array.slice();//Deep copy
                    event.object.geometry.attributes.color = highlightedElementColorV3;
                    verticalChart.highlightTraceSeries(event.object.name, highlightedElementColor);
                    horizontalChart.highlightTraceSeries(event.object.name, highlightedElementColor);
                    //Also highlight the chart lines
                }
            });

            dragControls.addEventListener('hoveroff', function (event) {
                if (event.object.name === verticalPlaneName || event.object.name === horizontalPlaneName || event.object.name === stepHandleName) {//Two planes
                    event.object.material.emissive.set(0x000000);
                    //Update annotations + disable highlight of trace series
                    if (event.object.name === verticalPlaneName) {
                        horizontalChart.settings.annotations.xLine.color = 'gray';
                    }
                    if (event.object.name === horizontalPlaneName) {
                        verticalChart.settings.annotations.yLine.color = 'gray';
                    }
                    verticalChart.highlightTraceSeries();
                    horizontalChart.highlightTraceSeries();
                } else { //Element Planes
                    event.object.geometry.attributes.color = prevColor;
                    //Update annotations + disable highlight of trace series
                    if (event.object.name === verticalPlaneName) {
                        horizontalChart.settings.annotations.xLine.color = 'gray';
                    }
                    if (event.object.name === horizontalPlaneName) {
                        verticalChart.settings.annotations.yLine.color = 'gray';
                    }
                    verticalChart.highlightTraceSeries();
                    horizontalChart.highlightTraceSeries();
                }
            });

            dragControls.addEventListener('dragstart', function (event) {
                orbitControls.enabled = false;
                if (event.object.name === verticalPlaneName || event.object.name === horizontalPlaneName) {//Two planes
                    //Record the plane current positions
                    verticalPlanePos = verticalPlane.position.clone();
                    horizontalPlanePos = horizontalPlane.position.clone();
                } else {
                    //Copy the current position
                    elementPos = event.object.position.clone();
                    //Highlight the element
                    verticalChart.highlightTraceSeries(event.object.name, highlightedElementColor);
                    horizontalChart.highlightTraceSeries(event.object.name, highlightedElementColor);
                    //Set the investigating element.
                    nextElementIdx = (nextElementIdx + 1) % 2;
                    if (nextElementIdx === 0) {
                        elementInfo1 = setupElementScene1(event.object);
                    } else {
                        elementInfo2 = setupElementScene2(event.object);
                    }

                }

            });

            dragControls.addEventListener('drag', function (event) {
                if (event.object.name === verticalPlaneName || event.object.name === horizontalPlaneName) {//Two planes
                    if (event.object.name === verticalPlaneName) {
                        //Keep vertical plane y and z position.
                        verticalPlane.position.y = verticalPlanePos.y;
                        verticalPlane.position.z = verticalPlanePos.z;
                        //Check for max and min x
                        if (verticalPlane.position.x < 0) {
                            verticalPlane.position.x = Math.max(profileMinMax.minX, verticalPlane.position.x);
                        } else {
                            verticalPlane.position.x = Math.min(profileMinMax.maxX, verticalPlane.position.x);
                        }

                    } else if (event.object.name === horizontalPlaneName) {
                        //Keep horizontal plane x and z position.
                        horizontalPlane.position.x = horizontalPlanePos.x;
                        horizontalPlane.position.z = horizontalPlanePos.z;
                        //Check for max and min y
                        if (horizontalPlane.position.y < 0) {
                            horizontalPlane.position.y = Math.max(profileMinMax.minY, horizontalPlane.position.y);
                        } else {
                            horizontalPlane.position.y = Math.min(profileMinMax.maxY, horizontalPlane.position.y);
                        }

                    }
                    //TODO: We may not need to collect both cut points again, just collect one and resort the another one
                    //Update annotations + disable highlight of trace series
                    if (event.object.name === verticalPlaneName) {
                        horizontalChart.settings.annotations.xLine.color = 'pink';
                    }
                    if (event.object.name === horizontalPlaneName) {
                        verticalChart.settings.annotations.yLine.color = 'pink';
                    }
                    verticalChart.highlightTraceSeries();
                    horizontalChart.highlightTraceSeries();
                    updateCharts();
                } else { //Elements
                    //Highlight the element
                    //Update annotations + disable highlight of trace series
                    if (event.object.name === verticalPlaneName) {
                        horizontalChart.settings.annotations.xLine.color = 'gray';
                    }
                    if (event.object.name === horizontalPlaneName) {
                        verticalChart.settings.annotations.yLine.color = 'gray';
                    }
                    verticalChart.highlightTraceSeries(event.object.name, highlightedElementColor);
                    horizontalChart.highlightTraceSeries(event.object.name, highlightedElementColor);
                    //Keep x and y
                    event.object.position.x = elementPos.x;
                    event.object.position.y = elementPos.y;

                    if (event.object.name === stepHandleName) {
                        event.object.position.z = Math.max(event.object.position.z, stepHandlerMargin + stepMargin);
                        elementPlaneStepSize = (event.object.position.z - stepHandlerMargin - stepMargin) / (numElms);
                        updatePointCloudPositions();
                    } else {
                        //This place order by dragging.
                        let sortedIdxs = argSort(pointClouds.map(pc => pc.position.z));
                        let sortedPointClouds = [];
                        sortedIdxs.forEach(idx => {
                            sortedPointClouds.push(pointClouds[idx]);
                        });

                        pointClouds = sortedPointClouds;
                        //Update point clouds position.
                        for (let i = 0; i < pointClouds.length; i++) {

                            if (pointClouds[i].name !== event.object.name) {
                                pointClouds[i].position.set(profilePosition.x, profilePosition.y, profilePosition.z + i * elementPlaneStepSize + stepMargin);
                            }
                        }
                        //Now update the charts too
                        updateChartByIdxs(sortedIdxs);
                    }
                }
            });

            dragControls.addEventListener('dragend', function (event) {
                orbitControls.enabled = true;
                if (event.object.name === verticalPlaneName || event.object.name === horizontalPlaneName) {//Two planes
                } else {
                    updatePointCloudPositions();
                    //Disable highlight element
                    prevObject.geometry.attributes.color = prevColor;
                    verticalChart.highlightTraceSeries();
                    horizontalChart.highlightTraceSeries();
                }
            });

            //</editor-fold>
            //Draw the initial charts
            updateCharts();

        }

        function updateCharts() {
            let horizontalCutData = collectHorizontalCutData();
            drawChart(horizontalCutData);

            let verticalCutData = collectVerticalCutData();
            drawChart(verticalCutData);
        }

        function onWindowResize() {
            setSizes();
            const aspect = (cameraViewWidth / cameraViewHeight);
            renderer.setSize(cameraViewWidth, cameraViewHeight);
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
        }

        function animate() {
            requestAnimationFrame(animate);
            updateTextPositions();//TODO: should set this in the OribtControls event (shouldn't set here since is wasting resources).
            render();
        }

        function render() {
            renderer.setScissorTest(false);
            renderer.clear(true, true);
            renderer.setScissorTest(true);
            renderScene(scene, camera, document.getElementById('container1'));
            renderSceneInfo(elementInfo1);
            renderSceneInfo(elementInfo2);

        }

        //</editor-fold>
    }

    function makeScene(elem) {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(1, 1, 1);
        const fov = 45;
        const aspect = 2; //The canvas default
        const near = 0.1;
        const far = 100;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        camera.position.set(0, 0, 8);
        camera.lookAt(0, 0, 0);
        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }
        return {scene, camera, elem};
    }

    function setupElementScene1(pointCloud) {
        return setupElementScene(pointCloud, 'detailChart1');
    }

    function setupElementScene2(pointCloud) {
        return setupElementScene(pointCloud, 'detailChart2');
    }

    function setupElementScene(pointCloud, elementId) {
        pointCloud = pointCloud.clone();
        pointCloud.position.set(0, 0, 0);
        const sceneInfo = makeScene(document.querySelector(`#${elementId}`));
        if (sceneInfo.mesh) {
            sceneInfo.scene.remove(sceneInfo.mesh);
        } else if (pointCloud) {
            sceneInfo.scene.add(pointCloud);
            sceneInfo.mesh = pointCloud;
        }

        return sceneInfo;
    }

    function renderSceneInfo(sceneInfo) {
        const {scene, camera, elem} = sceneInfo;
        renderScene(scene, camera, elem);
    }

    function renderScene(scene, camera, elem) {
        // Get the viewport relative position of this element
        const {left, right, top, bottom, width, height} = elem.getBoundingClientRect();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const positiveYUpBottom = window.innerHeight - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);
        renderer.render(scene, camera);
    }
}

function argSort(arr) {
    let idxs = [];
    for (let i = 0; i < arr.length; i++) {
        idxs.push(i);
    }
    idxs.sort((a, b) => arr[a] - arr[b]);
    return idxs;
}