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

    setupDimensions();
    //Brushing
    pc.on("brush", (d) => {
        brushChange();
    });


    function setupDimensions() {
        // click label to activate coloring
        pc.svg.selectAll(".dimension")
            .selectAll(".label")
            .on("click", changeVolumeRenderElement)
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
        updateAxisTicks();
    }


    function updateAxisTicks() {
        pc.svg.selectAll('.dimension').filter(d => (d !== 'Site' && d !== 'Depth')).selectAll('.tick').selectAll('text').text(d => {
            if (d > 1000) {
                return d / 1000 + 'K';
            } else {
                return d;
            }
        });
    }


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

    // update the selected element
    function changeVolumeRenderElement(dimension) {
        showLoader();
        setTimeout(() => {
            if (dimension !== "Site" && dimension !== "Depth") {
                //Change the color
                pc.svg.selectAll(".dimension")
                    .selectAll('text')
                    .style("font-weight", "normal")
                    .filter(function (d) {
                        return d == dimension;
                    })
                    .style("font-weight", "bold")
                    .selectAll('text').style('font-weight', 'bold');

                selectedVolumeRenderedElement = `${dimension} Concentration`;
                pc.color(d => colorScale(elementScalers[selectedVolumeRenderedElement](d[dimension]))).render();
                //Update the label on the volume renderer
                layoutObject.handleVolumeRendererLabelChange(`Current element: <b>${dimension}</b>`);
                //Handle the data change for the volume render
                brushChange();
            }
            hideLoader();
        }, 0);
    }

    function changeColorScale(colorScale) {
        setTimeout(() => {
            const dimension = selectedVolumeRenderedElement.split(' ')[0];
            if (dimension !== "Site" && dimension !== "Depth") {
                //Change the color
                pc.color(d => colorScale(elementScalers[selectedVolumeRenderedElement](d[dimension]))).render();
            }
            hideLoader();
        }, 0);
    }


    pc.updateAxisTicks = updateAxisTicks;
    pc.changeColorScale = changeColorScale;
    pc.setupDimensions = setupDimensions;
    return pc;
}
