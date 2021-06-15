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
    const layoutObject = {
        volumeRenderer: {
            width: vrWidth,
            height: vrHeight
        },
    };
    return layoutObject
}

//</editor-fold>
