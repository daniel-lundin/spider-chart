'use strict';

const jsdom = require('jsdom');
const d3 = require('d3');

const dom = jsdom.jsdom();

const colors = ['rgba(0, 0, 255, 0.6)', 'rgba(255, 0, 0, 0.6)', 'green'];
const labels = ['foobar', 'shizzle', 'my', 'dizzle', 'old', 'hedgehog'];
const dataSeries = [
  [7, 7, 2, 5, 3, 3],
  [5, 5, 1, 7, 2, 2]
];
const width = 400;
const height = 400;

function dataToSpiderCoords(data) {
  const len = data.length;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 0.8 * (width / 2);
  const spiderCoords =  data.map((d, index) => {
    // Polar coordinates
    const r = 1 / 7 + (d - 1) / 7;
    const phi = index / len * 2 * Math.PI - Math.PI / 2;
    // Covert to Cartesian coordinates
    const x = r * Math.cos(phi);
    const y = r * Math.sin(phi);

    return {
      x: centerX + x * radius,
      y: centerY + y * radius
    };
  });
  // Make it repeatable
  return spiderCoords.concat(spiderCoords[0]);
}


function createSvg() {
  const svg = d3.select(dom.body)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  return svg;
}

const lineFunction = d3.svg.line()
  .x((d) => d.x)
  .y((d) => d.y)
  .interpolate('linear');

function plotSpiderCoords(data, svg, strokeColor, fillColor) {
  svg.append('path')
    .attr('d', lineFunction(data))
    .attr('stroke', strokeColor)
    .attr('stroke-width', 1)
    .attr('fill', fillColor);
}

function generateNumberArray(number, length) {
  return Array.apply(null, { length: length }).map(() => number);
}

function xToTextAnchor(x) {
  if (Math.abs(width / 2 - x) < 20) {
    return 'middle';
  }
  if (width / 2 - x < 0) {
    return 'start';
  }
  return 'end';

}

function plotLabels(svg) {
  // Plot labels
  const edgePositions = dataToSpiderCoords(generateNumberArray(7, labels.length));
  const textAttributes = labels.map((label, i) => ({
    cx: edgePositions[i].x,
    cy: edgePositions[i].y,
    text: label,
    textAnchor: xToTextAnchor(edgePositions[i].x)
  }));

  svg.selectAll('text')
    .data(textAttributes)
    .enter()
    .append('text')
    .attr('text-anchor', (d) => d.textAnchor)
    .attr('x', (d) => d.cx)
    .attr('y', (d) => d.cy)
    .text((d) => d.text)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '20px')
    .attr('fill', 'black');
}


//console.log(spiderCoords);
const svg = createSvg();

// Plot grid lines
[1, 2, 3, 4, 5, 6, 7].forEach(function(number) {
  const len = dataSeries[0].length;
  const numberArray = generateNumberArray(number, len);
  const spiderCoords = dataToSpiderCoords(numberArray);
  plotSpiderCoords(spiderCoords, svg, 'gray', 'none');
});

plotLabels(svg, labels);

dataSeries.forEach(function(d, index) {
  const spiderCoords = dataToSpiderCoords(d);
  plotSpiderCoords(spiderCoords, svg, colors[index], colors[index]);
});

const html = d3.select(dom.body).html();
console.log('<html><body>' + html + '</body></html>');

