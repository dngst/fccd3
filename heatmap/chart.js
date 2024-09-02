async function drawHeatMap() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  const fetchedData = await d3.json(url)

  const baseTemperature = fetchedData.baseTemperature
  const dataset = fetchedData.monthlyVariance

  const monthFormat = d3.timeFormat("%B")

  const xAccessor = d => d.year
  const yAccessor = d => d.month
  const tempAccessor = d => d.variance

  const colors = [
    "rgb(69, 117, 180)",
    "rgb(116, 173, 209)",
    "rgb(171, 217, 233)",
    "rgb(224, 243, 248)",
    "rgb(255, 255, 191)",
    "rgb(254, 224, 144)",
    "rgb(253, 174, 97)",
    "rgb(244, 109, 67)",
    "rgb(215, 48, 39)"
    ]

  const months = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"]

  const width = 1320
  let dimensions = {
    width: width,
    height: width * 0.35,
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

  const colorScale = d3.scaleQuantize()
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
      .attr("data-month", d => yAccessor(d) - 1)
      .attr("data-year", d => xAccessor(d))
      .attr("data-temp", d => calcTemp(tempAccessor(d)))
      .on("mouseenter", function(e, datum) {
        onMouseEnter(datum)
      })
      .on("mousemove", onMouseMove)
      .on("mouseleave", onMouseLeave)
      .attr("width", 5)
      .attr("height", yScale.bandwidth())
      .attr("fill", "#F8F9FA")
      .transition().duration(1000).delay((d, i) => i * 3)
        .attr("fill", d => colorScale(tempAccessor(d)))

  // legend
  let temps = []

  dataset.map(data => {
    temps.push(calcTemp(tempAccessor(data)))
  })

  const size = 30
  const legendWidth = size * colors.length

  const legendScale = d3.scaleLinear()
    .domain(d3.extent(temps))
    .range([0, legendWidth])

  const legendAxis = d3.axisBottom(legendScale)

  const legend = d3.select("#legend")
    .append("svg")
      .attr("width", legendWidth)

  legendGroup = legend.append("g")

  legendGroup.selectAll("rect")
    .data(colors)
    .enter().append("rect")
      .attr("width", size)
      .attr("height", size)
      .attr("y", 0)
      .attr("x", (d, i) => i * size)
      .attr("fill", d => d)

  legend.append("g")
    .call(legendAxis)
      .style("transform", `translate(${0}px, ${size}px)`)

  // interactions
  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

  function onMouseEnter(d) {
    tooltip.attr("data-year", xAccessor(d))
    tooltip.select("#year_month")
      .text(`${xAccessor(d)} - ${monthFormat(new Date(0, yAccessor(d), 0))}`)
    tooltip.select("#temperature")
      .html(`${calcTemp(tempAccessor(d))}&#8451;`)
    tooltip.select("#variance")
      .html(`${String(tempAccessor(d)).startsWith("-")? roundTemp(tempAccessor(d)) : `+${roundTemp(tempAccessor(d))}`}&#8451;`)
    tooltip.style("opacity", 0.9)
  }

  function onMouseMove() {
    tooltip.style("left", `${event.pageX - 65}px`)
    tooltip.style("top", `${event.pageY - 95}px`)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }

  // utils
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
}

drawHeatMap()
