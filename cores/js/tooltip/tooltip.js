//Build tooltip
let div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

function showTip(event, htmlStr) {
    div.html(htmlStr).style("left", (event.pageX - 5) + "px")
        .style("top", (event.pageY + 20) + "px");
    div.transition().duration(1000).style("opacity", 1);
}

function hideTip() {
    div.transition().duration(1000).style("opacity", 0);
}
