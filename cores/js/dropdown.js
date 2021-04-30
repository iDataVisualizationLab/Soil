function populateSelectors(allElements, selectedElements, changeHandler) {
    createByJson("option1Container", allElements, "option1", selectedElements[0], changeHandler);
    createByJson("option2Container", allElements, "option2", selectedElements[1], changeHandler);

}

function createByJson(divId, allElements, name, selectedElement, changeHandler) {
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
    container.appendChild(select);
}
