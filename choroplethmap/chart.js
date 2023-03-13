async function drawChoroplethMap() {
  const educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  const countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  const educationData = await d3.json(educationUrl)
  const countyData = await d3.json(countyUrl)

  const percentage = d => d["bachelorsOrHigher"]
  const colors = ["#E5F5E0", "#C7E9C0", "#A1D99B", "#74C476", "#41AB5D", "#238B45", "#006D2C", "#00441B"]
  // convert TopoJSON to GeoJSON
  const counties = topojson.feature(countyData, countyData.objects.counties).features

  const width = 950
  let dimensions = {
    width: width,
    height: width * 0.7,
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

  const colorScale = d3.scaleQuantize()
    .domain(d3.extent(educationData, percentage))
    .range(colors)

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

  const map = bounds.selectAll("path")
    .data(counties)
    .enter().append("path")
      // geographic path generator
      .attr("d", d3.geoPath())
      .attr("class", "county")
      .on("mouseenter", onMouseEnter)
      .on("mousemove", onMouseMove)
      .on("mouseleave", onMouseLeave)
      .attr("data-fips", d => d.id)
      .attr("data-education", d => countyEducation(d.id, "bachelorsOrHigher"))
      .attr("county-name", d => countyEducation(d.id, "area_name"))
      .attr("fill", "#F8F9FA")
      .transition().duration(2000)
        .attr("fill", d => colorScale(countyEducation(d.id, "bachelorsOrHigher")))

  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

  const legend = d3.select("#legend")
    .append("svg")
      .attr("width", dimensions.boundedWidth)

  const legendScale = d3.scaleLinear()
    .domain(d3.extent(educationData, percentage))
    .range([0, 259])

  const legendAxis = d3.axisBottom(legendScale)
    .tickFormat(d => d + "%")

  legendGroup = legend.append("g")

  legendGroup.selectAll("rect")
    .data(colors)
    .enter().append("rect")
      .attr("width", 50)
      .attr("height", 8)
      .attr("y", 0)
      .attr("x", (d, i) => i * 30)
      .attr("fill", d => d)

  legend.append("g")
    .call(legendAxis)
      .style("transform", `translate(${0}px, ${8}px)`)

  function countyEducation(id, attr) {
    return educationData.find(obj => {
        return obj["fips"] === id
      })[`${attr}`]
  }

  function onMouseEnter() {
    d = d3.select(this).datum()
    tooltip.attr("data-education", countyEducation(d.id, "bachelorsOrHigher"))
    tooltip.text(`
      ${countyEducation(d.id, "area_name")},
      ${countyEducation(d.id, "state")}:
      ${countyEducation(d.id, "bachelorsOrHigher")}%`)
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

drawChoroplethMap()

/*
GeoJSON - a JSON based format for specifying geographic data.
TopoJSON - an extension of GeoJSON that encodes topology.
Projection - A way of showing the surface of a 3D sphere on a flat surface.
           - A function that converts latitude/longitude co-ordinates to x & y co-ordinates.
Geographic path generator - Function that converts GeoJSON shapes into SVG paths.
*/
