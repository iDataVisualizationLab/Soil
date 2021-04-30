//<editor-fold desc="setup the sizes for the layout">
let profiles = ['Large', 'Small', 'Range'];
let profileCodes = ['L', 'S', 'R'];
let defaultProfile = 'Large';
let profileOptions = {
    profileOptionText: defaultProfile
}
let gui;
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

    const legendRight = 10;
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
    gui.domElement.id = 'gui';
    d3.select('#gui')
        .style('position', 'absolute')
        .style('top', '0px')
        .style('left', '0px')
        .style('height', 'auto')
        .style('min-height', '25px')
        .style('width', '255px');


    gui.add(profileOptions, 'profileOptionText', profiles).name("Select profile")
        .onChange(function (value) {
            showLoader();
            handleProfileChange(profileCodes[profiles.indexOf(value)]);
        });

    gui.add(systemConfigurations, "helpEnabled").name("Help enabled");

    gui.close();//closed by default
    gui.domElement.onclose = (event) => {
        console.log(event);
    };
    gui.domElement.onopen = (event) => {
        console.log(event);
    };

    //
    d3.select("#parcoordsChart")
        .style('position', 'absolute')
        .style('left', pcLeft + 'px')
        .style('top', (pcTop + 10) + 'px')
        .style('width', pcWidth + "px")
        .style('height', pcHeight + "px")
        .style('outline', 'none')
        .classed("parcoords", true);
}

//</editor-fold>
