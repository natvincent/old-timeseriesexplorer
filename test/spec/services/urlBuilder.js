'use strict';

describe('service: urlBuilder', function () {
  var urlBuilder;

  beforeEach(function(){
    module('pageApp');
  });
  
  beforeEach(inject(function($injector){
    urlBuilder = $injector.get('urlBuilder');
  }));

  it('should return a URL based on the dataset, region, variable, season, scenario', function() {
    var url = urlBuilder.createModelDataUrl('historical', 'tas', 'annual', 'RS');
    expect(url).toEqual('/en/climate-futures/get-dataset?' + 
                        'scenario=historical&' +
                        'variable=tas&' +
                        'season=annual&' +
                        'region=RS');

    url = urlBuilder.createModelDataUrl('rcp45', 'psl', 'february', 'CS');
    expect(url).toEqual('/en/climate-futures/get-dataset?' + 
                        'scenario=rcp45&' +
                        'variable=psl&' +
                        'season=february&' +
                        'region=CS');

  });
});