let data = null;
let avgData = null;
let profiles = ["Profile1", "Profile2", "Profile3"];
let defaultProfileIndex = 0;
let svgId = "#corcoefGraph";
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
let digits = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
let columns = [
    'Grid ID',
    'Al Concentration',
    'Ca Concentration',
    'Cr Concentration',
    'Cu Concentration',
    'Fe Concentration',
    'K Concentration',
    'Mn Concentration',
    'Nb Concentration',
    'Ni Concentration',
    'Pb Concentration',
    'Rb Concentration',
    'S Concentration',
    'Si Concentration',
    'Sr Concentration',
    'Th Concentration',
    'Ti Concentration',
    'V Concentration',
    'Y Concentration',
    'Zn Concentration',
    'Zr Concentration'];
let allElements = [];
let defaultElementIndexes = [0, 1];
let theOptions = [];
let currentColumnNames = [];
let xContour = null;
let yContour = null;
let elmConcentrations = [];
let contourData = [];
let boxPlotData = [];
let curvePlotData = [];
let theProfile = null;
let opacitySliders = [];
let adjustedRSquaredScores = [0, 0];


let plotType = 'heatmap';
let plotTypeSelection = 'contour';
let colors5 = ["#4A8FC2", "#A6C09D", "#FAFA7C", "#EC9248", "#D63128"];
let colors10 = ["#4A8FC2", "#76A5B1", "#9DBCA2", "#C3D392", "#E8EC83", "#F8E571", "#F2B659", "#EB8C47", "#EB8C47", "#D63128"];
let colors20 = ['#4A8FC2', '#609ABB', '#71A2B3', '#87AFAC', '#98B9A5', '#AAC29B', '#BBCF93', '#CEDB8C', '#E2E888', '#F4F581', '#F8F076', '#F7DA6A', '#F4C461', '#F0AE57', '#EC994C', '#E98544', '#E5713C', '#E05C33', '#DC472D', '#D53327'];

let p1ColorScales5 = {
    'Al Concentration': {
        values: [1.6 * 10000, 2.7 * 10000, 3.9 * 10000, 5.1 * 10000, 6.3 * 10000, 7.9 * 10000],
        colors: colors5
    },
    'Ca Concentration': {
        values: [-1 * 10000, 0.8 * 10000, 2.5 * 10000, 4.5 * 10000, 10 * 10000, 23 * 10000],
        colors: colors5
    },
    'Cr Concentration': {values: [29, 38, 42, 46, 50, 62], colors: colors5},
    'Cu Concentration': {values: [11, 17, 20, 22, 24, 26], colors: colors5},
    'Fe Concentration': {
        values: [0.8 * 10000, 1.2 * 10000, 1.6 * 10000, 2.0 * 10000, 2.4 * 10000, 3.0 * 10000],
        colors: colors5
    },
    'K Concentration': {
        values: [0.4 * 10000, 0.8 * 10000, 1.1 * 10000, 1.3 * 10000, 1.5 * 10000, 1.7 * 10000],
        colors: colors5
    },
    'Mn Concentration': {values: [130, 240, 320, 370, 420, 636], colors: colors5},
    'Nb Concentration': {values: [6.4, 10.0, 13.3, 15.8, 18, 20.3], colors: colors5},
    'Ni Concentration': {values: [15, 16, 22, 26, 30, 35], colors: colors5},
    'Pb Concentration': {values: [7.7, 12, 15, 17, 19, 21.3], colors: colors5},
    'Rb Concentration': {values: [26, 45, 65, 77, 86, 95], colors: colors5},
    'S Concentration': {values: [125, 150, 170, 210, 250, 291], colors: colors5},
    'Si Concentration': {
        values: [8 * 10000, 12 * 10000, 16 * 10000, 20 * 10000, 24 * 10000, 28 * 10000],
        colors: colors5
    },
    'Sr Concentration': {values: [65, 85, 105, 125, 150, 331], colors: colors5},
    'Th Concentration': {values: [9.7, 11.2, 12.6, 13.6, 15.2, 16.9], colors: colors5},
    'Ti Concentration': {
        values: [0.13 * 10000, 0.20 * 10000, 0.28 * 10000, 0.32 * 10000, 0.36 * 10000, 0.40 * 10000],
        colors: colors5
    },
    'V Concentration': {values: [48, 56, 64, 68, 72, 77], colors: colors5},
    'Y Concentration': {values: [8.7, 14, 18, 22, 26, 30], colors: colors5},
    'Zn Concentration': {values: [24, 40, 54, 62, 67, 74], colors: colors5},
    'Zr Concentration': {values: [134, 220, 260, 280, 300, 370], colors: colors5}
}
let p1ColorScales10 = {
    'Al Concentration': {
        values: [1.6 * 10000, 2.1 * 10000, 2.7 * 10000, 3.3 * 10000, 3.9 * 10000, 4.5 * 10000, 5.1 * 10000, 5.7 * 10000, 6.3 * 10000, 6.9 * 10000, 7.9 * 10000],
        colors: colors10
    },
    'Ca Concentration': {
        values: [-1 * 10000, 0.4 * 10000, 0.8 * 10000, 1.5 * 10000, 2.5 * 10000, 3.5 * 10000, 4.5 * 10000, 6.0 * 10000, 10 * 10000, 15 * 10000, 23 * 10000],
        colors: colors10
    },
    'Cr Concentration': {values: [29, 35, 38, 40, 42, 44, 46, 48, 50, 54, 62], colors: colors10},
    'Cu Concentration': {values: [11, 14, 17, 19, 20, 21, 22, 23, 24, 25, 26], colors: colors10},
    'Fe Concentration': {
        values: [0.8 * 10000, 1.0 * 10000, 1.2 * 10000, 1.4 * 10000, 1.6 * 10000, 1.8 * 10000, 2.0 * 10000, 2.2 * 10000, 2.4 * 10000, 2.6 * 10000, 2.8 * 10000],
        colors: colors10
    },
    'K Concentration': {
        values: [0.4 * 10000, 0.6 * 10000, 0.8 * 10000, 0.9 * 10000, 1.1 * 10000, 1.2 * 10000, 1.3 * 10000, 1.4 * 10000, 1.5 * 10000, 1.6 * 10000, 1.7 * 10000],
        colors: colors10
    },
    'Mn Concentration': {values: [130, 200, 240, 280, 320, 350, 370, 390, 420, 500, 636], colors: colors10},
    'Nb Concentration': {values: [6.4, 8.0, 10.0, 12.0, 13.3, 14.6, 15.8, 17.0, 18.0, 19.0, 20.3], colors: colors10},
    'Ni Concentration': {values: [15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35], colors: colors10},
    'Pb Concentration': {values: [7.7, 10, 12, 14, 15, 16, 17, 18, 19, 20, 21.3], colors: colors10},
    'Rb Concentration': {values: [26, 35, 45, 55, 65, 71, 77, 82, 86, 90, 95], colors: colors10},
    'S Concentration': {values: [125, 140, 150, 160, 170, 190, 210, 230, 250, 270, 291], colors: colors10},
    'Si Concentration': {
        values: [8 * 10000, 10 * 10000, 12 * 10000, 14 * 10000, 16 * 10000, 18 * 10000, 20 * 10000, 22 * 10000, 24 * 10000, 26 * 10000, 28 * 10000],
        colors: colors10
    },
    'Sr Concentration': {values: [65, 75, 85, 95, 105, 115, 125, 135, 150, 250, 331], colors: colors10},
    'Th Concentration': {values: [9.7, 10.4, 11.2, 12, 12.6, 13.0, 13.6, 14.4, 15.2, 16, 16.9], colors: colors10},
    'Ti Concentration': {
        values: [0.13 * 10000, 0.16 * 10000, 0.20 * 10000, 0.24 * 10000, 0.28 * 10000, 0.30 * 10000, 0.32 * 10000, 0.34 * 10000, 0.36 * 10000, 0.38 * 10000, 0.40 * 10000],
        colors: colors10
    },
    'V Concentration': {values: [48, 52, 56, 60, 64, 66, 68, 70, 72, 74, 77], colors: colors10},
    'Y Concentration': {values: [8.7, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], colors: colors10},
    'Zn Concentration': {values: [24, 30, 40, 50, 54, 58, 62, 65, 67, 70, 74], colors: colors10},
    'Zr Concentration': {values: [134, 180, 220, 250, 260, 270, 280, 290, 300, 330, 370], colors: colors10},
}
let p1ColorScales20 = {
    'Al Concentration': {
        values: [1.6 * 10000, 1.9 * 10000, 2.1 * 10000, 2.4 * 10000, 2.7 * 10000, 3.0 * 10000, 3.3 * 10000, 3.6 * 10000, 3.9 * 10000, 4.2 * 10000, 4.5 * 10000, 4.8 * 10000, 5.1 * 10000, 5.4 * 10000, 5.7 * 10000, 6.0 * 10000, 6.3 * 10000, 6.6 * 10000, 6.9 * 10000, 7.2 * 10000, 7.9 * 10000],
        colors: colors20
    },
    'Ca Concentration': {
        values: [-1 * 1000, 0.2 * 10000, .4 * 10000, .6 * 10000, .8 * 10000, 1.0 * 10000, 1.5 * 10000, 2.0 * 10000, 2.5 * 10000, 3.0 * 10000, 3.5 * 10000, 4.0 * 10000, 4.5 * 10000, 5.0 * 10000, 6 * 10000, 8 * 10000, 10 * 10000, 12 * 10000, 15 * 10000, 20 * 10000, 23 * 10000],
        colors: colors20
    },
    'Cr Concentration': {
        values: [29, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 54, 56, 62],
        colors: colors20
    },
    'Cu Concentration': {
        values: [11, 12, 14, 16, 17, 18, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26],
        colors: colors20
    },
    'Fe Concentration': {
        values: [0.8 * 10000, 0.9 * 10000, 1 * 10000, 1.1 * 10000, 1.2 * 10000, 1.3 * 10000, 1.4 * 10000, 1.5 * 10000, 1.6 * 10000, 1.7 * 10000, 1.8 * 10000, 1.9 * 10000, 2 * 10000, 2.1 * 10000, 2.2 * 10000, 2.3 * 10000, 2.4 * 10000, 2.5 * 10000, 2.6 * 10000, 2.7 * 10000, 3 * 10000],
        colors: colors20
    },
    'K Concentration': {
        values: [0.4 * 10000, 0.5 * 10000, 0.6 * 10000, 0.7 * 10000, 0.8 * 10000, 0.9 * 10000, 1 * 10000, 1.05 * 10000, 1.1 * 10000, 1.15 * 10000, 1.2 * 10000, 1.25 * 10000, 1.3 * 10000, 1.35 * 10000, 1.4 * 10000, 1.45 * 10000, 1.5 * 10000, 1.55 * 10000, 1.6 * 10000, 1.65 * 10000, 1.73 * 10000],
        colors: colors20
    },
    'Mn Concentration': {
        values: [130, 160, 200, 220, 240, 260, 280, 300, 320, 340, 350, 360, 370, 380, 390, 400, 420, 450, 500, 550, 636],
        colors: colors20
    },
    'Nb Concentration': {
        values: [6.4, 7, 8, 9, 10, 11, 12, 13, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20.3],
        colors: colors20
    },
    'Ni Concentration': {
        values: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35],
        colors: colors20
    },
    'Pb Concentration': {
        values: [7.7, 9, 10, 11, 12, 13, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21.3],
        colors: colors20
    },
    'Rb Concentration': {
        values: [26, 30, 35, 40, 45, 50, 55, 60, 65, 68, 71, 74, 77, 80, 82, 84, 86, 88, 90, 92, 95],
        colors: colors20
    },
    'S Concentration': {
        values: [125, 130, 140, 145, 150, 155, 160, 165, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 291],
        colors: colors20
    },
    'Si Concentration': {
        values: [8.5 * 10000, 9 * 10000, 10 * 10000, 11 * 10000, 12 * 10000, 13 * 10000, 14 * 10000, 15 * 10000, 16 * 10000, 17 * 10000, 18 * 10000, 19 * 10000, 20 * 10000, 21 * 10000, 22 * 10000, 23 * 10000, 24 * 10000, 25 * 10000, 26 * 10000, 27 * 10000, 28 * 10000],
        colors: colors20
    },
    'Sr Concentration': {
        values: [65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 150, 200, 250, 300, 331],
        colors: colors20
    },
    'Th Concentration': {
        values: [4, 10, 10.4, 10.8, 11.2, 11.6, 12, 12.4, 12.6, 12.8, 13, 13.2, 13.6, 14, 14.4, 14.8, 15.2, 15.6, 16, 16.4, 16.9],
        colors: colors20
    },
    'Ti Concentration': {
        values: [0.12 * 10000, 0.14 * 10000, 0.16 * 10000, 0.18 * 10000, 0.2 * 10000, 0.22 * 10000, 0.24 * 10000, 0.26 * 10000, 0.28 * 10000, 0.29 * 10000, 0.3 * 10000, 0.31 * 10000, 0.32 * 10000, 0.33 * 10000, 0.34 * 10000, 0.35 * 10000, 0.36 * 10000, 0.37 * 10000, 0.38 * 10000, 0.39 * 10000, 0.4 * 10000],
        colors: colors20
    },
    'V Concentration': {
        values: [48, 50, 52, 54, 56, 58, 60, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 77],
        colors: colors20
    },
    'Y Concentration': {
        values: [8.7, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        colors: colors20
    },
    'Zn Concentration': {
        values: [24, 25, 30, 35, 40, 45, 50, 52, 54, 56, 58, 60, 62, 64, 65, 66, 67, 68, 70, 72, 74],
        colors: colors20
    },
    'Zr Concentration': {
        values: [134, 160, 180, 200, 220, 240, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 310, 330, 350, 370],
        colors: colors20
    },
}
let p1ColorScales = [p1ColorScales5, p1ColorScales10, p1ColorScales20];

let p2ColorScales5 = {
    'Al Concentration': {
        values: [1.0 * 10000, 5.0 * 10000, 6.3 * 10000, 6.7 * 10000, 7.1 * 10000, 7.5 * 10000],
        colors: colors5
    },
    'Ca Concentration': {
        values: [-1 * 10000, 0.4 * 10000, 0.8 * 10000, 3.0 * 10000, 8.0 * 10000, 23 * 10000],
        colors: colors5
    },
    'Cr Concentration': {values: [0, 35.5, 37.2, 39, 40.6, 62], colors: colors5},
    'Cu Concentration': {values: [9.0, 12.5, 16.5, 18.5, 23], colors: colors5},
    'Fe Concentration': {
        values: [0.6 * 10000, 1.0 * 10000, 1.4 * 10000, 1.7 * 10000, 1.9 * 10000, 2.1 * 10000],
        colors: colors5
    },
    'K Concentration': {
        values: [0.3 * 10000, 1.0 * 10000, 1.26 * 10000, 1.34 * 10000, 1.44 * 10000, 1.6 * 10000],
        colors: colors5
    },
    'Mn Concentration': {values: [96, 180, 230, 255, 275], colors: colors5},
    'Nb Concentration': {values: [7.0, 9.5, 10.5, 12.6, 13.4], colors: colors5},
    'Ni Concentration': {values: [0, 16.6, 17.8, 19.4, 20.6, 35], colors: colors5},
    'Pb Concentration': {values: [6, 8, 10, 12, 14, 32], colors: colors5},
    'Rb Concentration': {values: [25, 45, 59, 63, 67, 71], colors: colors5},
    'S Concentration': {values: [60, 100, 140, 180, 240, 334], colors: colors5},
    'Si Concentration': {
        values: [6.0 * 10000, 23.0 * 10000, 25.0 * 10000, 26.2 * 10000, 27 * 10000, 28 * 10000],
        colors: colors5
    },
    'Sr Concentration': {values: [51, 60, 68, 85, 140, 212], colors: colors5},
    'Th Concentration': {values: [0, 10, 10.8, 11.6, 12.4, 16.9], colors: colors5},
    'Ti Concentration': {
        values: [0.12 * 10000, 0.20 * 10000, 0.25 * 10000, 0.29 * 10000, 0.33 * 10000, 0.38 * 10000],
        colors: colors5
    },
    'V Concentration': {values: [0, 51, 53, 55, 57, 77], colors: colors5},
    'Y Concentration': {values: [9.3, 15, 16.4, 17.2, 18, 20], colors: colors5},
    'Zn Concentration': {values: [20, 28, 36, 42, 46, 50], colors: colors5},
    'Zr Concentration': {values: [132, 220, 265, 285, 310, 453], colors: colors5}
}
let p2ColorScales10 = {
    'Al Concentration': {
        values: [1 * 10000, 3 * 10000, 5 * 10000, 6.1 * 10000, 6.3 * 10000, 6.5 * 10000, 6.7 * 10000, 6.9 * 10000, 7.1 * 10000, 7.3 * 10000, 7.5 * 10000],
        colors: colors10
    },
    'Ca Concentration': {
        values: [0 * 10000, 0.2 * 10000, 0.4 * 10000, 0.6 * 10000, 0.8 * 10000, 1 * 10000, 3 * 10000, 5 * 10000, 8 * 10000, 15 * 10000, 26 * 10000],
        colors: colors10
    },
    'Cr Concentration': {values: [0, 34.5, 35.5, 36.4, 37.2, 38, 39, 39.8, 40.6, 41.5, 62], colors: colors10},
    'Cu Concentration': {values: [9, 10, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 20, 23], colors: colors10},
    'Fe Concentration': {
        values: [0.6 * 10000, 0.8 * 10000, 1 * 10000, 1.2 * 10000, 1.4 * 10000, 1.6 * 10000, 1.7 * 10000, 1.8 * 10000, 1.9 * 10000, 2 * 10000, 2.1 * 10000],
        colors: colors10
    },
    'K Concentration': {
        values: [0.3 * 10000, 0.6 * 10000, 1 * 10000, 1.22 * 10000, 1.26 * 10000, 1.3 * 10000, 1.34 * 10000, 1.38 * 10000, 1.44 * 10000, 1.52 * 10000, 1.6 * 10000],
        colors: colors10
    },
    'Mn Concentration': {values: [96, 140, 180, 210, 230, 245, 255, 265, 275, 290, 325], colors: colors10},
    'Nb Concentration': {values: [7, 8.5, 9.5, 10.5, 11.5, 12.2, 12.6, 13, 13.4, 13.8, 14.4], colors: colors10},
    'Ni Concentration': {values: [15.8, 16.2, 16.6, 17, 17.4, 17.8, 19.4, 20, 20.6, 21.4, 22.2], colors: colors10},
    'Pb Concentration': {values: [6, 7, 8, 9, 10, 11, 12, 13, 14, 20, 31.6], colors: colors10},
    'Rb Concentration': {values: [25, 35, 45, 54, 59, 61, 63, 65, 67, 69, 71], colors: colors10},
    'S Concentration': {values: [60, 80, 100, 120, 140, 160, 180, 200, 240, 280, 334], colors: colors10},
    'Si Concentration': {
        values: [6 * 10000, 8 * 10000, 18 * 10000, 23 * 10000, 24 * 10000, 25.8 * 10000, 26.2 * 10000, 26.6 * 10000, 27 * 10000, 27.4 * 10000, 28 * 10000],
        colors: colors10
    },
    'Sr Concentration': {values: [51, 56, 60, 64, 68, 75, 85, 100, 140, 180, 212], colors: colors10},
    'Th Concentration': {values: [9, 9.6, 10, 10.4, 10.8, 11.2, 11.6, 12, 12.4, 13, 13.6], colors: colors10},
    'Ti Concentration': {
        values: [0.12 * 10000, 0.16 * 10000, 0.2 * 10000, 0.23 * 10000, 0.25 * 10000, 0.27 * 10000, 0.29 * 10000, 0.31 * 10000, 0.33 * 10000, 0.35 * 10000, 0.38 * 10000],
        colors: colors10
    },
    'V Concentration': {values: [45, 48, 51, 52, 53, 54, 55, 56, 57, 59, 71], colors: colors10},
    'Y Concentration': {values: [9.3, 12, 15, 16, 16.4, 16.8, 17.2, 17.6, 18, 18.8, 20], colors: colors10},
    'Zn Concentration': {values: [20, 24, 28, 32, 36, 40, 42, 44, 46, 48, 50], colors: colors10},
    'Zr Concentration': {values: [132, 175, 220, 250, 265, 275, 285, 295, 310, 350, 453], colors: colors10}
}
let p2ColorScales20 = {
    'Al Concentration': {
        values: [1 * 10000, 2 * 10000, 3 * 10000, 4 * 10000, 5 * 10000, 6 * 10000, 6.1 * 10000, 6.2 * 10000, 6.3 * 10000, 6.4 * 10000, 6.5 * 10000, 6.6 * 10000, 6.7 * 10000, 6.8 * 10000, 6.9 * 10000, 7 * 10000, 7.1 * 10000, 7.2 * 10000, 7.3 * 10000, 7.4 * 10000, 7.5 * 10000],
        colors: colors20
    },
    'Ca Concentration': {
        values: [0 * 10000, 0.1 * 10000, 0.2 * 10000, 0.3 * 10000, 0.4 * 10000, 0.5 * 10000, 0.6 * 10000, 0.7 * 10000, 0.8 * 10000, 0.9 * 10000, 1 * 10000, 2 * 10000, 3 * 10000, 4 * 10000, 5 * 10000, 6 * 10000, 8 * 10000, 10 * 10000, 15 * 10000, 20 * 10000, 26 * 10000],
        colors: colors20
    },
    'Cr Concentration': {
        values: [33.5, 34, 34.5, 35, 35.5, 36, 36.4, 36.8, 37.2, 37.6, 38, 38.5, 39, 39.4, 39.8, 40.2, 40.6, 41, 41.5, 42, 42.5],
        colors: colors20
    },
    'Cu Concentration': {
        values: [9, 10, 11, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 20, 21, 23],
        colors: colors20
    },
    'Fe Concentration': {
        values: [0.6 * 10000, 0.7 * 10000, 0.8 * 10000, 0.9 * 10000, 1 * 10000, 1.1 * 10000, 1.2 * 10000, 1.3 * 10000, 1.4 * 10000, 1.5 * 10000, 1.6 * 10000, 1.65 * 10000, 1.7 * 10000, 1.75 * 10000, 1.8 * 10000, 1.85 * 10000, 1.9 * 10000, 1.95 * 10000, 2 * 10000, 2.05 * 10000, 2.1 * 10000],
        colors: colors20
    },
    'K Concentration': {
        values: [0.3 * 10000, 0.4 * 10000, 0.6 * 10000, 0.8 * 10000, 1 * 10000, 1.2 * 10000, 1.22 * 10000, 1.24 * 10000, 1.26 * 10000, 1.28 * 10000, 1.3 * 10000, 1.32 * 10000, 1.34 * 10000, 1.36 * 10000, 1.38 * 10000, 1.4 * 10000, 1.44 * 10000, 1.48 * 10000, 1.52 * 10000, 1.56 * 10000, 1.6 * 10000],
        colors: colors20
    },
    'Mn Concentration': {
        values: [96, 120, 140, 160, 180, 200, 210, 220, 230, 240, 245, 250, 255, 260, 265, 270, 275, 280, 290, 300, 325],
        colors: colors20
    },
    'Nb Concentration': {
        values: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.4],
        colors: colors20
    },
    'Ni Concentration': {
        values: [15.4, 15.8, 16.2, 16.4, 16.6, 16.8, 17, 17.4, 17.8, 18.2, 18.6, 19, 19.4, 19.8, 20, 20.2, 20.6, 21, 21.4, 21.8, 22.2],
        colors: colors20
    },
    'Pb Concentration': {
        values: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 16, 20, 25, 31.6],
        colors: colors20
    },
    'Rb Concentration': {
        values: [25, 30, 35, 40, 45, 50, 54, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
        colors: colors20
    },
    'S Concentration': {
        values: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 220, 240, 260, 280, 300, 334],
        colors: colors20
    },
    'Si Concentration': {
        values: [6 * 10000, 12 * 10000, 18 * 10000, 22 * 10000, 23 * 10000, 23.5 * 10000, 24 * 10000, 24.5 * 10000, 25 * 10000, 25.4 * 10000, 25.8 * 10000, 26 * 10000, 26.2 * 10000, 26.4 * 10000, 26.6 * 10000, 26.8 * 10000, 27 * 10000, 27.2 * 10000, 27.4 * 10000, 27.6 * 10000, 28 * 10000],
        colors: colors20
    },
    'Sr Concentration': {
        values: [52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 75, 80, 85, 90, 95, 100, 120, 140, 160, 180, 212],
        colors: colors20
    },
    'Th Concentration': {
        values: [9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 13, 13.5, 14],
        colors: colors20
    },
    'Ti Concentration': {
        values: [0.12 * 10000, 0.14 * 10000, 0.16 * 10000, 0.18 * 10000, 0.2 * 10000, 0.22 * 10000, 0.23 * 10000, 0.24 * 10000, 0.25 * 10000, 0.26 * 10000, 0.27 * 10000, 0.28 * 10000, 0.29 * 10000, 0.3 * 10000, 0.31 * 10000, 0.32 * 10000, 0.33 * 10000, 0.34 * 10000, 0.35 * 10000, 0.36 * 10000, 0.38 * 10000],
        colors: colors20
    },
    'V Concentration': {
        values: [44, 46, 48, 50, 51, 52, 52.5, 53, 53.5, 54, 54.5, 55, 55.5, 56, 56.5, 57, 57.5, 58, 59, 60, 61],
        colors: colors20
    },
    'Y Concentration': {
        values: [9.3, 10.5, 12, 13.5, 15, 15.5, 16, 16.2, 16.4, 16.6, 16.8, 17, 17.2, 17.4, 17.6, 17.8, 18, 18.4, 18.8, 19.2, 20],
        colors: colors20
    },
    'Zn Concentration': {
        values: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
        colors: colors20
    },
    'Zr Concentration': {
        values: [132, 150, 175, 200, 220, 240, 250, 260, 265, 270, 275, 280, 285, 290, 295, 300, 310, 320, 350, 400, 453],
        colors: colors20
    },
}
let p2ColorScales = [p2ColorScales5, p2ColorScales10, p2ColorScales20];

let p3ColorScales5 = {
    'Al Concentration': {
        values: [5.7 * 10000, 6.1 * 10000, 6.5 * 10000, 6.9 * 10000, 7.3 * 10000, 7.9 * 10000],
        colors: colors5
    },
    'Ca Concentration': {
        values: [-1 * 10000, 0.4 * 10000, 0.8 * 10000, 3.0 * 10000, 8.0 * 10000, 23 * 10000],
        colors: colors5
    },
    'Cr Concentration': {values: [22, 34, 38, 42, 46, 75], colors: colors5},
    'Cu Concentration': {values: [12, 14.8, 16.4, 18, 20, 22], colors: colors5},
    'Fe Concentration': {
        values: [1.3 * 10000, 1.55 * 10000, 1.75 * 10000, 1.95 * 10000, 2.15 * 10000, 2.35 * 10000],
        colors: colors5
    },
    'K Concentration': {
        values: [1 * 10000, 1.23 * 10000, 1.27 * 10000, 1.31 * 10000, 1.35 * 10000, 1.5 * 10000],
        colors: colors5
    },
    'Mn Concentration': {values: [178, 220, 255, 275, 295], colors: colors5},
    'Nb Concentration': {values: [9.5, 11.2, 12, 12.8, 13.6, 14.8], colors: colors5},
    'Ni Concentration': {values: [13.5, 15.5, 17.5, 19.2, 20.8, 22.4], colors: colors5},
    'Pb Concentration': {values: [9.5, 11.2, 12.0, 12.8, 13.6, 15.4], colors: colors5},
    'Rb Concentration': {values: [48, 56, 62, 66, 73, 80], colors: colors5},
    'S Concentration': {values: [42, 115, 135, 155, 175, 321], colors: colors5},
    'Si Concentration': {
        values: [23.5 * 10000, 25.6 * 10000, 26.4 * 10000, 27.2 * 10000, 28 * 10000, 30.2 * 10000],
        colors: colors5
    },
    'Sr Concentration': {values: [48, 55, 59, 65, 69, 77], colors: colors5},
    'Th Concentration': {values: [6, 9.6, 10.4, 11.2, 12.0, 22], colors: colors5},
    'Ti Concentration': {
        values: [0.26 * 10000, .28 * 10000, , 30 * 10000, .318 * 10000, .328 * 10000, .342 * 10000],
        colors: colors5
    },
    'V Concentration': {values: [44, 49, 53, 57, 61, 66], colors: colors5},
    'Y Concentration': {values: [13, 15.5, 17.2, 18, 18.8, 20.5], colors: colors5},
    'Zn Concentration': {values: [32, 35, 42, 46, 53, 58], colors: colors5},
    'Zr Concentration': {values: [243, 276, 286, 294, 302, 355], colors: colors5},
}
let p3ColorScales10 = {
    'Al Concentration': {
        values: [5.7 * 10000, 5.9 * 10000, 6.1 * 10000, 6.3 * 10000, 6.5 * 10000, 6.7 * 10000, 6.9 * 10000, 7.1 * 10000, 7.3 * 10000, 7.5 * 10000, 7.7 * 10000],
        colors: colors10
    },
    'Ca Concentration': {
        values: [-1 * 10000, 0.4 * 10000, 0.8 * 10000, 1.5 * 10000, 2.5 * 10000, 3.5 * 10000, 4.5 * 10000, 6.0 * 10000, 10 * 10000, 15 * 10000, 23 * 10000],
        colors: colors10
    },
    'Cr Concentration': {values: [22, 32, 34, 36, 38, 40, 42, 44, 46, 48, 75], colors: colors10},
    'Cu Concentration': {values: [12, 14, 14.8, 15.6, 16.4, 17.2, 18, 19, 20, 21, 22], colors: colors10},
    'Fe Concentration': {
        values: [1.3 * 10000, 1.45 * 10000, 1.55 * 10000, 1.65 * 10000, 1.75 * 10000, 1.85 * 10000, 1.95 * 10000, 2.05 * 10000, 2.15 * 10000, 2.25 * 10000, 2.35 * 10000,],
        colors: colors10
    },
    'K Concentration': {
        values: [1 * 10000, 1.21 * 10000, 1.23 * 10000, 1.25 * 10000, 1.27 * 10000, 1.29 * 10000, 1.31 * 10000, 1.33 * 10000, 1.35 * 10000, 1.37 * 10000, 1.5 * 10000],
        colors: colors10
    },
    'Mn Concentration': {values: [178, 200, 220, 240, 255, 265, 275, 285, 295, 305, 315], colors: colors10},
    'Nb Concentration': {values: [9.5, 10.5, 11.2, 11.6, 12, 12.4, 12.8, 13.2, 13.6, 14, 14.8], colors: colors10},
    'Ni Concentration': {values: [13.5, 14.5, 15.5, 16.5, 17.5, 18.4, 19.2, 20, 20.8, 21.6, 22.4], colors: colors10},
    'Pb Concentration': {values: [9.5, 10.5, 11.2, 11.6, 12, 12.4, 12.8, 13.2, 13.6, 14.2, 15.4], colors: colors10},
    'Rb Concentration': {values: [48, 52, 56, 60, 62, 64, 66, 70, 33, 76, 80], colors: colors10},
    'S Concentration': {values: [42, 95, 115, 125, 135, 145, 155, 165, 175, 195, 321], colors: colors10},
    'Si Concentration': {
        values: [23.5 * 10000, 25 * 10000, 25.6 * 10000, 26 * 10000, 26.4 * 10000, 26.8 * 10000, 27.2 * 10000, 27.6 * 10000, 28 * 10000, 28.8 * 10000, 30.2 * 10000],
        colors: colors10
    },
    'Sr Concentration': {values: [48, 52, 55, 57, 59, 62, 65, 67, 69, 72, 77], colors: colors10},
    'Th Concentration': {values: [6, 9.2, 9.6, 10, 10.4, 10.8, 11.2, 11.6, 12, 12.4, 22], colors: colors10},
    'Ti Concentration': {
        values: [0.26 * 10000, 0.27 * 10000, 0.28 * 10000, 0.29 * 10000, 0.3 * 10000, 0.31 * 10000, 0.318 * 10000, 0.324 * 10000, 0.328 * 10000, 0.334 * 10000, 0.342 * 10000],
        colors: colors10
    },
    'V Concentration': {values: [44, 47, 49, 51, 53, 55, 57, 59, 61, 63, 66], colors: colors10},
    'Y Concentration': {values: [13, 14.5, 15.5, 16.5, 17.2, 17.6, 18, 18.4, 18.8, 19.6, 20.5], colors: colors10},
    'Zn Concentration': {values: [30, 33, 35, 38, 42, 44, 46, 49, 53, 55, 58], colors: colors10},
    'Zr Concentration': {values: [243, 272, 276, 280, 286, 290, 294, 298, 302, 308, 355], colors: colors10},
}
let p3ColorScales20 = {
    'Al Concentration': {
        values: [5.7 * 10000, 5.8 * 10000, 5.9 * 10000, 6 * 10000, 6.1 * 10000, 6.2 * 10000, 6.3 * 10000, 6.4 * 10000, 6.5 * 10000, 6.6 * 10000, 6.7 * 10000, 6.8 * 10000, 6.9 * 10000, 7 * 10000, 7.1 * 10000, 7.2 * 10000, 7.3 * 10000, 7.4 * 10000, 7.5 * 10000, 7.6 * 10000, 7.7 * 10000],
        colors: colors20
    },
    'Ca Concentration': {
        values: [-1 * 1000, 0.2 * 10000, .4 * 10000, .6 * 10000, .8 * 10000, 1.0 * 10000, 1.5 * 10000, 2.0 * 10000, 2.5 * 10000, 3.0 * 10000, 3.5 * 10000, 4.0 * 10000, 4.5 * 10000, 5.0 * 10000, 6 * 10000, 8 * 10000, 10 * 10000, 12 * 10000, 15 * 10000, 20 * 10000, 23 * 10000],
        colors: colors20
    },
    'Cr Concentration': {
        values: [22, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 75],
        colors: colors20
    },
    'Cu Concentration': {
        values: [12, 13, 14, 14.4, 14.8, 15.2, 15.6, 16, 16.4, 16.8, 17.2, 17.6, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22],
        colors: colors20
    },
    'Fe Concentration': {
        values: [1.3 * 10000, 1.4 * 10000, 1.45 * 10000, 1.5 * 10000, 1.55 * 10000, 1.6 * 10000, 1.65 * 10000, 1.7 * 10000, 1.75 * 10000, 1.8 * 10000, 1.85 * 10000, 1.9 * 10000, 1.95 * 10000, 2 * 10000, 2.05 * 10000, 2.1 * 10000, 2.15 * 10000, 2.2 * 10000, 2.25 * 10000, 2.3 * 10000, 2.35 * 10000],
        colors: colors20
    },
    'K Concentration': {
        values: [1 * 10000, 1.2 * 10000, 1.21 * 10000, 1.22 * 10000, 1.23 * 10000, 1.24 * 10000, 1.25 * 10000, 1.26 * 10000, 1.27 * 10000, 1.28 * 10000, 1.29 * 10000, 1.3 * 10000, 1.31 * 10000, 1.32 * 10000, 1.33 * 10000, 1.34 * 10000, 1.35 * 10000, 1.36 * 10000, 1.37 * 10000, 1.38 * 10000, 1.5 * 10000],
        colors: colors20
    },
    'Mn Concentration': {
        values: [178, 190, 200, 210, 220, 230, 240, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315],
        colors: colors20
    },
    'Nb Concentration': {
        values: [9.5, 10, 10.5, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.4, 14.8],
        colors: colors20
    },
    'Ni Concentration': {
        values: [13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.4, 18.8, 19.2, 19.6, 20, 20.4, 20.8, 21.2, 21.6, 22, 22.4],
        colors: colors20
    },
    'Pb Concentration': {
        values: [9.5, 10, 10.5, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14.2, 14.6, 15.4],
        colors: colors20
    },
    'Rb Concentration': {
        values: [48, 50, 52, 54, 56, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 72, 74, 76, 78],
        colors: colors20
    },
    'S Concentration': {
        values: [42, 85, 95, 105, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 185, 195, 205, 321],
        colors: colors20
    },
    'Si Concentration': {
        values: [23.5 * 10000, 24.5 * 10000, 25 * 10000, 25.4 * 10000, 25.6 * 10000, 25.8 * 10000, 26 * 10000, 26.2 * 10000, 26.4 * 10000, 26.6 * 10000, 26.8 * 10000, 27 * 10000, 27.2 * 10000, 27.4 * 10000, 27.6 * 10000, 27.8 * 10000, 28 * 10000, 28.4 * 10000, 28.8 * 10000, 29.2 * 10000, 30.2 * 10000],
        colors: colors20
    },
    'Sr Concentration': {
        values: [48, 50, 52, 54, 55, 56, 57, 58, 59, 60, 62, 64, 65, 66, 67, 68, 69, 70, 72, 74, 77],
        colors: colors20
    },
    'Th Concentration': {
        values: [0, 9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.8, 14],
        colors: colors20
    },
    'Ti Concentration': {
        values: [0.26 * 10000, 0.265 * 10000, 0.27 * 10000, 0.275 * 10000, 0.28 * 10000, 0.285 * 10000, 0.29 * 10000, 0.295 * 10000, 0.3 * 10000, 0.305 * 10000, 0.31 * 10000, 0.314 * 10000, 0.318 * 10000, 0.322 * 10000, 0.324 * 10000, 0.326 * 10000, 0.328 * 10000, 0.33 * 10000, 0.332 * 10000, 0.334 * 10000, 0.338 * 10000],
        colors: colors20
    },
    'V Concentration': {
        values: [44, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66],
        colors: colors20
    },
    'Y Concentration': {
        values: [13, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.2, 17.4, 17.6, 17.8, 18, 18.2, 18.4, 18.6, 18.8, 19.2, 19.6, 20, 20.5],
        colors: colors20
    },
    'Zn Concentration': {
        values: [30, 32, 33, 34, 35, 36, 38, 40, 42, 43, 44, 45, 46, 47, 49, 51, 53, 54, 55, 56, 58],
        colors: colors20
    },
    'Zr Concentration': {
        values: [243, 270, 272, 274, 276, 278, 280, 283, 286, 288, 290, 292, 294, 296, 298, 300, 302, 304, 308, 312, 355],
        colors: colors20
    },
}
let p3ColorScales = [p3ColorScales5, p3ColorScales10, p3ColorScales20];

let contourColorScales = {
    Profile1: p1ColorScales,
    Profile2: p2ColorScales,
    Profile3: p3ColorScales
};

//Default color scales
let colorScales = contourColorScales[profiles[defaultProfileIndex]];
//The level color scale index (0, 1, 2 for 5 levels, 10 levels, and 20 levels correspondingly).
let colorLevelsScaleIndex = 2;


loadProfiles();

function loadProfiles() {

    var data = profiles.map(d => {
        return {
            value: d,
            text: d
        }
    });
    theProfile = createByJson("profileContainerDiv", data, "optionprofile", defaultProfileIndex, changeProfile);
    changeProfile({target: {value: profiles[defaultProfileIndex]}});
}

function changeProfile(event) {
    //Clean the graph layout
    d3.select(".loader").style("display", "block").style("opacity", 1.0);
    d3.select("#page").style("visibility", "hidden");
    d3.select(svgId).selectAll("*").remove();
    let profile = event.target.value;
    //Change the profile background.
    d3.selectAll('.contourRoundedBorder').style('background-image', `url("data/images/${profile}.png")`);
    //Change the color profile.
    colorScales = contourColorScales[profile];
    readData("data/" + profile);
}

function readData(fileName) {
    d3.csv(fileName + "Avg.csv", function (error, rawAvgData) {
        avgData = rawAvgData;
        if (error) throw error;
        d3.csv(fileName + ".csv", function (error, rawData) {
            if (error) throw error;
            data = rawData.filter(function (d) {
                //Valid ID
                return validGridId(d["Grid ID"]);
            });
            //Add data for the three formulas
            let alAW = 26.9815385,
                oAW = 15.999,
                siAW = 28.085,
                feAW = 55.845,
                tiAW = 47.867,
                Al2O3AW = alAW * 2 + oAW * 3,
                alRatio = alAW * 2 / Al2O3AW,
                siO2AW = siAW + 2 * oAW,
                siRatio = siAW / siO2AW,
                Fe2O3AW = feAW * 2 + oAW * 3,
                feRatio = feAW * 2 / Fe2O3AW,
                tiO2AW = tiAW + 2 * oAW,
                tiRatio = tiAW / tiO2AW;
            data = data.map(row => {
                //Use only 20 elements
                let temp = {};
                columns.forEach(c => {
                    temp[c] = row[c];
                });
                row = temp;

                //Calculate Ruxton weathering index
                let si = (row["Si Concentration"] === "<LOD") ? 0 : +row["Si Concentration"],
                    al = (row["Al Concentration"] === "<LOD") ? 0 : +row["Al Concentration"],
                    al2o3 = al / alRatio,
                    sio2 = si / siRatio;
                let RI = sio2 / al2o3;
                row["RI Concentration"] = RI + "";
                //Desilication index
                let fe = (row["Fe Concentration"] === "<LOD") ? 0 : +row["Fe Concentration"],
                    ti = (row["Ti Concentration"] === "<LOD") ? 0 : +row["Ti Concentration"],
                    fe2o3 = fe / feRatio,
                    tio2 = ti / tiRatio;
                let DI = sio2 / (al2o3 + fe2o3 + tio2);
                row["DI Concentration"] = DI + "";
                // Elemental ratio of elements resistant to weathering
                let zr = (row["Zr Concentration"] === "<LOD") ? 0 : +row["Zr Concentration"];
                let SR = ti / zr;
                row["SR Concentration"] = SR + "";
                return row;
            });
            handleData(data);
        });
    });

}

/*Handling data after loading*/
function getColumn(data, columnName) {
    if (data.length <= 0 || data[0][columnName] === undefined) {
        return null;
    }
    let column = [];
    d3.map(data, function (d) {
        column.push(d[columnName]);
    });
    return column;
}

function getNumberColumn(data, columnName) {
    if (data.length <= 0 || data[0][columnName] === undefined) {
        return null;
    }
    let column = [];
    d3.map(data, function (d) {
        if (d[columnName].indexOf('<LOD') != -1) {
            column.push(0);
        } else if (!d[columnName]) {
            column.push(null);
        } else {
            column.push(+d[columnName]);
        }
    });
    return column;
}

function validGridId(id) {
    let re = /^[A-Z]\d\d$/g;
    return id != null && id.match(re) != null;
}

function plotTypeChange() {
    if ($("#contourPlotTypeS").is(":checked")) {
        plotTypeSelection = 'contours';
        plotType = 'contour';
    }
    if ($("#contourPlotTypeR").is(":checked")) {
        plotTypeSelection = 'contourr';
        plotType = 'heatmap';
    }
    if ($("#heatmapPlotType").is(":checked")) {
        plotTypeSelection = 'heatmap';
        plotType = 'heatmap';
    }
    plotGridMaps();
}

function colorScaleChange() {
    colorLevelsScaleIndex = document.getElementById("colorScaleSelect").selectedIndex;
    plotGridMaps();
}

function toggleGraphTopMenu() {
    if ($("#toggleGraphTopMenu").is(":checked")) {
        d3.selectAll(".modebar").style("opacity", 1);
    } else {
        d3.selectAll(".modebar").style("opacity", 0);
    }
}

function plotGridMaps() {
    //Plot contour
    setContourData(0);
    setContourData(1);
    plotContour(0);
    plotContour(1);
}

function handleData(data) {
    allElements = getAllElements();
    //Set the two default current elements
    currentColumnNames[0] = allElements[defaultElementIndexes[0]].value;
    currentColumnNames[1] = allElements[defaultElementIndexes[1]].value;
    setContourX();
    setContourY();
    setElmConcentration(0);
    setElmConcentration(1);
    plotGridMaps();
    populateSelectors(data);
    //Plot scatter
    plotScatter();
    //draw the correlation graph
    drawGraph();
    //Plot the box plots
    plotBoxPlots();
    //Plot the cureve plots
    plotCurvePlots();
    //Handling the loader spinner
    d3.select(".loader").style("opacity", 1.0).transition().duration(1000).style("opacity", 1e-6).style("display", "none");
    d3.select("#page").style("visibility", "visible").style("opacity", 1e-6).transition().duration(5000).style("opacity", 1.0);
}

//<editor-fold desc="functions to get information for the contours">
function extractGridLetter(gridId) {
    return gridId.substr(0, 1);
}

function extractGridNumber(gridId) {
    return gridId.substr(1, 2);
}

function getGridLetterList(data) {
    let letterList = [];
    d3.map(data, function (d) {
        letterList.push(extractGridLetter(d["Grid ID"]));
    });
    return letterList;
}

function getGridNumberList(data) {
    let numberList = [];
    d3.map(data, function (d) {
        numberList.push(extractGridNumber(d["Grid ID"]));
    });
    return numberList;
}

function setContourX() {
    xContour = getGridNumberList(data);
}

function setContourY() {
    yContour = getGridLetterList(data);
}

function setElmConcentration(index) {
    elmConcentrations[index] = getNumberColumn(data, currentColumnNames[index]);
}

function smoothenData(contourData) {
    let t = [];
    let x = [];
    let y = [];
    //Remove outliers
    let q95 = ss.quantile(contourData.z, 0.95);
    let q05 = ss.quantile(contourData.z, 0.05);
    for (let i = 0; i < contourData.z.length; i++) {
        if (contourData.z[i] <= q95 && contourData.z[i] >= q05) {
            t.push(contourData.z[i]);
            x.push(digits.indexOf(contourData.x[i]));
            y.push(letters.indexOf(contourData.y[i]));
        }
    }
    // var model = "exponential";
    let model = "spherical";
    // let model = "gaussian";
    let sigma2 = 0, alpha = 100;
    let variogram = kriging.train(t, x, y, model, sigma2, alpha);
    //Now interpolate data (step) at a point
    contourData.z = [];
    contourData.x = [];
    contourData.y = [];
    let step = 0.05;
    for (let i = 0; i < digits.length; i = i + step) {
        for (let j = 0; j < letters.length; j = j + step) {
            contourData.x.push(i);
            contourData.y.push(j);
            contourData.z.push(kriging.predict(i, j, variogram))
        }
    }
}

function getContourColorScale(columnName) {
    let colorScale = 'Portland';
    let selectedColorScales = colorScales[colorLevelsScaleIndex];
    if (selectedColorScales[columnName]) {
        colorScale = [];
        let valueScale = d3.scaleLinear().domain(d3.extent(selectedColorScales[columnName].values)).range([0, 1]);
        for (let i = 0; i < selectedColorScales[columnName].values.length - 1; i++) {
            colorScale.push([valueScale(selectedColorScales[columnName].values[i]), selectedColorScales[columnName].colors[i]]);
            colorScale.push([valueScale(selectedColorScales[columnName].values[i + 1]), selectedColorScales[columnName].colors[i]])
        }
    }
    return colorScale;
}

function setContourData(index) {

    let columnName = currentColumnNames[index]
    let colorScale = getContourColorScale(columnName);
    contourData[index] = [{
        x: xContour,
        y: yContour,
        z: elmConcentrations[index],
        type: plotType,
        name: currentColumnNames[index],
        showscale: true,
        colorscale: colorScale,
        line: {
            smoothing: 0.5,
            color: 'rgba(0, 0, 0,0)'
        },
        colorbar: {
            tickfont: {
                color: 'white'
            },
            ticks: colorScales[columnName]
        },
        connectgaps: true,
    }];
    if (plotTypeSelection != 'heatmap') {
        smoothenData(contourData[index][0]);
    }
}


let plotMargins = {
    l: 20,
    r: 80,
    t: 50,
    b: 30,
    pad: 0,
    autoexpand: false
};

function plotContour(index) {
    let contourLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: plotMargins,
        xaxis: {
            gridcolor: '#bdbdbd',
            linecolor: '#636363',
            // showticklabels: true,
            // autotick: false,
            tickvals: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5],
            ticktext: digits,
            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            }
        },
        yaxis: {
            gridcolor: '#bdbdbd',
            linecolor: '#636363',
            // showticklabels: true,
            // autotick: false,
            tickvals: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5],
            ticktext: letters,
            tickfont: {
                family: "Impact",
                size: 12,
                color: "white"
            }
        },
        font: {
            family: "Georgia,Times,serif"
        },
        shapes: d3.range(1, 11, 1)
            .map(makeLineVert)
            .concat(d3.range(0, 13, 1)
                .map(makeLineHoriz)
            ),//For displayinbg the gridlines
    }
    Plotly.newPlot('contour' + (index + 1), contourData[index], contourLayout);
    //Now draw the threshold slider if it is not drawn
    d3.select("#plotOpacity" + (index + 1)).select("svg").selectAll("*").remove();
    opacitySliders[index] = drawThresholdSlider(d3.select("#plotOpacity" + (index + 1)).select("svg"), "Plot opacity", onOpacityThreshold);

    function makeLineVert(x) {
        return {
            type: 'line',
            xref: 'x',
            yref: 'paper',
            x0: x,
            y0: 0,
            x1: x,
            y1: 1,
            line: {
                color: '#636363',
                width: 1
            }
        };
    }

    function makeLineHoriz(y) {
        return {
            type: 'line',
            xref: 'paper',
            yref: 'y',
            x0: 0,
            y0: y,
            x1: 1,
            y1: y,
            line: {
                color: '#636363',
                width: 1
            }
        };
    }
}

function setBoxPlotData(index) {
    boxPlotData[index] = [{
        x: elmConcentrations[index],
        y: yContour,
        type: 'box',
        name: currentColumnNames[index],
        boxmean: false,
        orientation: 'h'
    }];
}

function plotBoxPlot(index) {
    let layout = {
        paper_bgcolor: 'rgba(255,266,255,.75)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: currentColumnNames[index],
        margin: {
            l: 20,
            r: 80,
            t: 50,
            b: 76,
            pad: 0,
            autoexpand: false
        },
        xaxis: {
            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            }
        },
        yaxis: {

            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            }
        },
        boxmode: 'group'
    };

    Plotly.newPlot('boxPlot' + (index + 1), boxPlotData[index], layout);
}

function plotBoxPlots() {
    setBoxPlotData(0);
    plotBoxPlot(0);
    setBoxPlotData(1);
    plotBoxPlot(1);
}

function setCurvePlotData(index) {
    let x = getNumberColumn(avgData, currentColumnNames[index]);
    if (x == null) x = [];
    let y = getColumn(avgData, 'Depth').map(d => +d.split('-')[1]);
    if (y == null) y = [];
    let x1 = x.slice(0, 13);//First 13 is for 10cm, the last are for the 6 levels
    let x2 = x.slice(13);
    let y1 = y.slice(0, 13);//First 13 is for 10cm, the last are for the 6 levels
    let y2 = y.slice(13);
    adjustedRSquaredScores[index] = calculateAdjustedRSquared(x1, y1, x2, y2);
    curvePlotData[index] = [{
        x: x1,
        y: y1,
        type: 'scatter',
        name: '10cm',
        mode: 'lines',
        line: {shape: 'spline'}
    }, {
        x: x2,
        y: y2,
        type: 'scatter',
        name: 'Horizon',
        mode: 'lines',
        line: {shape: 'spline'}
    }
    ];
}

function calculateAdjustedRSquared(x1, y1, x2, y2) {
    if (x1.length === 0) {
        return 0;
    }
    let result;
    let points = x2.map((v, i) => [v, y2[i]]);
    var line = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveCardinal);

    var tempSvg = document.createElement('svg');
    tempSvg = d3.select(tempSvg);
    var tempPath = tempSvg.append("svg:path").attr("d", line(points));
    var tpNode = tempPath.node();
    let prevY = 0;
    let currY = 0;
    let x2Interpolated = [];
    let y2Interpolated = [];
    let counter = 0;
    let totalLength = tpNode.getTotalLength();
    let step = 0.01;
    var curlen = 0;
    while (curlen <= totalLength + step) {
        prevY = currY;
        let point = getXY(curlen);
        currY = point[1];
        if (prevY < y1[counter] && currY >= y1[counter]) {
            x2Interpolated.push(point[0]);
            y2Interpolated.push(point[1]);
            counter += 1;
        }
        curlen += step;
    }

    function getXY(len) {
        var point = tpNode.getPointAtLength(len);
        return [point.x, point.y];
    }

    let sse = ss.sum(x2Interpolated.map((x2v, i) => (x1[i] - x2v) * (x1[i] - x2v)));
    let mx1 = ss.mean(x1);
    let sst = ss.sum(x1.map((x1v) => (x1v - mx1) * (x1v - mx1)));
    result = 1 - (sse / sst);
    return result;
}

function plotCurvePlot(index) {

    let layout = {
        paper_bgcolor: 'rgba(255,266,255,.75)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: currentColumnNames[index] + ", R-Squared:" + adjustedRSquaredScores[index].toFixed(3),
        margin: {
            l: 120,
            r: 120,
            t: 50,
            b: 76,
            autoexpand: false
        },
        xaxis: {
            showgrid: true,
            zeroline: false,
            showline: true,
            autotick: true,
            autorange: true,
            showticklabels: true,
            ticklen: 4,
            tickwidth: 2,
            tickcolor: '#000',
            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            },

        },
        yaxis: {
            showgrid: true,
            zeroline: false,
            showline: true,
            autotick: true,
            showticklabels: true,
            ticklen: 4,
            tickwidth: 2,
            tickcolor: '#000',
            tickfont: {
                family: "Impact",
                size: 12,
                color: "black"
            },
            range: [140, 0]
        },
        legend: {
            "orientation": "h",
            bgcolor: 'rgba(0, 0, 0, 0)'
        }

    };

    Plotly.newPlot('curvePlot' + (index + 1), curvePlotData[index], layout);
    //Then remove the clip-path, since this clipath is cutting off the curves
    d3.select(`#curvePlot${index + 1}`).select('.plot').attr('clip-path', '');
    //Add toggle button
    addToggleAxesButton(index);
}

function plotCurvePlots() {
    setCurvePlotData(0);
    plotCurvePlot(0);
    setCurvePlotData(1);
    plotCurvePlot(1);

}

function addToggleAxesButton(index) {
    let htmlString =
        '<a id="toggleAxesBtn" rel="tooltip" class="modebar-btn" data-title="Toggle axes" data-toggle="false" data-gravity="n">' +
        '<svg width="16" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">' +
        '<g><g><path d="M846.7,153.7c-191.2-191.5-501.5-191.7-693-0.4c-191.5,191.2-191.7,501.5-0.4,693c191.2,191.5,501.5,191.7,693,0.4C1037.7,655.5,1037.9,345.2,846.7,153.7z M568.4,810.9c0,7.6-6.1,13.7-13.7,13.7H445.3c-7.6,0-13.7-6.1-13.7-13.7V404.6c0-7.6,6.1-13.7,13.7-13.7h109.5c7.6,0,13.7,6.1,13.7,13.7V810.9z M500,334.1c-43.8,0-79.4-35.6-79.4-79.4c0-43.8,35.6-79.4,79.4-79.4c43.8,0,79.4,35.6,79.4,79.4C579.4,298.5,543.8,334.1,500,334.1z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>' +
        '</svg>' +
        '</a>';
    let theElm = createElementFromHTML(htmlString);
    //Select the div
    let theDiv = d3.select(`#curvePlot${index + 1}`);
    //Set the opacity = 1 by default. Because by default there is no opacity attribute so we can't change it
    theElm.addEventListener('click', () => {
        //Process the toggling here.
        let theXAxisText = theDiv.select('.xaxislayer-above');
        let theYAxisText = theDiv.select('.yaxislayer-above');
        let theXLinesAbove = theDiv.select('.xlines-above.crisp');
        let theYLinesAbove = theDiv.select('.ylines-above.crisp');
        if (theXAxisText.attr("opacity") === null || +theXAxisText.attr("opacity") === 1) {
            theXAxisText.attr("opacity", 0);
            theYAxisText.attr("opacity", 0);
            theXLinesAbove.attr("opacity", 0);
            theYLinesAbove.attr("opacity", 0);
        } else {
            theXAxisText.attr("opacity", 1);
            theYAxisText.attr("opacity", 1);
            theXLinesAbove.attr("opacity", 1);
            theYLinesAbove.attr("opacity", 1);
        }
    }, false);
    let downloadBtn = theDiv.select('[data-title="Download plot as a png"]');
    if (!downloadBtn.empty()) {
        downloadBtn.node().parentNode.insertBefore(theElm, downloadBtn.node());
    }
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function plotScatter() {
    //Do the sorting.
    let scatterData = data.map(function (d) {
        let result = {};
        result[currentColumnNames[0]] = (d[currentColumnNames[0]].indexOf('<LOD') != -1) ? 0 : +d[currentColumnNames[0]];
        result[currentColumnNames[1]] = (d[currentColumnNames[1]].indexOf('<LOD') != -1) ? 0 : +d[currentColumnNames[1]];
        return result;
    });
    scatterData.sort(function (a, b) {
        return a[currentColumnNames[0]] - b[currentColumnNames[0]];
    });

    let xData = getColumn(scatterData, currentColumnNames[0]);
    let yData = getColumn(scatterData, currentColumnNames[1]);
    let model = linearRegiression(xData, yData);
    let yPredictedData = predict(xData, model);
    let scatterTraces = [{
        x: xData,
        y: yData,
        type: 'scatter',
        mode: 'markers',
        name: 'data',
        marker: {
            color: "black"
        }
    }, {
        x: xData,
        y: yPredictedData,
        type: 'scatter',
        mode: 'lines',
        name: 'regression',
        line: {
            color: "rgb(200, 0, 200)"
        }
    }
    ];

    let layout = {
        title: currentColumnNames[0].split(" ")[0] + " vs. " + currentColumnNames[1].split(" ")[0] + ", correlation: " + getCurrentCorrelation(),
        xaxis: {
            title: currentColumnNames[0]
        },
        yaxis: {
            title: currentColumnNames[1]
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            family: "Georgia,Times,serif"
        },
        margin: {
            l: 80,
            r: 80,
            t: 70,
            b: 80,
            pad: 0,
            autoexpand: false
        }
    }
    Plotly.newPlot('scatterPlot', scatterTraces, layout);
}

function getCurrentCorrelation() {
    let corcoef = ss.sampleCorrelation(elmConcentrations[0], elmConcentrations[1]);
    return Math.round(corcoef * 1000) / 1000;
}

//</editor-fold>
/*Creating the the selection box*/
function createByJson(div, jsonData, name, selectedIndex, changeHandler, width) {
    let msdd = $("#" + div).msDropDown({byJson: {data: jsonData, name: name, width: width}}).data("dd");
    msdd.set("selectedIndex", selectedIndex);
    let theOption = $("select[name='" + name + "']");
    theOption.change(changeHandler);
    return theOption;
}

function getAllElements() {
    let headers = d3.keys(data[0]);
    let elements = headers.filter(function (d) {
        return d.indexOf('Concentration') != -1;
    });
    //Create option 1
    let jsonData = [];
    for (let i = 0; i < elements.length; i++) {
        jsonData.push({value: elements[i], text: elements[i]});
    }
    jsonData.sort((a, b) => {
        return a.text.localeCompare(b.text);
    });
    return jsonData;
}

function populateSelectors() {
    //headers
    theOptions[0] = createByJson("option1Container", allElements, "option1", defaultElementIndexes[0], updateElement1);
    theOptions[1] = createByJson("option2Container", allElements, "option2", defaultElementIndexes[1], updateElement2);
}

/*Updating data when the option changes*/
function updateElement1() {
    updateElement(0);
}

function updateElement2() {
    updateElement(1);
}

function updateElement(index) {
    currentColumnNames[index] = theOptions[index].val();
    setElmConcentration(index);
    //Update Contour
    setContourData(index);
    plotContour(index);
    //Update Scatter
    plotScatter();
    //Update the box plot
    setBoxPlotData(index);
    plotBoxPlot(index);
    //Update the curve plot
    setCurvePlotData(index);
    plotCurvePlot(index);
    //Reset the selection circles of the correlation graph.
    resetSelectionCircles();
}

//<editor-fold desc="Section for the force directed layout of the correlation graph"
let graphNodeRadius = 12;
let mouseOverExpand = 6;
let selectionStrokeWidth = 3;
var force;
let maxLinkWidth = 2;
let minLinkWidth = 0.5;
var corScale;
let nodes_data = [];
let links_data = [];
var node;
var link;
let defaultThreshold = 0.75;
let linkStrengthPower = 10;
let selectionCounter = 0;
let selectionCircle;
let defaultMargin = 20;

function getGraphSize(svg) {
    if (!svg) {
        svg = d3.select(svgId);
    }
    let width = svg.node().getBoundingClientRect().width;
    let height = svg.node().getBoundingClientRect().height;
    return [width, height];
}

function createForce() {
    let graphSize = getGraphSize(),
        width = graphSize[0],
        height = graphSize[1];
    let myForce = d3.forceSimulation()
        .velocityDecay(0.5)
        .alphaDecay(0)
        .force("charge", d3.forceManyBody().strength(-80).distanceMin(4 * graphNodeRadius))
        .force("collision", d3.forceCollide(2 * graphNodeRadius).strength(1))
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2));

    force = myForce;
    return myForce;
}

function getNodes() {
    nodes_data = getAllElements();
    return nodes_data;
}

function setLinkData(threshold) {
    nodes_data = force.nodes();
    let links = [];
    for (let i = 0; i < nodes_data.length - 1; i++) {
        let u = getNumberColumn(data, nodes_data[i].value)
        for (let j = i + 1; j < nodes_data.length; j++) {
            let v = getNumberColumn(data, nodes_data[j].value);
            let corcoef = ss.sampleCorrelation(u, v);
            let type = (corcoef >= 0) ? "positive" : "negative"
            let corcoefabs = Math.abs(Math.round(corcoef * 1000) / 1000);
            if (corcoefabs >= threshold) {
                links.push({source: nodes_data[i], target: nodes_data[j], type: type, value: corcoefabs});
            }
        }
    }
    links_data = [];
    links.forEach(e => {
        links_data.push(e)
    });
    return links;
}

function getCorScale(links_data) {

    let maxCor = d3.max(links_data, function (d) {
        return d.value;
    });
    let minCor = d3.min(links_data, function (d) {
        return d.value;
    });
    //Make the scales before filtering
    let corScale = d3.scaleLinear().domain([minCor, maxCor]).range([minLinkWidth, maxLinkWidth]);
    return corScale;
}

//</editor-fold>
//<editor-fold desc="Draw the force directed graph">
function drawGraph() {
    let svg = d3.select(svgId);
    let graphSize = getGraphSize();
    let width = graphSize[0];
    let height = graphSize[0];

    force = createForce();

    nodes_data = getNodes();
    force.nodes(nodes_data);

    setLinkData(defaultThreshold);
    corScale = getCorScale(links_data);
    force.force("link", d3.forceLink(links_data).strength(Math.pow(defaultThreshold, linkStrengthPower)));

    let g = svg.append("g");

    //Links
    link = g.append("g")
        .selectAll("line")
        .data(links_data)
        .enter().append("line")
        .attr("stroke-width", linkWidth)
        .style("stroke", linkColor);

    let node = g.append("defs")
        .selectAll("clipPath")
        .data(nodes_data)
        .enter()
        .append("clipPath")
        .attr("id", (d) => {
            return "clipPath" + d.index;
        })
        .append("circle")
        .attr("fill", "black")
        .attr("r", graphNodeRadius);

    let plot = g.append("g")
        .selectAll("image")
        .data(nodes_data)
        .enter()
        .append("image")
        .attr("id", (d) => {
            return "img" + d.index;
        })
        .attr("clip-path", (d) => "url(#clipPath" + d.index + ")")
        .on("click", (d) => {
            selectionCounter = selectionCounter % 2;
            $("#option" + (selectionCounter + 1) + "Container").msDropDown().data("dd").setIndexByValue(d.value);
            updateElement(selectionCounter);
            selectionCounter += 1;

        }).on("mouseover", (d) => {
            d3.select("#clipPath" + d.index + " circle").attr("r", graphNodeRadius + mouseOverExpand);
            d3.select("#circle" + d.index).attr("r", graphNodeRadius + mouseOverExpand);
            d3.select("#label" + d.index).attr("dy", graphNodeRadius + mouseOverExpand);
        }).on("mouseout", (d) => {
            d3.select("#clipPath" + d.index + " circle").attr("r", graphNodeRadius);
            d3.select("#circle" + d.index).attr("r", graphNodeRadius);
            d3.select("#label" + d.index).attr("dy", graphNodeRadius);
        });

    selectionCircle = g.append("g")
        .selectAll("circle")
        .data(nodes_data)
        .enter()
        .append("circle")
        .attr("id", (d) => "circle" + d.index)
        .attr("r", graphNodeRadius)
        .attr("stroke-width", selectionStrokeWidth)
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("visibility", (d) => (d.value === currentColumnNames[0] || (d.value === currentColumnNames[1])) ? "visible" : "hidden");


    //Plot to the images
    generateNodesWithSVGData((graphNodeRadius + mouseOverExpand) * 2, (graphNodeRadius + mouseOverExpand) * 2, nodes_data);
    //Lablel
    let label = g.append("g")
        .selectAll("text")
        .data(nodes_data)
        .enter().append("text")
        .attr("class", "elementText")
        .text((d) => {
            return d.text.split(" ")[0];
        })
        .attr("id", (d) => "label" + d.index)
        .attr("dy", graphNodeRadius);

    force.on("tick", tickHandler);

    function tickHandler() {
        if (node) {
            node
                .attr("cx", function (d) {
                    return d.x = boundX(d.x);
                })
                .attr("cy", function (d) {
                    return d.y = boundY(d.y);
                });
        }
        if (plot) {
            plot
                .attr("x", (d) => {
                    return d.x - graphNodeRadius - mouseOverExpand;
                })
                .attr("y", (d) => {
                    return d.y - graphNodeRadius - mouseOverExpand;
                })
        }
        if (selectionCircle) {
            selectionCircle.attr("cx", (d) => d.x);
            selectionCircle.attr("cy", (d) => d.y);
        }
        //update link positions
        if (link) {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
        }


        //update label positions
        if (label) {
            label
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y + 2;
                });
        }
    }

    //Handling drag
    let dragHandler = d3.drag()
        .on("start", dragStart)
        .on("drag", dragDrag)
        .on("end", dragEnd);

    dragHandler(plot);

    function dragStart(d) {
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragDrag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnd(d) {
        d.fx = null;
        d.fy = null;
    }

    //Handling zoom
    let zoomHandler = d3.zoom()
        .on("zoom", zoomActions);

    zoomHandler(svg);

    function zoomActions() {
        g.attr("transform", d3.event.transform);
    }

    function boundX(x) {
        return (x > width - graphNodeRadius * 2) ? width - graphNodeRadius * 2 : (x < graphNodeRadius * 2 ? graphNodeRadius * 2 : x);
    }

    function boundY(y) {
        return (y > height - graphNodeRadius * 2) ? height - graphNodeRadius * 2 : (y < graphNodeRadius * 2 ? graphNodeRadius * 2 : y);
    }

    //Now draw the threshold slider
    drawThresholdSlider(svg);
}

function resetSelectionCircles() {
    selectionCircle.attr("visibility", (d) => (d.value === currentColumnNames[0] || (d.value === currentColumnNames[1])) ? "visible" : "hidden");
}

function linkColor(d) {
    return d.type == 'positive' ? 'green' : 'red';
}

function linkWidth(d) {
    return corScale(d.value);
}

//</editor-fold>
//<editor-fold desc="Section for the slider">
function onThreshold(threshold) {
    links_data = setLinkData(threshold);
    link = link.data(links_data);
    link.exit().remove();
    let newLink = link.enter().append("line");
    link = link.merge(newLink);
    //Update the values
    link.attr("stroke-width", linkWidth)
        .style("stroke", linkColor);

    force.force("link", d3.forceLink(links_data).strength(Math.pow(threshold, linkStrengthPower)));
    force.restart();
}

function onOpacityThreshold(threshold) {
    //synchronize the two sliders
    opacitySliders[0].value(threshold);
    opacitySliders[1].value(threshold);
    d3.selectAll(".contour").selectAll(".cartesianlayer").style("opacity", threshold);

}

let sliderHeight = 24;
let sliderWidth = 140;
let sliderMarginRight = 20;

function drawThresholdSlider(svg, label, thresholdHandler) {
    if (!thresholdHandler) {
        thresholdHandler = onThreshold;
    }
    if (!label) {
        label = "Correlation threshold";
    }
    let corThreshold = d3.sliderHorizontal()
        .min(0)
        .max(1.0)
        .width(sliderWidth)
        .tickFormat(d3.format('.4'))
        .ticks(3)
        .default(defaultThreshold)
        .on('onchange', thresholdHandler);
    let graphSize = getGraphSize(svg);
    let graphWidth = graphSize[0];
    let graphHeight = graphSize[1];
    let sliderX = graphWidth - sliderWidth - sliderMarginRight;
    let sliderY = graphHeight - sliderHeight;
    let g = svg.append("g")
        .attr("transform", "translate(" + sliderX + "," + sliderY + ")");

    g.append("text")
        .attr("text-anchor", "start")
        .text("alignment-baseline", "ideographic")
        .attr("dy", "-.4em")
        .text(label);
    g.call(corThreshold);
    return corThreshold;
}

//</editor-fold>
//<editor-fold desc = "Section for the image generator">
/*Section for the image on the graph nodes*/

function generateNodesWithSVGData(imgWidth, imgHeight, nodes_data) {
    let xContour = getGridNumberList(data);
    let yContour = getGridLetterList(data);

    let layout = {
        displayModeBar: false,
        xaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false
        },
        yaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false
        },
        margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 0,
            pad: 0,
            autoexpand: false
        }
    };

    nodes_data.forEach(function (d) {
        let aDiv = document.createElement("div");
        let z = getNumberColumn(data, d.value);
        let colorScale = getContourColorScale(d.value);
        let contourData = [
            {
                x: xContour,
                y: yContour,
                z: z,
                type: 'contour',
                showscale: false,
                colorscale: colorScale,
                line: {
                    smoothing: 0.5,
                    color: 'rgba(0, 0, 0, 0)'
                }
            }
        ];
        Plotly.plot(aDiv, contourData, layout).then(
            function (gd) {
                Plotly.toImage(gd, {format: 'png', width: imgWidth, height: imgHeight}).then(function (svgData) {
                    //d.svgData = svgData;
                    d3.select("#img" + d.index).attr('width', imgWidth).attr('height', imgHeight).attr("xlink:href", svgData);
                });
            }
        );
    });
}

//</editor-fold>
