async function drawBarChart() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  const dataset = await d3.json(url).then(response => {
    return response.data
  })

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

  const xScale = d3.scaleLinear()
    .domain(d3.extent(years))
    .range([0, dimensions.boundedWidth])

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

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

  const barPadding = 1
  const binsGroup = bounds.append("g")
  const barRects = binsGroup.selectAll("g")
    .data(filtredData)
    .enter().append("rect")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("x", d => xScale(d[0]))
    .attr("y", d => yScale(d[1]))
    .attr("width", 18)
    .attr("height", d => dimensions.boundedHeight - yScale(d[1]))
    .attr("class", "bar")
}

drawBarChart()
