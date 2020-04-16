function createMenus(elements, elementSelectionChange) {
    let elementSelectionList = d3.select('#elementSelectionList');
    let listItemDiv = elementSelectionList.append("div");

    let enterElementSelectionList = listItemDiv.selectAll('.elementSelectionListItem')
        .data(elements, d => d).enter().append('span');
    enterElementSelectionList.append('input')
        .attr("id", d => `${d}elementSelectionId`)
        .attr("class", "elementSelectionListItem")
        .attr("value", d => d)
        .attr("type", "checkbox")
        .attr("checked", "true")
        .style('margin-left', '10px')
        .on("change", elementSelectionChange);
    enterElementSelectionList.append('label')
        .attr('for', d => `${d}elementSelectionId`)
        .text(d => d);

    //Create the second layer for the menus
    let packageItemDiv = elementSelectionList.append("div");

}

function createMenuStructure(detectedElements) {
    let heavyMetals = ['Cr', 'Pb', 'Cd', 'Hg', 'As'];
    let plantEssentialElements = ['Ca', 'Cu', 'Fe', 'K', 'Mn', 'S', 'Zn'];
    let pedologicalFeatures = ['RI', 'DI', 'SR'];
    let others = detectedElements.filter(e => heavyMetals.indexOf(e) < 0 && plantEssentialElements.indexOf(e) < 0 && pedologicalFeatures.indexOf(e) < 0)

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
    //Build the table

}

