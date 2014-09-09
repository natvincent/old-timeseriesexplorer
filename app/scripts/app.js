'use strict';

console.log('Yo! Startup!');

var app = angular.module('pageApp', ['d3Chart', 'chartDirective']);
 
var format = d3.time.format.iso;

function parseDate(d) {
  return new format.parse(d);
}

app.controller('ChartController', function ($scope, resources, models) {
  console.log('ChartController start');

  $scope.historical = null;
  $scope.future = null;
  $scope.historicalMean = null;
  $scope.futureMean = null;
  $scope.changeCounter = 0;
  $scope.yAxis = null;
  $scope.regions = null;

  // these defaults as discussed with Penny Whetton on 2014-08-21
  $scope.currentModel = 'ACCESS1-0';
  $scope.currentRegion = 'MB';
  $scope.currentScenario = 'rcp45';
  $scope.currentVariable = 'tas';
  $scope.currentSeason = 'annual';

  $scope.variables = resources.getVariables();
  $scope.seasons = resources.getSeasons();
  $scope.scenarios = resources.getScenarios();

  resources.requestRegions().then(function (result){
    $scope.regions = result;
  });

  // $http
  //   .get('sample_data/historical_annual_tas_AUS.json')
  //   .then(function(result){
  //     console.log('have historical response');
  //     $scope.all.historical = result.data;

  //     for (var key in $scope.all.historical) {
  //       $scope.all.historical[key].table.rows.forEach(fixData);
  //     }

  //     $scope.historical = $scope.all.historical[$scope.currentModel].table.rows;

  //     $scope.changeCounter++;
  //     console.log('historical data processed. min: ' + $scope.min + ' max: ' + $scope.max);

  //     $scope.models = Object.keys($scope.all.historical);

  //     $http
  //       .get('sample_data/rcp45_annual_tas_AUS.json')
  //       .then(function(result){
  //         console.log('have future response');
  //         $scope.all.future = result.data;

  //         for (var key in $scope.all.future) {
  //           $scope.all.future[key].table.rows.forEach(fixData);
  //         }

  //         $scope.future = $scope.all.future[$scope.currentModel].table.rows;

  //         $scope.changeCounter++;
  //         console.log('future data processed. min: ' + $scope.min + ' max: ' + $scope.max);
  //       });
  //   });
  
  $scope.$watch('currentModel', function (newValue, oldValue) {
    console.log('currentModel changed from: ' + oldValue + ' to: ' + newValue);

    $scope.historical = models.getHistorical(newValue);
    $scope.changeCounter++;
  
    $scope.future = models.getFuture(newValue);

  });

  var watchCurrentCallback = function () {
    models.requestModelData($scope.currentScenario,
                            $scope.currentVariable,
                            $scope.currentSeason,
                            $scope.currentRegion
                            )
    .then(function (result){
      console.log('watchCurrentCallback then called');
      
      $scope.models = models.getModelNames();

      $scope.historical = models.getHistorical($scope.currentModel);
      $scope.future = models.getFuture($scope.currentModel);

      $scope.historical90th = models.getHistoricalEnsemble('pctl90');
      $scope.future90th = models.getFutureEnsemble('pctl90');
      
      $scope.historical10th = models.getHistoricalEnsemble('pctl10');
      $scope.future10th = models.getFutureEnsemble('pctl10');

      $scope.historicalMean = models.getHistoricalEnsemble('mean');
      $scope.futureMean = models.getFutureEnsemble('mean');

      $scope.yAxis = {
        'max': models.getMaxTemp(),
        'min': models.getMinTemp()
      };
    });

  };

  $scope.$watch('currentSeason', watchCurrentCallback);
  $scope.$watch('currentRegion', watchCurrentCallback);
  $scope.$watch('currentVariable', watchCurrentCallback);
  $scope.$watch('currentScenario', watchCurrentCallback);

});

console.log('Startup complete');
