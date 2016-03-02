// ==UserScript==
// @run-at      document-start
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @name        legacy
// @namespace   binary.com
// @description Make the new binary trading page compatible with the legacy iMacros scripts
// @include     https://www.binary.com/trading*
// @exclude     https://www.binary.com/trading*legacy
// @version     1
// @resource    bet_container	http://binary-com.github.io/imacros/bet_container.html
// @resource    jasmine http://binary-com.github.io/imacros/test/jasmine.js
// @resource    jasmine_boot http://binary-com.github.io/imacros/test/boot.js
// @resource    unit_test http://binary-com.github.io/imacros/test/unit_test.js
// @grant       GM_getResourceText 
// ==/UserScript==

(function () {
	var selectors = {
		orderform_10: "form.orderform#orderform_10",
		btn_buybet_10: "button[name=btn_buybet_10]",
		orderform_20: "form.orderform#orderform_20",
		btn_buybet_20: "button[name=btn_buybet_20]",
		form0: "form[name=form0]",
		bet_calculate: "#bet_calculate",
		amount: "#amount",
		duration_amount: "#duration_amount",
		duration_units: "#duration_units",
		amount_type: "#amount_type",
		bet_underlying: "#bet_underlying",
		spot: "#spot",
	};

	var hideElement = function hideElement(obj) {
		obj.css('position', 'fixed');
		obj.css('left', '-9999px');
		obj.css('width', '0px');
		obj.css('height', '0px');
	};

	var removeAllHtml = function removeAllHtml() {
		window.stop();
		$(document)
			.children()
			.remove();
		var html = document.createElement('html');
		var head = document.createElement('head');
		var body = document.createElement('body');
		html.appendChild(head);
		html.appendChild(body);
		document.appendChild(html);
		$('head')
			.append('<title>Binary.com - Binary.com - Sharp Prices. Smart Trading.</title>');
	};

	var addDummyNewPage = function addDummyNewPage() {
		var url = window.location.href;
		var lastChar = url.slice(-1);
		if (url.indexOf('=') >= 0 && lastChar != '&' && lastChar != '?') {
			url += '&';
		} else if (lastChar != '&' && lastChar != '?') {
			url += '?';
		}
		$('body')
			.append('<iframe style="border: 0px; position: fixed; left: 0px; top: 0px; height: 100%; width: 100%;" id="dummyNewPage" src="' + url + 'legacy"></iframe>');
	};

	var onReady = function onReady(condition, callback) {
		var intervalID = setInterval(function () {
			if (condition()) {
				clearInterval(intervalID);
				callback();
			}
		}, 500);
	};

	var addLegacyElements = function addLegacyElements() {
		$('body')
			.append('<div id="mockElements"></div>');
		var mockElements = $('#mockElements');
		mockElements
			.append(GM_getResourceText('bet_container'));
		hideElement(mockElements);
		var faulty = false;
		Object.keys(selectors)
			.forEach(function (key) {
				if ($(selectors[key])
					.length !== 1) {
					faulty = true;
					console.log(key);
				}
			});
		if (!faulty) {
			console.log('All Mock Elements were added successfully');
		}
	};

	var addEventRedirection = function addEventRedirection(eventName, legacySelector, newElement) {
		$(legacySelector)
			.on(eventName, function (event) {
				event.preventDefault();
				newElement.val(event.target.value);
				newElement[0].dispatchEvent(new Event('change'));
			});
		newElement.on(eventName, function (event) {
			newElement.val($(legacySelector)
				.val());
		});
	};

	var syncElement = function syncElement(eventType, legacySelector, newSelector) {
		var newElement = $('#dummyNewPage')
			.contents()
			.find(newSelector);

		if (eventType !== null) {
			$(legacySelector)
				.val(newElement.val());
			addEventRedirection(eventType, legacySelector, newElement);
		} else {
			newElement.val($(legacySelector)
				.val());
			newElement[0].dispatchEvent(new Event('input'));
		}
	};

	var elementShapes = [
		function bet_calculate() {
			$('#bet_calculate')
				.click(function (event) {
					event.preventDefault();
				});
		},
		function purchase_top() {
			var purchase_button_top = $('#dummyNewPage')
				.contents()
				.find('#purchase_button_top');
			addClickRedirection(selectors.btn_buybet_10, purchase_button_top);
			addObserver(purchase_button_top[0], observeStyleConfig, function (mutations) {
				if (purchase_button_top.css('display') === 'none') {
					$('.price_box_first #bet_cal_buy')
						.css('display', 'none');
				} else {
					$('.price_box_first #bet_cal_buy')
						.css('display', 'block');
				}
			});
		},
		function purchase_bottom() {
			var purchase_button_bottom = $('#dummyNewPage')
				.contents()
				.find('#purchase_button_bottom');
			addClickRedirection(selectors.btn_buybet_20, purchase_button_bottom);
			addObserver(purchase_button_bottom[0], observeStyleConfig, function (mutations) {
				if (purchase_button_bottom.css('display') === 'none') {
					$('.price_box_last #bet_cal_buy')
						.css('display', 'none');
				} else {
					$('.price_box_last #bet_cal_buy')
						.css('display', 'block');
				}
			});
		},
		function underlying() {
			syncElement('change', selectors.bet_underlying, '#underlying');
		},
		function amount() {
			syncElement('input change paste', selectors.amount, '#amount');
		},
		function duration_amount() {
			syncElement('input change paste', selectors.duration_amount, '#duration_amount');
		},
		function amount_type() {
			syncElement('change', selectors.amount_type, '#amount_type');
		},
		function spot() {
			var newElement = $('#dummyNewPage')
				.contents()
				.find('#spot');
			addObserver(newElement[0], {
				childList: true
			}, function callback() {
				$(selectors.spot)
					.text(newElement.text());
				$(selectors.spot)
					.attr('class', newElement.attr('class'));
				window.dispatchEvent(new CustomEvent('spotChanged', {}));
			});
		},
		function a() {
			var newElement = $('#dummyNewPage')
				.contents()
				.find('a')
				.filter(function (index) {
					return $(this)
						.text() === "x";
				});
			$('a')
				.filter(function (index) {
					return $(this)
						.text() === "x";
				})
				.click(function () {
					newElement[0].click();
				});
		},
		function resync() {
			var loading = $('#dummyNewPage')
				.contents()
				.find('#loading_container3');
			addObserver(loading[0], observeStyleConfig, function callback() {
				syncElement(null, selectors.bet_underlying, '#underlying');
				syncElement(null, selectors.amount, '#amount');
				syncElement(null, selectors.duration_amount, '#duration_amount');
				syncElement(null, selectors.amount_type, '#amount_type');
			});
		},
		function elementsAdded(){
			window.dispatchEvent(new CustomEvent('elementsAdded', {}));
		},
		function confirmation() {
			var newElement = $('#dummyNewPage')
				.contents()
				.find('#contract_confirmation_container');
			addObserver(newElement[0], {
				childList: true
			}, function callback() {
				onReady(function () {
					var header = $('#dummyNewPage')
						.contents()
						.find('#contract_purchase_heading');
					if (header.text()
						.indexOf('This contract') > -1) {
						return true;
					} else {
						return false;
					}
				}, function () {
					var header = $('#dummyNewPage')
						.contents()
						.find('#contract_purchase_heading');
					$('#contract-outcome-label')
						.text($('#dummyNewPage')
							.contents()
							.find('#contract_purchase_profit')
							.contents()[0].textContent);
					$('#contract-outcome-profit')
						.text($('#dummyNewPage')
							.contents()
							.find('#contract_purchase_profit>p')
							.text());
					$('#contract-outcome-payout')
						.text($('#dummyNewPage')
							.contents()
							.find('#contract_purchase_cost>p')
							.text());
					$('#contract-outcome-buyprice')
						.text($('#dummyNewPage')
							.contents()
							.find('#contract_purchase_payout>p')
							.text());
					if (header.text()
						.indexOf('This contract lost') > -1) {
						$('#contract-outcome-label')
							.attr('class', 'grd-grid-12 grd-no-col-padding standin loss');
						$('#contract-outcome-profit')
							.attr('class', 'grd-grid-12 grd-with-top-padding standin loss');
					} else {
						$('#contract-outcome-label')
							.attr('class', 'grd-grid-12 grd-no-col-padding standout profit');
						$('#contract-outcome-profit')
							.attr('class', 'grd-grid-12 grd-with-top-padding standout profit');
					}
					window.dispatchEvent(new CustomEvent('confirmationChanged', {}));
				});
			});
		},
	];

	var updateElements = function updateElements() {
		elementShapes.forEach(function (element) {
			element();
		});
	};

	var addClickRedirection = function addClickRedirection(legacySelector, newElement) {
		$(legacySelector)
			.click(function (event) {
				event.preventDefault();
				newElement.click();
			});
	};

	var addObserver = function addObserver(el, config, callback) {
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		callback();
		var observer = new MutationObserver(function (mutations) {
			callback(mutations);
		});
		observer.observe(el, config);
	};

	var observeStyleConfig = {
		attributes: true,
		attributeFilter: ['style'],
	};

	var injectLegacyElements = function injectLegacyElements() {
		addLegacyElements();
		updateElements();
		legacyInjected = true;
	};

	onReady(function () {
		var body = $('body');
		if (body.length > 0) {
			return true;
		} else {
			return false;
		}
	}, function () {
		removeAllHtml();
		addDummyNewPage();

		onReady(function () {
			var progress = $('#dummyNewPage')
				.contents()
				.find('#trading_init_progress');
			if (progress.css('display') === 'none') {
				return true;
			} else {
				return false;
			}
		}, function () {
			var duration_units = $('#dummyNewPage')
				.contents()
				.find('#duration_units');
			duration_units.val('t');
			duration_units[0].dispatchEvent(new Event('change'));
			var contract_markets = $('#dummyNewPage')
				.contents()
				.find('#contract_markets');
			contract_markets.val('random');
			contract_markets[0].dispatchEvent(new Event('change'));
			onReady(function () {
				var loading = $('#dummyNewPage')
					.contents()
					.find('#loading_container3');
				if (loading.css('display') === 'none') {
					return true;
				} else {
					return false;
				}
			}, function () {
				injectLegacyElements();
			});
		});

	});
})();
var Spec = function Spec() {
	eval(GM_getResourceText('jasmine'));
	eval(GM_getResourceText('jasmine_boot'));
	eval(GM_getResourceText('unit_test'));
};
var run_unit_test = function run_unit_test() {
	Spec.call(window);
};
var legacyInjected = false;
run_unit_test();
