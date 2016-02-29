(function (global) {
	var jasmine = global.jasmine = global.jasmineRequire.core(global.jasmineRequire);
	var env = jasmine.getEnv();
	var jasmineInterface = global.jasmineRequire.interface(jasmine, env);
	extend(global, jasmineInterface);
	var reporter = {
		jasmineStarted: function (suiteInfo) {
			console.log('Running suite with', suiteInfo.totalSpecsDefined, 'specs');
		},
		suiteStarted: function (result) {
			console.log(result.description);
		},
		specStarted: function (result) {
			console.log(result.description);
		},
		specDone: function (result) {
			console.log(result.description, 'was', result.status);
			for (var i = 0; i < result.failedExpectations.length; i++) {
				console.log('Failure:', result.failedExpectations[i].message);
			}
		},
		suiteDone: function (result) {
			console.log('Suit:', result.description, 'was', result.status);
			for (var i = 0; i < result.failedExpectations.length; i++) {
				console.log('At Last:', result.failedExpectations[i].message);
			}
		},
		jasmineDone: function () {
			console.log('Suite Finished');
		}
	};
	env.addReporter(reporter);
	global.runJasmine = function runJasmine() {
		env.execute();
	};

	function extend(destination, source) {
		for (var property in source) destination[property] = source[property];
		return destination;
	}
})(this);
