showLoader();
//<editor-fold desc="setup the sizes for the layout">

const defaultElementIndexes = [0, 0];
let detailChart1Container = document.getElementById('detailChart1Container');
let detailChart2Container = document.getElementById('detailChart2Container');

let parcoordsChart = document.getElementById('parcoordsChart');
setupLayout();

function setupLayout() {
    const width = window.innerWidth / 2, height = 2 * window.innerHeight / 3;
    const margin = 10;
    const detailChartLeft1 = margin;
    const detailChartTop1 = window.innerHeight - height + margin;
    const detailChartWidth = width - 2 * margin;
    const detailChartHeight = height - 2 * margin;

    const detailChartLeft2 = width + margin;
    const detailChartTop2 = detailChartTop1;

    const pcLeft = margin;
    const pcTop = margin;
    const pcWidth = window.innerWidth - 2 * pcLeft;
    const pcHeight = window.innerHeight - detailChartHeight - 4 * margin;

    d3.select(parcoordsChart)
        .style('position', 'absolute')
        .style('left', pcLeft + 'px')
        .style('top', pcTop + 'px')
        .style('width', pcWidth + "px")
        .style('height', pcHeight + "px")
        // .style('border', '1px solid black')
        .style('outline', 'none')

    const d3DetailChart1Container = d3.select(detailChart1Container)
        .style('position', 'absolute')
        .style('left', detailChartLeft1 + 'px')
        .style('top', detailChartTop1 + 'px')
        .style('width', detailChartWidth + "px")
        .style('height', detailChartHeight + "px");

    d3DetailChart1Container.append('div')
        .attr('id', 'detailChart1')
        .style('position', 'absolute')
        .style('left', 0 + 'px')
        .style('top', 0 + 'px')
        .style('width', detailChartWidth + "px")
        .style('height', detailChartHeight + "px")
        .style('border', '1px solid black')
        .style('outline', 'none')
        .append('svg')//for the legends
        .attr("id", "detailElmText1")
        .attr("class", "elementText")
        .style("position", "absolute")
        .style("left", "10px")
        .style("top", "25px");

    d3DetailChart1Container
        .append("div")//for the selection
        .attr("id", "option1Container")
        .style("position", "absolute")
        .style("left", "10px")
        .style("top", "5px");

    const d3DetailChart2Container = d3.select(detailChart2Container)
        .style('position', 'absolute')
        .style('left', detailChartLeft2 + 'px')
        .style('top', detailChartTop2 + 'px')
        .style('width', detailChartWidth + "px")
        .style('height', detailChartHeight + "px");

    d3DetailChart2Container.append('div')
        .attr('id', 'detailChart2')
        .style('position', 'absolute')
        .style('left', 0 + 'px')
        .style('top', 0 + 'px')
        .style('width', detailChartWidth + "px")
        .style('height', detailChartHeight + "px")
        .style('border', '1px solid black')
        .style('outline', 'none')
        .append('svg')//for the legend
        .attr("id", "detailElmText2")
        .attr("class", "elementText")
        .style("position", "absolute")
        .style("left", "10px")
        .style("top", "25px");

    d3DetailChart2Container
        .append('div')//for the selection
        .attr("id", "option2Container")
        .style("position", "absolute")
        .style("left", "10px")
        .style("top", "5px");

}

//</editor-fold>

const selectedElements = ["Fe Concentration", "Al Concentration"];
let camera, renderer, textureLoader;
let threeDScences;
const elementInfos = [];
const profileToCanvasScale = d3.scaleLinear().domain([-0.5, 0.5]).range([0, 49]);
let hths;//horizontal texture handler
let vths;//vertical texture handler

main();

async function main() {

    //<editor-fold desc="Setting up data">
    //Setup data
    const pd = new ProfileDescription('./data/L.csv', locationNameMapping);
    const elements = await pd.getElements();
    const csvContent = await pd.getCsvContent();
    const elementScalers = await pd.getElementScalers();
    const ip = new Interpolator(csvContent, elements, depthNames, locationNameMapping, 50, 50, elementScalers);

    //The selector
    const msddOptions = elements.map(d => {
        return {text: d, value: d}
    }).sort((a, b) => a.text.localeCompare(b.text));

    populateSelectors(msddOptions, selectedElements, handleSelectionChange, 200);
    // const colorScale = new d3.scaleLinear().domain([0, 1]).range(['blue', 'red']);
    const colorScale = new d3.scaleLinear().domain([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]).range(colors10);


    //Preload the data for this element
    hths = selectedElements.map(elm => new HorizontalCanvasTextureHandler(ip, elm, colorScale));
    vths = selectedElements.map(elm => new VerticalCanvasTextureHandler(ip, elm, colorScale));
    const elmScalers = await pd.getElementScalers();
    //Set the text and the legend
    selectedElements.forEach((elm, i) => {
        handleLegendChange(elm, i);
    });

    function handleLegendChange(elm, i) {
        const elmScaler = elmScalers[elm];
        const legendDomain = colorScale.domain().map(d => elmScaler.invert(d));
        const range = colorScale.range();
        legend({
            svgId: `detailElmText${i + 1}`,
            color: d3.scaleThreshold(legendDomain, range),
            // title: elm,
            tickSize: 0,
            tickFormat: ",.0f",
            ticks: 10,
            width: 400
        })
        d3.select().text(elm);
    }

    //</editor-fold>

    //<editor-fold desc="Selection box change handler">
    function handleSelectionChange(event) {
        let optionIdx = ["option1", "option2"].indexOf(event.target.name);
        let elm = event.target.value;
        //Update the selected element
        selectedElements[optionIdx] = elm;
        //Update the texture
        hths[optionIdx] = new HorizontalCanvasTextureHandler(ip, elm, colorScale);
        vths[optionIdx] = new VerticalCanvasTextureHandler(ip, elm, colorScale);
        //handle the cutChange
        handleCutChange(elementInfos, optionIdx);
        handleLegendChange(elm, optionIdx);
    }

    function handleCutChange(elementInfos, idx) {
        //Angle cut
        const elementInfo = elementInfos[idx]
        const cutAngle = elementInfo.orbitControls.getAzimuthalAngle();
        let texture = vths[idx].getTexture(cutAngle);
        elementInfo.theProfile.handleVertiCutAngle(cutAngle, texture);

        //Horizontal cut
        const horizCutPlaneY = elementInfo.horizCutPlane.position.y;
        const horizCutCanvasY = Math.round(profileToCanvasScale(horizCutPlaneY));
        texture = hths[idx].getTexture(horizCutCanvasY);
        elementInfo.theProfile.handleHorizCutPosition(horizCutPlaneY, texture);
    }

    //</editor-fold>
    //<editor-fold desc="3D Cores">
    init();

    function init() {
        textureLoader = new THREE.TextureLoader();
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff);
        document.body.appendChild(renderer.domElement);

        //Setup the two views (scenes)
        threeDScences = new ThreeDScences(renderer);
        threeDScences.setupElementScenes(elementInfos);

        //Currently for simplicity we only setup the controls on the first chart and sync to the second one
        let orbitControlDiv = document.getElementById('detailChart1');
        setupOrbitControls(elementInfos, orbitControlDiv, vths);
        setupDragControls(elementInfos, orbitControlDiv, hths);

        //Setup the default cuts

        elementInfos.forEach((elementInfo, idx) => {
            handleCutChange(elementInfos, idx);
        });


        render();
        hideLoader();
    }

    function render() {
        renderer.setScissorTest(false);
        renderer.clear(true, true);
        renderer.setScissorTest(true);
        elementInfos.forEach(elementInfo => {
            threeDScences.renderSceneInfo(elementInfo);
        });
        requestAnimationFrame(render);
    }

    function setupOrbitControls(elementInfos, domElement, vths) {
        elementInfos.forEach((elementInfo, idx) => {
            setupOrbitControlsPerElement(elementInfo, domElement, vths, idx);
        });

        function setupOrbitControlsPerElement(elementInfo, domElement, vths, idx) {
            let orbitControls = new THREE.OrbitControls(elementInfo.camera, domElement);
            orbitControls.enableZoom = false;
            orbitControls.enablePan = false;
            orbitControls.maxPolarAngle = Math.PI / 2;

            //
            orbitControls.minAzimuthAngle = -Math.PI / 2;
            orbitControls.maxAzimuthAngle = Math.PI / 2;

            //
            orbitControls.rotateSpeed = 0.3;

            //
            let prevAngle = 0;
            orbitControls.addEventListener("start", function () {
                prevAngle = orbitControls.getAzimuthalAngle();
                showLoader();
            });

            orbitControls.addEventListener("change", function () {
                const cutAngle = orbitControls.getAzimuthalAngle();
                let texture = undefined;
                elementInfo.theProfile.handleVertiCutAngle(cutAngle, texture);
                elementInfo.theProfile.rotation.y = orbitControls.getAzimuthalAngle();
            });
            orbitControls.addEventListener("end", function () {
                const cutAngle = orbitControls.getAzimuthalAngle();
                const texture = vths[idx].getTexture(cutAngle);
                hideLoader();
                elementInfo.theProfile.handleVertiCutAngle(cutAngle, texture);
                elementInfo.theProfile.rotation.y = orbitControls.getAzimuthalAngle();
            });
            elementInfo.orbitControls = orbitControls;
        }
    }

    function setupDragControls(elementInfos, domElement, hths) {
        elementInfos.forEach(elementInfo => {
            setupDragControlsPerElement(elementInfo, domElement, handleStart, handleEnd, handleHorizontalCutPositions);
        });

        function handleStart() {
            elementInfos.forEach(elementInfo => {
                elementInfo.orbitControls.enabled = false;
            });
        }

        function handleEnd() {
            elementInfos.forEach(elementInfo => {
                elementInfo.orbitControls.enabled = true;
            });
        }

        function handleHorizontalCutPositions(horizCutPlaneX, horizCutPlaneY, horizCutPlaneZ) {
            const horizCutCanvasY = Math.round(profileToCanvasScale(horizCutPlaneY));
            elementInfos.forEach((elementInfo, idx) => {
                elementInfo.horizCutPlane.position.x = horizCutPlaneX;
                elementInfo.horizCutPlane.position.y = horizCutPlaneY;
                elementInfo.horizCutPlane.position.z = horizCutPlaneZ;
                const texture = hths[idx].getTexture(horizCutCanvasY);
                elementInfo.theProfile.handleHorizCutPosition(horizCutPlaneY, texture);
            });
        }

        function setupDragControlsPerElement(elementInfo, domElement, handleStart, handleEnd, handleHorizontalCutPositions) {
            let horizCutPlaneX, horizCutPlaneY, horizCutPlaneZ;
            const draggableObjects = [elementInfo.horizCutPlane];
            const dragControls = new THREE.DragControls(draggableObjects, elementInfo.camera, domElement);
            dragControls.addEventListener('hoveron', function (event) {
                event.object.material.emissive.set(0xaa0000);
            });
            dragControls.addEventListener('hoveroff', function (event) {
                event.object.material.emissive.set(0x000000);
            });
            dragControls.addEventListener("dragstart", function (event) {
                handleStart();
                horizCutPlaneX = event.object.position.x;
                horizCutPlaneY = event.object.position.y;
                horizCutPlaneZ = event.object.position.z;

            });
            dragControls.addEventListener("drag", function (event) {
                event.object.position.x = horizCutPlaneX;
                event.object.position.z = horizCutPlaneZ;
                if (event.object.position.y > 0.5) {
                    event.object.position.y = 0.5;
                }
                if (event.object.position.y < -0.5) {
                    event.object.position.y = -0.5;
                }
                horizCutPlaneY = event.object.position.y;
                handleHorizontalCutPositions(horizCutPlaneX, horizCutPlaneY, horizCutPlaneZ);
            });
            dragControls.addEventListener("dragend", function (event) {
                handleEnd();
            });
        }
    }

    //</editor-fold>

    //<editor-fold desc="Parallel Coordinates">
    pd.getParCoordsData().then(data => {
        let pc = parcoords()("#parcoordsChart");
        pc
            .data(data)
            .smoothness(0.05)
            .alpha(0.3)
            .margin({top: 24, left: 10, bottom: 12, right: 10})
            .render()
            .reorderable()
            .brushMode("1D-axes")  // enable brushing
            .interactive();

        change_color('Ca');

        // click label to activate coloring
        pc.svg.selectAll(".dimension")
            .on("click", change_color)
            .selectAll(".label")
            .style("font-size", "14px");
        d3.selectAll('.dimension')
            .on("mouseover", (event, d) => {
                if (systemConfigurations.helpEnabled) {
                    const msg = `Click ${d} label to color by ${d} values<br/>Drag ${d} label to reorder ${d} axis<br/>Brush on the ${d} axis to filter by ${d} values`;
                    showTip(event, msg);
                }
            })
            .on("mouseout", () => {
                hideTip();
            });
        pc.flipAxisAndUpdatePCP("Depth");

        // update color
        function change_color(dimension) {
            if (dimension !== "Location" && dimension !== "Depth") {
                pc.svg.selectAll(".dimension")
                    .style("font-weight", "normal")
                    .filter(function (d) {
                        return d == dimension;
                    })
                    .style("font-weight", "bold");

                pc.color(d => colorScale(elementScalers[`${dimension} Concentration`](d[dimension]))).render();
            }
        }
    });

    //</editor-fold>
}


