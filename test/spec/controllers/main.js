'use strict';

var testVariables = [{value: 'tasmax', label: 'Maximum Temperature'},
                 {value: 'tasmin', label: 'Minimum Temperature'},
                 {value: 'psl', label: 'Sea Level Pressure'},
                 {value: 'tas', label: 'Temperature at Surface'}];
var testSeasons = ['annual', 'djf', 'mam', 'jja', 'son'];
var testScenarios = ['rcp85'];
var testRegions = {1: {"code": "RS", "name": "Rangelands (South)", "region_set": "NRM15"}, 
                   2: {"code": "ECN", "name": "East Coast (North)", "region_set": "NRM15"}, 
                   3: {"code": "SSTW", "name": "Southern Slopes (Tas West)", "region_set": "NRM15"}};

// test data - this is really really test data, and doesn't mean anything.

var testHistorialData =  { "ACCESS1-0": { 
                              "table" : { 
                                "rows" : 
                                  [ [ "1900-01-01T01:00:00.000Z",
                                      "1.0E20" ],
                                    [ "1900-01-01T01:00:00.000Z",
                                      "295.4722" ] ] 
                              } 
                            },
                           "ACCESS1-3": { 
                              "table" : { 
                                "rows" : 
                                  [ [ "1900-01-01T01:00:00.000Z",
                                      "294.4722" ] ] 
                              } 
                            } 
                          };

var testHistorialDataFixed = 
                          { "ACCESS1-0": { 
                              "table" : { 
                                "rows" : 
                                  [ [ "1900-01-01T01:00:00.000Z",
                                      null ],
                                    [ "1900-01-01T01:00:00.000Z",
                                      "295.4722" ] ] 
                              } 
                            },
                           "ACCESS1-3": { 
                              "table" : { 
                                "rows" : 
                                  [ [ "1900-01-01T01:00:00.000Z",
                                      "294.4722" ] ] 
                              } 
                            } 
                          };

var testFutureData =  { "ACCESS1-0": { 
                              "table" : { 
                                "rows" : 
                                  [ [ "2006-01-01T01:00:00.000Z",
                                      "296.4722" ] ] 
                              } 
                            }, 
                        "ACCESS1-3": { 
                              "table" : { 
                                "rows" : 
                                  [ [ "2006-01-01T01:00:00.000Z",
                                      "297.4722" ] ] 
                              } 
                            } 
                          };

var testHistoricalEnsembleData =  { "mean": { 
                                  "table" : { 
                                    "rows" : 
                                      [ [ "1900-01-01T01:00:00.000Z",
                                          "295.4722" ] ] 
                                  } 
                                },
                                "pctl90": { 
                                  "table" : { 
                                    "rows" : 
                                      [ [ "1900-01-01T01:00:00.000Z",
                                          "295.4722" ] ] } },
                                "pctl10": { 
                                  "table" : { 
                                    "rows" : 
                                      [ [ "1900-01-01T01:00:00.000Z",
                                          "295.4722" ] ] } } };

var testFutureEnsembleData =      { "mean": { 
                                  "table" : { 
                                    "rows" : 
                                      [ [ "2006-01-01T01:00:00.000Z",
                                          "295.4722" ] ] 
                                  } 
                                },
                                "pctl90": { 
                                  "table" : { 
                                    "rows" : 
                                      [ [ "2006-01-01T01:00:00.000Z",
                                          "295.4722" ] ] } },
                                "pctl10": { 
                                  "table" : { 
                                    "rows" : 
                                      [ [ "2006-01-01T01:00:00.000Z",
                                          "295.4722" ] ] } } };

var testAll = { "historical": testHistorialData,
                "future": testFutureData,
                "historicalEnsemble": testHistoricalEnsembleData,
                "futureEnsemble": testFutureEnsembleData };

describe('Controller: ChartController', function () {

  // load the controller's module
  beforeEach(module('pageApp'));

  var ChartController,
    $rootScope,
    $q,
    scope,
    httpBackend,
    urlBuilder,
    resourcesMock,
    modelsMock,
    deferredRegion,
    deferredSeries,
    deferredRequestModelData;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$q_, $controller, $httpBackend, _$rootScope_) {
    $rootScope = _$rootScope_;
    $q = _$q_;

    urlBuilder = {
      createModelDataUrl: function () {}
    }

    spyOn(urlBuilder, 'createModelDataUrl').andReturn('http://blah');

    deferredRegion = $q.defer();
    deferredSeries = $q.defer();

    resourcesMock = jasmine.createSpyObj('resources',
                                         ['getVariables',
                                          'getSeasons',
                                          'getScenarios', 
                                          'requestRegions']);

    resourcesMock.getVariables.andReturn(testVariables);
    resourcesMock.getSeasons.andReturn(testSeasons);
    resourcesMock.getScenarios.andReturn(testScenarios);
    resourcesMock.requestRegions.andReturn(deferredRegion.promise);

    modelsMock = jasmine.createSpyObj('models', 
                                      ['requestModelData',
                                       'getHistorical',
                                       'getFuture',
                                       'getHistoricalEnsemble',
                                       'getFutureEnsemble',
                                       'getModelNames',
                                       'getMaxTemp',
                                       'getMinTemp']);

    modelsMock.getHistorical.andReturn(testHistorialData['ACCESS1-0'].table.rows);
    modelsMock.getFuture.andReturn(testFutureData['ACCESS1-0'].table.rows);

    modelsMock.getHistoricalEnsemble.andReturn(testHistoricalEnsembleData['pctl10'].table.rows);
    modelsMock.getFutureEnsemble.andReturn(testFutureEnsembleData['pctl10'].table.rows);

    modelsMock.getModelNames.andReturn(['ACCESS1-0']);

    deferredRequestModelData = $q.defer();

    modelsMock.requestModelData.andReturn(deferredRequestModelData.promise);

    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    ChartController = $controller('ChartController', {
      $scope: scope,
      resources: resourcesMock,
      models: modelsMock
    });
  }));

  afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

  it('should initialise defaults and things that need to be initialsed', function () {
    // these defaults as discussed with Penny Whetton on 2014-08-21
    expect(scope.currentModel).toEqual('ACCESS1-0');
    expect(scope.currentRegion).toEqual('MB');
    expect(scope.currentScenario).toEqual('rcp45');
    expect(scope.currentSeason).toEqual('annual');
    expect(scope.currentVariable).toEqual('tas');

    expect(scope.yAxis).toBeNull();
    expect(scope.regions).toBeNull();
  });

  it('should populate the variables from resource factory', function () {
    expect(resourcesMock.getVariables).toHaveBeenCalled();
    expect(scope.variables).toEqual(testVariables);
  });

  it('should populate the seasons from the resource factory', function () {
    expect(resourcesMock.getSeasons).toHaveBeenCalled();
    expect(scope.seasons).toEqual(testSeasons);
  });

  it('should populate the scenarios from the resource factory', function () {
    expect(resourcesMock.getScenarios).toHaveBeenCalled();
    expect(scope.scenarios).toEqual(testScenarios);
  });

  it('should populate the regions from the resource factory (which will do a http call in behind the scenes)', function () {
    deferredRegion.resolve(testRegions);
    $rootScope.$digest();

    expect(resourcesMock.requestRegions).toHaveBeenCalled();
    expect(scope.regions).toEqual(testRegions);
  });

  it('should populate model data initially based on the first value in variables, seasons, scenarios, regions and series type', function (){
    deferredRequestModelData.resolve();
    $rootScope.$digest();

    expect(modelsMock.requestModelData)
      .toHaveBeenCalledWith('rcp45', 'tas', 'annual', 'MB');

    expect(scope.historical).toEqual(testHistorialData['ACCESS1-0'].table.rows);
    expect(scope.future).toEqual(testFutureData['ACCESS1-0'].table.rows);

    expect(scope.historical90th).toEqual(testHistoricalEnsembleData['pctl90'].table.rows);
    expect(scope.future90th).toEqual(testFutureEnsembleData['pctl10'].table.rows);
    
    expect(scope.historical10th).toEqual(testHistoricalEnsembleData['pctl10'].table.rows);
    expect(scope.future10th).toEqual(testFutureEnsembleData['pctl10'].table.rows);

    expect(scope.historicalMean).toEqual(testHistoricalEnsembleData['mean'].table.rows);
    expect(scope.futureMean).toEqual(testFutureEnsembleData['mean'].table.rows);

  });

  it('should populate the models list on the scope with the names from the model', function(){
    deferredRequestModelData.resolve();
    $rootScope.$digest();

    expect(modelsMock.requestModelData)
      .toHaveBeenCalledWith('rcp45', 'tas', 'annual', 'MB');

    expect(modelsMock.getModelNames).toHaveBeenCalled();

    expect(scope.models).toEqual(['ACCESS1-0']);

  });

  it('should request model data when region changes', function () {

    deferredSeries.resolve(testAll);
    $rootScope.$digest();

    scope.currentRegion = 'SS';

    deferredRequestModelData.resolve(testAll);
    $rootScope.$digest();

    expect(modelsMock.requestModelData)
      .toHaveBeenCalledWith('rcp45', 'tas', 'annual', 'SS');

  });

  it('should request model data when season changes', function () {

    deferredRequestModelData.resolve();
    $rootScope.$digest();

    scope.currentSeason = 'djf';

    deferredRequestModelData.resolve(testAll);
    $rootScope.$digest();

    expect(modelsMock.requestModelData)
      .toHaveBeenCalledWith('rcp45', 'tas', 'djf', 'MB');

  });

  it('should request model data when variable changes', function () {

    deferredRequestModelData.resolve();
    $rootScope.$digest();

    scope.currentVariable = 'tasmax';

    deferredRequestModelData.resolve();
    $rootScope.$digest();

    expect(modelsMock.requestModelData)
      .toHaveBeenCalledWith('rcp45', 'tasmax', 'annual', 'MB');

  });

  it('should request model data when scenario changes', function () {

    deferredRequestModelData.resolve();
    $rootScope.$digest();

    scope.currentScenario = 'rcp85';

    deferredRequestModelData.resolve();
    $rootScope.$digest();

    expect(modelsMock.requestModelData)
      .toHaveBeenCalledWith('rcp85', 'tas', 'annual', 'MB');

  });

  it('should update the current model on the scope when currentModel is changed', function(){

    deferredRequestModelData.resolve();
    $rootScope.$digest();

    scope.currentModel = 'ACCESS1-3';

    $rootScope.$digest();

    expect(modelsMock.getHistorical)
      .toHaveBeenCalledWith('ACCESS1-3');

    expect(scope.historical).toEqual(testHistorialData['ACCESS1-0'].table.rows);

  });

  it('should update the yAxis data on the scope with the data from the models', function(){
    
    modelsMock.getMaxTemp.andReturn(31);
    modelsMock.getMinTemp.andReturn(14);

    deferredRequestModelData.resolve();
    $rootScope.$digest();

    expect(scope.yAxis.max).toEqual(31);
    expect(scope.yAxis.min).toEqual(14);

    expect(modelsMock.getMaxTemp).toHaveBeenCalled();
    expect(modelsMock.getMinTemp).toHaveBeenCalled();

  });

});