async function drawTreeMapDiagram() {
  const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  const dataset = await d3.json(url)

  const genres = dataset.children.map(d => { return d.name })
  const colors = ["#225095", "#D4121A", "#E0E5E7", "#A6A6A6", "#96ADC8", "#FAC901", "#436436"]

  const width = 900
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

  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

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
  const treemap = d3.treemap().size([dimensions.width, dimensions.height]).padding(1)
  const root = treemap(hierachy)

  const rects = bounds.selectAll("rect")
    .data(root.leaves())
    .enter().append("g")
      .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.data.category))
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("class", "tile")
        .on("mouseenter", onMouseEnter)
        .on("mousemove", onMouseMove)
        .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

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
