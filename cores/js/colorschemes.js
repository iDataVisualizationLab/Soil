let colors5 = ["#4A8FC2", "#A6C09D", "#FAFA7C", "#EC9248", "#D63128"];
let colors10 = ["#4A8FC2", "#76A5B1", "#9DBCA2", "#C3D392", "#E8EC83", "#F8E571", "#F2B659", "#EB8C47", "#EB8C47", "#D63128"];
let colors20 = ['#4A8FC2', '#609ABB', '#71A2B3', '#87AFAC', '#98B9A5', '#AAC29B', '#BBCF93', '#CEDB8C', '#E2E888', '#F4F581', '#F8F076', '#F7DA6A', '#F4C461', '#F0AE57', '#EC994C', '#E98544', '#E5713C', '#E05C33', '#DC472D', '#D53327'];
const colorQuantiles = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
const continuousColorScale = new d3.scaleLinear().domain(colorQuantiles.map(d=>d-0.1)).range(colors10);
const quantileColorScale = new d3.scaleThreshold().domain(colorQuantiles).range(colors10);
// const quantileColorScale = function (val) {
//     //If < the first threshold, return the first color
//     if (val < colorQuantiles[0]) {
//         return colors10[0];
//     }
//     //If in any range return the correpsonding color
//     let idx = 0;
//     for (idx = 0; idx < colorQuantiles.length - 2; idx++) {
//         const qt = colorQuantiles[idx];
//         if (val >= qt && val < colorQuantiles[idx + 1]) {
//             return colors10[idx];
//         }
//     }
//     //If greater than the last one return the last color
//     return colors10[idx];//Return the last color
// };
// quantileColorScale.domain = function () {
//     return colorQuantiles;
// }
// quantileColorScale.range = function () {
//     return colors10;
// }
