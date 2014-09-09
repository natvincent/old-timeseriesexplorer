'use strict';

console.log('chart creator doin it\'s thang!');

var TRANSITION_SPEED = 1000;

// series base class
function Series (name) {
  console.log('Series constructor');
  this.data = [];
  this.name = name;
  this.chart = null;
}

Series.prototype.updateData = function(data) {
  console.log('base series updateData');
  this.data = data;
  this.calculateExtents();
  this.chart.updateAxes();
};

Series.prototype.calculateExtents = function () {
  
};

Series.prototype.InternalRefreshChart = function()  {

};

Series.prototype.setChart = function (chart) {
  this.chart = chart; 
};

function SimpleLineSeries (name) {
  console.log('SimpleLineSeries constructor');
  Series.call(this, name);
}

SimpleLineSeries.prototype = new Series();
SimpleLineSeries.prototype.constructor = SimpleLineSeries;

SimpleLineSeries.prototype.dateAccessor = function (d){ return d[0]; };
SimpleLineSeries.prototype.yAccessor = function (d){ return d[1]; };

SimpleLineSeries.prototype.calculateExtents = function () {
  console.log('SimpleLineSeries calculateExtents');
  this.chart.setYExtents(
      this.chart.minimum(this.data, this.yAccessor),
      this.chart.maximum(this.data, this.yAccessor)
    );

  this.chart.setXExtents(
      this.chart.minimum(this.data, this.dateAccessor),
      this.chart.maximum(this.data, this.dateAccessor)
    );
};

SimpleLineSeries.prototype.InternalRefreshChart = function() {
  console.log('SimpleLineSeries InternalRefreshChart name: ' + this.name 
    + ' counter: ' + this.counter 
    + ' time: ' + Date.now());
  var join = this.chart.lineGroup
    .selectAll('path.' + this.name)
    .data([this.data]);

  join
    .transition()
      .duration(TRANSITION_SPEED)
      .attr('d', this.chart.line(this.data));
  join
    .exit()
      .remove()
      .transition()
        .duration(TRANSITION_SPEED);
  join
    .enter()
      .append('path')
        .data([this.data])
        .attr('class', 'line')
        .attr('class', this.name)
        .attr('clip-path', 'url(#clip)')
        .attr('d', this.chart.line(this.data))
      .transition()
        .duration(TRANSITION_SPEED);

};

function PlumeSeries (name) {
  Series.call(this, name);
}

PlumeSeries.prototype = new Series();
PlumeSeries.prototype.constructor = SimpleLineSeries;

PlumeSeries.prototype.dateAccessor = function (d){ return d[0]; };
PlumeSeries.prototype.yAccessor = function (d){ return d[1]; };

PlumeSeries.prototype.calculateExtents = function () {
  this.chart.setYExtents(
      this.chart.minimum(this.data[0], this.yAccessor),
      this.chart.maximum(this.data[1], this.yAccessor)
    );

  this.chart.setXExtents(
      this.chart.minimum(this.data[0], this.dateAccessor),
      this.chart.maximum(this.data[1], this.dateAccessor)
    );
};

function Chart () {
  console.log('chart constructor begin');

  this.width = 600;
  this.height = 300;
  this.min = Math.min(this.width, this.height);

  this.svg = null;

  this.xMax = null;
  this.xMin = null;
  this.yMax = null;
  this.yMin = null;

  this.updateCount = 0;

  this.seriesList = {};

  this.xScale = d3.time.scale();
  this.yScale = d3.scale.linear().nice();

  this.xAxis = d3.svg.axis()
                    .orient('bottom')
                    .scale(this.xScale);
  this.yAxis = d3.svg.axis()
                    .orient('left')
                    .scale(this.yScale);

  this.line = d3.svg.line()
                      .x(
                        function(d) {
                          return this.xScale(d[0]);
                        })
                      .y(
                        function(d) {
                          return this.yScale(d[1]);
                        });
  console.log('chart constructor end');
}

Chart.prototype.setDomElement = function(element, width, height) {
  console.log('Chart.setDomElement');


  this.width = width;
  this.height = height;
  this.min = Math.min(this.width, this.height);

  console.log('newchart width: ' + this.width + ' height: ' + this.height);

  this.svg = d3.select(element).append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .style('border', '1px solid black')
    .style('padding', '50px')
    .append('g');

  this.axisGroup = this.svg
    .append('g')
    .attr('class', 'axisGroup');

  this.lineGroup = this.svg
    .append('g')
    .attr('class', 'lineGroup');

  this.xMax = null;
  this.xMin = null;
  this.yMax = null;
  this.yMin = null;

  this.xScale = d3.time.scale();
  this.yScale = d3.scale.linear().nice();

};

Chart.prototype.minimum = function (array, accessor) {
  if (typeof(accessor) !== 'undefined')
  {
    return d3.min(array, accessor);
  }
  else
  {
    return d3.min(array);
  }
};

Chart.prototype.maximum = function (array, accessor) {
  if (typeof(accessor) !== 'undefined')
  {
    return d3.max(array, accessor);
  }
  else
  {
    return d3.max(array);
  }
};

Chart.prototype.addSeries = function (series) {
  console.log('addSeries: ' + series);
  series.chart = this;
  this.seriesList[series.name] = series;
};

Chart.prototype.getSeries = function(name) {
  if (name in this.seriesList) {
    return this.seriesList[name];
  }
  else {
    return null;
  }
};

Chart.prototype.setYExtents = function(yMin, yMax) {
  this.yMin = this.yMin === null ? yMin : Math.min(this.yMin, yMin);
  this.yMax = this.yMax === null ? yMax : Math.max(this.yMax, yMax);
    
  this.updateAxes();

};

Chart.prototype.setXExtents = function(xMin, xMax) {
  this.xMin = this.xMin === null ? xMin : d3.min([this.xMin, xMin]);
  this.xMax = this.xMax === null ? xMax : d3.max([this.xMax, xMax]);

  this.updateAxes();
};

Chart.prototype.updateAxes = function () {
  console.log('Chart updateAxes. updateCount: ' + this.updateCount);
  if (this.updateCount === 0) {
    this.updateCount++;
    try {
      this.yScale = d3.scale.linear().nice()
                        .domain([this.yMin, this.yMax])
                        .range([this.height, 0]);
      this.yAxis = d3.svg.axis()
                      .orient('left')
                      .scale(this.yScale);

      this.xScale = d3.time.scale()
                        .domain([this.xMin, this.xMax])
                        .range([0, this.width]);
      this.xAxis = d3.svg.axis()
                      .orient('bottom')
                      .scale(this.xScale);

      var axisJoin = this.axisGroup
        .selectAll('.y')
        .data([this.yMin, this.yMax]);

      axisJoin
        .transition()
          .duration(TRANSITION_SPEED)
          .call(this.yAxis);
      axisJoin
        .enter()
          .append('g')
          .attr('class', 'y axis')
          .call(this.yAxis);

      axisJoin = this.axisGroup
        .selectAll('.x')
        .data([this.xMin, this.xMax]);

      axisJoin
        .transition()
          .duration(TRANSITION_SPEED)
          .call(this.xAxis);
      axisJoin
        .enter()
          .append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(this.xAxis);

      console.log('updateAxes: asking for series to update chart');
      for (var seriesKey in this.seriesList) {
        console.log('updateAxes: series: ' + seriesKey);
        this.seriesList[seriesKey].InternalRefreshChart();
      }

    }
    finally {
      this.updateCount--;
    }
  }
};

Chart.prototype.beginUpdate = function() {
  this.updateCount++;
};

Chart.prototype.endUpdate = function() {
  this.updateCount--;
  if (this.updateCount === 0) {
    this.updateAxes();
  }
};

var d3ChartModule = angular.module('d3Chart', [])
.factory('chart', function (){
  console.log('chart created');
  return new Chart();
})
.service('seriesFactory', function(){
  var counter = 0;
  this.createSimpleLineSeries = function(name) {
    counter++;
    var result = new SimpleLineSeries(name);
    result.counter = counter;
    return result;
  };
});
