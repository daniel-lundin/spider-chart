var jsdom = require('jsdom');
var d3 = require('d3');

var dom = jsdom.jsdom();

var colors = ['rgba(0, 0, 255, 0.8)', 'rgba(255, 0, 0, 0.8)', 'green'];
var data = [
  [7, 7, 2, 5, 3, 3],
  [5, 5, 1, 4, 2, 2]
];
var width = 400;
var height = 400;

function dataToSpiderCoords(data) {
  var len = data.length;
  var centerX = width/2;
  var centerY = height/2;
  var spiderCoords =  data.map(function(d, index) {
    // Polar coordinates
    var r = 1/7 + (d - 1) / 7;
    var phi = index / len * 2 * Math.PI - Math.PI / 2;
    // Covert to Cartesian coordinates
    var x = r * Math.cos(phi);
    var y = r * Math.sin(phi);

    return {
      x: centerX + x * (width / 2),
      y: centerY + y * (width / 2)
    };
  });
  // Make it repeatable
  return spiderCoords.concat(spiderCoords[0]);
}


var spiderCoords = dataToSpiderCoords(data);

function createSvg() {
  var svg = d3.select(dom.body)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  return svg;
}

var lineFunction = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate('linear');

function plotSpiderCoords(data, svg, strokeColor, fillColor) {
  var path = svg.append('path')
      .attr('d', lineFunction(data))
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2)
      .attr('fill', fillColor);
}

//console.log(spiderCoords);
var svg = createSvg();

// Plot grid lines
[1, 2, 3, 4, 5, 6, 7].forEach(function(number) {
  var len = data[0].length;
  var numberArray = Array.apply(null, { length: len }).map(function() { return number; });
  var spiderCoords = dataToSpiderCoords(numberArray);
  plotSpiderCoords(spiderCoords, svg, 'orange', 'none');
});

data.forEach(function(d, index) {
  var spiderCoords = dataToSpiderCoords(d);
  plotSpiderCoords(spiderCoords, svg, colors[index], colors[index]);
});

var html = d3.select(dom.body).html();
console.log('<html><body>' + html + '</body></html>');

