async function drawChoroplethMap() {
  const educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  const countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  const educationData = await d3.json(educationUrl)
  const countyData = await d3.json(countyUrl)

  const percentage = d => d["bachelorsOrHigher"]
  const colors = ["#006d2c", "#238b45", "#41ab5d", "#74c476", "#a1d99b", "#c7e9c0", "#e5f5e0"].reverse()

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
    .range(colors);

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

  const map = bounds.selectAll("g")
    // convert TopoJSON to GeoJSON
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter().append("g")

  map.append("path")
    // geographic path generator
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .on("mouseenter", onMouseEnter)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)
    .attr("data-fips", d => d.id)
    .attr("data-education", d => countyEducation(d.id, "bachelorsOrHigher"))
    .attr("county-name", d => countyEducation(d.id, "area_name"))
    .attr("fill", "#DDDDDD")
    .transition().duration(2000)
      .attr("fill", d => colorScale(countyEducation(d.id, "bachelorsOrHigher")))

  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

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

  function countyEducation(id, attr) {
    return educationData.find(obj => {
        return obj["fips"] === id
      })[`${attr}`]
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
