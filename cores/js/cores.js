let profileDescriptions = {};
let renderer;
let clocks = [new THREE.Clock(), new THREE.Clock()];
let horizCutTranslationClock = new THREE.Clock();
const elementInfos = [];
let circleTextureHandlers, squareTextureHandlers;
const selectedElements = ["Ca Concentration", "Rb Concentration"];
let selectedVolumeRenderedElement = "Ca Concentration";
let vr;
let pc;
let allDimensions;
let theProfileHandler;
let timePassed = [0, 0];

showLoader();
handleProfileChange(profileCodes[profiles.indexOf(defaultProfile)]).then(profileHandler => {
    hideLoader();
    theProfileHandler = profileHandler;
});

async function handleProfileChange(profileName) {
    const profileToCanvasScale = d3.scaleLinear().domain([-0.5, 0.5]).range([0, 49]);
    const profileToXCutCanvasScale = d3.scaleLinear().domain([-0.5, 0.5]).range([0, 49]);
    const profileToYCutCanvasScale = profileToCanvasScale;
    const profileToZCutCanvasScale = d3.scaleLinear().domain([-0.5, 0.5]).range([49, 0]);

    //<editor-fold desc="Setting up data">
    //Setup data
    if (!profileDescriptions[profileName]) {
        profileDescriptions[profileName] = new ProfileDescription(`./data/${profileName}.csv`, systemConfigurations.profiles[profileName].locationNameMapping);
    }

    const elements = await profileDescriptions[profileName].getElements();
    const csvContent = await profileDescriptions[profileName].getCsvContent();
    const elementScalers = await profileDescriptions[profileName].getElementScalers();
    const ip = new Interpolator(csvContent, elements, systemConfigurations.depthNames, systemConfigurations.profiles[profileName].locationNameMapping, 50, 50, elementScalers, profileName);
    //If the selected elements is not in one of the element list, then set to Ca
    selectedElements.forEach((elm, i) => {
        if (elements.indexOf(elm) === -1) {
            selectedElements[i] = 'Ca Concentration';
        }
    });
    //The selector
    const elmSelectOptions = elements.map(d => {
        return { text: d, value: d }
    }).sort((a, b) => a.text.localeCompare(b.text));

    populateSelectors(elmSelectOptions, selectedElements, handleSelectionChange);

    //Color scale
    let colorScale = systemConfigurations.quantiles ? quantileColorScale : continuousColorScale;

    //Preload the data for this element
    circleTextureHandlers = selectedElements.map(elm => new HorizontalCanvasTextureHandler(ip, elm, colorScale, systemConfigurations.profiles[profileName].locationInfo.stepDistance));
    circleTextureHandlers.name = profileName;
    squareTextureHandlers = selectedElements.map(elm => new VerticalCanvasTextureHandler(ip, elm, colorScale, systemConfigurations.profiles[profileName].locationInfo.stepDistance));
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

    //<editor-fold desc="Menu">
    let soilPackages = new SoilPackages(elements.map(d => d.split(' ')[0]));
    //Clean the menu
    document.getElementById('elementSelectionList').innerHTML = "";
    const menuObj = createMenuStructure('elementSelectionList', soilPackages, elementSelectionChange);
    menuObj.mouseoverLabelHandler = function (elements, color) {
        pc.svg.selectAll('.dimension').filter(d => elements.indexOf(d) >= 0).selectAll('text').attr('fill', color);
    };
    menuObj.mouseleaveLabelHandler = function (elements, color) {
        pc.svg.selectAll('.dimension').filter(d => elements.indexOf(d) >= 0).selectAll('text').attr('fill', color);
    };

    function elementSelectionChange(evt) {
        let elm = evt.target.value;
        //Current dims
        let dims = pc.dimensions();
        if (evt.target.checked) {
            //The code is long here to keep the order
            const selected = Object.keys(dims);
            selected.push(elm);
            dims = {};
            Object.keys(allDimensions).forEach((key, i) => {
                if (selected.indexOf(key) >= 0) {
                    dims[key] = allDimensions[key];
                    dims[key].index = i; //This index helps to reorder the dimensions
                }
            });

        } else {
            //Remove dimension
            delete dims[elm];
        }

        //Update
        pc.dimensions(dims);
        //Re-setup dimensions (events and ticks etc).
        pc.setupDimensions();
        //Also reset the brush
        pc.brushChange();

    };
    //</editor-fold>

    //<editor-fold desc="Parallel Coordinates">
    profileDescriptions[profileName].getParCoordsData().then(data => {
        pc = createCoresParcoords(data, elementScalers, ip, colorScale);
        //save all dimensions for future use
        allDimensions = { ...pc.dimensions() };
        //Remove the others package by default
        let dims = pc.dimensions();
        soilPackages.others.elements.forEach(elm => {
            delete dims[elm];
        });
        pc.dimensions(dims);
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
            document.getElementById('detailChart1')
        );
    } else {
        vr.handleDataChange(ip.getInterpolatedData(selectedVolumeRenderedElement));
    }
    //Update the face
    const locFaceTx = new TextureHandler().createLocationTexture(systemConfigurations.profiles[profileName].locationNameMapping, 300);
    vr.changeLocationFace(locFaceTx);
    const depthFaceTx = new TextureHandler(undefined, undefined, undefined, systemConfigurations.profiles[profileName].locationInfo.stepDistance).createDepthTexture(300);
    vr.changeDepthFace(depthFaceTx);
    //</editor-fold>

    //<editor-fold desc="Selection box change handler">
    function handleLegendChange(elm, i) {
        if (systemConfigurations.quantiles) {
            const range = colorScale.range();
            legend({
                svgId: `detailElmText${i + 1}`,
                color: quantileColorScale,
                title: 'Quantiles',
                tickSize: 0,
                tickFormat: ",.1f",
                ticks: colorQuantiles.length,
                width: 400
            });
        } else {
            const elmScaler = elmScalers[elm];
            const range = colorScale.range();
            const domain = colorScale.domain().map(d => elmScaler.invert(d));
            legend({
                svgId: `detailElmText${i + 1}`,
                color: d3.scaleLinear(domain, range),
                title: 'Parts Per Million (PPM)',
                tickSize: 0,
                tickFormat: ",.0f",
                ticks: colorQuantiles.length,
                width: 400
            });
        }
    }

    function handleSelectionChange(event) {

        let optionIdx = ["option1", "option2"].indexOf(event.target.name);
        let elm = event.target.value;
        //Update the selected element
        selectedElements[optionIdx] = elm;
        //Update the texture
        circleTextureHandlers[optionIdx] = new HorizontalCanvasTextureHandler(ip, elm, colorScale, systemConfigurations.profiles[profileName].locationInfo.stepDistance);
        squareTextureHandlers[optionIdx] = new VerticalCanvasTextureHandler(ip, elm, colorScale, systemConfigurations.profiles[profileName].locationInfo.stepDistance);


        //handle the cutChange
        handleCutChange(elementInfos, optionIdx, squareTextureHandlers, circleTextureHandlers);
        //handle the XYZ cutChange
        handleXYZCutsChange(0);

        handleLegendChange(elm, optionIdx);
        //Handle also the xyz change


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

    function handleXCutChange(elementInfo, idx, textureHandlers) {
        const pos = elementInfo.the3Cuts.xCut.position.x;
        const posCanvas = Math.round(profileToXCutCanvasScale(pos));
        const texture = textureHandlers[idx].getXTexture(posCanvas);
        elementInfo.the3Cuts.handleXCutPosition(posCanvas, texture);
    }

    function handleYCutChange(elementInfo, idx, textureHandlers) {
        const pos = elementInfo.the3Cuts.yCut.position.y;
        const posCanvas = Math.round(profileToYCutCanvasScale(pos));
        const texture = textureHandlers[idx].getYTexture(posCanvas, systemConfigurations.profiles[profileName].locationNameMapping);
        elementInfo.the3Cuts.handleYCutPosition(posCanvas, texture);
    }

    function handleZCutChange(elementInfo, idx, textureHandlers) {
        const pos = elementInfo.the3Cuts.zCut.position.z;
        const posCanvas = Math.round(profileToZCutCanvasScale(pos));
        const texture = textureHandlers[idx].getZTexture(posCanvas);
        elementInfo.the3Cuts.handleZCutPosition(posCanvas, texture);
    }

    function getCutPosition(theObj, direction, timeLapse) {
        //Take one y position (that of the first one) to assure sync
        let cutPos = theObj.position[direction] + systemConfigurations.autoTranslationDirection[direction] * (timeLapse) * systemConfigurations.autoTranslateSpeed * 0.0025;

        if (cutPos > 0.5) {
            cutPos = 0.5;
            systemConfigurations.autoTranslationDirection[direction] = -systemConfigurations.autoTranslationDirection[direction];
        } else if (cutPos < -0.5) {
            cutPos = -0.5;
            systemConfigurations.autoTranslationDirection[direction] = -systemConfigurations.autoTranslationDirection[direction];
        }
        return cutPos;
    }

    function autoTranslateHorizCut() {
        let timeLapse = horizCutTranslationClock.getDelta();
        if (systemConfigurations.cylinderView) {
            const horizCutY = getCutPosition(elementInfos[0].theProfile.horizCut, "y", timeLapse);
            console.log(horizCutY);
            elementInfos.forEach((elementInfo, idx) => {
                elementInfo.theProfile.horizCut.position.y = horizCutY;
                handleHorizCutChange(elementInfo, idx, circleTextureHandlers);
            });
        } else {
            handleXYZCutsChange(timeLapse);
        }

        if (systemConfigurations.autoRotate) {
            requestAnimationFrame(autoTranslateHorizCut);
        }
    }

    function handleXYZCutsChange(timeLapse) {
        //Translate the three others
        const cutX = getCutPosition(elementInfos[0].the3Cuts.xCut, "x", timeLapse);
        elementInfos.forEach((elementInfo, idx) => {
            elementInfos[idx].the3Cuts.xCut.position.x = cutX;
            handleXCutChange(elementInfo, idx, circleTextureHandlers);
        });
        const cutY = getCutPosition(elementInfos[0].the3Cuts.yCut, "y", timeLapse);
        elementInfos.forEach((elementInfo, idx) => {
            elementInfos[idx].the3Cuts.yCut.position.y = cutY;
            handleYCutChange(elementInfo, idx, circleTextureHandlers);
        });
        const cutZ = getCutPosition(elementInfos[0].the3Cuts.zCut, "z", timeLapse);
        elementInfos.forEach((elementInfo, idx) => {
            elementInfos[idx].the3Cuts.zCut.position.z = cutZ;
            handleZCutChange(elementInfo, idx, circleTextureHandlers);
        });
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
        //Update the three cuts
        handleXYZCutsChange(0);
    }

    function init() {
        //Start of the creation code
        renderer = new THREE.WebGLRenderer({ antialias: true });
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
        //For auto rotate
        elementInfos.forEach(elementInfo => {
            elementInfo.orbitControls.update();
        });
        vr.orbitControls.update();

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
            let orbitControls = createOrbitControls(elementInfo.camera, domElement);

            //
            let prevAngle = 0;

            orbitControls.addEventListener("start", function () {
                prevAngle = orbitControls.getAzimuthalAngle();
                showLoader();
                timePassed[idx] = 0;
            });
            orbitControls.addEventListener("change", function () {
                if (systemConfigurations.cylinderView) {
                    const cutAngle = orbitControls.getAzimuthalAngle();
                    let texture = undefined;
                    elementInfo.theProfile.handleVertiCutAngle(cutAngle, texture);
                    //This line avoid it to rotate
                    elementInfo.theProfile.rotation.y = orbitControls.getAzimuthalAngle();

                    //Everytime we change we check for the delta
                    timePassed[idx] += clocks[idx].getDelta();
                    if (timePassed[idx] > 2.0) {
                        handleCutAngleChange(orbitControls, squareTextureHandlers, idx, elementInfo);
                        timePassed[idx] = 0;
                    }
                }
            });
            orbitControls.addEventListener("end", function () {
                handleCutAngleChange(orbitControls, squareTextureHandlers, idx, elementInfo);
                hideLoader();
            });
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
            let dragX, dragY, dragZ;
            const draggableObjects = [elementInfo.theProfile.horizCut, elementInfo.the3Cuts.xCut, elementInfo.the3Cuts.yCut, elementInfo.the3Cuts.zCut];
            const dragControls = new THREE.DragControls(draggableObjects, elementInfo.camera, domElement);
            //Remove the previous controls on domElement
            dragControls.addEventListener('hoveron', function (event) {
                if (systemConfigurations.cylinderView) {
                    if (event.object.name === elementInfo.theProfile.horizCut.name) {
                        elementInfos[idx].theProfile.setHighlightRingVisibility(true);
                    }
                }
            });
            dragControls.addEventListener('hoveroff', function (event) {
                elementInfos[idx].theProfile.setHighlightRingVisibility(false);
            });
            dragControls.addEventListener("dragstart", function (event) {
                //Disable orbit
                elementInfos.forEach(elementInfo => {
                    elementInfo.orbitControls.enabled = false;
                });
                vr.orbitControls.enabled = false;
                //Get the old position
                dragX = event.object.position.x;
                dragY = event.object.position.y;
                dragZ = event.object.position.z;
            });
            dragControls.addEventListener("drag", function (event) {
                //Check boundary
                if (event.object.position.x > 0.5) {
                    event.object.position.x = 0.5;
                }
                if (event.object.position.x < -0.5) {
                    event.object.position.x = -0.5;
                }
                if (event.object.position.y > 0.5) {
                    event.object.position.y = 0.5;
                }
                if (event.object.position.y < -0.5) {
                    event.object.position.y = -0.5;
                }
                if (event.object.position.z > 0.5) {
                    event.object.position.z = 0.5;
                }
                if (event.object.position.z < -0.5) {
                    event.object.position.z = -0.5;
                }

                //horizCut and yCut
                if (event.object.name === elementInfo.theProfile.horizCut.name || event.object.name === elementInfo.the3Cuts.yCut.name) {
                    event.object.position.x = dragX;
                    event.object.position.z = dragZ;
                    dragY = event.object.position.y;
                    const horizCutCanvasY = Math.round(profileToYCutCanvasScale(dragY));
                    elementInfos.forEach((elementInfo, idx) => {
                        const horizTexture = circleTextureHandlers[idx].getTextureWithLocation(horizCutCanvasY, systemConfigurations.profiles[profileName].locationNameMapping);
                        const yCutTexture = circleTextureHandlers[idx].getYTexture(horizCutCanvasY, systemConfigurations.profiles[profileName].locationNameMapping, systemConfigurations.profiles[profileName].stepDistance);
                        elementInfo.theProfile.handleHorizCutPosition(dragY, horizTexture);
                        elementInfo.the3Cuts.handleYCutPosition(dragY, yCutTexture);
                    });
                }
                //xCut
                if (event.object.name === elementInfo.the3Cuts.xCut.name) {
                    event.object.position.y = dragY;
                    event.object.position.z = dragZ;
                    dragX = event.object.position.x;
                    const cutCanvasX = Math.round(profileToXCutCanvasScale(dragX));
                    elementInfos.forEach((elementInfo, idx) => {
                        const texture = circleTextureHandlers[idx].getXTexture(cutCanvasX);
                        elementInfo.the3Cuts.handleXCutPosition(dragX, texture);
                    });
                }
                //zCut
                if (event.object.name === elementInfo.the3Cuts.zCut.name) {
                    event.object.position.x = dragX;
                    event.object.position.y = dragY;
                    dragZ = event.object.position.z;
                    const cutCanvasZ = Math.round(profileToZCutCanvasScale(dragZ));
                    elementInfos.forEach((elementInfo, idx) => {
                        const texture = circleTextureHandlers[idx].getZTexture(cutCanvasZ);
                        elementInfo.the3Cuts.handleZCutPosition(dragZ, texture);
                    });
                }
            });
            dragControls.addEventListener("dragend", function (event) {
                elementInfos.forEach(elementInfo => {
                    elementInfo.orbitControls.enabled = true;
                });
                vr.orbitControls.enabled = true;
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

    //Exposing functionalities
    this.handleCutChange = handleCutChange;
    this.handleLegendChange = handleLegendChange;
    this.autoTranslateHorizCut = autoTranslateHorizCut;
    this.handleXYZCutsChange = handleXYZCutsChange;
    return this;
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

function handleXCutVisibility(isVisible) {
    elementInfos[0].the3Cuts.setXCutVisibility(isVisible);
    elementInfos[1].the3Cuts.setXCutVisibility(isVisible);
}

function handleYCutVisibility(isVisible) {
    elementInfos[0].the3Cuts.setYCutVisibility(isVisible);
    elementInfos[1].the3Cuts.setYCutVisibility(isVisible);
}

function handleZCutVisibility(isVisible) {
    elementInfos[0].the3Cuts.setZCutVisibility(isVisible);
    elementInfos[1].the3Cuts.setZCutVisibility(isVisible);
}

function removeAxes(name) {
    pc.removeAxes([name]);
}
