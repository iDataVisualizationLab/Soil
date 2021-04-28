/*Creating the the selection box*/
//Use this
/**
 * Populate two selectors
 * @param allElements:
 * @param defaultElementIndexes: what element index to be selected in each selection
 */
/**
 * Create the selection box
 * Example of accessing the selected element:
 * let theOption = $("select[name='" + name + "']");
 * let selectedValue = theOption.val();
 * @param allElements must be in the form of [{value: "value", text: "text"}, {value: "value", text: "text"}]
 * @param selectedElements the texts for the two selected elements
 * @param changeHandler a function to handle two change events
 * @param width the width of the selection box
 */
function populateSelectors(allElements, selectedElements, changeHandler, width) {
    //headers
    const theOptions = new Array(2);
    const elementNames = allElements.map(e => e.text)
    const defaultElementIndexes = selectedElements.map(se => elementNames.indexOf(se));
    theOptions[0] = createByJson("option1Container", allElements, "option1", defaultElementIndexes[0], changeHandler, width);
    theOptions[1] = createByJson("option2Container", allElements, "option2", defaultElementIndexes[1], changeHandler, width);
}

//Example of accessor

//<editor-fold desc="low level constructions">
//Can safely ignore the followings (low level constructions)
function createByJson(div, jsonData, name, selectedIndex, changeHandler, width) {
    let msdd = $("#" + div).msDropDown({byJson: {data: jsonData, name: name, width: width}}).data("dd");
    if (width) {
        $("#" + div).css('width', `${width}px`);
    }
    msdd.set("selectedIndex", selectedIndex);
    let theOption = $("select[name='" + name + "']");
    theOption.change(changeHandler);
    return theOption;
}

//</editor-fold>
