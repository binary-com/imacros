(function (global) {
	var jasmine = global.jasmine = global.jasmineRequire.core(global.jasmineRequire);
	var env = jasmine.getEnv();
	var jasmineInterface = global.jasmineRequire.interface(jasmine, env);
	extend(global, jasmineInterface);
	var Reporter = function Reporter() {
		var errorNum = 0;
		return {
			jasmineStarted: function (suiteInfo) {
				console.log('Jasmine Started With', suiteInfo.totalSpecsDefined, 'Specs');
			},
			suiteStarted: function (result) {
				console.log('Suite:', result.description);
			},
			specStarted: function (result) {
				//console.log('Entering:', result.description);
			},
			specDone: function (result) {
				var css = '';
				if ( result.status === 'passed' ) {
					css = 'color: green';
				} else if ( result.status === 'failed' ) {
					css = 'color: red';
				} else {
					css = 'color: yellow';
				}
				console.log(result.description + ' was ' + '%c' + result.status.toUpperCase(), css);
				for (var i = 0; i < result.failedExpectations.length; i++) {
					errorNum++;
					console.log('%cError: ' + result.failedExpectations[i].message, 'color: red');
				}
			},
			suiteDone: function (result) {
				var css = '';
				if ( errorNum > 0 ){
					css = 'color: red';
				} else {
					css = 'color: green';
				}
				console.log('%cSuite: ' + result.description + ' was ' + result.status + ' with ' + errorNum + ' error(s)', css);
			},
			jasmineDone: function () {
				console.log('Jasmine Finished');
			}
		};
	};
	env.addReporter(Reporter());
	global.runJasmine = function runJasmine() {
		env.execute();
	};

	function extend(destination, source) {
		for (var property in source) destination[property] = source[property];
		return destination;
	}
})(this);
