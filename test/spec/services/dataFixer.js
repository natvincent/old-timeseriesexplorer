'use strict';

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
                                      "294.4722" ],
                                    [ "1900-01-01T01:00:00.000Z",
                                       1E+20] ] 
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

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
}

describe('Service: models', function () {

  var dataFixer;

  beforeEach(function() {
     module('pageApp');
  });

  beforeEach(function(){

    inject(function ($injector) {
      dataFixer = $injector.get('dataFixer');
    });

  });

	it('should convert temperatures to celcius', function (){
		var data = clone(testHistorialData);

    dataFixer.processModelData(data);

    expect(data['ACCESS1-0'].table.rows[1][1]).toEqual(295.4722 - K_TO_C);
    expect(data['ACCESS1-3'].table.rows[0][1]).toEqual(294.4722 - K_TO_C);
	});

	it('should return the lowest temperature when getMinTemp() called', function (){

		var data = clone(testHistorialData);

    dataFixer.processModelData(data);

    expect(dataFixer.getMinTemp()).toEqual(294.4722 - K_TO_C);

	});

	it('should return the highest temperature when getMaxTemp() called', function (){
		var data = clone(testHistorialData);

    dataFixer.processModelData(data);

    expect(dataFixer.getMaxTemp()).toEqual(295.4722 - K_TO_C);

	});

	it('should set temps of 1.0E20 to null', function (){
		var data = clone(testHistorialData);

    dataFixer.processModelData(data);

    expect(data['ACCESS1-0'].table.rows[0][1]).toBeNull();
    expect(data['ACCESS1-3'].table.rows[1][1]).toBeNull();

	});

	it('should accumulate the minimum and maximum temps over multiple calls', function () {
		var data1 = clone(testHistorialData);
		var data2 = clone(testFutureData);

    dataFixer.processModelData(data1);

    expect(dataFixer.getMaxTemp()).toEqual(295.4722 - K_TO_C);
    expect(dataFixer.getMinTemp()).toEqual(294.4722 - K_TO_C);

    dataFixer.processModelData(data2);

    expect(dataFixer.getMaxTemp()).toEqual(297.4722 - K_TO_C);
    expect(dataFixer.getMinTemp()).toEqual(294.4722 - K_TO_C);

	});

	it('should null the minimum and maximum temps when clearExtents called', function () {
		var data1 = clone(testHistorialData);

    dataFixer.processModelData(data1);

    expect(dataFixer.getMaxTemp()).toEqual(295.4722 - K_TO_C);
    expect(dataFixer.getMinTemp()).toEqual(294.4722 - K_TO_C);

    dataFixer.clearExtents();

    expect(dataFixer.getMinTemp()).toBeNull();
    expect(dataFixer.getMaxTemp()).toBeNull();

	});

	it('should force the date to be a date object', function () {
		var data = clone(testHistorialData);

    dataFixer.processModelData(data);

    expect(data['ACCESS1-0'].table.rows[0][0].constructor.name).toEqual('Date');
	});

});