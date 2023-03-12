async function drawChoroplethMap() {
  const educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  const countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  const educationalData = await d3.json(educationUrl)
  const countyData = await d3.json(countyUrl)

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
}

drawChoroplethMap()

/*
GeoJSON - a JSON based format for specifying geographic data.
TopoJSON - an extension of GeoJSON that encodes topology.
Projection - A way of showing the surface of a 3D sphere on a flat surface.
           - A function that converts latitude/longitude co-ordinates to x & y co-ordinates. 
*/
