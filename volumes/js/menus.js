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

function createViewGroups(containerId, groups, groupName, groupSelectionChange, elementSelectionChange, enableAllOption) {
    const allGroupIds = Object.keys(groups);
    const rightPointer = "&#187;";
    const leftPointer = "&#171;";
    allGroupIds.forEach(groupId => {
        const group = groups[groupId];
        const groupLabel = group.label,
            groupColor = group.color,
            groupSelection = group.selection,
            groupOptions = group.options;
        const container = document.getElementById(containerId);
        const childrenDivId = groupId + 'Children';
        const groupDivId = groupId + 'Div';
        // Create a div for the package
        const groupDiv = document.createElement('div');
        groupDiv.style.paddingBottom = '3px';
        groupDiv.id = groupDivId;
        groupDiv.style.display = 'inline';
        container.appendChild(groupDiv);


        //Create the child div for its children
        const childrenDiv = document.createElement('div');
        childrenDiv.id = childrenDivId;
        childrenDiv.style.display = groupSelection ? 'inline' : 'none';
        //Now add a radio button for toggling

        const groupRadioButtonLabel = document.createElement('label');
        groupRadioButtonLabel.id = groupId + 'Label';
        groupRadioButtonLabel.innerHTML = `<b>${groupLabel} ${rightPointer}</b>`;
        groupRadioButtonLabel.style.color = groupSelection ? groupColor : 'gray';
        groupRadioButtonLabel.style.marginTop = '3px';
        groupRadioButtonLabel.style.marginBottom = '3px';
        groupRadioButtonLabel.style.marginLeft = '2px';
        groupRadioButtonLabel.style.marginRight = '2px';
        groupRadioButtonLabel.htmlFor = groupId + "Radio";

        const groupRadio = document.createElement('input');
        groupRadio.type = 'radio';
        groupRadio.id = groupId + 'Radio';
        groupRadio.name = groupName;
        groupRadio.groupId = groupId;
        if (groupSelection) {
            groupRadio.checked = true;
        } else {
            groupRadio.checked = null;
        }
        groupRadio.style.marginTop = '3px';
        groupRadio.style.marginBottom = '3px';
        groupRadio.style.marginLeft = '5px';
        groupRadio.style.marginRight = '5px';

        groupRadio.onclick = function (event) {
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
            //Also call to the group selection change

        }

        groupRadio.onchange = function (event) {
            const groupId = event.target.groupId
            const group = groups[groupId];
            const groupOptions = group.options
            const groupLabel = document.getElementById(groupId + 'Label');

            //If it is selected
            if (event.target.checked) {
                //Change it to its color
                groupLabel.style.color = group.color;
                //Select all the elements under it
                showLoader();
                setTimeout(() => {
                    groupOptions.forEach(elm => {
                        const theElm = document.getElementById(`${elm.id}elementSelectionId`);
                        if (!theElm.checked) {
                            theElm.click(); //Select it if it is not selected
                        }
                    });
                    hideLoader();
                }, 20);
                //Switch all the other groups color to black
                allGroupIds.forEach(gId => {
                    if (gId !== groupId) {
                        const groupLabel = document.getElementById(gId + 'Label');
                        groupLabel.style.color = "gray";
                        //Switch its options off
                        const gOptions = groups[gId].options;
                        gOptions.forEach(elm => {
                            const theElm = document.getElementById(`${elm.id}elementSelectionId`);
                            if (theElm.checked) {
                                theElm.click(); //Uncheck if it is checked
                            }
                        });
                    }
                });
            }
            groupSelectionChange(event);
        }

        groupDiv.appendChild(groupRadio);
        groupDiv.appendChild(groupRadioButtonLabel);
        groupDiv.appendChild(childrenDiv);

        if (enableAllOption) {
            // One option for all
            createCheckBox(childrenDivId, '<b>All</b>', groupId, groupSelection, function (d) {
                showLoader();
                setTimeout(() => {
                    groupOptions.forEach(elm => {
                        const theElm = document.getElementById(`${elm.id}elementSelectionId`);
                        if (d.target.checked !== theElm.checked) {
                            theElm.click();
                        }
                    });
                    hideLoader();
                }, 20);
            });
        }

        //The options
        groupOptions.forEach(elm => {
            const cbx = createCheckBox(childrenDivId, elm.label, `${elm.id}elementSelectionId`, groupSelection, elementSelectionChange, elm);
            cbx.value = elm.id;
        });

    });

    function collapseAGroup(groupId, groupLabel) {
        const childrenDiv = document.getElementById(groupId + 'Children');
        const packageLabelElm = document.getElementById(groupId + 'Label');
        if (childrenDiv.style.display === 'inline') {
            childrenDiv.style.display = 'none';
            packageLabelElm.innerHTML = `<b>${groupLabel} ${leftPointer}</b>`;
        }
    }

    function expandAGroup(groupId, groupLabel) {
        const childrenDiv = document.getElementById(groupId + 'Children');
        const packageLabelElm = document.getElementById(groupId + 'Label');

        if (childrenDiv.style.display === 'none') {
            childrenDiv.style.display = 'inline';
            packageLabelElm.innerHTML = `<b>${groupLabel} ${rightPointer}</b>`;
        }
    }
}
