function SoilPackages(detectedElements) {
    const packages = {
        rcra8Metals: {
            label: "RCRA 8 metals", //https://www.heritage-enviro.com/what-are-the-rcra-8-metals/
            elements: ['As', 'Ba', 'Cd', 'Cr', 'Pb', 'Hg', 'Se', 'Ag'],
            color: 'red',
            //Need to calculate detected and not detected elements and add here
        },
        plantEssentialElements: {
            label: "Plant essentials",
            elements: ['Ca', 'Cu', 'Fe', 'K', 'Mn', 'S', 'Zn'],
            color: 'green',
            //Need to calculate detected and not detected elements and add here
        },
        pedology: {
            label: "Pedology",
            elements: ['RI', 'DI', 'SR'],
            color: 'blue',
        },
        others: {
            label: 'Others',
            elements: [], //need to calculate these
            color: 'black',
            notDetected: [],
        }
    }
    const allKeys = Object.keys(packages);
    //Calculate the others
    packages['others'].elements = detectedElements.filter(e => {
        for (let i = 0; i < allKeys.length; i++) {
            if (packages[allKeys[i]].elements.indexOf(e) >= 0) {
                return false;
            }
        }
        return true;
    });
    packages['others'].detected = packages['others'].elements;

    //Calculate the detected and not detected elements for each package
    allKeys.forEach(key => {
        if (key !== "others") {
            let detected = [];
            let notDetected = [];
            packages[key].elements.forEach(e => {
                if (detectedElements.indexOf(e) >= 0) {
                    detected.push(e);
                } else {
                    notDetected.push(e);
                }
            });
            packages[key].detected = detected;
            packages[key].notDetected = notDetected;
        }
    });
    //Ordering
    return packages;
}


