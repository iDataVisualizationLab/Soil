let profileDescriptions = {};
let renderer;
const elementInfos = [];
const selectedElements = ["Ca Concentration", "Rb Concentration"];
let selectedVolumeRenderedElement = "Ca Concentration";
let vr;
let pc;
let allDimensions;
showLoader();
handleProfileChange('L').then(_ => {
    hideLoader();
});

async function handleProfileChange(profileName) {
    const profileToCanvasScale = d3.scaleLinear().domain([-0.5, 0.5]).range([0, 49]);

    //<editor-fold desc="Setting up data">
    //Setup data
    if (!profileDescriptions[profileName]) {
        profileDescriptions[profileName] = new ProfileDescription(`./data/${profileName}.csv`, systemConfigurations.profiles[profileName].locationNameMapping);
    }

    const elements = await profileDescriptions[profileName].getElements();
    const csvContent = await profileDescriptions[profileName].getCsvContent();
    const elementScalers = await profileDescriptions[profileName].getElementScalers();
    const ip = new Interpolator(csvContent, elements, systemConfigurations.depthNames, systemConfigurations.profiles[profileName].locationNameMapping, 50, 50, elementScalers);
    //If the selected elements is not in one of the element list, then set to Ca
    selectedElements.forEach((elm, i) => {
        if (elements.indexOf(elm) === -1) {
            selectedElements[i] = 'Ca Concentration';
        }
    });
    //The selector
    const elmSelectOptions = elements.map(d => {
        return {text: d, value: d}
    }).sort((a, b) => a.text.localeCompare(b.text));

    populateSelectors(elmSelectOptions, selectedElements, handleSelectionChange);

    const colorScale = new d3.scaleLinear().domain([0., 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]).range(colors10);


    //Preload the data for this element
    let circleTextureHandlers = selectedElements.map(elm => new HorizontalCanvasTextureHandler(ip, elm, colorScale));
    circleTextureHandlers.name = profileName;
    let squareTextureHandlers = selectedElements.map(elm => new VerticalCanvasTextureHandler(ip, elm, colorScale));
    squareTextureHandlers.name = profileName;

    const elmScalers = await profileDescriptions[profileName].getElementScalers();
    //Set the text and the legend
    selectedElements.forEach((elm, i) => {
        handleLegendChange(elm, i);
    });


    //</editor-fold>

    //<editor-fold desc="The Google Earth Link">
    const locationInfo = systemConfigurations.profiles[profileName].locationInfo;
    layoutObject.changeGoogleEarthLocation(locationInfo.lat, locationInfo.long, locationInfo.distance);
    //</editor-fold>

    //<editor-fold desc="menu">
    let soilPackages = new SoilPackages(elements.map(d => d.split(' ')[0]));
    //Clean the menu
    document.getElementById('elementSelectionList').innerHTML = "";
    createMenuStructure('elementSelectionList', soilPackages, elementSelectionChange);

    function elementSelectionChange(evt) {
        let elm = evt.target.value;
        //Current dims
        const dims = pc.dimensions();
        if (evt.target.checked) {
            //Added dimension
            dims[elm] = allDimensions[elm];
        } else {
            //Remove dimension
            delete dims[elm];
        }
        //Update
        pc.dimensions(dims);

    };
    //</editor-fold>

    //<editor-fold desc="Parallel Coordinates">
    profileDescriptions[profileName].getParCoordsData().then(data => {
        pc = createCoresParcoords(data, elementScalers, ip, colorScale);
        //save all dimensions for future use
        allDimensions = {...pc.dimensions()};
    });

    //</editor-fold>

    //<editor-fold desc="The volume renderer">
    // const ip1 = new Interpolator(csvContent, elements, systemConfigurations.depthNames, systemConfigurations.profiles[profileName].locationNameMapping, 50, 100, elementScalers);
    if (!vr) {
        vr = createVolumeRenderer(
            document.getElementById('volumeRenderer'),
            ip.getInterpolatedData(selectedVolumeRenderedElement),
            layoutObject.volumeRenderer.width,
            layoutObject.volumeRenderer.height,
            50,
            50,
            colorScale,
            gui
        );
    } else {
        vr.handleDataChange(ip.getInterpolatedData(selectedVolumeRenderedElement));
    }
    //Update the face
    const faceTx = new TextureHandler().createLocationTexture(systemConfigurations.profiles[profileName].locationNameMapping, 300);
    vr.changeLocationFace(faceTx);
    //</editor-fold>

    //<editor-fold desc="Selection box change handler">
    function handleLegendChange(elm, i) {
        const elmScaler = elmScalers[elm];
        const legendDomain = colorScale.domain().map(d => elmScaler.invert(d));
        const range = colorScale.range();
        legend({
            svgId: `detailElmText${i + 1}`,
            color: d3.scaleThreshold(legendDomain, range),
            title: 'Parts Per Million (PPM)',
            tickSize: 0,
            tickFormat: ",.0f",
            ticks: 10,
            width: 400
        });
        d3.select().text(elm);
    }

    function handleSelectionChange(event) {
        let optionIdx = ["option1", "option2"].indexOf(event.target.name);
        let elm = event.target.value;
        //Update the selected element
        selectedElements[optionIdx] = elm;
        //Update the texture
        circleTextureHandlers[optionIdx] = new HorizontalCanvasTextureHandler(ip, elm, colorScale);
        squareTextureHandlers[optionIdx] = new VerticalCanvasTextureHandler(ip, elm, colorScale);
        //handle the cutChange
        handleCutChange(elementInfos, optionIdx, squareTextureHandlers, circleTextureHandlers);
        handleLegendChange(elm, optionIdx);
    }

    function handleCutChange(elementInfos, idx, squareTextureHandlers, circleTextureHandlers) {
        //Angle cut
        const elementInfo = elementInfos[idx]
        handleCutAngleChange(elementInfo.orbitControls, squareTextureHandlers, idx, elementInfo);

        //Horizontal cut
        handleHorizCutChange(elementInfo, idx, circleTextureHandlers);
    }

    function handleHorizCutChange(elementInfo, idx, circleTextureHandlers) {
        // const horizCutPlaneY = elementInfo.horizCutPlane.position.y;
        const horizCutPlaneY = elementInfo.theProfile.horizCut.position.y;
        const horizCutCanvasY = Math.round(profileToCanvasScale(horizCutPlaneY));
        // const texture = circleTextureHandlers[idx].getTexture(horizCutCanvasY);
        const texture = circleTextureHandlers[idx].getTextureWithLocation(horizCutCanvasY, systemConfigurations.profiles[profileName].locationNameMapping);

        elementInfo.theProfile.handleHorizCutPosition(horizCutPlaneY, texture);
    }

    function handleCutAngleChange(orbitControls, squareTextureHandlers, idx, elementInfo) {
        const cutAngle = orbitControls.getAzimuthalAngle();
        const texture = squareTextureHandlers[idx].getTexture(cutAngle);
        elementInfo.theProfile.handleVertiCutAngle(cutAngle, texture);
        elementInfo.theProfile.rotation.y = orbitControls.getAzimuthalAngle();
    }

    //</editor-fold>

    //<editor-fold desc="3D Cores">
    let threeDScences;

    function setupDataFor3DScenes(squareTextureHandlers, circleTextureHandlers) {
        //Currently for simplicity we only setup the controls on the first chart and sync to the second one
        let controlDiv = document.getElementById('detailChart1');

        setupOrbitControls(elementInfos, controlDiv, squareTextureHandlers);
        setupDragControls(elementInfos, controlDiv, circleTextureHandlers);
        //Setup the default cuts
        elementInfos.forEach((elementInfo, idx) => {
            handleCutChange(elementInfos, idx, squareTextureHandlers, circleTextureHandlers);
        });
        //Also update texture
        elementInfos.forEach((elementInfo) => {
            elementInfo.theProfile.updateTopCapTexture(profileName);
        });
    }

    function init() {
        //Start of the creation code
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff);
        renderer.domElement.id = "rendererDomElement";
        document.body.appendChild(renderer.domElement);

        //Setup the two views (scenes)
        threeDScences = new ThreeDScences(renderer, profileName);
        threeDScences.setupElementScenes(elementInfos);

        setupDataFor3DScenes(squareTextureHandlers, circleTextureHandlers);

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

    function setupOrbitControls(elementInfos, domElement, squareTextureHandlers) {
        elementInfos.forEach((elementInfo, idx) => {
            setupOrbitControlsPerElement(elementInfos, domElement, squareTextureHandlers, idx);
        });

        function setupOrbitControlsPerElement(elementInfos, domElement, squareTextureHandlers, idx) {

            const elementInfo = elementInfos[idx];
            //Remove existing one
            if (elementInfo.orbitControls) {
                elementInfo.orbitControls.enabled = false;
                elementInfo.orbitControls.dispose();
            }
            let orbitControls = new THREE.OrbitControls(elementInfo.camera, domElement);
            orbitControls.enableZoom = false;
            orbitControls.enablePan = false;

            //
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
                handleCutAngleChange(orbitControls, squareTextureHandlers, idx, elementInfo);
                hideLoader();
            });
            orbitControls.autoRotate = true;
            elementInfo.orbitControls = orbitControls;
        }
    }

    function setupDragControls(elementInfos, domElement, circleTextureHandlers) {
        elementInfos.forEach((_, idx) => {
            setupDragControlsPerElement(elementInfos, idx, domElement, circleTextureHandlers);
        });

        function setupDragControlsPerElement(elementInfos, idx, domElement, circleTextureHandlers) {
            const elementInfo = elementInfos[idx];
            //Disable the existing one
            if (elementInfo.dragControls) {
                elementInfo.dragControls.deactivate();
                elementInfo.dragControls.dispose();
            }
            let horizCutPlaneX, horizCutPlaneY, horizCutPlaneZ;
            const draggableObjects = [elementInfo.theProfile.horizCut];
            const dragControls = new THREE.DragControls(draggableObjects, elementInfo.camera, domElement);
            //Remove the previous controls on domElement
            dragControls.addEventListener('hoveron', function (event) {
                event.object.material.emissive.set(0xaa0000);
            });
            dragControls.addEventListener('hoveroff', function (event) {
                event.object.material.emissive.set(0x000000);
            });
            dragControls.addEventListener("dragstart", function (event) {
                //Disable orbit
                elementInfos.forEach(elementInfo => {
                    elementInfo.orbitControls.enabled = false;
                });
                horizCutPlaneX = event.object.position.x;
                horizCutPlaneY = event.object.position.y;
                horizCutPlaneZ = event.object.position.z;
                event.object.material.emissive.set(0x000000);
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
                const horizCutCanvasY = Math.round(profileToCanvasScale(horizCutPlaneY));
                elementInfos.forEach((elementInfo, idx) => {
                    // elementInfo.horizCutPlane.position.x = horizCutPlaneX;
                    // elementInfo.horizCutPlane.position.y = horizCutPlaneY;
                    // elementInfo.horizCutPlane.position.z = horizCutPlaneZ;
                    const texture = circleTextureHandlers[idx].getTextureWithLocation(horizCutCanvasY, systemConfigurations.profiles[profileName].locationNameMapping);
                    elementInfo.theProfile.handleHorizCutPosition(horizCutPlaneY, texture);
                });
            });
            dragControls.addEventListener("dragend", function (event) {
                elementInfos.forEach(elementInfo => {
                    elementInfo.orbitControls.enabled = true;
                });
            });
            elementInfo.dragControls = dragControls;
        }

    }

    if (!renderer) {
        init();
    } else {
        setupDataFor3DScenes(squareTextureHandlers, circleTextureHandlers);
        hideLoader();
    }
    //</editor-fold>
}

function handleOuterVisibility(isVisible) {
    elementInfos[0].theProfile.setOuterVisibility(isVisible);
    elementInfos[1].theProfile.setOuterVisibility(isVisible);
}

function handleVertiCutVisibility(isVisible) {
    elementInfos[0].theProfile.setVertiCutVisibility(isVisible);
    elementInfos[1].theProfile.setVertiCutVisibility(isVisible);
}

function handleHorizCutVisibility(isVisible) {
    elementInfos[0].theProfile.setHorizCutVisibility(isVisible);
    elementInfos[1].theProfile.setHorizCutVisibility(isVisible);
}

function removeAxes(name) {
    pc.removeAxes([name]);
}
