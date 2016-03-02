var onReady = function onReady(condition, callback) {
	var intervalID = setInterval(function () {
		if (condition()) {
			clearInterval(intervalID);
			callback();
		}
	}, 500);
};
var addObserver = function addObserver(el, config, callback, once) {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	var observer = new MutationObserver(function (mutations) {
		callback(mutations);
		if ( once ) {
			observer.disconnect();
		}
	});
	observer.observe(el, config);
};

window.addEventListener('elementsAdded', function (e) {
	describe('Dummy new page iframe', function () {
		var contents;
		beforeAll(function () {
			contents = $('#dummyNewPage')
			.contents();
		});
		it('selected market is random', function () {
			expect(contents.find('#contract_markets')
				.val())
				.toBe('random');
		});
		it('duration units is ticks', function () {
			expect(contents.find('#duration_units')
				.val())
				.toBe('t');
		});
	});
	describe('Dummy elements', function () {
		var contents;
		beforeAll(function () {
			contents = $('#dummyNewPage')
			.contents();
		});
		it('underlying matches bet_underlying', function () {
			expect(contents.find('#underlying')
				.val())
				.toBe($('#bet_underlying').val());
		});
		it('amount matches amount', function () {
			expect(contents.find('#amount')
				.val())
				.toBe($('#amount').val());
		});
		it('duration_amount matches duration_amount', function () {
			expect(contents.find('#duration_amount')
				.val())
				.toBe($('#duration_amount').val());
		});
		it('amount_type matches amount_type', function () {
			expect(contents.find('#amount_type')
				.val())
				.toBe($('#amount_type').val());
		});
		describe('async tests', function(){
			beforeAll(function(){
				jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
			});
			afterAll(function(){
				jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
			});
			describe('spot matches spot', function () {
				beforeAll(function(done){
					window.addEventListener('spotChanged', function(){
						done();
					});
				});
				it('text matches text', function () {
					expect(contents.find('#spot')
						.text())
						.toBe($('#spot').text());
				});
				it('class matches class', function () {
					expect(contents.find('#spot')
						.attr('class'))
						.toBe($('#spot').attr('class'));
				});
			});
			describe('contract was purchased', function(){
				beforeAll(function(done){
					window.addEventListener('confirmationChanged', function(){
						done();
					});
					$('button[name=btn_buybet_10]').click();
				});
				it('purchase result strings are the same', function () {
					expect($('#contract-outcome-label').text()).toBe(contents.find('#contract_purchase_profit').contents()[0].textContent);
				});
				it('purchase profits are the same', function () {
					expect($('#contract-outcome-profit').text()).toBe(contents.find('#contract_purchase_profit>p').text());
				});
				it('purchase payouts are the same', function () {
					expect($('#contract-outcome-payout').text()).toBe(contents.find('#contract_purchase_cost>p').text());
				});
				it('purchase prices are the same', function () {
					expect($('#contract-outcome-buyprice').text()).toBe(contents.find('#contract_purchase_payout>p').text());
				});
				it('result color is appropriate', function () {
					if ( contents.find('#contract_purchase_heading').text().indexOf('lost') >= 0 ) {
						expect($('#contract-outcome-label').attr('class')).toContain('loss');
						expect($('#contract-outcome-profit').attr('class')).toContain('loss');
					} else {
						expect($('#contract-outcome-label').attr('class')).toContain('profit');
						expect($('#contract-outcome-profit').attr('class')).toContain('profit');
					}
				});
			});
		});
	});
	window.runJasmine();
});
