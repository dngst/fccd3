async function drawHeatMap() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  const fetchedData = await d3.json(url)

  const baseTemperature = fetchedData.baseTemperature
  const dataset = fetchedData.monthlyVariance

  // const monthFormat = d3.timeFormat("%B")

  const xAccessor = d => d.year
  const yAccessor = d => new Date(0, d.month, 0)

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

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"))

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const yScale = d3.scaleTime()
    .domain(d3.extent(dataset, yAccessor).reverse())
    .range([dimensions.boundedHeight, 0])

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
}

drawHeatMap()
