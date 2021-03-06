function createCoresParcoords(data, elementScalers, ips, colorScale) {
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
                    let msg = `Drag ${d} label (left/right) to reorder ${d} axis
                                <br/>Brush on the ${d} axis to filter by ${d} values
                                <br/>Click on the ${d} axis to release brushed range
                                <br/>Double click on the ${d} label to reverse value order`;

                    if (['Site', 'Depth'].indexOf(d) < 0) {
                        msg += `<br/>Click ${d} label to color by ${d} values & change volume rendering element.`
                    }

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
            if (!isNaN(d)) {
                if (d > 1000) {
                    return d / 1000 + 'K';
                } else {
                    return d.toFixed(1);
                }
            } else {
                return d;
            }

        });
    }


    function brushChange() {
        //Get the extend of the selected element
        for (let i = 0; i < profileCodes.length; i++) {
            const profileName = profileCodes[i];
            let valueRange;
            const vr = vrs[profileName];
            const ip = ips[profileName];

            const brushExtents = pc.brushExtents();
            const vrDim = selectedVolumeRenderedElement.split(' ')[0];
            const vrData = ip.getInterpolatedData(selectedVolumeRenderedElement);
            //Initialize the filtered data
            const filteredData = {
                x: [...vrData.x],
                y: [...vrData.y],
                z: [...vrData.z],
                t: [...vrData.t],
            }
            //Preload the data for each of the brushed element
            let brushedDims = Object.keys(brushExtents);

            if (brushedDims.length > 0) {
                const interpolatedData = {};
                interpolatedData[vrDim] = vrData;
                brushedDims = brushedDims.filter(d => (d !== 'Site' && d !== 'Depth' && d !== 'profile'));
                brushedDims.forEach(dim => {
                    const elm = dim + ' Concentration';
                    if (dim !== vrDim) {
                        interpolatedData[dim] = ip.getInterpolatedData(elm);
                    }
                    //Scale down the brushExtents
                    brushExtents[dim] = brushExtents[dim].map(elementScalers[elm]);
                });
                //Filter each t
                for (let tIdx = 0; tIdx < filteredData.t.length; tIdx++) {
                    //Check the range for each brushed dimension
                    for (let i = 0; i < brushedDims.length; i++) {
                        let dim = brushedDims[i];
                        //If one of the condition
                        if ((interpolatedData[dim].t[tIdx] < brushExtents[dim][0]) || (interpolatedData[dim].t[tIdx] > brushExtents[dim][1])) {
                            //Out of range => set this data point to zero
                            filteredData.t[tIdx] = 0;
                            break;//Only one is enough so break it.
                        }
                    }
                }
            }

            //Now handle the change
            vr.handleDataChange(filteredData);
        }

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

                //Handle the data change for the volume render
                brushChange();
                //Handle legend change
                theProfileHandler.handleLegendChange(selectedVolumeRenderedElement);
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
    pc.brushChange = brushChange;
    return pc;
}
