function createMenuStructure(containerId, soilPackages, elementSelectionChange) {
    debugger
    const allPackageIds = Object.keys(soilPackages);
    allPackageIds.forEach(packageId => {
        const pkgInfo = soilPackages[packageId];
        createPackageDiv(containerId, packageId, pkgInfo.label, pkgInfo.color, elementSelectionChange, pkgInfo.detected, pkgInfo.notDetected, soilPackages);
    });
}

function createPackageDiv(containerId, groupId, groupLabel, groupColor, elementSelectionChange, enabledElements, disabledElements, groups) {
    const allGroupIds = Object.keys(groups);
    const container = document.getElementById(containerId);
    const childrenDivId = groupId + 'Children';
    const packageDivId = groupId + 'Div';
    // Create a div for the package
    const packageDiv = document.createElement('div');
    packageDiv.style.borderBottom = `1px solid ${groupColor}`;
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
    packageLabelElm.id = groupId + 'Label';
    packageLabelElm.innerHTML = `<b>${groupLabel} &#187;</b>`;
    packageLabelElm.style.color = groupColor;
    packageLabelElm.style.marginTop = '3px';
    packageLabelElm.style.marginBottom = '3px';
    packageLabelElm.style.marginLeft = '5px'
    packageLabelElm.style.marginRight = '5px'
    packageLabelElm.onclick = function () {
        if (childrenDiv.style.display === 'inline') {
            collapseAGroup(groupId, groupLabel);
        } else {
            expandAGroup(groupId, groupLabel);
            //Collapse other packages
            allGroupIds.forEach(otherGrpId => {
                if (otherGrpId !== groupId) {
                    //Collapse them
                    const otherGrpLabel = groups[otherGrpId].label;
                    collapseAGroup(otherGrpId, otherGrpLabel);
                }
            });
        }
    }

    packageDiv.appendChild(packageLabelElm);
    packageDiv.appendChild(childrenDiv);
    // One option for all
    createCheckBox(childrenDivId, '<b>All</b>', groupId, true, function (d) {
        showLoader();
        setTimeout(() => {
            enabledElements.forEach(elm => {
                const theElm = document.getElementById(`#${elm}elementSelectionId`);
                if (d.target.checked !== theElm.checked) {
                    theElm.click();
                }
            });
            hideLoader();
        }, 20);

    });

    //1. Detected elements
    enabledElements.forEach(elm => {
        const cbx = createCheckBox(childrenDivId, elm, `#${elm}elementSelectionId`, true, elementSelectionChange, elm);
        cbx.value = elm;
    });
    //2. Not detected elements
    disabledElements.forEach(elm => {
        let cbx = createCheckBox(childrenDivId, `<sppan style="color:gray;">${elm}</span>`, elm, false, () => {
            //Do nothing for not detected elements
        });
        cbx.disabled = true;
        cbx.setAttribute('data-tooltip', 'Not detected');
    });

    function collapseAGroup(groupId, groupLabel) {
        const childrenDiv = document.getElementById(groupId + 'Children');
        const packageLabelElm = document.getElementById(groupId + 'Label');

        if (childrenDiv.style.display === 'inline') {
            childrenDiv.style.display = 'none';
            packageLabelElm.innerHTML = `<b>${groupLabel} &#187;</b>`;
        }
    }

    function expandAGroup(groupId, groupLabel) {
        const childrenDiv = document.getElementById(groupId + 'Children');
        const packageLabelElm = document.getElementById(groupId + 'Label');

        if (childrenDiv.style.display === 'none') {
            childrenDiv.style.display = 'inline';
            packageLabelElm.innerHTML = `<b>${groupLabel} &#171;</b>`;
        }
    }

}
