//Partly Inspired from: https://bl.ocks.org/Lulkafe/95a63ddea80d4d02cc4ab8bedd48dfd8
function d3CloseButton() {
    let size = 20,
        x = 0,
        y = 0,
        rx = 5,
        ry = 5,
        isCircle = false,
        isBorderShown = false,
        borderStrokeWidth = 1,
        crossStrokeWidth = 1,
        g,
        event;

    function button(selection) {
        //Styling for the border of the button
        let
            //for the cross
            r = size / 2,
            ofs = size / 6,
            cross;

        g = selection.append("g").on("click", event);

        cross = g.append("g");

        if (isCircle) {
            g.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", r)
                .style("fill-opacity", 0)
                .style("stroke-width", borderStrokeWidth)
                .style("stroke", d => (isBorderShown) ? "none" : "black");

            cross.append("line")
                .attr("x1", x - r + ofs)
                .attr("y1", y)
                .attr("x2", x + r - ofs)
                .attr("y2", y);

            cross.append("line")
                .attr("x1", x)
                .attr("y1", y - r + ofs)
                .attr("x2", x)
                .attr("y2", y + r - ofs);

            // Make '+' to 'x'
            cross.attr("transform", "rotate (45," + x + "," + y + ")");

        } else {
            g.append("rect")
                .attr("x", x)
                .attr("y", y)
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("width", size)
                .attr("height", size)
                .attr("fill", 'steelblue')
                .style("fill-opacity", 0)
                .style("stroke-width", borderStrokeWidth)
                .style("stroke", d => (isBorderShown) ? "none" : "black");

            cross.append("line")
                .attr("x1", x + ofs)
                .attr("y1", y + ofs)
                .attr("x2", (x + size) - ofs)
                .attr("y2", (y + size) - ofs);

            cross.append("line")
                .attr("x1", (x + size) - ofs)
                .attr("y1", y + ofs)
                .attr("x2", x + ofs)
                .attr("y2", (y + size) - ofs);
        }
        cross.style("stroke-width", crossStrokeWidth)
            .style("stroke", "black")

        g.on("mouseover", ()=>{
            g.selectAll('*').attr("stroke", 'red');
        }).on('mouseleave', ()=>{
            g.selectAll('*').attr("stroke", 'black');
        });
    }

    button.x = function (val) {
        x = val;
        return button;
    }

    button.y = function (val) {
        y = val;
        return button;
    }

    button.size = function (val) {
        size = val;
        return button;
    }

    button.rx = function (val) {
        rx = val;
        return button;
    }

    button.ry = function (val) {
        ry = val;
        return button;
    }

    button.borderStrokeWidth = function (val) {
        borderStrokeWidth = val;
        return button;
    }

    button.crossStrokeWidth = function (val) {
        crossStrokeWidth = val;
        return button;
    }

    //If true, the border of the button becomes a circle instead of a rectangle
    button.isCircle = function (val) {
        isCircle = val;
        return button;
    }

    button.isBorderShown = function (val) {
        isBorderShown = val;
        return button;
    }

    button.clickEvent = function (val) {
        event = val;
        return button;
    }

    //Remove the whole button if one already exists
    button.remove = function () {
        if (g) {
            g.remove();
            g = undefined;
        }

        return button;
    }

    return button;
}
