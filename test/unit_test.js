var onReady = function onReady(condition, callback) {
	var intervalID = setInterval(function () {
		if (condition()) {
			clearInterval(intervalID);
			callback();
		}
	}, 500);
};
onReady(function () {
	var progress = $('#dummyNewPage')
		.contents()
		.find('#trading_init_progress');
	if (progress.length !== 0 && progress.css('display') === 'none') {
		return true;
	} else {
		return false;
	}
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
});
