let profileDescriptions = {};
let renderer;
let clocks = [new THREE.Clock(), new THREE.Clock()];
let horizCutTranslationClock = new THREE.Clock();
const elementInfos = [];
let circleTextureHandlers, squareTextureHandlers;
const selectedElements = ["Ca Concentration", "Rb Concentration"];
let selectedVolumeRenderedElement = "Ca Concentration";
let vrs = {};
let pc;
let allDimensions;
let theProfileHandler;
let timePassed = [0, 0];
let profileNames = ['L', 'S', 'R'];
showLoader();
handleProfileChange(profileNames).then(profileHandler => {
    hideLoader();
    theProfileHandler = profileHandler;
});

async function handleProfileChange(profileNames) {
    const profileToCanvasScale = d3.scaleLinear().domain([-0.5, 0.5]).range([0, 49]);
    const profileToXCutCanvasScale = d3.scaleLinear().domain([-0.5, 0.5]).range([0, 49]);
    const profileToYCutCanvasScale = profileToCanvasScale;
    const profileToZCutCanvasScale = d3.scaleLinear().domain([-0.5, 0.5]).range([49, 0]);

    //<editor-fold desc="Setting up data">
    //Setup data
    //Load all three
    const allProfilesElements = {};
    const allProfilesIPs = {};
    const elements = [];
    const elementDomains = {};
    for (let i = 0; i < profileNames.length; i++) {
        const profileName = profileNames[i];
        if (!profileDescriptions[profileName]) {
            profileDescriptions[profileName] = new ProfileDescription(`./data/${profileName}.csv`, systemConfigurations.profiles[profileName].locationNameMapping);
            const elms = await profileDescriptions[profileName].getElements();
            allProfilesElements[profileName] = elms;
            const elementScalers = await profileDescriptions[profileName].getElementScalers();
            //Process the elements and domains
            elms.forEach(elm => {
                if (elements.indexOf(elm) < 0) {//Not exist
                    elements.push(elm);
                    elementDomains[elm] = elementScalers[elm].domain();
                } else {//If exist, update domain
                    const newDomain = elementScalers[elm].domain();
                    if (elementDomains[elm][0] > newDomain[0]) {
                        elementDomains[elm][0] = newDomain[0];
                    }
                    if (elementDomains[elm][1] < newDomain[1]) {
                        elementDomains[elm][1] = newDomain[1];
                    }
                }
            });
        }
    }


    //Create the element scalers for all the profiles (each element uses the same scaler throughout all profiles)
    const elementScalers = {};
    elements.forEach(elm => {
        elementScalers[elm] = d3.scaleLinear().domain(elementDomains[elm]).range([0, 1]);
    });

    //Create the interpolators
    for (let i = 0; i < profileNames.length; i++) {
        const profileName = profileNames[i];
        let csvContent = await profileDescriptions[profileName].getCsvContent();
        //For each profile if there is an element which is not detected
        // add it with 0 for each location and each site
        const profileElements =  await allProfilesElements[profileName];
        elements.forEach(elm=>{
            if(profileElements.indexOf(elm)<0){
                csvContent.forEach(obj=>{
                    obj[elm] = 0;
                    return obj;
                });
            }
        });
        const ip = new Interpolator(csvContent, elements, systemConfigurations.depthNames, systemConfigurations.profiles[profileName].locationNameMapping, 50, 50, elementScalers);
        allProfilesIPs[profileName] = ip;
    }


    //Color scale
    let colorScale = systemConfigurations.quantiles ? quantileColorScale : continuousColorScale;

    //</editor-fold>

    //<editor-fold desc="Menu">
    let soilPackages = new SoilPackages(elements.map(d => d.split(' ')[0]));
    //Clean the menu
    document.getElementById('elementSelectionList').innerHTML = "";
    const menuObj = createMenuStructure('elementSelectionList', soilPackages, elementSelectionChange);
    menuObj.mouseoverLabelHandler = function (elements, color) {
        pc.svg.selectAll('.dimension').filter(d => elements.indexOf(d) >= 0).selectAll('text').attr('fill', color);
    };
    menuObj.mouseleaveLabelHandler = function (elements, color) {
        pc.svg.selectAll('.dimension').filter(d => elements.indexOf(d) >= 0).selectAll('text').attr('fill', color);
    };

    function elementSelectionChange(evt) {
        let elm = evt.target.value;
        //Current dims
        let dims = pc.dimensions();
        if (evt.target.checked) {
            //The code is long here to keep the order
            const selected = Object.keys(dims);
            selected.push(elm);
            dims = {};
            Object.keys(allDimensions).forEach((key, i) => {
                if (selected.indexOf(key) >= 0) {
                    dims[key] = allDimensions[key];
                    dims[key].index = i; //This index helps to reorder the dimensions
                }
            });

        } else {
            //Remove dimension
            delete dims[elm];
        }

        //Update
        pc.dimensions(dims);
        //Re-setup dimensions (events and ticks etc).
        pc.setupDimensions();
        //Also reset the brush
        pc.brushChange();

    };
    //</editor-fold>

    //<editor-fold desc="Parallel Coordinates">
    //Process the parcoords data for all profiles
    const pcData = [];
    for (let i = 0; i < profileNames.length; i++) {
        const profileName = profileNames[i];
        const profileData = await profileDescriptions[profileName].getParCoordsData();
        profileData.forEach(record => {
            pcData.push({'profile': profileName, ...record});
        });
        //For each profile if there is an element which is not detected
        // add it with 0 for each location and each site
        const profileElements =  await allProfilesElements[profileName];
        elements.forEach(elm=>{
            if(profileElements.indexOf(elm)<0){
                pcData.forEach(obj=>{
                    if(obj['profile'] === profileName){
                        obj[elm.split(' ')[0]] = 0;
                    }
                });
            }
        });
    }

    pc = createCoresParcoords(pcData, elementScalers, allProfilesIPs, colorScale);
    //save all dimensions for future use
    allDimensions = {...pc.dimensions()};
    //Remove the others package by default
    let dims = pc.dimensions();
    soilPackages.others.elements.forEach(elm => {
        delete dims[elm];
    });
    pc.dimensions(dims);

    //</editor-fold>

    //<editor-fold desc="The volume renderer">
    // const ip1 = new Interpolator(csvContent, elements, systemConfigurations.depthNames, systemConfigurations.profiles[profileName].locationNameMapping, 50, 100, elementScalers);
    for (let i = 0; i < profileNames.length; i++) {
        const profileName = profileNames[i];
        let vr = vrs[profileName];
        const ip = allProfilesIPs[profileName];
        if (!vr) {
            vr = new createVolumeRenderer(
                document.getElementById('volumeRenderer' + profileName),
                ip.getInterpolatedData(selectedVolumeRenderedElement),
                layoutObject.volumeRenderer.width,
                layoutObject.volumeRenderer.height,
                50,
                50,
                colorScale,
                document.getElementById('volumeRenderer' + profileNames[0])
            );
            vrs[profileName] = vr;
        } else {
            vr.handleDataChange(ip.getInterpolatedData(selectedVolumeRenderedElement));
        }
        //Update the face
        const locFaceTx = new TextureHandler().createLocationTexture(systemConfigurations.profiles[profileName].locationNameMapping, 300);
        vr.changeLocationFace(locFaceTx);
        const depthFaceTx = new TextureHandler(undefined, undefined, undefined, systemConfigurations.profiles[profileName].locationInfo.stepDistance).createDepthTexture(300);
        vr.changeDepthFace(depthFaceTx);
    }

    //</editor-fold>

    //Handlers
    function handleLegendChange(elm) {
        if (systemConfigurations.quantiles) {
            legend({
                svgId: `colorLegend`,
                color: quantileColorScale,
                title: `${elm} Concentration: Quantiles`,
                tickSize: 0,
                tickFormat: ",.1f",
                ticks: colorQuantiles.length,
                width: 400
            });
        } else {
            const elmScaler = elementScalers[elm];
            const range = colorScale.range();
            const domain = colorScale.domain().map(d => elmScaler.invert(d));
            legend({
                svgId: `colorLegend`,
                color: d3.scaleLinear(domain, range),
                title: `${elm} Concentration: Parts Per Million (PPM)`,
                tickSize: 0,
                tickFormat: ",.0f",
                ticks: colorQuantiles.length,
                width: 400
            });
        }
    }
    handleLegendChange(selectedVolumeRenderedElement);
    this.handleLegendChange = handleLegendChange;

    return this;
}

function removeAxes(name) {
    pc.removeAxes([name]);
}
