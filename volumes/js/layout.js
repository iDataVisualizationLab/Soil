//<editor-fold desc="setup the sizes for the layout">
let profiles = ['Large', 'Small', 'Range'];
let profileCodes = ['L', 'S', 'R'];
let defaultProfile = 'Range';
let profileOptions = {
    profileOptionText: defaultProfile
}
let gui;
const layoutObject = setupLayout();

function setupLayout() {
    const margin = 15;
    //Parallel coordinates
    const pcLeft = margin;
    const pcTop = margin;
    const pcHeight = window.innerHeight / 2 - 2 * margin;
    const pcWidth = window.innerWidth - 2 * pcLeft;

    //The GUI
    //Setup the gui
    gui = new dat.GUI({autoPlace: true});
    gui.close();//closed by default
    gui.domElement.id = 'gui';

    gui.add(systemConfigurations, "quantiles")
        .name('Qualitative view')
        .onChange(function (value) {
            handleQualitativeViewChange(value);
        });

    gui.add(systemConfigurations, "autoRotateSpeed", 1, 50).name("Rotation speed")
        .onChange(function (value) {
            systemConfigurations.autoRotateSpeed = value;
            for (let i = 0; i < profileCodes.length; i++) {
                const profileName = profileCodes[i];
                vr = vrs[profileName];
                vr.orbitControls.autoRotateSpeed = value;
            }

        });
    gui.add(systemConfigurations, "helpEnabled").name("Help enabled");

    //Parcoords Chart
    d3.select("#parcoordsChart")
        .style('position', 'absolute')
        .style('left', pcLeft + 'px')
        .style('top', (pcTop) + 'px')
        .style('width', pcWidth + "px")
        .style('height', pcHeight + "px")
        .style('outline', 'none')
        .classed("parcoords", true);

    //The volume renderer
    const vrTop = pcHeight + 2 * margin;
    const vrWidth = (window.innerWidth - margin) / profiles.length - margin;
    const vrHeight = pcHeight;
    const volumeRendererDivs = d3.selectAll('.volumeRenderer').data(profileCodes, d => d).join('div')
        .attr('class', '.volumeRenderer')
        .attr('id', d => 'volumeRenderer' + d)
        .style('position', 'absolute')
        .style('left', (d, i) => (margin + i * (vrWidth + margin)) + 'px')
        .style('top', (vrTop) + 'px')
        .style('width', vrWidth + 'px')
        .style('height', vrHeight + 'px')
        .style('outline', 'none')
        .style('border', '1px solid black').on("mousemove", (event, d) => {
            if (systemConfigurations.helpEnabled) {
                const msg = `The drag and orbit controls are on the bottom-left panel.`;
                showTip(event, msg);
            }
        })
        .on("mouseout", () => {
            hideTip();
        });
    //For each one of them add a label
    volumeRendererDivs.append('div')
        .style('position', 'absolute')
        .style('margin-left', 5 + 'px')
        .text(d => `Profile: ${profiles[profileCodes.indexOf(d)]}`);

    //For each of them add a Google Earth link
    //for the Google Earth link
    const googleEarthLinkDivs = volumeRendererDivs
        .append('div')
        .attr('id', 'googleEarthLinkDiv')
        .style('position', 'absolute')
        .style('right', '10px')
        .style('bottom', '5px')
        .style('text-align', 'center');


    const googleEarthLinks = googleEarthLinkDivs.append('a')
        .attr("id", "googleEarthLink")
        .attr("href", "#")
        .attr('target', '_blank');


    googleEarthLinks.append('label').attr("for", 'googleEarthLink')
        .text('Google Earth')
        .style('decoration', 'none');

    googleEarthLinks.append('img')
        .attr('src', 'data/images/googleearthlocation.png')
        .style('width', '2em')
        .style('height', '2em');

    googleEarthLinks.attr("href", d => {
        const profileName = d;
        const locationInfo = systemConfigurations.profiles[profileName].locationInfo
        const lat = locationInfo.lat;
        const long = locationInfo.long;
        const distance = locationInfo.distance;
        const googleEarthUrl = `https://earth.google.com/web/@${lat},${long},${distance}d`;
        return googleEarthUrl;
    });

    //Create a place for view options
    d3.select('body').append('div') //Div for the view options
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
            for (let i = 0; i < profileCodes.length; i++) {
                const profileName = profileCodes[i];
                const vr = vrs[profileName];
                vr.changeRenderStyle(event.target.value);
            }
        }
    });
    createCheckBox('volumeRenderViewOptions', 'Location helper', 'locationHelper', false, (event) => {
        for (let i = 0; i < profileCodes.length; i++) {
            const profileName = profileCodes[i];
            const vr = vrs[profileName];
            vr.setLocationHelperVisiblity(event.target.checked);
        }
    });
    //Auto rotate
    createCheckBox('volumeRenderViewOptions', 'Auto rotate', 'autoRotate', false, (event) => {
        systemConfigurations.autoRotate = event.target.checked;
        handleAutoRotationChange(systemConfigurations.autoRotate);
    });

    function handleAutoRotationChange(autoRotate) {
        for (let i = 0; i < profileCodes.length; i++) {
            const profileName = profileCodes[i];
            const vr = vrs[profileName];
            vr.orbitControls.autoRotate = autoRotate;
        }
    }


    function handleQualitativeViewChange(value) {
        //Change VR color scheme
        profileCodes.forEach(profileName => {
            const vr = vrs[profileName];
            vr.changeColorType(value ? 'quantiles' : 'continuous');
        });

        // //Change the legend
        // selectedElements.forEach((elm, idx) => {
        //     theProfileHandler.handleLegendChange(elm, idx);
        // });
        //Change the parallel coordinate color scale
        pc.changeColorScale(value ? quantileColorScale : continuousColorScale);
    }


    const layoutObject = {
        volumeRenderer: {
            width: vrWidth,
            height: vrHeight
        },
    };
    return layoutObject
}

//</editor-fold>
