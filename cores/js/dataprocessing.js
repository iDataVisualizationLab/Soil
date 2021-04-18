class ProfileDescription {
    constructor(csvFile, coreNames, profileName, pictureFile) {
        this.profileName = profileName;
        this.csvFile = csvFile;
        this.pictureFile = pictureFile;
        this.coreNames = coreNames;
        this.csvContent = null;
        this.detectedElements = null;
        this.interpolatedData = null;
    }

    getProfileName() {
        return this.profileName;
    }

    getCsvFile() {
        return this.csvFile;
    }

    getPictureFile() {
        return this.pictureFile;
    }

    getCoreNames() {
        return this.coreNames;
    }

    async getCsvContent() {
        if (!this.csvContent) {
            await this.loadCsvContent();
        }
        return this.csvContent;
    }

    async loadCsvContent() {
        this.csvContent = await d3.csv(this.csvFile);
        const elements = Object.keys(this.csvContent[0]).filter(d => d.indexOf("Concentration") > 0);
        const detectedElements = [];
        elements.forEach(elm => {
            let detected = false;
            for (let i = 0; i < this.csvContent.length; i++) {
                if (this.csvContent[i][elm] > 0) {
                    detected = true;
                    break;
                }
            }
            if (detected) {
                detectedElements.push(elm);
            }
        });
        this.detectedElements = detectedElements;
        //Also convert concentrations into numbers
        this.csvContent.forEach(row => {
            detectedElements.forEach(element => {
                row[element] = +row[element];
            });
        });
    }

    async getElements() {
        if (!this.csvContent) {
            await this.loadCsvContent();
        }
        return this.detectedElements;
    }

    async getDepths() {
        if (!this.csvContent) {
            await this.loadCsvContent();
        }
        return Array.from(new Set(this.csvContent.map(d => d['Sample ID'])));
    }

    async getLocations() {
        if (!this.csvContent) {
            await this.loadCsvContent();
        }
        return Array.from(new Set(this.csvContent.map(d => d['Location'])));
    }

    async getElementScalers() {
        if (!this.csvContent) {
            await this.loadCsvContent();
        }
        const scalers = {};
        const elements = await this.getElements();
        elements.forEach(elm => {
            const elmValues = this.csvContent.map(d => d[elm]);
            const minVal = d3.min(elmValues);
            const maxVal = d3.max(elmValues);
            const domain = [minVal, maxVal];
            let range = [0, 1];
            if (minVal === 0 && maxVal == 0) {
                range = [0, 0];
            }
            scalers[elm] = d3.scaleLinear().domain(domain).range(range);
        });
        return scalers;
    }

    async getParCoordsData() {
        if (!this.csvContent) {
            await this.loadCsvContent();
        }
        const allLocations = await this.getLocations();
        const allElements = await this.getElements();
        const allDepths = await this.getDepths();
        const elementScalers = await this.getElementScalers();
        const parcoordsData = [];
        //This is every depth
        allElements.forEach(element => {
            allLocations.forEach(loc => {
                //Each element in one location is one item (one line)
                const item = {'Element': element.split(" ")[0], 'Location': loc};
                allDepths.forEach(depth => {
                    const elmVal = this.csvContent.filter(d => (d['Location'] === loc) && (d['Sample ID'] === depth))[0][element];
                    item[depth] = elementScalers[element](elmVal);
                });
                parcoordsData.push(item);
            });
        });

        return parcoordsData;
    }

    async getInterpolatedData() {
        if (this.interpolatedData) {
            return this.interpolatedData;
        } else {
            //Load CSV if needed
            if (!this.csvContent) {
                await this.loadCsvContent();
            }
        }
    }
}

function interpolateHorizontalData(csvContent, locationMapping, depthIdx, element) {
    //Get the depth data
    let depthData = csvContent.filter(d => depthNames[d["Sample ID"]] === depthIdx); //should have 13
    console.assert(depthData.length === 13, 'Depth data should = 13');

    //First interpolate horizontally
    let horizontalInterpolatedSteps = 100;
    let horizontalSteps = 5;
    //Known data
    let x = [];
    let y = [];
    let t = [];
    depthData.forEach(row => {
        let locName = row["Location"];
        x.push(locationNameMapping[locName][0] + 0.5);
        y.push(locationNameMapping[locName][1] + 0.5);
        t.push(row[element]);
    });
    //The model
    // var model = "exponential";
    let model = "spherical";
    // let model = "gaussian";
    let sigma2 = 50, alpha = 100;
    let variogram = kriging.train(t, x, y, model, sigma2, alpha);
    //Now interpolate data (elementPlaneStepSize) at a point
    let interpolatedData = {};
    interpolatedData.z = [];
    interpolatedData.x = [];
    interpolatedData.y = [];
    let step = horizontalSteps / horizontalInterpolatedSteps;
    for (let i = 0; i < 5; i = i + step) {
        for (let j = 0; j < 5; j = j + step) {
            interpolatedData.x.push(i);
            interpolatedData.y.push(j);
            interpolatedData.z.push(kriging.predict(i, j, variogram))
        }
    }
    return interpolatedData;
}
