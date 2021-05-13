function createMenuStructure(containerId, soilPackages, elementSelectionChange) {
    const allPackageIds = Object.keys(soilPackages);
    //Setup mouseover
    this.mouseoverLabelHandler = undefined;
    this.mouseleaveLabelHandler = undefined;
    allPackageIds.forEach(packageId => {
        const pkgInfo = soilPackages[packageId];
        createPackageDiv(containerId, packageId, pkgInfo.label, pkgInfo.color, pkgInfo.selected, (evt) => {
            elementSelectionChange(evt);
            updateGroupLabelColor();
        }, pkgInfo.detected, pkgInfo.notDetected, soilPackages);
        document.getElementById(packageId + 'Label').onmouseover = (evt) => {
            //Call to the mouseover handler giving the detected elements
            if (this.mouseoverLabelHandler) {
                this.mouseoverLabelHandler(pkgInfo.detected, pkgInfo.color);
            }

        };
        document.getElementById(packageId + 'Label').onmouseleave = (evt) => {
            //Call to the mouseleave handler giving the detected elements
            if (this.mouseleaveLabelHandler) {
                this.mouseleaveLabelHandler(pkgInfo.detected, 'black');
            }

        };

    });

    function updateGroupLabelColor() {
        allPackageIds.forEach(packageId => {
            const pkgInfo = soilPackages[packageId];
            let color = 'gray';
            for (let i = 0; i < pkgInfo.detected.length; i++) {
                const elm = pkgInfo.detected[i];
                if (document.getElementById(`${elm}elementSelectionId`).checked) {
                    color = pkgInfo.color;
                }
            }
            document.getElementById(packageId + 'Label').style.color = color;
        });
    }

    return this;
}

function createPackageDiv(containerId, groupId, groupLabel, groupColor, groupSelection, elementSelectionChange, enabledElements, disabledElements, groups) {
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
    packageLabelElm.style.color = groupSelection ? groupColor : 'gray';
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
    createCheckBox(childrenDivId, '<b>All</b>', groupId, groupSelection, function (d) {
        showLoader();
        setTimeout(() => {
            enabledElements.forEach(elm => {
                const theElm = document.getElementById(`${elm}elementSelectionId`);
                if (d.target.checked !== theElm.checked) {
                    theElm.click();
                }
            });
            hideLoader();
        }, 20);

    });

    //1. Detected elements
    enabledElements.forEach(elm => {
        const cbx = createCheckBox(childrenDivId, elm, `${elm}elementSelectionId`, groupSelection, elementSelectionChange, elm);
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
