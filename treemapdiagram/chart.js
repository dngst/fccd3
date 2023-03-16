async function drawTreeMapDiagram() {
  const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  const dataset = await d3.json(url)

  const genres = dataset.children.map(d => { return d.name })
  const colors = ["#225095", "#D4121A", "#D4DBDE", "#A020F0", "#FFA500", "#FAC901", "#436436"]

  const width = 1170
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  let bounds = wrapper.append("g")
    .style("transform", `translate(${
      dimensions.margin.left
    }px, ${
      dimensions.margin.top
    }px)`)

  const colorScale = d3.scaleOrdinal()
    .domain(genres)
    .range(colors)

  const hierachy = d3.hierarchy(dataset)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)
  const treemap = d3.treemap().size([dimensions.width, dimensions.height]).paddingOuter(1.5).paddingInner(1)
  const root = treemap(hierachy)

  const rectGroup = bounds.selectAll("g")
    .data(root.leaves())
    .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`)
      .on("mouseenter", onMouseEnter)
      .on("mousemove", onMouseMove)
      .on("mouseleave", onMouseLeave)

  rectGroup.append("rect")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("class", "tile")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => colorScale(d.data.category))

  rectGroup.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append("tspan")
      .text(d => d)
      .attr("font-size", "0.55em")
      .attr("x", 0)
      .attr("y", (d, i) => 10 + 8.5 * i)

  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

  const legend = d3.select("#legend")
    .append("svg")
      .attr("width", 1000)
      .attr("height", 35)
      .style("margin-top", "2%")

  const legendGroup = legend.append("g").selectAll("g")
    .data(genres)
    .enter().append("g")

  legendGroup.append("rect")
    .attr("x", (d, i) => i * 150)
    .attr("y", 0)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", d => colorScale(d))
    .attr("class", "legend-item")

  legendGroup.append("text")
    .attr("x", (d, i) => i * 150 + 20)
    .attr("y", 14)
    .text(d => d)

  function onMouseEnter() {
    d = d3.select(this).datum()
    tooltip.select("#name")
      .text(d.data.name)
    tooltip.attr("data-value", d.data.value)
    tooltip.select("#category")
      .text(`Category: ${d.data.category}`)
    tooltip.select("#value")
      .text(`Value: ${d.data.value}`)
    tooltip.style("opacity", 0.9)
  }

  function onMouseMove() {
    tooltip.style("left", `${event.pageX}px`)
    tooltip.style("top", `${event.pageY}px`)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }
}

drawTreeMapDiagram()
