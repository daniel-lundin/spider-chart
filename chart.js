'use strict';

const jsdom = require('jsdom');
const d3 = require('d3');

function dataToSpiderCoords(data, width, height) {
  const len = data.length;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 0.7 * (width / 2);
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


function createSvg(dom, width, height) {
  const svg = d3.select(dom.body)
      .append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('width', 2 * width)
      .attr('height', 2 * height);
  return svg;
}

function plotSpiderCoords(data, svg, strokeColor, fillColor) {
  const lineFunction = d3.svg.line()
    .x((d) => d.x)
    .y((d) => d.y)
    .interpolate('linear');

  svg.append('path')
    .attr('d', lineFunction(data))
    .attr('stroke', strokeColor)
    .attr('stroke-width', 1)
    .attr('fill', fillColor);
}

function generateNumberArray(number, length) {
  return Array.apply(null, { length: length }).map(() => number);
}

function xToTextAnchor(x, width) {
  if (Math.abs(width / 2 - x) < 20) {
    return 'middle';
  }
  if (width / 2 - x < 0) {
    return 'start';
  }
  return 'end';

}

function plotLabels(svg, labels, width, height) {
  // Plot labels
  const edgePositions = dataToSpiderCoords(generateNumberArray(7, labels.length), width, height);
  const textAttributes = labels.map((label, i) => ({
    cx: edgePositions[i].x,
    cy: edgePositions[i].y,
    text: label,
    textAnchor: xToTextAnchor(edgePositions[i].x, width)
  }));

  svg.selectAll('text')
    .data(textAttributes)
    .enter()
    .append('text')
    .attr('text-anchor', (d) => d.textAnchor)
    .attr('x', (d) => d.cx)
    .attr('y', (d) => d.cy)
    .text((d) => d.text)
    .attr('font-family', '\'Helvetice Neue\', sans-serif')
    .attr('font-weight', '200')
    .attr('font-size', '20px')
    .attr('fill', '#eee');
}

function plotLines(svg, labels, width, height) {
  const numberArray = generateNumberArray(8, labels.length);
  const spiderCoords = dataToSpiderCoords(numberArray, width, height);

  const lineFunction = d3.svg.line()
    .x((d) => d.x)
    .y((d) => d.y)
    .interpolate('linear');

  spiderCoords.forEach((point) => {
    const path = [
      { x: width / 2, y: height / 2 },
      point
    ];

    svg.append('path')
      .attr('d', lineFunction(path))
      .attr('stroke', 'gray')
      .attr('stroke-width', 1)
      .attr('fill', 'none');
  });
}

function plotLinesAndLabels(svg, labels, width, height) {
  [1, 2, 3, 4, 5, 6, 7].forEach(function(number) {
    const len = labels.length;
    const numberArray = generateNumberArray(number, len);
    const spiderCoords = dataToSpiderCoords(numberArray, width, height);
    plotSpiderCoords(spiderCoords, svg, 'gray', 'none');
  });

  plotLines(svg, labels, width, height);
  plotLabels(svg, labels, width, height);
}

function generateSpider() {
  const colors = ['rgba(0, 0, 255, 0.6)', 'rgba(255, 0, 0, 0.6)', 'green'];
  const labels = ['foobar', 'shizzle', 'my', 'dizzle', 'old', 'hedgehog'];
  const dataSeries = [
    [7, 7, 2, 5, 3, 3],
    [5, 5, 1, 7, 2, 2]
  ];
  const width = 400;
  const height = 400;

  const dom = jsdom.jsdom();
  const svg = createSvg(dom, width, height);

  plotLinesAndLabels(svg, labels, width, height);
  dataSeries.forEach(function(d, index) {
    const spiderCoords = dataToSpiderCoords(d, width, height);
    plotSpiderCoords(spiderCoords, svg, '#eee', colors[index]);
  });

  return d3.select(dom.body).html();
}

module.exports = {
  generateSpider: generateSpider
};
