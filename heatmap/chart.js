async function drawHeatMap() {
  // const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  const fetchedData = await d3.json("../heat.json")

  const baseTemperature = fetchedData.baseTemperature
  const dataset = fetchedData.monthlyVariance

  const monthFormat = d3.timeFormat("%B")

  const xAccessor = d => d.year
  const yAccessor = d => d.month
  const tempAccessor = d => d.variance

  const colors = ["#225095", "#D4121A", "#E0E5E7", "#A6A6A6"]
  const months = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];

  const width = 950
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 10,
      right: 20,
      bottom: 50,
      left: 60
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

  const colorScale = d3.scaleLinear()
    .domain(d3.extent(dataset, tempAccessor))
    .range(colors)

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"))
    .ticks(19)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
      .attr("id", "x-axis")

  const yScale = d3.scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].reverse())
    .range([dimensions.boundedHeight, 0])

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .tickValues(yScale.domain())
    .tickFormat(d => months[d])

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
      .attr("id", "y-axis")

  const rects = bounds.selectAll("rect")
    .data(dataset)
    .enter().append("rect")
      .attr("x", d => xScale(xAccessor(d)))
      .attr("y", d => yScale(yAccessor(d) - 1))
      .attr("class", "cell")
      .attr("data-month", d => yAccessor(d))
      .attr("data-year", d => xAccessor(d))
      .attr("data-temp", d => calcTemp(tempAccessor(d)))
      .on("mouseenter", onMouseEnter)
      .on("mousemove", onMouseMove)
      .on("mouseleave", onMouseLeave)
      .attr("fill", d => colorScale(tempAccessor(d)))
      .transition().duration(1000)
        .attr("height", yScale.bandwidth())
        .attr("width", 4)

  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

  function calcTemp(variance) {
    if(String(variance).startsWith("-")) {
      return roundTemp(baseTemperature - String(variance).split("-")[1])
    } else {
      return roundTemp(baseTemperature + variance)
    }
  }

  function roundTemp(temp) {
    return Math.round(temp * 10) / 10
  }

  function onMouseEnter() {
    d = d3.select(this).datum()
    tooltip.attr("data-year", xAccessor(d))
    tooltip.select("#year_month")
      .text(`${xAccessor(d)} - ${monthFormat(new Date(0, yAccessor(d), 0))}`)
    tooltip.select("#temperature")
      .text(`${calcTemp(tempAccessor(d))}℃`)
    tooltip.select("#variance")
      .text(`${String(tempAccessor(d)).startsWith("-")? roundTemp(tempAccessor(d)) : `+${roundTemp(tempAccessor(d))}`}℃`)
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

drawHeatMap()
