function populateSelectors(allElements, selectedElements, changeHandler) {
    createSelectionFromJson("option1Container", allElements, "option1", selectedElements[0], changeHandler);
    createSelectionFromJson("option2Container", allElements, "option2", selectedElements[1], changeHandler);

}

function createSelectionFromJson(divId, allElements, name, selectedElement, changeHandler, label) {
    const container = document.getElementById(divId);
    container.innerHTML = "";//Remove its content
    const select = document.createElement("select");
    select.name = name;
    select.id = name;
    for (const d of allElements) {
        let option = document.createElement("option");
        option.value = d.value;
        option.text = d.text;
        select.appendChild(option);
    }
    select.value = selectedElement;
    select.onchange = changeHandler;

    // creating label for checkbox
    if(label){
        let elmLabel = document.createElement('label');
        elmLabel.htmlFor = name;
        elmLabel.appendChild(document.createTextNode(label));
        elmLabel.style.paddingLeft = '10px';
        container.appendChild(elmLabel);
    }


    container.appendChild(select);
}

/**
 * Create a checkbox with label and event handler
 * To get the event use this:
 * event.target.checked
 * @param containerId
 * @param label
 * @param name
 * @param isSelected
 * @param changeHandler
 * @return {HTMLInputElement}
 */
function createCheckBox(containerId, label, name, isSelected, changeHandler) {

    const container = document.getElementById(containerId);
    const checkbox = document.createElement("input");
    checkbox.name = name;
    checkbox.id = name;
    checkbox.type = "checkbox";
    checkbox.value = "value";
    if (isSelected) {
        checkbox.checked = true;
    } else {
        checkbox.checked = null;
    }
    // creating label for checkbox
    let cbxLabel = document.createElement('label');
    cbxLabel.htmlFor = name;
    cbxLabel.appendChild(document.createTextNode(label));
    cbxLabel.style.paddingRight = '10px';

    container.appendChild(checkbox);
    container.appendChild(cbxLabel);
    //Event handler
    checkbox.onchange = changeHandler;

    return checkbox;
}

/**
 * Create a checkbox with label and event handler
 * To get the event use this:
 * event.target.checked
 * @param containerId
 * @param label
 * @param name
 * @param isSelected
 * @param changeHandler
 * @return {HTMLInputElement}
 */
function createCheckBox(containerId, label, name, isSelected, changeHandler) {

    const container = document.getElementById(containerId);
    const checkbox = document.createElement("input");
    checkbox.name = name;
    checkbox.id = name;
    checkbox.type = "checkbox";
    checkbox.value = "value";
    if (isSelected) {
        checkbox.checked = true;
    } else {
        checkbox.checked = null;
    }
    // creating label for checkbox
    let cbxLabel = document.createElement('label');
    cbxLabel.htmlFor = name;
    cbxLabel.appendChild(document.createTextNode(label));
    cbxLabel.style.paddingRight = '10px';

    container.appendChild(checkbox);
    container.appendChild(cbxLabel);
    //Event handler
    checkbox.onchange = changeHandler;

    return checkbox;
}
