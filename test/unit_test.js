var onReady = function onReady(condition, callback) {
	var intervalID = setInterval(function () {
		if (condition()) {
			clearInterval(intervalID);
			callback();
		}
	}, 500);
};
onReady(function () {
	return legacyInjected;
}, function () {
	describe("SUTE", function () {
		it("EXPT", function () {
			expect(true)
				.toBe(true);
		});
		describe('OOP', function () {
			it('IN', function () {
				expect(0)
					.toBe(1);
			});
		});
	});
	window.runJasmine();
});
