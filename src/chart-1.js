import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 60, left: 50, right: 200, bottom: 30 }

var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

// Add your svg
var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create a time parser (see hints)
let parseTime = d3.timeParse('%B-%y')

// Create your scales
var xPositionScale = d3.scaleLinear().range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([180, 340])
  .range([height, 0])
var colorScale = d3
  .scaleOrdinal()
  .domain([
    'Mountain',
    'Pacific',
    'West South Central',
    'South Atlantic',
    'U.S.',
    'West North Central',
    'New England',
    'East South Central',
    'Middle Atlantic',
    'East North Central'
  ])
  .range([
    '#d53e4f',
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#ffffbf',
    '#e6f598',
    '#abdda4',
    '#66c2a5',
    '#3288bd',
    '#92c5de'
  ])

// Create a d3.line function that uses your scales
// line generator
var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })
  .curve(d3.curveMonotoneX)

// Read in your housing price data
d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Write your ready function

function ready(datapoints) {
  // Convert your months to dates
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  let dates = datapoints.map(function(d) {
    return d.datetime
  })
  // console.log(datapoints)

  xPositionScale.domain(d3.extent(dates))

  // Get a list of dates and a list of prices

  // Group your data together
  var nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)
  // console.log(nested)

  // Draw your lines

  svg
    .selectAll('.price-category')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'price-category')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', d => colorScale(d.key))
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .lower()

  svg
    .selectAll('.last-month')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'last-month')
    .attr('cy', d => yPositionScale(d.values[0].price))
    .attr('cx', d => xPositionScale(d.values[0].datetime))
    // This also works because all circles have same x position
    // .attr('cx', width)
    .attr('fill', d => colorScale(d.key))
    .attr('r', 3)

  // Add your text on the right-hand side
  svg
    .selectAll('.region-category')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'region-category')
    .attr('y', d => yPositionScale(d.values[0].price))
    .attr('x', width)
    .attr('dx', 7)
    .attr('alignment-baseline', 'hanging')
    .attr('font-size', 12)
    // .attr('text-anchor', 'start')
    .text(d => d.key)

  // Add your title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 0 - margin.top / 2)
    .attr('text-anchor', 'middle')
    // Style is same as attr here
    // But use Style in <div>
    .style('font-size', 18)
    // .style('text-decoration', 'underline')
    .text('U.S. Housing Prices Fall in Winter')

  // Add the shaded rectangle
  var december16 = parseTime('December-16')
  var february17 = parseTime('February-17')
  // var maxPrice = d3.max(datapoints, d => d.price)
  svg
    .append('rect')
    .attr('x', xPositionScale(december16))
    // .attr('y', yPositionScale(340))
    .attr('y', yPositionScale(340))
    .attr('width', xPositionScale(february17) - xPositionScale(december16))
    .attr('height', height)
    .attr('fill', 'lightgray')
    .attr('opacity', 0.5)

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

  var yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([200, 220, 240, 260, 280, 300, 320])

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}

export {
  xPositionScale,
  yPositionScale,
  colorScale,
  width,
  height,
  line,
  parseTime
}
