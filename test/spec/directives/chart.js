'use strict';

describe('Directive: chartDirective', function () {

  var scope, html, element, compiled, $compile;

  var chartMock;


  beforeEach(function (){
    console.log('before each');
    module('chartDirective');

    chartMock = jasmine.createSpyObj('chart', ['setDomElement', 'setYExtents']);

    module(function ($provide){
      console.log('module call');
      $provide.value('chart', chartMock);
    });

    inject(function (_$compile_, $rootScope) {
      scope = $rootScope.$new();
      $compile = _$compile_;
    });
  });

  it('should set the width and height', function () {

      var element = angular.element('<chart width="300" height="300"/>');
      var compiled = $compile(element);
    
      compiled(scope);
      scope.$digest();

      expect(chartMock.setDomElement).toHaveBeenCalledWith(element[0], 300, 300);
  });

  it('should set the min and max y axis if available on the scope', function () {

      scope.yaxis = {min: 10,
                     max: 35 };

      var element = angular.element('<chart width="300" height="300" yaxis="yaxis"/>');

      console.log('compiling element');
      var compiled = $compile(element)(scope);

      console.log('Before digest. yAxis: ' + scope.yaxis);

      scope.$digest();

      expect(chartMock.setYExtents).toHaveBeenCalledWith(10, 35);


  });

});

describe('Directive: chartDirective', function () {

  var scope, html, seriesElement, chartElement, compiled, $compile;

  var chartMock, seriesFactory, seriesMock, chartController;

  beforeEach(function (){
    console.log('before each');
    module('chartDirective');

    seriesFactory = {
      createSimpleLineSeries: function(name) {}
    }

    seriesMock = jasmine.createSpyObj('series', ['updateData']);
    spyOn(seriesFactory, 'createSimpleLineSeries').andReturn(seriesMock);

    chartMock = jasmine.createSpyObj('chart', ['setDomElement', 'setYExtents',
                                               'beginUpdate', 'endUpdate', 
                                               'getSeries', 'addSeries']);
    
    module(function ($provide){
      console.log('module call');
      $provide.value('chart', chartMock);
      $provide.value('seriesFactory', seriesFactory);
    });

    inject(function (_$compile_, $rootScope) {
      scope = $rootScope.$new();
      $compile = _$compile_;
    });

    chartElement = $compile('<chart></chart>')(scope);
    chartController = chartElement.controller('chart');
    spyOn(chartController, 'getChart').andReturn(chartMock);

  });

  it('should get the chart object from the parent chart element and add series created by factory injected in', function () {

    seriesElement = angular.element('<timeseries id="future"/>');
    chartElement.append(seriesElement);
    seriesElement = $compile(seriesElement)(scope);

    expect(seriesFactory.createSimpleLineSeries).toHaveBeenCalledWith('future');
    expect(chartController.getChart).toHaveBeenCalled();
    expect(chartMock.addSeries).toHaveBeenCalledWith(seriesMock);
  });

  it('should call methods on d3chart when data changes', function () {
  
    seriesElement = angular.element('<timeseries id="future" data="data"/>');
    chartElement.append(seriesElement);
    seriesElement = $compile(seriesElement)(scope);

    console.log('setting data');
    seriesElement.scope().data = [ [
                     "1901-01-01T01:00:00.000Z",
                     302.15303
                   ],
                   [
                     "1902-01-01T01:00:00.000Z",
                     301.71471400000001
                   ] ];

    console.log('calling apply');
    seriesElement.scope().$apply();

    console.log('apply done, doing checks');
    expect(seriesMock.updateData).toHaveBeenCalledWith(scope.data);

  });


});