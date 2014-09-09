'use strict';

var app = angular.module('chartDirective', ['d3Chart']);

console.log('chartDirective module load');

app.directive('chart', function(chart) {

  console.log('chart directive');
  function link(scope, element) {
    console.log('chart link');
    console.log(chart);
    // the d3 bits
    var el = element[0];

    chart.setDomElement(el, scope.width, scope.height);

    if (typeof(scope.yaxis) !== 'undefined' && scope.yaxis !== null) { 
      chart.setYExtents(scope.yaxis.min, scope.yaxis.max);
    } else {
      console.log(scope.yaxis);
    }

    console.log('test: ' + scope.test);

    scope.$watch('yaxis', function(newData, oldData, scope){
      console.log('scope watch on yAxis');
      console.log('newData = ' + typeof(newData));
      console.log('scope.yAxis = ' + typeof(scope.yaxis));
      if (typeof(newData) !== 'undefined' && newData !== null) { 
        chart.setYExtents(newData.min, newData.max);
        console.log('done watch');
      }
    });

    scope.$watch('test', function(newData, oldData) {
      console.log('test newData: ' + newData);
    });
  }

  // isolate scope
  console.log('chart directive returning stuff');

  return {
    scope: {
      'data': '=',
      'onClick': '&',
      'width': '=',
      'height': '=',
      'yaxis': '=',
      'test' : '='
    },
    restrict: 'E',
    link: link,
    compile: null,
    controller: function ($scope, $compile, $http) {
      console.log('chart controller');
      this.getChart = function () {
        console.log('chart controller getChart');
        return chart;
      };
    }
  };
});

app.directive('timeseries', function(seriesFactory) {
  console.log('timeSeries!');
  var chart = null;

  function link(scope, elem, attrs, controllerInstance) {
    console.log('timeSeries Link function');
    
    var series = null;

    series = seriesFactory.createSimpleLineSeries(scope.id);

    chart = controllerInstance.getChart();

    chart.addSeries(series);

    console.log('timeSeries Link getChart called');

    // our data changed or we are here for the first time! 
    scope.$watchCollection('data', function(newData, oldData, scope){
      console.log('in timeSeries watch! series: ' + series.name);

      // console.log('new: ' + newData + ' old: ' + oldData);
      if (!newData) {
        console.log('No data yet, exiting.');
        return;
      }

      chart.beginUpdate();
      try {
        console.log('updating series data');
        series.updateData(newData);
        console.log('update done');
      }
      finally {
        chart.endUpdate();
      }
      console.log('done watch');
    });
  }

  return {
    scope: {
      'data': '=',
      'id' : '@'
    },
    compile: null,
    restrict: 'E',
    require: '^chart',
    link: link
  };
});