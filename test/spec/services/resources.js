'use strict';

describe('Service: resources', function () {

  var service, $httpBackend, regionRequestHandler;

  beforeEach(function(){
    module('pageApp');
  });

  beforeEach(inject(function($injector){

    inject(function (_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    });

    regionRequestHandler = $httpBackend.when('GET', '/en/climate-futures/get-regions-json/')
                                       .respond(testRegions);

    service = $injector.get('resources');

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should return all the variables', function () {
    var result = service.getVariables();
    expect(result).toEqual(testVariables);
  });

  it('should return the list of valid seasons', function () {
    var result = service.getSeasons();
    expect(result).toEqual(['annual', 'djf', 'mam', 'jja', 'son', 
                            'january', 'february', 'march', 'april', 
                            'may', 'june', 'july', 'august', 'september',
                            'october', 'november', 'december']);
  });

  it('should return the list of scenarios', function () {
    var result = service.getScenarios();
    expect(result).toEqual(['rcp26', 'rcp45', 'rcp60', 'rcp85']);
  });

  // it('should call to a json service to get the regions and return a promise', function (){
  //   $httpBackend.expectGET('/en/climate-futures/get-regions-json');

  //   service
  //     .requestRegions()
  //     .then(function(result) {
  //       expect(result).toEqual(testRegions);
  //     });

  // })

  it('should get the regions and return a promise, since we\'re testing, just load from local resource', function () {
    $httpBackend
      .expectGET('sample_data/nrm_regions.json')
      .respond(testRegions);

    service
      .requestRegions()
      .success(function(result) {
        expect(result).toEqual(testRegions);
      });

    $httpBackend.flush();
  });
});
