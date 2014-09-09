'use strict';

angular.module('pageApp')
.service('urlBuilder', function() {
  var testUrls = {
  	'rcp26': '/sample_data/rcp45_annual_tas_AUS.json',
  	'rcp45': '/sample_data/rcp45_annual_tas_AUS.json',
  	'rcp60': '/sample_data/rcp45_annual_tas_AUS.json',
  	'rcp85': '/sample_data/rcp45_annual_tas_AUS.json',
  	'historical': '/sample_data/historical_annual_tas_AUS.json',
  	'rcp26_ensemble': '/sample_data/rcp45_annual_tas_AUS_ensemble.json',
  	'rcp45_ensemble': '/sample_data/rcp45_annual_tas_AUS_ensemble.json',
  	'rcp60_ensemble': '/sample_data/rcp45_annual_tas_AUS_ensemble.json',
  	'rcp85_ensemble': '/sample_data/rcp45_annual_tas_AUS_ensemble.json',
  	'historical_ensemble': '/sample_data/historical_annual_tas_AUS_ensemble.json',
  }

  this.createModelDataUrl = function(scenario, variable, season, region) {
    return testUrls[scenario]; 

  }
});
