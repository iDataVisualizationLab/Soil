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
    const width = window.innerWidth / 2, height = 2 * window.innerHeight / 3;
    const margin = 10;

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
    const pcHeight = window.innerHeight - detailChartHeight - 4 * margin;
    const pcWidth = window.innerWidth - 2 * pcLeft - pcHeight;

    //Volume render element
    const vrLeft = pcWidth;
    const vrTop = pcTop + 30;
    const vrWidth = pcHeight + 10;
    const vrHeight = vrWidth - 40;


    const legendRight = 20;
    const legendTop = 0;

    const d3DetailChart1Container = d3.select('#detailChart1Container').data([1]).join('div')
        .attr("id", "detailChart1Container")
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
        .style("right", `${legendRight}px`)
        .style("top", `${legendTop}px`);

    d3DetailChart1Container
        .append("div")//for the selection
        .attr("id", "option1Container")
        .style("position", "absolute")
        .style("left", "10px")
        .style("top", "5px");
    //For the element texts
    // d3.selectAll('.location').data(new Array(13), (d, i)=>i)
    //     .join('div').attr('class', 'location');
    // function updateTextPositions(projectedPositions) {
    //     const locations = Object.keys(projectedPositions);
    //     d3DetailChart1Container.selectAll('.location').data(locations, (loc, i)=>i)
    //         .join('div').attr('class', 'location')
    //         .text(loc=>loc)
    //         .style('position', 'absolute')
    //         .style('left', loc=>projectedPositions[loc].x + 'px')
    //         .style('top', loc=>projectedPositions[loc].y + 'px');
    // }


    const d3DetailChart2Container = d3.select('#detailChart2Container').data([2]).join('div')
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
    gui.add(systemConfigurations, "helpEnabled").name("Help enabled");
    gui.add(systemConfigurations, "isOuterVisible").name("Outer visibility").onChange(function(value){
        handleOuterVisibility(systemConfigurations.isOuterVisible);
    });


    //
    d3.select("#parcoordsChart")
        .style('position', 'absolute')
        .style('left', pcLeft + 'px')
        .style('top', (pcTop + 10) + 'px')
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
        .style('border', '1px solid black');

    handleVolumeRendererLabelChange('Current element')

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
        detailChart1:{
            width: detailChartWidth,
            height: detailChartHeight
        }
    };
    layoutObject.handleVolumeRendererLabelChange = handleVolumeRendererLabelChange;
    //Expose this
    // layoutObject.updateTextPositions = updateTextPositions;
    return layoutObject;
}

//</editor-fold>
