function SoilPackages(detectedElements) {
    //https://www.heritage-enviro.com/what-are-the-rcra-8-metals/
    let heavyMetalsLabel = "RCRA 8 metals";
    let heavyMetals = ['As', 'Ba', 'Cd', 'Cr', 'Pb', 'Hg', 'Se', 'Ag'];

    let plantEssentialElementsLabel = "Plant essentials";
    let plantEssentialElements = ['Ca', 'Cu', 'Fe', 'K', 'Mn', 'S', 'Zn'];

    let pedologicalFeaturesLabel = "Pedology";
    let pedologicalFeatures = ['RI', 'DI', 'SR'];

    let othersLabel = "Others";
    let others = detectedElements.filter(e => heavyMetals.indexOf(e) < 0 && plantEssentialElements.indexOf(e) < 0 && pedologicalFeatures.indexOf(e) < 0);

    let packages = [heavyMetalsLabel, plantEssentialElementsLabel, pedologicalFeaturesLabel, othersLabel];

    let detectedHeavyMetals = [];
    let notDetectedHeavyMetals = [];
    heavyMetals.forEach(e => {
        if (detectedElements.indexOf(e) >= 0) {
            detectedHeavyMetals.push(e);
        } else {
            notDetectedHeavyMetals.push(e);
        }
    });
    let detectedPlantEssentialElements = [];
    let notDetectedPlantEssentialElements = [];
    plantEssentialElements.forEach(e => {
        if (detectedElements.indexOf(e) >= 0) {
            detectedPlantEssentialElements.push(e);
        } else {
            notDetectedPlantEssentialElements.push(e);
        }
    });
    let detectedPedologicalFeatures = [];
    let notDetectedPedologicalFeatures = [];
    pedologicalFeatures.forEach(e => {
        if (detectedElements.indexOf(e) >= 0) {
            detectedPedologicalFeatures.push(e);
        } else {
            notDetectedPedologicalFeatures.push(e);
        }
    });

    function getDetectedElementsFromPackageName(packageName) {
        if (packageName === heavyMetalsLabel) {
            return detectedHeavyMetals;
        }
        if (packageName === plantEssentialElementsLabel) {
            return detectedPlantEssentialElements;
        }
        if (packageName === pedologicalFeaturesLabel) {
            return detectedPedologicalFeatures;
        }
        if (packageName === othersLabel) {
            return others;
        }
    }

    //Exporting
    this.heavyMetals = heavyMetals;
    this.detectedHeavyMetals = detectedHeavyMetals;
    this.notDetectedHeavyMetals = notDetectedHeavyMetals;

    this.plantEssentialElements = plantEssentialElements;
    this.detectedPlantEssentialElements = detectedPlantEssentialElements;
    this.notDetectedPlantEssentialElements = notDetectedPlantEssentialElements;

    this.pedologicalFeatures = pedologicalFeatures;
    this.detectedPedologicalFeatures = detectedPedologicalFeatures;
    this.notDetectedPedologicalFeatures = notDetectedPedologicalFeatures;
    this.others = others;

    this.heavyMetalsLabel = heavyMetalsLabel;
    this.plantEssentialElementsLabel = plantEssentialElementsLabel;
    this.pedologicalFeaturesLabel = pedologicalFeaturesLabel;
    this.othersLabel = othersLabel;

    this.getDetectedElementsFromPackageName = getDetectedElementsFromPackageName;
    this.packages = packages;
}


