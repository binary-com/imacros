var onReady = function onReady(condition, callback) {
	var intervalID = setInterval(function () {
		if (condition()) {
			clearInterval(intervalID);
			callback();
		}
	}, 500);
};
onReady(function () {
	console.log(legacyInjected);
	return legacyInjected;
}, function () {
	describe("SUTE", function () {
		it("EXPT", function () {
			expect(true).toBe(true);
		});
	});
	window.runJasmine();
});
