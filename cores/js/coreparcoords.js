function createCoresParcoords(data, elementScalers, ip, colorScale) {
    d3.select("#parcoordsChart").selectAll("*").remove();
    let pc = parcoords()("#parcoordsChart");
    pc
        .data(data)
        .smoothness(0.05)
        .alpha(0.3)
        .margin({top: 40, left: 10, bottom: 12, right: 10})
        .render()
        .reorderable()
        .brushMode("1D-axes")  // enable brushing
        .interactive();

    changeVolumeRenderElement('Ca');

    // click label to activate coloring
    pc.svg.selectAll(".dimension")
        .on("click", changeVolumeRenderElement)
        .selectAll(".label")
        .style("font-size", "14px");
    d3.selectAll('.dimension')
        .on("mouseover", (event, d) => {
            if (systemConfigurations.helpEnabled) {
                const msg = `Click ${d} label to color by ${d} values
                                <br/>Drag ${d} label to reorder ${d} axis
                                <br/>Brush on the ${d} axis to filter by ${d} values
                                <br/>Double click on the ${d} label to reverse value order`;
                showTip(event, msg);
            }
        })
        .on("mouseout", () => {
            hideTip();
        });
    //update axis ticks to reduce space
    pc.svg.selectAll('.dimension').filter(d => (d !== 'Site' && d !== 'Depth')).selectAll('.tick').selectAll('text').text(d => {
        if (d > 1000) {
            return d / 1000 + 'K';
        } else {
            return d;
        }
    });
    //Brushing
    pc.on("brush", (d) => {
        brushChange();
    });

    function brushChange() {
        //Get the extend of the selected element
        let valueRange;
        const brushExtents = pc.brushExtents();
        const pcDimension = selectedVolumeRenderedElement.split(' ')[0];

        //If the element itself is not brushed take its value ranges from selected data items (might be selected due to other brushes)
        if (pc.brushed()) {
            valueRange = d3.extent(pc.brushed().map(item => item[pcDimension]));
        } else {
            valueRange = elementScalers[selectedVolumeRenderedElement].domain();
        }
        //Scale that element range down to 0 to 1
        valueRange = valueRange.map(v => elementScalers[selectedVolumeRenderedElement](v));
        //Now handle the change
        vr.handleDataChange(ip.getInterpolatedData(selectedVolumeRenderedElement), valueRange);
    }

    //Delete button
    // d3.select("#parcoordsChart").selectAll('.dimension').each(function (d) {
    //     const closeBtn = new d3CloseButton().size(15).x(-8).y(-32);
    //     closeBtn.clickEvent(function (event) {
    //         debugger
    //         const dims = pc.dimensions();
    //         delete dims[d];
    //         pc.dimensions(dims);
    //         //Prevent it to trigger the click event from the dimension
    //         event.stopPropagation();
    //     });
    //     let dim = d3.select(this);
    //     dim.call(closeBtn);
    // });

    // update color
    function changeVolumeRenderElement(dimension) {
        if (dimension !== "Site" && dimension !== "Depth") {
            //Change the color
            pc.svg.selectAll(".dimension")
                .style("font-weight", "normal")
                .filter(function (d) {
                    return d == dimension;
                })
                .style("font-weight", "bold");
            selectedVolumeRenderedElement = `${dimension} Concentration`;
            pc.color(d => colorScale(elementScalers[selectedVolumeRenderedElement](d[dimension]))).render();
            //Update the label on the volume renderer
            layoutObject.handleVolumeRendererLabelChange(`Current element: <b>${dimension}</b>`);
            //Handle the data change for the volume render
            brushChange();
        }
    }

    return pc;
}
