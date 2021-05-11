let colors2 = ["#4A8FC2", "#D63128"];
let colors5 = ["#4A8FC2", "#A6C09D", "#FAFA7C", "#EC9248", "#D63128"];
let colors10 = ["#4A8FC2", "#76A5B1", "#9DBCA2", "#C3D392", "#E8EC83", "#F8E571", "#F2B659", "#EB8C47", "#EB8C47", "#D63128"];
let colors20 = ['#4A8FC2', '#609ABB', '#71A2B3', '#87AFAC', '#98B9A5', '#AAC29B', '#BBCF93', '#CEDB8C', '#E2E888', '#F4F581', '#F8F076', '#F7DA6A', '#F4C461', '#F0AE57', '#EC994C', '#E98544', '#E5713C', '#E05C33', '#DC472D', '#D53327'];

// //Colors 2
// const colorQuantiles = [0.5, 1.0];
// const continuousColorScale = new d3.scaleLinear().domain(colorQuantiles.map(d=>d-colorQuantiles[0])).range(colors2);
// const quantileColorScale = new d3.scaleThreshold().domain(colorQuantiles).range(colors2);

//Colors 5
const colorQuantiles = [0.2, 0.4, 0.6, 0.8, 1.0];
const continuousColorScale = new d3.scaleLinear().domain(colorQuantiles.map(d=>d-colorQuantiles[0])).range(colors5);
const quantileColorScale = new d3.scaleThreshold().domain(colorQuantiles).range(colors5);

// //Colors 10
// const colorQuantiles = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
// const continuousColorScale = new d3.scaleLinear().domain(colorQuantiles.map(d=>d-colorQuantiles[0])).range(colors10);
// const quantileColorScale = new d3.scaleThreshold().domain(colorQuantiles).range(colors10);

