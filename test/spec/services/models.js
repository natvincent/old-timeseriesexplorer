'use strict';

describe('Service: models', function () {

  var models, 
  		dataFixerMock,
  		$httpBackend, 
  		urlBuilderMock,
  		$rootScope;

  beforeEach(function() {
     module('pageApp');
  });

  beforeEach(function(){

    var responseLookup = {
      'historical': '/callone',
      'rcp45': '/calltwo',
      'historical_ensemble': '/callthree',
      'rcp45_ensemble': '/callfour'
    }

    urlBuilderMock = {
      createModelDataUrl: function (scenario, variable, season, region) {
        return responseLookup[scenario];
      }
    }

    spyOn(urlBuilderMock, 'createModelDataUrl').andCallThrough();

    dataFixerMock = jasmine.createSpyObj('dataFixer', 
    																				['getMinTemp',
    																				 'getMaxTemp',
    																				 'processModelData',
    																				 'clearExtents']);

    module(function ($provide){
      $provide.value('urlBuilder', urlBuilderMock);
      $provide.value('dataFixer', dataFixerMock);
    });

    inject(function (_$rootScope_, _$httpBackend_, $injector) {
    	$rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      models = $injector.get('models');
    });

    $httpBackend.expectGET('/callone')
      .respond(200, testHistorialData);

    $httpBackend.expectGET('/calltwo')
      .respond(200, testFutureData);

    $httpBackend.expectGET('/callthree')
      .respond(200, testHistoricalEnsembleData);

    $httpBackend.expectGET('/callfour')
      .respond(200, testFutureEnsembleData);

  });

  it('should be able to request the model data and return a promise', function () {
    
    models.requestModelData('rcp45', 'tas', 'winter', 'CS')
      .then(function(){
        expect(models.getHistorical('ACCESS1-0')).toEqual(testHistorialData['ACCESS1-0'].table.rows);
        expect(models.getFuture('ACCESS1-0')).toEqual(testFutureData['ACCESS1-0'].table.rows);
        expect(models.getHistoricalEnsemble('mean')).toEqual(testHistoricalEnsembleData['mean'].table.rows);
        expect(models.getFutureEnsemble('pctl10')).toEqual(testFutureEnsembleData['pctl10'].table.rows);
      });

    $rootScope.$digest();
    $httpBackend.flush();

    expect(urlBuilderMock.createModelDataUrl.calls.length).toEqual(4);

    expect(urlBuilderMock.createModelDataUrl.calls[0].args)
      .toEqual(['historical', 'tas', 'winter', 'CS']);
    expect(urlBuilderMock.createModelDataUrl.calls[1].args)
      .toEqual(['rcp45', 'tas', 'winter', 'CS']);
    expect(urlBuilderMock.createModelDataUrl.calls[2].args)
      .toEqual(['historical_ensemble', 'tas', 'winter', 'CS']);
    expect(urlBuilderMock.createModelDataUrl.calls[3].args)
      .toEqual(['rcp45_ensemble', 'tas', 'winter', 'CS']);

  });

	it('should populate the model names list when the request is complete', function (){

    models.requestModelData('rcp45', 'tas', 'winter', 'CS')
      .then(function(){
        expect(models.getModelNames()).toEqual(['ACCESS1-0', 'ACCESS1-3']);
      });

    $rootScope.$digest();
    $httpBackend.flush();

	});

	it('should return the lowest temperature when getMinTemp() called', function (){

		var minTemp = 23.554;

		dataFixerMock.getMinTemp.andReturn(minTemp);

    models.requestModelData('rcp45', 'tas', 'winter', 'CS')
      .then(function(){
        expect(models.getMinTemp()).toEqual(minTemp);
      });

    $rootScope.$digest();
    $httpBackend.flush();

    expect(dataFixerMock.processModelData).toHaveBeenCalled();
    expect(dataFixerMock.getMinTemp).toHaveBeenCalled();

	});

	it('should return the highest temperature when getMaxTemp() called', function (){
		var maxTemp = 23.554;

		dataFixerMock.getMaxTemp.andReturn(maxTemp);

    models.requestModelData('rcp45', 'tas', 'winter', 'CS')
      .then(function(){
        expect(models.getMaxTemp()).toEqual(maxTemp);
      });

    $rootScope.$digest();
    $httpBackend.flush();
	});

	it('should call the dataFixer to process the data we have received', function (){
    models.requestModelData('rcp45', 'tas', 'winter', 'CS')
      .then(function(){
        expect(dataFixerMock.processModelData).toHaveBeenCalled();
      });

    $rootScope.$digest();
    $httpBackend.flush();
	});

	it('should tell the dataFixer to clear it\'s extents when it receives the model data', function (){

    models.requestModelData('rcp45', 'tas', 'winter', 'CS')
      .then(function(){
        expect(dataFixerMock.clearExtents).toHaveBeenCalled();
      });

    $rootScope.$digest();
    $httpBackend.flush();
	});

});