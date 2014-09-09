'use strict';

var K_TO_C = 273.15;

function kToC(d) {
  return d - K_TO_C;
}

function parseDate(d) {
  return new format.parse(d);
}

angular.module('pageApp')
.service('dataFixer', function(){
	
	var minimumTemp = null;
	var maximumTemp = null;



	this.processModelData = function (data) {
		var modelDataProcessor = function (d) {
			// yes I mean == here, not ===
			if (d[1] == '1.0E20') {
				d[1] = null;
			}
			else {
				d[1] = kToC(d[1]);
				minimumTemp === null ? minimumTemp = d[1] : minimumTemp = Math.min(minimumTemp, d[1]);
				maximumTemp === null ? maximumTemp = d[1] : maximumTemp = Math.max(maximumTemp, d[1]);
			}
			d[0] = parseDate(d[0]);
		}

    for (var key in data) {
      data[key].table.rows.forEach(modelDataProcessor);
    }
	};

	this.getMinTemp = function () {
		return minimumTemp;
	};

	this.getMaxTemp = function () {
		return maximumTemp;
	};

	this.clearExtents = function () {
		maximumTemp = null;
		minimumTemp = null;
	};

});