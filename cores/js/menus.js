function createMenuStructure(containerId, soilPackages, elementSelectionChange) {
    //Package Div for heavy metals
    createPackageDiv(containerId, 'heavyMetals', soilPackages.heavyMetalsLabel, 'red', elementSelectionChange, soilPackages.detectedHeavyMetals, soilPackages.notDetectedHeavyMetals);
    //Package div for plant essentials
    createPackageDiv(containerId, 'plantEssentials', soilPackages.plantEssentialElementsLabel, 'green', elementSelectionChange, soilPackages.detectedPlantEssentialElements, soilPackages.notDetectedPlantEssentialElements);

    //Add pedological features package
    // soilPackages.pedologicalFeatures, soilPackages.pedologicalFeaturesLabel, elementSelectionChange, "blue"
    // soilPackages.detectedPedologicalFeatures

    //Others
    // soilPackages.others
    createPackageDiv(containerId, 'others', soilPackages.othersLabel, 'black', elementSelectionChange, soilPackages.others, []);
}

function createPackageDiv(containerId, packageId, packageLabel, packageColor, elementSelectionChange, detectedElements, notDetectedElements) {
    const container = document.getElementById(containerId);

    const childrenDivId = packageId + 'Children';
    const packageDivId = packageId + 'Div';
    // Create a div for the package
    const packageDiv = document.createElement('div');
    packageDiv.style.borderBottom = `1px solid ${packageColor}`;
    packageDiv.style.paddingBottom = '3px';
    packageDiv.id = packageDivId;
    packageDiv.style.display = 'inline';
    container.appendChild(packageDiv);
    //Create the child div for its children
    const childrenDiv = document.createElement('div');
    childrenDiv.id = childrenDivId;
    childrenDiv.style.display = 'none';
    //Now add a label for toggling
    const packageLabelElm = document.createElement('label');
    packageLabelElm.innerHTML = `<b>${packageLabel} &#187;</b>`;
    packageLabelElm.style.color = packageColor;
    packageLabelElm.style.marginTop = '3px';
    packageLabelElm.style.marginBottom = '3px';
    packageLabelElm.style.marginLeft = '5px'
    packageLabelElm.style.marginRight = '5px'
    packageLabelElm.onclick = function () {
        if (childrenDiv.style.display === 'inline') {
            childrenDiv.style.display = 'none';
            packageLabelElm.innerHTML = `<b>${packageLabel} &#187;</b>`;
        } else {
            childrenDiv.style.display = 'inline';
            packageLabelElm.innerHTML = `<b>${packageLabel} &#171;</b>`;
        }
    }

    packageDiv.appendChild(packageLabelElm);
    packageDiv.appendChild(childrenDiv);
    // One option for all
    createCheckBox(childrenDivId, 'All', packageId, true, function (d) {

        detectedElements.forEach(elm => {
            const theElm = document.getElementById(`#${elm}elementSelectionId`);
            if (d.target.checked !== theElm.checked) {
                theElm.click();
            }
        });
    });

    //1. Detected elements
    detectedElements.forEach(elm => {
        const cbx = createCheckBox(childrenDivId, elm, `#${elm}elementSelectionId`, true, elementSelectionChange, elm);
        cbx.value = elm;
    });
    //2. Not detected elements
    notDetectedElements.forEach(elm => {
        let cbx = createCheckBox(childrenDivId, elm, elm, false, () => {
            //Do nothing for not detected elements
        });
        cbx.disabled = true;
        cbx.setAttribute('data-tooltip', 'Not detected');
    })
}
