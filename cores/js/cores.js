showLoader();
//<editor-fold desc="setup the sizes for the divs">
let detailChart1 = document.getElementById('detailChart1');
let detailChart2 = document.getElementById('detailChart2');
let parcoordsChart = document.getElementById('parcoordsChart');
setupSizes();

function setupSizes() {
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

    d3.select(detailChart1)
        .style('position', 'absolute')
        .style('left', detailChartLeft1 + 'px')
        .style('top', detailChartTop1 + 'px')
        .style('width', detailChartWidth + "px")
        .style('height', detailChartHeight + "px")
        .style('border', '1px solid black')
        .style('outline', 'none')
        .append('svg')//for the text
        .attr("id", "detailElmText1")
        .attr("class", "elementText")
        .style("position", "absolute")
        .style("left", "10px")
        .style("top", "5px");

    d3.select(detailChart2)
        .style('position', 'absolute')
        .style('left', detailChartLeft2 + 'px')
        .style('top', detailChartTop2 + 'px')
        .style('width', detailChartWidth + "px")
        .style('height', detailChartHeight + "px")
        .style('border', '1px solid black')
        .style('outline', 'none')
        .append('svg')//for the text
        .attr("id", "detailElmText2")
        .attr("class", "elementText")
        .style("position", "absolute")
        .style("left", "10px")
        .style("top", "5px");
}

//</editor-fold>

const selectedElements = ["Ca Concentration", "Al Concentration"];
let camera, renderer, textureLoader;
let threeDScences;
let elementInfo1;
let elementInfo2;
const profileToCanvasScale = d3.scaleLinear().domain([-0.5, 0.5]).range([0, 49]);

main();

async function main() {

    //<editor-fold desc="Setting up data">
    //Setup data
    const pd = new ProfileDescription('./data/L.csv', locationNameMapping);
    const elements = await pd.getElements();
    const csvContent = await pd.getCsvContent();
    const elementScalers = await pd.getElementScalers();
    const ip = new Interpolator(csvContent, elements, depthNames, locationNameMapping, 50, 50, elementScalers);

    // const colorScale = new d3.scaleLinear().domain([0, 1]).range(['blue', 'red']);
    const colorScale = new d3.scaleLinear().domain([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]).range(colors10);
    //Preload the data for this element
    const hths = selectedElements.map(elm => new HorizontalCanvasTextureHandler(ip, elm, colorScale));
    const vths = selectedElements.map(elm => new VerticalCanvasTextureHandler(ip, elm, colorScale));
    const elmScalers = await pd.getElementScalers();
    //Set the text and the legend
    selectedElements.forEach((elm, i) => {
        const elmScaler = elmScalers[elm];
        const legendDomain = colorScale.domain().map(d=>elmScaler.invert(d));
        const range = colorScale.range();
        legend({
            svgId: `detailElmText${i + 1}`,
            color: d3.scaleThreshold(legendDomain, range),
            title: elm,
            tickSize: 0,
            tickFormat: ",.0f",
            ticks: 10,
            width: 400
        })
        d3.select().text(elm);
    });
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
        elementInfo1 = threeDScences.setupElementScene1(elementInfo1);
        elementInfo2 = threeDScences.setupElementScene2(elementInfo2);

        //Currently for simplicity we only setup the controls on the first chart and sync to the second one
        setupOrbitControls(elementInfo1, elementInfo2, detailChart1, vths);
        setupDragControls(elementInfo1, elementInfo2, detailChart1, hths);

        //Setup the default cuts
        const cutAngle = elementInfo1.orbitControls.getAzimuthalAngle()
        let texture1 = vths[0].getTexture(0);
        elementInfo1.theProfile.handleVertiCutAngle(cutAngle, texture1);
        let texture2 = vths[1].getTexture(0);
        elementInfo2.theProfile.handleVertiCutAngle(cutAngle, texture2);
        //
        const horizCutPlaneY = elementInfo1.horizCutPlane.position.y;
        const horizCutCanvasY = Math.round(profileToCanvasScale(horizCutPlaneY));
        texture1 = hths[0].getTexture(horizCutCanvasY);
        elementInfo1.theProfile.handleHorizCutPosition(horizCutPlaneY, texture1);
        texture2 = hths[1].getTexture(horizCutCanvasY);
        elementInfo2.theProfile.handleHorizCutPosition(horizCutPlaneY, texture2);


        render();
        hideLoader();
    }

    function render() {
        renderer.setScissorTest(false);
        renderer.clear(true, true);
        renderer.setScissorTest(true);
        threeDScences.renderSceneInfo(elementInfo1);
        threeDScences.renderSceneInfo(elementInfo2);
        requestAnimationFrame(render);
    }

    function setupOrbitControls(elementInfo1, elementInfo2, domElement, vths) {
        setupOrbitControlsPerElement(elementInfo1, domElement, vths[0]);
        setupOrbitControlsPerElement(elementInfo2, domElement, vths[1]);
    }

    function setupOrbitControlsPerElement(elementInfo, domElement, vth) {
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
        orbitControls.addEventListener("start", function () {
            showLoader();
        });
        orbitControls.addEventListener("change", function () {
            const cutAngle = orbitControls.getAzimuthalAngle();
            elementInfo.theProfile.handleVertiCutAngle(cutAngle, undefined);
            elementInfo.theProfile.rotation.y = orbitControls.getAzimuthalAngle();
        });
        orbitControls.addEventListener("end", function () {
            const cutAngle = orbitControls.getAzimuthalAngle();
            const texture = vth.getTexture(cutAngle);
            hideLoader();
            elementInfo.theProfile.handleVertiCutAngle(cutAngle, texture);
            elementInfo.theProfile.rotation.y = orbitControls.getAzimuthalAngle();
        });
        elementInfo.orbitControls = orbitControls;
    }

    function setupDragControls(elementInfo1, elementInfo2, domElement, hths) {
        setupDragControlsPerElement(elementInfo1, domElement, handleStart, handleEnd, handleHorizontalCutPositions);
        setupDragControlsPerElement(elementInfo2, domElement, handleStart, handleEnd, handleHorizontalCutPositions);

        function handleStart() {
            elementInfo1.orbitControls.enabled = false;
            elementInfo2.orbitControls.enabled = false;
        }

        function handleEnd() {
            elementInfo1.orbitControls.enabled = true;
            elementInfo2.orbitControls.enabled = true;
        }

        function handleHorizontalCutPositions(horizCutPlaneX, horizCutPlaneY, horizCutPlaneZ) {
            elementInfo1.horizCutPlane.position.x = horizCutPlaneX;
            elementInfo1.horizCutPlane.position.y = horizCutPlaneY;
            elementInfo1.horizCutPlane.position.z = horizCutPlaneZ;
            elementInfo2.horizCutPlane.position.x = horizCutPlaneX;
            elementInfo2.horizCutPlane.position.y = horizCutPlaneY;
            elementInfo2.horizCutPlane.position.z = horizCutPlaneZ;
            const horizCutCanvasY = Math.round(profileToCanvasScale(horizCutPlaneY));
            const texture1 = hths[0].getTexture(horizCutCanvasY);
            elementInfo1.theProfile.handleHorizCutPosition(horizCutPlaneY, texture1);
            const texture2 = hths[1].getTexture(horizCutCanvasY);
            elementInfo2.theProfile.handleHorizCutPosition(horizCutPlaneY, texture2);
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
            .alpha(0.2)
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
                const msg = `Click ${d} label to color by ${d} values<br/>Drag ${d} label to reorder ${d} axis<br/>Brush on the ${d} axis to filter by ${d} values`;
                showTip(event, msg);
            })
            .on("mouseout", () => {
                hideTip();
            });

        // update color
        function change_color(dimension) {
            pc.svg.selectAll(".dimension")
                .style("font-weight", "normal")
                .filter(function (d) {
                    return d == dimension;
                })
                .style("font-weight", "bold");

            pc.color(d => colorScale(d[dimension])).render();
        }
    });

    //</editor-fold>
}
