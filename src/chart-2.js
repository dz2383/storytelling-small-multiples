import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 30, left: 20, right: 20, bottom: 20 }

var height = 150 - margin.top - margin.bottom
var width = 100 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales
var xPositionScale = d3.scaleLinear().range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// var colorScale = d3
//   .scaleOrdinal()
//   .domain(['ASFR_jp', 'ASFR_us'])
//   .range(['#e34a33', '#2b8cbe'])

// Create a d3.line function that uses your scales
var lineus = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_us)
  })
  .curve(d3.curveMonotoneX)

var linejp = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_jp)
  })
  .curve(d3.curveMonotoneX)

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
  console.log(nested)

  // Draw your lines
  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  svg
    .append('path')
    .attr('d', function(d) {
      return lineus(d.values)
    })
    .attr('stroke', '#2b8cbe')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .lower()
  // .each(function(d) {
  //   var g = d3.select(this)

  //   var datapoints = d.values
  //   console.log(datapoints)}

  // Need to use + here to convert to numbers
  // let maxHigh = d3.max(datapoints, d => +d.high)
  // let minHigh = d3.min(datapoints, d => +d.high)

  // g.append('circle')
  //   .attr('r', 7)
  //   .attr('fill', 'pink')
  //   .attr('cy', 0)
  //   .attr('cx', xPositionScale(maxHigh))

  // g.append('circle')
  //   .attr('r', 7)
  //   .attr('fill', 'lightblue')
  //   .attr('cy', 0)
  //   .attr('cx', xPositionScale(minHigh))

  // g.append('line')
  //   .attr('y1', 0)
  //   .attr('y2', 0)
  //   .attr('x1', xPositionScale(minHigh))
  //   .attr('x2', xPositionScale(maxHigh))
  //   .attr('stroke', 'grey')
  //   .lower()

  // Add your axes
  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(10)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale).tickValues([0.0, 0.1, 0.2, 0.3])

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
