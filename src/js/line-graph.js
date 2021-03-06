var margin = {
    top: 20,
    right: 80,
    bottom: 30,
    left: 50
},
    width = 1200 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom

// parse data / time
var parseTime = d3.timeParse('%Y')

// set ranges
var x = d3.scaleTime().range([0, width])
var y = d3.scaleLinear().range([height, 0])

// define line
var valueline = d3.line()
    .x(d => x(d.discovery_date))
    .y(d => y(d.discovery_order))
    .curve(d3.curveStepAfter)

// append svg object
// append group
// move group
var svg = d3.select('main').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)


// do stuff with data
d3.json('/data/discovery_order.json', function (error, data) {
    if (error) console.error(error)
    // format data, objects are passed by ref and therefore can be changed
    // unlike array of primitives
    data = data.elements
    data.forEach(d => {
        d.discovery_date = parseTime(d.discovery_date)        
    })

    // scale range of data
    x.domain([parseTime("1210"), d3.max(data, d => d.discovery_date )])
    y.domain([0, d3.max(data, d => d.discovery_order )])

    // add valueline path
    svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueline)
    
    // add x-axis
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    svg.append('g')
        .attr('transform', `translate(0, 0)`)
        .call(d3.axisTop(x))

    // add x label
    let x_offset = width/2
    let y_offset = height + margin.top + 20
    svg.append('text')
        .attr('transform', `translate(${x_offset}, ${y_offset})`)
        .style('text-anchor', 'middle')
        .text('Year Discovered')
    
    // add y-axis
    svg.append('g')
        .call(d3.axisLeft(y))

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height/2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Discovered Order')
    
    
    svg.append('text')
        .attr('transform', `translate(${margin.left * 2}, ${margin.top * 6})`)
        .attr('font-size', '1.5em')
        .append('svg:tspan')
        .attr('x', 0)
        .attr('dy', 25)
        .text('Chronological Rate of Acquisition')
        .append('svg:tspan')
        .attr('x', 0)
        .attr('dy', 25)
        .text('of Chemical Elements')
    
    svg.append('g')
        .classed('g-element-labels', true)
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', (d) => x(d.discovery_date) + 5)
        .attr('y', (d) => y(d.discovery_order) + 10)
        .text((d) => `${d.number}  ${d.name}`)

    d3.select('.g-element-labels')
        .selectAll('text')
        .on('mouseover', function (d, i) {
            let xPosition = Math.trunc(parseFloat(d3.select(this).attr("x")))
            let yPosition = Math.trunc(parseFloat(d3.select(this).attr("y")))
            
            d3.select('.tooltip')
                .style('left', `${xPosition-200}px`)
                .style('top', `${yPosition}px`)
                .classed('hidden', false)
            
            rePositionTooltip(xPosition, yPosition)
            d3.select(this).style('fill', 'red')
            
            d3.select('.element_name').text(d.name)
            d3.select('.note').text(d.notes)
        })
        .on('mouseout', function(d, i) {
            d3.select('.tooltip').classed('hidden', true)
            d3.select(this).style('fill', 'black')
        })
})

function rePositionTooltip (xPosition, yPosition) {
    let box = document.getElementsByClassName('tooltip')[0]
    let viewable = isElementInViewport(box)

    xPosition = viewable ? xPosition - 200 : xPosition + 200
    yPosition = viewable ? yPosition : yPosition - 150

    d3.select('.tooltip')
        .style('left', `${xPosition}px`)
        .style('top', `${yPosition}px`)
}

function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
    );
}


