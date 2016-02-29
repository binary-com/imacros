/**
 Starting with version 2.0, this file "boots" Jasmine, performing all of the necessary initialization before executing the loaded environment and all of a project's specs. This file should be loaded after `jasmine.js` and `jasmine_html.js`, but before any project source files or spec files are loaded. Thus this file can also be used to customize Jasmine for a project.

 If a project is using Jasmine via the standalone distribution, this file can be customized directly. If a project is using Jasmine via the [Ruby gem][jasmine-gem], this file can be copied into the support directory via `jasmine copy_boot_js`. Other environments (e.g., Python) will have different mechanisms.

 The location of `boot.js` can be specified and/or overridden in `jasmine.yml`.

 [jasmine-gem]: http://github.com/pivotal/jasmine-gem
 */

(function (global) {
	global.jasmineBoot = function jasmineBoot(global, jasmineRequire) {

		/**
		 * ## Require &amp; Instantiate
		 *
		 * Require Jasmine's core files. Specifically, this requires and attaches all of Jasmine's code to the `jasmine` reference.
		 */
		var jasmine = global.jasmine = jasmineRequire.core(jasmineRequire);

		/**
		 * Create the Jasmine environment. This is used to run all specs in a project.
		 */
		var env = jasmine.getEnv();

		/**
		 * ## The Global Interface
		 *
		 * Build up the functions that will be exposed as the Jasmine public interface. A project can customize, rename or alias any of these functions as desired, provided the implementation remains unchanged.
		 */
		var jasmineInterface = jasmineRequire.interface(jasmine, env);

		/**
		 * Add all of the Jasmine global/public interface to the global scope, so a project can use the public interface directly. For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
		 */
		extend(global, jasmineInterface);



		var reporter = {




			jasmineStarted: function (suiteInfo) {


				console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
			},
			suiteStarted: function (result) {
				console.log('Suite started: ' + result.description + ' whose full description is: ' + result.fullName);
			},
			specStarted: function (result) {
				console.log('Spec started: ' + result.description + ' whose full description is: ' + result.fullName);
			},


			specDone: function (result) {

				console.log('Spec: ' + result.description + ' was ' + result.status);
				for (var i = 0; i < result.failedExpectations.length; i++) {
					console.log('Failure: ' + result.failedExpectations[i].message);
					console.log(result.failedExpectations[i].stack);
				}
				console.log(result.passedExpectations.length);
			},
			suiteDone: function (result) {


				console.log('Suite: ' + result.description + ' was ' + result.status);
				for (var i = 0; i < result.failedExpectations.length; i++) {

					console.log('AfterAll ' + result.failedExpectations[i].message);
					console.log(result.failedExpectations[i].stack);
				}
			},
			jasmineDone: function () {
				console.log('Finished suite');
			}
		};


		env.addReporter(reporter);

		env.execute();

		function extend(destination, source) {
			for (var property in source) destination[property] = source[property];
			return destination;
		}

	};
})(this);
