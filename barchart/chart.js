async function drawBarChart() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  const dataset = await d3.json(url).then(response => {
    return response.data
  })

  const xAccessor = d => d[0]
  const yAccessor = d => d[1]

  const width = 900
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 20,
      bottom: 50,
      left: 50
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
    .domain(d3.extent(dataset, yAccessor))
    .range(["#85BB65", "#223517"])

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, d => {
      return new Date(d[0])
    }))
    .range([0, dimensions.boundedWidth])

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .attr("id", "x-axis")
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
      .attr("class", "tick")

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
      .attr("id", "y-axis")
      .attr("class", "tick")

  const yAxisLabel = yAxis.append("text")
    .attr("y", -dimensions.margin.left + 74)
    .text("Gross Domestic Product")
    .attr("class", 'yaxis-label')

  const barRects = bounds.append("g")
    .selectAll("g")
      .data(dataset)
      .enter().append("rect")
      .on("mouseenter", function(e, datum) {
        onMouseEnter(datum)
      })
      .on("mousemove", onMouseMove)
      .on("mouseleave", onMouseLeave)
      .attr("data-date", d => xAccessor(d))
      .attr("data-gdp", d => yAccessor(d))
      .attr("class", "bar")
      .attr("fill", d => colorScale(yAccessor(d)))
      .attr("width", 3)
      .attr("height", 0)
      .attr("y", d => yScale(0))
      .attr("x", d => xScale(new Date(xAccessor(d))))
      .transition().duration(1000).delay((d, i) => i * 20)
        .attr("y", d => yScale(yAccessor(d)))
        .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))

  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

  const dateParser = d3.timeFormat("%B %d, %Y")

  function onMouseEnter(d) {
    tooltip
      .attr("data-date", xAccessor(d))
    tooltip.select("#gdp")
      .text(`$${yAccessor(d)} Billion`)
    tooltip.select("#date")
      .text(`${dateParser(new Date(xAccessor(d)))}`)
    tooltip.style("opacity", 0.9)
  }

  function onMouseMove() {
    tooltip.style("left", `${event.pageX + 15}px`)
    tooltip.style("top", `${event.pageY - 65}px`)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }
}

drawBarChart()
