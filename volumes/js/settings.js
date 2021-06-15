let depthNames;
let locationNameMapping;

const systemConfigurations = {
    cylinderView: true,
    quantiles: false,
    autoRotate: false,
    autoTranslationDirection: {
        x: 1,
        y: 1,
        z: 1
    },
    autoRotateSpeed: 20,
    autoTranslateSpeed: 20,
    helpEnabled: false,
    isOuterVisible: true,
    isHorizCutVisible: true,
    isVertiCutVisible: true,
    isXCutVisible: false,
    isYCutVisible: false,
    isZCutVisible: false,
    depthNames: {
        "0-10 cm": 9,
        "10-20 cm": 8,
        "20-30 cm": 7,
        "30-40 cm": 6,
        "40-50 cm": 5,
        "50-60 cm": 4,
        "60-70 cm": 3,
        "70-80 cm": 2,
        "80-90 cm": 1,
        "90-100 cm": 0
    },
    profiles: {
        "L": {
            locationNameMapping: {
                "L1": [1, 1],
                "L2": [2, 1],
                "L3": [2, 0],
                "L4": [3, 1],
                "L5": [0, 2],
                "L6": [1, 2],
                "L7": [2, 2],
                "L8": [3, 2],
                "L9": [4, 2],
                "L10": [1, 3],
                "L11": [2, 3],
                "L12": [3, 3],
                "L13": [2, 4]
            },
            locationInfo: {
                lat: 33.747547370160966,
                long: -101.913188856191468,
                distance: 50000,
                stepDistance: 200,
            },
            cachedInterpolators: {},
        },
        "R": {
            locationNameMapping: {
                "R1": [1, 1],
                "R12": [2, 1],
                "R8": [2, 0],
                "R4": [3, 1],
                "R9": [0, 2],
                "R11": [1, 2],
                "R5": [2, 2],
                "R13": [3, 2],
                "R6": [4, 2],
                "R2": [1, 3],
                "R10": [2, 3],
                "R3": [3, 3],
                "R7": [2, 4]
            },
            locationInfo: {
                lat: 33.83461039087063,
                long: -102.4674384046790868,
                distance: 50000,
                stepDistance: 100,
            },
            cachedInterpolators: {},
        },
        "S": {
            locationNameMapping: {
                "S1": [1, 1],
                "S12": [2, 1],
                "S8": [2, 0],
                "S4": [3, 1],
                "S9": [0, 2],
                "S11": [1, 2],
                "S5": [2, 2],
                "S13": [3, 2],
                "S6": [4, 2],
                "S2": [1, 3],
                "S10": [2, 3],
                "S3": [3, 3],
                "S7": [2, 4]
            },
            locationInfo: {
                lat: 33.744746287327004,
                long: -101.916557538506922,
                distance: 25000,
                stepDistance: 100,
            },
            cachedInterpolators: {},
        }
    }
}
