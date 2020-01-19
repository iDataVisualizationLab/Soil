let colors5 = ["#4A8FC2", "#A6C09D", "#FAFA7C", "#EC9248", "#D63128"];
let colors10 = ["#4A8FC2", "#76A5B1", "#9DBCA2", "#C3D392", "#E8EC83", "#F8E571", "#F2B659", "#EB8C47", "#EB8C47", "#D63128"];
let colors20 = ['#4A8FC2', '#609ABB', '#71A2B3', '#87AFAC', '#98B9A5', '#AAC29B', '#BBCF93', '#CEDB8C', '#E2E888', '#F4F581', '#F8F076', '#F7DA6A', '#F4C461', '#F0AE57', '#EC994C', '#E98544', '#E5713C', '#E05C33', '#DC472D', '#D53327'];

//<editor-fold desc="colors">
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
//</editor-fold>

//<editor-fold desc="colors">
let contourColorScales = {
    Profile1: p1ColorScales,
    Profile2: p2ColorScales,
    Profile3: p3ColorScales,
    others: p1ColorScales
};

//</editor-fold>