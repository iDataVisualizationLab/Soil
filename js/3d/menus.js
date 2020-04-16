function createMenus(elements, elementSelectionChange) {
    let elementSelectionList = d3.select('#elementSelectionList');
    let enterElementSelectionList = elementSelectionList.selectAll('.elementSelectionListItem').data(elements, d => d).enter().append('span');
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
}

