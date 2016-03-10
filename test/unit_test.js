var selectors = { 
	orderform_10: "form.orderform#orderform_10",
	orderform_20: "form.orderform#orderform_20",
	form0: "form[name=form0]",
	profit_table: "a:contains('Profit Table')",
	bet_calculate: "#bet_calculate",
	get_prices: "[name=form0] button:contains('Get Prices')",
	btn_buybet_10: "button[name=btn_buybet_10]",
	btn_buybet_20: "button[name=btn_buybet_20]",
	content: "div#content",
	higher: "h4:contains('higher')",
	amount: "[name=form0] input:text#amount",
	duration_amount: "[name=form0] input:text#duration_amount",
	duration_units: "[name=form0] select#duration_units",
	amount_type: "[name=form0] select[name=amount_type]#amount_type.unbind_later",
	bet_underlying: "[name=form0] select[name=underlying_symbol]#bet_underlying.unbind_later",
	spot: "span#spot",
	expiry_type: "#expiry_type",
	bet_currency: "#bet_currency",
	atleast: "#atleast",
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
		var faulty = false;
		beforeAll(function () {
			contents = $('#dummyNewPage')
				.contents();
			Object.keys(selectors)
				.forEach(function (key) {
					if ($(selectors[key])
						.length < 1) {
							faulty = true;
							console.log('%cAbsent Element ' + key, 'color: red');
						}
				});
		});
		it('all elements are present', function () {
			expect(faulty).toBe(false);
		});
		it('underlying matches bet_underlying', function () {
			expect(contents.find('#underlying')
					.val())
				.toBe($('#bet_underlying')
					.val());
		});
		it('amount matches amount', function () {
			expect(contents.find('#amount')
					.val())
				.toBe($('#amount')
					.val());
		});
		it('duration_amount matches duration_amount', function () {
			expect(contents.find('#duration_amount')
					.val())
				.toBe($('#duration_amount')
					.val());
		});
		it('amount_type matches amount_type', function () {
			expect(contents.find('#amount_type')
					.val())
				.toBe($('#amount_type')
					.val());
		});
		it('duration_units matches duration_units', function () {
			expect(contents.find('#duration_units')
					.val())
				.toBe($('#duration_units')
					.val());
		});
		it('expiry_type matches expiry_type', function () {
			expect(contents.find('#expiry_type')
					.val())
				.toBe($('#expiry_type')
					.val());
		});
		it('currency matches bet_currency', function () {
			expect(contents.find('#currency')
					.val())
				.toBe($('#bet_currency')
					.val());
		});
		it('date_start matches atleast', function () {
			expect(contents.find('#date_start')
					.val())
				.toBe($('#atleast')
					.val());
		});
		describe('async tests', function () {
			beforeAll(function () {
				jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
			});
			afterAll(function () {
				jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
			});
			describe('spot matches spot', function () {
				beforeAll(function (done) {
					window.addEventListener('spotChanged', function () {
						done();
					});
				});
				it('text matches text', function () {
					expect(contents.find('#spot')
							.text())
						.toBe($('#spot')
							.text());
				});
				it('class matches class', function () {
					expect(contents.find('#spot')
							.attr('class'))
						.toBe($('#spot')
							.attr('class'));
				});
			});
			describe('contract was purchased', function () {
				beforeAll(function (done) {
					window.addEventListener('purchaseFinished', function () {
						done();
					});
					setTimeout(function () {
						$('button[name=btn_buybet_10]')
							.click();
					}, 3000);
				});
				afterAll(function (done) {
					$('a')
						.filter(function (index) {
							return $(this)
								.text() === "x";
						})
						.click();
					window.addEventListener('confirmationClosed', function () {
						done();
					});
				});
				it('balances match', function () {
					expect(contents.find('#balance').text()).toBe($('#balance').text());
				});
				it('purchase result strings are the same', function () {
					expect($('#contract-outcome-label')
							.text())
						.toBe(contents.find('#contract_purchase_profit')
							.contents()[0].textContent);
				});
				it('purchase profits are the same', function () {
					expect($('#contract-outcome-profit')
							.text())
						.toBe(contents.find('#contract_purchase_profit>p')
							.text());
				});
				it('purchase payouts are the same', function () {
					expect($('#contract-outcome-payout')
							.text())
						.toBe(contents.find('#contract_purchase_cost>p')
							.text());
				});
				it('purchase prices are the same', function () {
					expect($('#contract-outcome-buyprice')
							.text())
						.toBe(contents.find('#contract_purchase_payout>p')
							.text());
				});
				it('result color is appropriate', function () {
					if (contents.find('#contract_purchase_heading')
						.text()
						.indexOf('lost') >= 0) {
						expect($('#contract-outcome-label')
								.attr('class'))
							.toContain('loss');
						expect($('#contract-outcome-profit')
								.attr('class'))
							.toContain('loss');
					} else {
						expect($('#contract-outcome-label')
								.attr('class'))
							.toContain('profit');
						expect($('#contract-outcome-profit')
								.attr('class'))
							.toContain('profit');
					}
				});
			});
		});
	});
	window.runJasmine();
});
