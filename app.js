'use strict';

const express = require('express');
const app = express();
const chart = require('./chart.js');

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', (req, res) => {
  const chartSvg = chart.generateSpider();
  res.render('index', { chart: chartSvg });
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
