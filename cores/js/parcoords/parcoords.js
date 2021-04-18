function verticalparcoords(container, data, config) {
    let svgWidth = config.width,
        svgHeight = config.height;
    let margins = {left: 60, top: 30, right: 10, bottom: 10},
        width = svgWidth - margins.left - margins.right,
        height = svgHeight - margins.top - margins.bottom;
    let dimensions = Object.keys(data[0]);

    let y = d3.scalePoint().domain(dimensions).range([0, height]),
        x = {};

    //Process the data to get the scales
    dimensions.forEach(d => {
        let domain = d3.extent(data, p => p[d]);
        if (!isNaN(domain[0])) {
            x[d] = d3.scaleLinear().domain(domain).range([0, width]);
        } else {
            x[d] = d3.scalePoint().domain(data.map(p => p[d])).range([0, width]);
        }

        x[d].brush = d3.brushX().extent([[x[d].range()[0], -5], [x[d].range()[1], 5]])
            .on("start", brushstart)
            .on("brush", brush);
    });

    let line = d3.line(),
        foreground;
    const dragging = {};
    let svg = d3.select(container).append("svg")
        .attr("width", width + margins.left + margins.right)
        .attr("height", height + margins.top + margins.bottom)
        .style("margin", "auto")
        .style("display", "block")
        .append("g")
        .attr("transform", `translate(${margins.left}, ${margins.top})`);

    //Add foreground lines
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path);


    //Add a group of element for each dimension
    let g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr('class', "dimension")
        .attr("transform", d => `translate(0, ${y(d)})`)
        .call(d3.drag().subject(d => {
                return {y: y(d)}
            })
                .on("start", dragstart)
                .on("drag", drag)
                .on("end", dragend)
        );

    //Add axis and title
    g.append("g")
        .attr("class", "axis")
        .each(function (d) {
            d3.select(this).call(d3.axisTop(x[d]))
        })
        .append("text")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .attr("x", -9)
        .text(String);
    //Add brush for each axis

    g.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(x[d].brush)
        })
        .selectAll("rect")
        .attr('y', -8)
        .attr("height", 16)
        .on("click", brush);


    function brushstart(event) {
        event.sourceEvent.stopPropagation();
    };

    function brush() {
        var actives = [];
        //filter brushed extents
        svg.selectAll(".brush")
            .filter(function (d) {
                return d3.brushSelection(this)
            })
            .each(function (d) {
                actives.push({
                    dimension: d,
                    extent: d3.brushSelection(this)
                });
            });
        //set unbrushed foreground line disappear
        foreground.classed("fade", function (d) {
            return !actives.every(function (active) {
                let dim = active.dimension;
                return active.extent[0] <= x[dim](d[dim]) && x[dim](d[dim]) <= active.extent[1];
            });
        });
    }

    function dragstart(event, d) {
        dragging[d] = y(d);
    }

    function drag(event, d) {
        dragging[d] = Math.min(width, Math.max(0, event.y));
        foreground.attr("d", path);
        dimensions.sort(function (a, b) {
            return position(a) - position(b);
        });

        y.domain(dimensions);
        g.attr("transform", function (d) {
            return "translate(0, " + position(d) + ")";
        });
    }

    function dragend(event, d) {
        delete dragging[d];
        transition(d3.select(this)).attr("transform", "translate(0, " + y(d) + ")");
        transition(foreground).attr("d", path);
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    function position(d) {
        var v = dragging[d];
        return v == null ? y(d) : v;
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function (p) {
            return [x[p](d[p]), position(p)];
        }));
    }

}
