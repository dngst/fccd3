async function drawScatterPlot() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  const dataset = await d3.json(url)

  const timeFormat = d3.timeFormat("%M:%S")
  const minsParser = d3.timeParse(timeFormat)

  const xAccessor = d => d.Year
  const yAccessor = d => minsParser(d.Time)

  const allegations = "#7F00FF";
  const noAllegations = "#FFA500";

  const width = 900
  let dimensions = {
    width: width,
    height: width * 0.63,
    margin: {
      top: 30,
      right: 20,
      bottom: 50,
      left: 80
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

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"))

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
      .attr("id", "x-axis")

  const yScale = d3.scaleTime()
    .domain(d3.extent(dataset, yAccessor).reverse())
    .range([dimensions.boundedHeight, 0])

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .tickFormat(timeFormat)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
      .attr("id", "y-axis")

  const yAxisLabel = yAxis.append("text")
    .text("Time in Minutes")
    .attr("y", -dimensions.margin.bottom)
    .attr("x", 0)
    .attr("class", "yaxis-label")

  const dots = bounds.selectAll("circle")
    .data(dataset)
    .enter().append("circle")
      .attr("cx", 0)
      .attr("cy", 459)
      .attr("fill", d => d.Doping? allegations : noAllegations)
      .attr("class", "dot")
      .attr("data-yvalue", d => yAccessor(d).toISOString())
      .attr("data-xvalue", d => xAccessor(d))
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)
      .transition().duration(5000)
        .attr("r", 6)
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("cx", d => xScale(xAccessor(d)))

  const legend = bounds.append("g")
    .attr("id", "legend")

  const legendEntry1 = legend.append("circle")
      .attr("cx", 800)
      .attr("cy", 50)
      .attr("r", 6)
      .attr("class", "legend-dot")
      .attr("fill", allegations)

  const legendEntry1Text = legend.append("text")
    .attr("class", "legend-text")
    .text("Riders with doping allegations")
    .attr("x", 780)
    .attr("y", 55)

  const legendEntry2 = legend.append("circle")
      .attr("cx", 800)
      .attr("cy", 20)
      .attr("r", 6)
      .attr("class", "legend-dot")
      .attr("fill", noAllegations)

  const legendEntry2Text = legend.append("text")
    .attr("class", "legend-text")
    .text("No doping allegations")
    .attr("x", 780)
    .attr("y", 25)

  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

  function onMouseEnter() {
    d = d3.select(this).datum()
    tooltip.attr("data-year", xAccessor(d))
    tooltip.select("#name_nationality")
      .text(`${d.Name}; ${d.Nationality}`)
    tooltip.select("#year_time")
      .text(`Time: ${d.Time}, Year: ${d.Year}`)
    tooltip.select("#doping")
      .text(`${d.Doping}`)
      const x = xScale(xAccessor(d))
    const y = yScale(yAccessor(d))

    tooltip.style("transform", `translate(`
      + `calc( 27% + ${x}px),`
      + `calc(-70% + ${y}px)`
      + `)`)
    tooltip.style("opacity", 0.9)
    tooltip.style("left", "230px")
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }
}

drawScatterPlot()
