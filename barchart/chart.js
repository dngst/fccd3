async function drawBarChart() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  const dataset = await d3.json(url).then(response => {
    return response.data
  })

  const xAccessor = d => d[0]
  const yAccessor = d => d[1]
  // const colorAccessor = d => d[]

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

  const years = []
  const gdps = []
  const filtredData =[]

  for (const row of dataset) {
    const year = new Date(row[0]).getFullYear()
    filtredData.push([year, row[1]])
    for(const either of row) {
      years.push(year)
      gdps.push(row[1])
    }
  }

  const colorScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range(["#99ff99", "#004d00"])

  const xScale = d3.scaleLinear()
    .domain(d3.extent(years))
    .range([0, dimensions.boundedWidth])

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"))

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .attr("id", "x-axis")
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
      .attr("class", "tick")

  const yScale = d3.scaleLinear()
    .domain(d3.extent(gdps))
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
      .data(filtredData)
      .enter().append("rect")
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)
      .attr("data-date", d => xAccessor(d))
      .attr("data-gdp", d => yAccessor(d))
      .attr("x", d => xScale(xAccessor(d)))
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", 12)
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr("class", "bar")
      .attr("fill", d => colorScale(yAccessor(d)))

  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

 function onMouseEnter(d) {
    d = d3.select(this).datum()
    tooltip.select("#tooltip-text")
      .text(`$${yAccessor(d)} Billion in ${xAccessor(d)}`)
      .attr("data-date", xAccessor(d))

    tooltip.style("opacity", 1)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }
}

drawBarChart()
