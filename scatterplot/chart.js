async function drawScatterPlot() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  const fetchedData = await d3.json(url)

  const dataset = []

  const timeFormat = d3.timeFormat("%M:%S")

  fetchedData.map(data => {
    const minsParser = d3.timeParse(timeFormat)
    dataset.push([data["Year"], minsParser(data["Time"]), data["Doping"]])
  })

  const xAccessor = d => d[0]
  const yAccessor = d => d[1]

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
    .nice()

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .tickFormat(timeFormat)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
      .attr("id", "y-axis")

  const yAxisLabel = yAxis.append("text")
    .text("Time in Minutes")
    .attr("y", -dimensions.margin.left / 2)
    .attr("x", -dimensions.margin.top * 2)
    .attr("class", "yaxis-label")

  const dots = bounds.selectAll("circle")
    .data(dataset)
    .enter().append("circle")
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", 6)
      .attr("fill", d => d[2]? "#7F00FF" : "#FFA500")
      .attr("class", "dot")

  const legend = bounds.append("g")
    .attr("id", "legend")

  const legendEntry1 = legend.append("circle")
      .attr("cx", 800)
      .attr("cy", 50)
      .attr("r", 6)
      .attr("class", "dot")
      .attr("fill", "#7F00FF")

  const legendEntry1Text = legend.append("text")
    .attr("class", "legend-text")
    .text("Riders with doping allegations")
    .attr("x", 780)
    .attr("y", 56)

  const legendEntry2 = legend.append("circle")
      .attr("cx", 800)
      .attr("cy", 20)
      .attr("r", 6)
      .attr("class", "dot")
      .attr("fill", "#FFA500")

  const legendEntry2Text = legend.append("text")
    .attr("class", "legend-text")
    .text("No doping allegations")
    .attr("x", 780)
    .attr("y", 26)
}

drawScatterPlot()
