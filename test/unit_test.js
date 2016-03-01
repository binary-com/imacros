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
	describe("In the dummy new page", function () {
		var contents;
		beforeEach(function () {
			contents = $('#dummyNewPage')
				.contents();
		});
		it("selected market is Random", function () {
			expect(contents.find('#contract_markets')
					.val())
				.toBe('random');
		});
		xit("selected underlying is R_100", function () {
			expect(contents.find('#underlying')
					.val())
				.toBe('R_100');
		});
		xit("selected underlying is R_00", function () {
			expect(contents.find('#underlying')
					.val())
				.toBe('R_00');
		});
	});
	xdescribe('fake', function(){
		it('test1', function(){
			expect(1).toBe(1)
		});
		it('test2', function(){
			expect(2).toBe(1)
		});
	});
	window.runJasmine();
});
