'use strict';

angular.module('pageApp')
.service('urlBuilder', function() {
  this.createModelDataUrl = function(scenario, variable, season, region) {
    return '/en/climate-futures/get-dataset' +
           '?scenario=' + scenario +
           '&variable=' + variable +
           '&season=' + season +
           '&region=' + region; 

  }
});
