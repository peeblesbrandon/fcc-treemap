const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';
const color = ["#586ba4", "#324376", "#f5dd90", "#f68e5f", "#f76c5e", "#524948", "#57467b", "#7cb4b8", "#70f8ba", "#cafe48", "#ff6666", "#ccff66", "#5d2e8c", "#2ec4b6", "#f1e8b8", "#87255B", "#899878", "#CD533B"];
// const color = d3.scaleOrdinal(d3.schemeCategory10);
// svgs
var w = 1200;
var h = 800;
var padding = 75;
var canvas = d3.select("#canvas")
                .attr("width", w)
                .attr("height", h);
const legendWidth = 100;
const legendHeight = 400;
var legend = d3.select("#legend")
                .attr("width", legendWidth)
                .attr("height", legendHeight);
// div for creating tooltip
var tooltip = d3.select('body')
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

d3.json(url, function(error, data) { 
    if (error) throw error;

    console.log(data);
    // make color scale
    var colorScale = d3.scaleOrdinal()
        .domain(data.children.map((d) => {
            return d.name;
        }))
        .range(color);

    // generate treemap and calculate tile sizes
    const root = d3.hierarchy(data)
        .sum((d) => (d.value))
        .sort((a, b) => (b.value - a.value));
    const treemap = d3.treemap()
        .size([w, h])
        .padding(0.5);
    treemap(root);

    // draw treemap
    console.log(root);
    // console.log(root.leaves());

    var cell = canvas.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr("transform", (d) => { return "translate(" + d.x0 + "," + d.y0 + ")"; });
    
    var tile = cell.append('rect')
        .attr('class', 'tile')
        .attr('width', (d) => { return d.x1 - d.x0; })
        .attr('height', (d) => { return d.y1 - d.y0; })
        .attr('data-name', (d) => { return d.data.name })
        .attr('data-category', (d) => { return d.data.category })
        .attr('data-value', (d) => { return d.data.value })
        .style("stroke", "white")
        .style("stroke-width", 1)
        .style("fill", (d) => {
            return colorScale(d.data.category);
        })
        .on("mouseover", function (d) {
            d3.select(this).transition()
                .duration("0")
                .style("stroke", "black")
                .style("stroke-width", 2);
            tooltip.transition()
                .duration("100")
                .style("opacity", 0.9);
            tooltip.html('Name: ' + d.data.name + '</br>Platform: ' + d.data.category + '</br>Value: ' + d.data.value)
                .style("left", (d3.event.pageX + 25) + "px")
                .style("top", (d3.event.pageY - 20) + "px")
                .attr("data-value", d.data.value);
        })
        .on("mouseout", function (d) {
            d3.select(this).transition()
                .duration("0")
                .style("stroke", '')
                .style("stroke-width", 0);
            tooltip.transition()
                .duration("100")
                .style("opacity", 0);
        });
    
    cell.append("text")
        .attr('class', 'tile-text')
        .selectAll("tspan")
        .data(function (d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
        .enter()
        .append("tspan")
        .attr("y", function (d, i) { return 13 + i * 10;})
        .attr("x", 4)
        .text(function (d) { return d; });

    
    const legendPadding = 25;
    const legendCellPadding = 2;
    const legendCellSideLength = (legendHeight - ((color.length + 1) * legendCellPadding) - (legendPadding * 2)) / color.length;

    legend.selectAll('rect')
        .data(color)
        .enter()
        .append('rect')
        .attr('class', 'legend-item')
        .attr('width', legendCellSideLength)
        .attr('height', legendCellSideLength)
        .attr('x', 10)
        .attr('y', (d, i) => {
            return legendPadding + legendCellSideLength * i + legendCellPadding * (i + 1);
        })
        .attr('fill', (d) => d)
        
    legend.selectAll('text')
        .data(data.children)
        .enter()
        .append('text')
        .attr('class', 'legendText')
        .text((d) => {
            return d.name;
        })
        .attr('x', 40)
        .attr('y', (d, i) => {
            return legendPadding + legendCellSideLength/1.5 + legendCellSideLength * (i) + legendCellPadding * (i + 1);
        })
});