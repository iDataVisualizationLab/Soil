class ProfileDescription {
    constructor(csvFile, locationMapping, profileName, pictureFile) {
        this.profileName = profileName;
        this.csvFile = csvFile;
        this.pictureFile = pictureFile;
        this.locationMapping = locationMapping;
        this.csvContent = null;
        this.detectedElements = null;
        this.interpolatedData = null;
    }

    getProfileName() {
        return this.profileName;
    }

    getPictureFile() {
        return this.pictureFile;
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
        let detectedElements = [];
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

        //Add data for the three formulas
        const addedData = cleanAndAddPedologicalFeatures(this.csvContent, ['Location', 'Sample ID'].concat(detectedElements));
        //Update data
        this.csvContent = addedData.rows;
        //Update detected elements
        detectedElements = detectedElements.concat(addedData.addedElements);
        this.detectedElements = detectedElements;
        //Also convert concentrations into numbers
        this.csvContent.forEach(row => {
            detectedElements.forEach(element => {
                row[element] = +row[element];
            });
        });
        debugger

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
            // const domain = [0, maxVal];
            let range = [0, 1];
            if (minVal === 0 && maxVal == 0) {
                range = [0, 0];
            }
            scalers[elm] = d3.scaleLinear().domain(domain).range(range);
        });
        return scalers;
    }

    async getVerticalParCoordsData() {
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

    async getParCoordsData() {
        if (!this.csvContent) {
            await this.loadCsvContent();
        }
        const allLocations = await this.getLocations();
        const allElements = await this.getElements();

        //Sort/order the elements by their max values
        const scalers = await this.getElementScalers();
        allElements.sort((a, b) => {
            return scalers[b].domain()[1] - scalers[a].domain()[1];
        });

        const allDepths = await this.getDepths();
        const parcoordsData = [];
        //This is every element
        allLocations.forEach(loc => {
            allDepths.forEach(depth => {
                //Each element in one location is one item (one line)
                const item = {'Site': loc, 'Depth': `${(+depth.split('-')[0] + 5)} cm`};
                allElements.forEach(element => {
                    const elmVal = this.csvContent.filter(d => (d['Location'] === loc) && (d['Sample ID'] === depth))[0][element];
                    item[element.split(' ')[0]] = elmVal;
                });
                parcoordsData.push(item);
            });
        });

        return parcoordsData;
    }
}

class Interpolator {
    constructor(csvContent, elements, depthNames, locationNameMapping, depthSteps, horizontalSteps, elementScalers) {
        this.elementScalers = elementScalers;
        this.csvContent = csvContent;
        this.elements = elements;
        this.depthNames = depthNames;
        this.locationNameMapping = locationNameMapping;
        this.depthSteps = depthSteps;
        this.horizontalSteps = horizontalSteps;
        this.interpolatedData = {};
        this.interpolatedElementalDepthData = null;
        this.horizontalRectSize = 200 / this.horizontalSteps;
    }

    /**
     * This method generate teh interpolated data at every depth (depthIdx from 0 to 9) for every element
     * @return an object that has a key for every element, each element there is an array of interpolated value at a depth for all depths
     */
    getInterpolatedElementalDepthData() {
        if (!this.interpolatedElementalDepthData) {
            this.interpolatedElementalDepthData = {};
            const elements = this.elements;
            elements.forEach(elm => {
                this.interpolatedElementalDepthData[elm] = new Array(10);
                for (let depthIdx = 0; depthIdx < 10; depthIdx++) {
                    this.interpolatedElementalDepthData[elm][depthIdx] = this.interpolateHorizontalData(depthIdx, elm);
                }
            });
        }
        return this.interpolatedElementalDepthData;
    }

    /**
     * Interpolate data for an element at a specific depth (a depth from 0 to 9 discretely, not every interpolated step)
     * @param depthIdx
     * @param element
     * @return Object that contains interpolated data for an element at a depth
     */
    interpolateHorizontalData(depthIdx, element) {
        //Get the depth data
        let csvContent = this.csvContent;
        let depthData = csvContent.filter(d => this.depthNames[d["Sample ID"]] === depthIdx); //should have 13
        //First interpolate horizontally
        //Known data
        let x = [], z = [], t = [];
        depthData.forEach(row => {
            let locName = row["Location"];
            x.push((this.locationNameMapping[locName][0] + 0.5) * (this.horizontalSteps / 5));
            z.push((this.locationNameMapping[locName][1] + 0.5) * (this.horizontalSteps / 5));
            t.push(row[element]);
        });
        //The model
        let model = "spherical";
        let sigma2 = 0, alpha = 100;
        let variogram = kriging.train(t, x, z, model, sigma2, alpha);
        //Now interpolate data (elementPlaneStepSize) at a point
        let interpolatedData = {};
        interpolatedData.t = [];
        interpolatedData.x = [];
        interpolatedData.z = [];
        //Note that we push z first, means z acts as row and x acts as column
        for (let zValIdx = 0; zValIdx < this.horizontalSteps; zValIdx++) {
            for (let xValIdx = 0; xValIdx < this.horizontalSteps; xValIdx++) {
                interpolatedData.x.push(xValIdx);
                interpolatedData.z.push(zValIdx);
                let predictedVal = kriging.predict(xValIdx, zValIdx, variogram);
                if (predictedVal < 0) predictedVal = 0;
                interpolatedData.t.push(predictedVal);
            }
        }
        return interpolatedData;
    }

    /**
     * Get the complete interpolated data (for x, y, z at every interpolated steps, details)
     * @param element
     * @return complete interpolated data (for x, y, z at every interpolated steps, details)
     */
    getInterpolatedData(element) {
        if (!this.interpolatedData[element]) {
            //Initialize it
            this.interpolatedData[element] = {};
            this.interpolatedData[element].t = [];
            this.interpolatedData[element].x = [];
            this.interpolatedData[element].y = [];
            this.interpolatedData[element].z = [];
            const interpolatedElementalDepthData = this.getInterpolatedElementalDepthData();//will provide x, z, for some y

            //Now interpolate each z
            for (let zValIdx = 0; zValIdx < this.horizontalSteps; zValIdx++) {
                //Get the known data for this zValIdx
                const x = [];
                const y = [];
                const t = [];
                //known y
                for (let depthIdx = 0; depthIdx < 10; depthIdx++) {
                    const interpolatedDataAtDepth = interpolatedElementalDepthData[element][depthIdx];
                    //Known indices for known x and t values
                    const startKnownValIdx = zValIdx * this.horizontalSteps;
                    const yVal = (depthIdx + 0.5) * (this.horizontalSteps / 10);
                    //known x
                    for (let xValIdx = 0; xValIdx < this.horizontalSteps; xValIdx++) {
                        if (xValIdx % 10 === 0) {
                            const xVal = interpolatedDataAtDepth.x[startKnownValIdx + xValIdx];
                            const tVal = interpolatedDataAtDepth.t[startKnownValIdx + xValIdx];
                            x.push(xVal);
                            y.push(yVal);
                            t.push(tVal);
                        }
                    }
                }
                //Create the model
                //The model
                let model = "spherical";
                let sigma2 = 0, alpha = 100;
                let variogram = kriging.train(t, x, y, model, sigma2, alpha);
                //Now interpolate data (elementPlaneStepSize) at a point
                for (let xValIdx = 0; xValIdx < this.horizontalSteps; xValIdx++) {
                    for (let yValIdx = 0; yValIdx < this.depthSteps; yValIdx++) {
                        this.interpolatedData[element].x.push(xValIdx);
                        this.interpolatedData[element].y.push(yValIdx);
                        this.interpolatedData[element].z.push(zValIdx);
                        let predictedVal = kriging.predict(xValIdx, yValIdx, variogram);
                        predictedVal = this.elementScalers[element](predictedVal)
                        if (predictedVal < 0) predictedVal = 0;
                        if (predictedVal > 1) predictedVal = 1;
                        this.interpolatedData[element].t.push(predictedVal);
                    }
                }
            }
        }
        return this.interpolatedData[element];
    }

}

