//<editor-fold desc="setup the sizes for the layout">
let profiles = ['Large', 'Small', 'Range'];
let profileCodes = ['L', 'S', 'R'];
let defaultProfile = 'Large';
let profileOptions = {
    profileOptionText: defaultProfile
}
let gui;
const layoutObject = setupLayout();

function setupLayout() {
    const width = window.innerWidth / 2, height = window.innerHeight / 2;
    const margin = 15;

    //Detail charts
    const detailChartLeft1 = margin;
    const detailChartTop1 = window.innerHeight - height + margin;
    const detailChartWidth = width - 2 * margin;
    const detailChartHeight = height - 2 * margin;

    const detailChartLeft2 = width + margin;
    const detailChartTop2 = detailChartTop1;

    //Parallel coordinates
    const pcLeft = margin;
    const pcTop = margin;
    const pcHeight = window.innerHeight - detailChartHeight - 2 * margin;
    const pcWidth = window.innerWidth - 2 * pcLeft - pcHeight;

    //Volume render element
    const vrLeft = pcWidth + 5;
    const vrTop = pcTop + 30;
    const vrWidth = pcHeight + 10;
    const vrHeight = vrWidth - 60;


    const legendRight = 20;
    const legendTop = 0;

    const d3DetailChart1Container = d3.select('body').select('#detailChart1Container').data([1]).join('div')
        .attr("id", "detailChart1Container")
        .style('position', 'absolute')
        .style('left', detailChartLeft1 + 'px')
        .style('top', detailChartTop1 + 'px')
        .style('width', detailChartWidth + "px")
        .style('height', detailChartHeight + "px")
        .on("mousemove", (event, d) => {
            if (systemConfigurations.helpEnabled) {
                const msg = `Drag the horizontal cut up/down to change the depth.<br/>
                            Drag left/right on this panel to change the vertical cut angle.<br/>
                            Planes' visibility toggles are available at the bottom.`;
                showTip(event, msg);
            }
        })
        .on("mouseout", () => {
            hideTip();
        });

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
        .style("right", `${legendRight}px`)
        .style("top", `${legendTop}px`);

    d3DetailChart1Container
        .append("div")//for the selection
        .attr("id", "option1Container")
        .style("position", "absolute")
        .style("left", "10px")
        .style("top", "5px");

    d3DetailChart1Container
        .append("div")//for the view options
        .attr("id", "viewOptions")
        .style("position", "absolute")
        .style("left", "10px")
        .style("bottom", "5px");

    createCheckBox('viewOptions', 'Outer visibility', 'outerVisibility', true, (event) => {
        systemConfigurations.isOuterVisible = event.target.checked;
        handleOuterVisibility(systemConfigurations.isOuterVisible);
    });
    createCheckBox('viewOptions', 'Horizontal cut visibility', 'horizCutVisibility', true, (event) => {
        systemConfigurations.isHorizCutVisible = event.target.checked;
        handleHorizCutVisibility(systemConfigurations.isHorizCutVisible);
    });
    createCheckBox('viewOptions', 'Vertical cut visibility', 'vertiCutVisibility', true, (event) => {
        systemConfigurations.isVertiCutVisible = event.target.checked;
        handleVertiCutVisibility(systemConfigurations.isVertiCutVisible);
    });
    createCheckBox('viewOptions', 'Auto rotate', 'autoRotate', false, (event) => {
        systemConfigurations.autoRotate = event.target.checked;
        handleAutoRotationChange(systemConfigurations.autoRotate);
    });

    function handleAutoRotationChange(autoRotate) {
        elementInfos.forEach(elementInfo => {
            elementInfo.orbitControls.autoRotate = autoRotate;
        });
        vr.orbitControls.autoRotate = autoRotate;
        //Change also the height
        horizCutTranslationClock.getDelta();//Reset the time
        theProfileHandler.autoTranslateHorizCut();

    }

    //for the Google Earth link
    const googleEarthLinkDiv = d3DetailChart1Container
        .append('div')
        .attr('id', 'googleEarthLinkDiv')
        .style('position', 'absolute')
        .style('right', '10px')
        .style('bottom', '5px')
        .style('text-align', 'center');


    const googleEarthLink = googleEarthLinkDiv.append('a')
        .attr("id", "googleEarthLink")
        .attr("href", "#")
        .attr('target', '_blank');


    googleEarthLink.append('label').attr("for", 'googleEarthLink')
        .text('View on Google Earth')
        .style('decoration', 'none');

    googleEarthLink.append('img')
        .attr('src', 'data/images/googleearthlocation.png')
        .style('width', '2em')
        .style('height', '2em');

    function changeGoogleEarthLocation(lat, lon, distance) {
        const googleEarthUrl = `https://earth.google.com/web/@${lat},${lon},${distance}d`;
        googleEarthLink.attr("href", googleEarthUrl);
    }

    const d3DetailChart2Container = d3.select('body').select('#detailChart2Container').data([2]).join('div')
        .attr("id", "detailChart2Container")
        .style('position', 'absolute')
        .style('left', detailChartLeft2 + 'px')
        .style('top', detailChartTop2 + 'px')
        .style('width', detailChartWidth + "px")
        .style('height', detailChartHeight + "px")
        .on("mousemove", (event, d) => {
            if (systemConfigurations.helpEnabled) {
                const msg = `The drag and orbit controls are on the left panel.`;
                showTip(event, msg);
            }
        })
        .on("mouseout", () => {
            hideTip();
        });

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
        .style("right", `${legendRight}px`)
        .style("top", `${legendTop}px`);

    d3DetailChart2Container
        .append('div')//for the selection
        .attr("id", "option2Container")
        .style("position", "absolute")
        .style("left", "10px")
        .style("top", "5px");


    //Setup the gui
    gui = new dat.GUI({autoPlace: true});
    gui.close();//closed by default
    gui.domElement.id = 'gui';
    gui.add(profileOptions, 'profileOptionText', profiles).name("Select profile")
        .onChange(function (value) {
            showLoader();
            handleProfileChange(profileCodes[profiles.indexOf(value)]);
        });

    gui.add(systemConfigurations, "quantiles")
        .name('Qualitative view')
        .onChange(function (value) {
            handleQualitativeViewChange(value);
        });

    gui.add(systemConfigurations, "autoRotateSpeed", 1, 50).name("Rotation speed")
        .onChange(function (value) {
            systemConfigurations.autoRotateSpeed = value;
            elementInfos.forEach(elementInfo => {
                elementInfo.orbitControls.autoRotateSpeed = value;
            });
            vr.orbitControls.autoRotateSpeed = value;
        });
    gui.add(systemConfigurations, "autoTranslateSpeed", 1, 50).name("Translation speed");

    gui.add(systemConfigurations, "helpEnabled").name("Help enabled");

    function handleQualitativeViewChange(value) {
        //Change VR color scheme
        vr.changeColorType(value ? 'quantiles' : 'continuous');
        //Change the profile color scheme
        circleTextureHandlers.forEach(handler => {
            handler.changeColorScale(value ? quantileColorScale : continuousColorScale);
        });
        squareTextureHandlers.forEach(handler => {
            handler.changeColorScale(value ? quantileColorScale : continuousColorScale);
        });
        theProfileHandler.handleCutChange(elementInfos, 0, squareTextureHandlers, circleTextureHandlers);
        theProfileHandler.handleCutChange(elementInfos, 1, squareTextureHandlers, circleTextureHandlers);
        //Change the legend
        selectedElements.forEach((elm, idx) => {
            theProfileHandler.handleLegendChange(elm, idx);
        });
        //Change the parallel coordinate color scale
        pc.changeColorScale(value ? quantileColorScale : continuousColorScale);

    }

    //
    d3.select("#parcoordsChart")
        .style('position', 'absolute')
        .style('left', pcLeft + 'px')
        .style('top', (pcTop - 10) + 'px')
        .style('width', pcWidth + "px")
        .style('height', pcHeight + "px")
        .style('outline', 'none')
        .classed("parcoords", true);
    //The volume renderer
    d3.select('#volumeRenderer').data([1]).join('div')
        .attr('id', 'volumeRenderer')
        .style('position', 'absolute')
        .style('left', vrLeft + 'px')
        .style('top', (vrTop) + 'px')
        .style('width', vrWidth + 'px')
        .style('height', vrHeight + 'px')
        .style('outline', 'none')
        .style('border', '1px solid black')
        .append('div') //Div for the view options
        .attr("id", 'volumeRenderViewOptions')
        .style('position', 'absolute')
        .style('left', margin + 'px')
        .style('bottom', 5 + 'px');


    const renderStyleOptions = [{label: 'iso', value: 'iso', id: 'isoRenderStyle'}, {
        label: 'mip',
        value: 'mip',
        id: 'mipRenderStyle'
    }];
    createRadioButtons('volumeRenderViewOptions', renderStyleOptions, 'renderStyle', 'iso', (event) => {
        if (event.target.checked) {
            vr.changeRenderStyle(event.target.value);
        }
    });
    createCheckBox('volumeRenderViewOptions', 'Location helper', 'locationHelper', false, (event) => {
        vr.setLocationHelperVisiblity(event.target.checked);
    });

    handleVolumeRendererLabelChange('Current element');

    function handleVolumeRendererLabelChange(text) {
        d3.select('#volumeRendererLabel')
            .style('position', 'absolute')
            .style('left', vrLeft + 'px')
            .style('top', '20px')
            .on('mousemove', (event, d) => {
                if (systemConfigurations.helpEnabled) {
                    showTip(event, "The color scale is on the parallel coordinate<br/>" +
                        "Click on the elmenet on the parallel coordinate to change the selection.<br/>");
                }
            })
            .on('mouseleave', (event, d) => {
                hideTip();
            })
            .node().innerHTML = text;
    }

    const layoutObject = {
        volumeRenderer: {
            width: vrWidth,
            height: vrHeight
        },
        detailChart1: {
            width: detailChartWidth,
            height: detailChartHeight
        }
    };
    layoutObject.handleVolumeRendererLabelChange = handleVolumeRendererLabelChange;
    layoutObject.changeGoogleEarthLocation = changeGoogleEarthLocation;
    //Expose this
    // layoutObject.updateTextPositions = updateTextPositions;
    return layoutObject;
}

//</editor-fold>
