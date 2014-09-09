'use strict';

angular.module('pageApp')
.service('resources', function($http, $q) {
  this.getVariables = function() {
    return [{value: 'tasmax', label: 'Maximum Temperature'},
            {value: 'tasmin', label: 'Minimum Temperature'},
            {value: 'psl', label: 'Sea Level Pressure'},
            {value: 'tas', label: 'Temperature at Surface'}];
  };
  this.getSeasons = function() {
    return ['annual', 'djf', 'mam', 'jja', 'son', 
            'january', 'february', 'march', 'april', 
            'may', 'june', 'july', 'august', 'september',
            'october', 'november', 'december'];
  };
  this.getScenarios = function() {
    return ['rcp26', 'rcp45', 'rcp60', 'rcp85'];
  };
  this.requestRegions = function () {
    //return $http.get('/en/climate-futures/get-regions-json');
    // return [{name: 'Central Slopes', code: 'CS', group: 'NRM15'},
    //         {name: 'Southern Slopes (Vic West}', code: 'SSVW', group: 'NRM15'}];
    return $http.get('sample_data/nrm_regions.json');
  };
  this.requestModelData = function (scenario, variable, season, region) {
    return '';
  };
});
