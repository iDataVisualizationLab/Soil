let plotMargins = {
    l: 20,
    r: 20,
    t: 20,
    b: 20,
    pad: 0,
    autoexpand: false
};

function plotVerticalChart(container, data, plotType) {
    const dataTraces = [{
        x: data.x,
        y: data.y,
        z: data.z,
        type: plotType,
        name: "name",
        showscale: true,
        line: {
            smoothing: 0.5,
            color: 'rgba(0, 0, 0,0)'
        },
        connectgaps: true,
    }];
    let layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: plotMargins,
        xaxis: {
            gridcolor: '#bdbdbd',
            linecolor: '#636363',
        },
        yaxis: {
            gridcolor: '#bdbdbd',
            linecolor: '#636363',
            autorange: true,
        }
    }
    Plotly.newPlot(container, dataTraces, layout);
}
