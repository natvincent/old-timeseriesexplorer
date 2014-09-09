'use strict';

angular.module('pageApp')
.service('models', function($q, $http, urlBuilder, dataFixer) {

  var historical = {};
  var future = {};
  var historicalEnsemble = {};
  var futureEnsemble = {};

  this.getHistorical = function(modelName) {
  	return historical[modelName].table.rows;
  };

  this.getFuture = function(modelName) {
  	return future[modelName].table.rows;
  };

  this.getHistoricalEnsemble = function(series) {
  	return historicalEnsemble[series].table.rows;
  };

  this.getFutureEnsemble = function(series) {
  	return futureEnsemble[series].table.rows;
  };

  this.getModelNames = function() {
  	return Object.keys(historical);
  };

  this.getMinTemp = function() {
  	return dataFixer.getMinTemp();
  }

  this.getMaxTemp = function() {
  	return dataFixer.getMaxTemp();
  }

  this.requestModelData = function (scenario, variable, season, region) {

    var models = this;

    var promises = [];

    var historicalUrl = urlBuilder.createModelDataUrl('historical', variable, season, region);
    var futureUrl = urlBuilder.createModelDataUrl(scenario, variable, season, region);
    var historicalEnsembleUrl = urlBuilder.createModelDataUrl('historical_ensemble', variable, season, region);
    var futureEnsembleUrl = urlBuilder.createModelDataUrl(scenario + '_ensemble', variable, season, region);


    promises.push($http.get(historicalUrl).then(function(result) {
      historical = result.data;
      console.log('historical promise done');
    }));

    promises.push($http.get(futureUrl).then(function(result){
      future = result.data;
      console.log('future promise done');
    }));

    promises.push($http.get(historicalEnsembleUrl).then(function(result){
      historicalEnsemble = result.data;
      console.log('historicalEnsemble promise done');
    }));

    promises.push($http.get(futureEnsembleUrl).then(function(result){
      futureEnsemble = result.data;
      console.log('futureEnsemble promise done');
    }));

    return $q.all(promises).then(function(){
    	dataFixer.clearExtents();
      dataFixer.processModelData(future);
      dataFixer.processModelData(historical);
      dataFixer.processModelData(futureEnsemble);
      dataFixer.processModelData(historicalEnsemble); 
    });
  };

  // var ZERO_TEMP = 0;

  // function resetSingleDataPointArrayToZero(data, startYear, endYear) {
  //   data.length = 0;
  //   for (var i = startYear; i <= endYear; i++) {
  //     data.push([new Date(i, 1, 1, 0, 0, 0, 0), ZERO_TEMP]);        
  //   }  
  // }

  // function resetDualDataPointArrayToZero(data, startYear, endYear) {
  //   data.length = 0;
  //   for (var i = startYear; i <= endYear; i++) {
  //     data.push([new Date(i, 1, 1, 0, 0, 0, 0), ZERO_TEMP, ZERO_TEMP]);        
  //   }  
  // }
  // this.resetToZero = function () {
  //   this.historical = {};
  //   this.future = {};
  //   this.historicalPlume = {};
  //   this.futurePlume = {};

  //   var nullHistorical = 

  //   resetSingleDataPointArrayToZero(historical, 1900, 2005);
  //   resetSingleDataPointArrayToZero(future, 2006, 2099);

  //   resetDualDataPointArrayToZero(historicalEnsemble, 1900, 2005);
  //   resetDualDataPointArrayToZero(futureEnsemble, 2006, 2099);
  // };

});
