import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 30, left: 30, right: 10, bottom: 20 }

var height = 130 - margin.top - margin.bottom
var width = 100 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales
var xPositionScale = d3.scaleLinear().range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales
var line_us = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_us)
  })
// .curve(d3.curveMonotoneX)

var line_jp = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_jp)
  })
// .curve(d3.curveMonotoneX)

// area = d3.area()

// Read in your data
d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  // Group your data together
  var nested = d3
    .nest()
    .key(d => d.Year)
    .entries(datapoints)
  // console.log(nested)

  // pull out ages on x axis
  var ages = datapoints.map(d => d.Age)
  xPositionScale.domain(d3.extent(ages))

  // Draw your lines
  container
    .selectAll('.fertility-svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'fertility-svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      var svg = d3.select(this)

      var datapoints = d.values
      console.log(datapoints)

      let rateUS = d3.sum(datapoints, d => +d.ASFR_us).toFixed(2)
      let rateJP = d3.sum(datapoints, d => +d.ASFR_jp).toFixed(2)

      // Add your pathes
      svg
        .append('path')
        // why I cannot use .data(datapoints)
        .datum(datapoints)
        .attr('d', line_us)
        .attr('stroke', 'lightblue')
        .attr('fill', 'lightblue')
        .attr('opacity', 0.6)

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line_jp)
        .attr('stroke', 'red')
        .attr('fill', 'red')
        .attr('opacity', 0.4)
        .lower()

      // Add your notations
      svg
        .append('text')
        .attr('x', (width * 3) / 4)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', 8)
        .attr('stroke', 'lightblue')
        .attr('fill', 'lightblue')
        .attr('opacity', 0.6)
        .text(rateUS)

      svg
        .append('text')
        .attr('x', (width * 3) / 4)
        .attr('y', height / 2 + 10)
        .attr('text-anchor', 'middle')
        .style('font-size', 8)
        .attr('stroke', 'red')
        .attr('fill', 'red')
        .attr('opacity', 0.4)
        .text(rateJP)

      // Add your title
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 0 - margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', 10)
        .text(d.key)

      // Add your axes
      var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickValues([0.0, 0.1, 0.2, 0.3])
        .ticks(4)

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
export {
  xPositionScale,
  yPositionScale,
  width,
  height,
  line_us,
  line_jp,
  container
}
