(function (global) {
	var jasmine = global.jasmine = global.jasmineRequire.core(global.jasmineRequire);
	var env = jasmine.getEnv();
	var jasmineInterface = global.jasmineRequire.interface(jasmine, env);
	extend(global, jasmineInterface);
	var reporter = {
		jasmineStarted: function (suiteInfo) {
			console.log('Running Jasmine With', suiteInfo.totalSpecsDefined, 'Suites');
		},
		suiteStarted: function (result) {
			console.log('In Suite:', result.description);
		},
		specStarted: function (result) {
			console.log('Entering:', result.description);
		},
		specDone: function (result) {
			var css = '';
			if ( result.status === 'passed' ) {
				css = 'color: green';
			} else if ( result.status === 'disabled' ) {
				css = 'color: yellow';
			} else {
				css = 'color: red';
			}
			console.log(result.description, 'was', '%c ' + result.status, css);
			for (var i = 0; i < result.failedExpectations.length; i++) {
				console.log('%c Failure: ' + result.failedExpectations[i].message, 'color: red');
			}
		},
		suiteDone: function (result) {
			console.log('Suit:', result.description, 'was', result.status);
			for (var i = 0; i < result.failedExpectations.length; i++) {
				console.log('At Last:', result.failedExpectations[i].message);
			}
		},
		jasmineDone: function () {
			console.log('Jasmine Finished');
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
