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
    const vrWidth = (window.innerWidth-margin) / profiles.length - margin;
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
            elementInfos.forEach(elementInfo => {
                elementInfo.orbitControls.autoRotateSpeed = value;
            });
            vr.orbitControls.autoRotateSpeed = value;
        });
    gui.add(systemConfigurations, "autoTranslateSpeed", 1, 50).name("Translation speed");

    gui.add(systemConfigurations, "helpEnabled").name("Help enabled");

    function handleQualitativeViewChange(value) {
        //Change VR color scheme
        profileCodes.forEach(profileName=>{
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
