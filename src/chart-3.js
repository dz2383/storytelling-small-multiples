import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 30, left: 40, right: 20, bottom: 20 }

var height = 200 - margin.top - margin.bottom
var width = 150 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales
var xPositionScale = d3.scaleLinear().range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.income)
  })

// Read in your data
Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
]).then(ready)

// Build your ready function that draws lines, axes, etc
function ready([datapoints_world, datapoints_us]) {
  // Group your data together
  var nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapoints_world)
  // console.log(nested)

  // put out years on x axis
  // use  d3.extent() !
  var incomeYear = datapoints_world.map(d => d.year)
  xPositionScale.domain(d3.extent(incomeYear))

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      var svg = d3.select(this)

      var datapoints = d.values
      // console.log(datapoints)

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('stroke', '#c51b8a')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      svg
        .append('path')
        .datum(datapoints_us)
        .attr('d', line)
        .attr('stroke', 'gray')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      // Add your title
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 0 - margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', 14)
        .style('fill', '#c51b8a')
        .attr('font-weight', 'bold')
        .text(d.key)
      // Add USA notation
      svg
        .append('text')
        .text('USA')
        .attr('x', 10)
        .attr('y', 20)
        .attr('font-size', 10)
        .attr('fill', 'gray')

      // Add your axes
      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickFormat(d3.format('d'))
        .tickValues([1980, 1990, 2000, 2010])
        .tickSize(-height)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .style('stroke-dasharray', '2, 2')
        .call(xAxis)

      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickFormat(d3.format('$,d'))
        .tickSize(-width)
        .tickValues([5000, 10000, 15000, 20000])
        

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .style('stroke-dasharray', '2, 2')
        .call(yAxis)

      // Move our axes below everything else
      svg.select('.axis').lower()

      // Remove the weird lines
      svg.selectAll('.domain').remove()
    })
}
export {
  xPositionScale,
  yPositionScale,
  width,
  height,
  line,
  container
}

