// ==UserScript==
// @run-at      document-start
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @name        legacy
// @namespace   binary.com
// @description Make the new binary trading page compatible with the legacy iMacros scripts
// @include     https://www.binary.com/trading*
// @exclude     https://www.binary.com/trading?legacy*
// @version     1
// @resource    bet_container	http://binary-com.github.io/imacros/bet_container.html
// @resource    jasmine http://binary-com.github.io/imacros/test/jasmine.js
// @resource    jasmine_boot http://binary-com.github.io/imacros/test/boot.js
// @resource    unit_test http://binary-com.github.io/imacros/test/unit_test.js
// @grant       GM_getResourceText 
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

function QueryData(queryString) {
	if (queryString.charAt(0) == '?') queryString = queryString.substring(1);
	if (queryString.length > 0) {
		queryString = queryString.replace(/\+/g, ' ');
		var queryComponents = queryString.split(/[&;]/g);
		for (var index = 0; index < queryComponents.length; index++) {
			var keyValuePair = queryComponents[index].split('=');
			var key = decodeURIComponent(keyValuePair[0]);
			var value = keyValuePair.length > 1 ? decodeURIComponent(keyValuePair[1]) : '';
			if (key !== '') {
				if (!(key in this)) this[key] = [];
				this[key].push(value);
			}
		}
	}
}

var broadcast = function broadcast(eventName) {
	window.dispatchEvent(new CustomEvent(eventName, {}));
};

var addParameter = function addParameter(searchString, parameterName) {
	var parameters = new QueryData(searchString);
	var keys = Object.keys(parameters);
	if (keys.length === 0) {
		return '?' + parameterName;
	} else {
		return '?' + parameterName + '&' + searchString.substr(1);
	}
};
(function () {
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
		body.id = 'betpage';
		html.appendChild(head);
		html.appendChild(body);
		document.appendChild(html);
		$('head')
			.append('<title>Binary.com - Binary.com - Sharp Prices. Smart Trading.</title>');
	};

	var addDummyNewPage = function addDummyNewPage() {
		var queryString = addParameter(document.location.search, 'legacy');
		var dummyUrl = document.location.href.split('?')[0] + queryString + document.location.hash;
		$('body')
			.append('<iframe style="border: 0px; position: fixed; left: 0px; top: 0px; height: 100%; width: 100%;" id="dummyNewPage" src="' + dummyUrl + '"></iframe>');
		$('#dummyNewPage')
			.load(function (e) {
				var dummyLocation = e.target.contentDocument.location;
				var searchChanged = dummyLocation.search !== queryString;
				var urlChanged = dummyLocation.href.split('?')[0] !== document.location.href.split('?')[0];
				if (urlChanged) {
					document.location = dummyLocation.href;
				} else if (searchChanged) {
					var search = dummyLocation.search.replace('legacy', '')
						.replace('?&', '?');
					if (search.slice(-1) === '?') {
						search.splice(-1);
					}
					document.title = e.target.contentDocument.title;
					window.history.pushState({}, '', dummyLocation.href.split('?')[0] + search);
					document.location.hash = dummyLocation.hash;
				}
			});
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
			.append(GM_getResourceText('bet_container'));
		hideElement($('#page-wrapper'));
	};

	var triggerChange = function triggerChange(element) {
		contractReady = false;
		element.dispatchEvent(new Event('change'));
		element.dispatchEvent(new Event('input'));
	};

	var addEventRedirection = function addEventRedirection(eventName, legacySelector, newElement) {
		$(legacySelector)
			.on(eventName, function (event) {
				event.preventDefault();
				newElement.val(event.target.value);
				triggerChange(newElement[0]);
			});
		newElement[0].addEventListener('input', function(event){
			event.preventDefault();
			newElement.val($(legacySelector).val());
		});
		newElement[0].addEventListener('change', function(event){
			event.preventDefault();
			newElement.val($(legacySelector).val());
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
		}
	};

	var cloneElement = function cloneElement(selector){
		var newElement = $('#dummyNewPage').contents().find(selector);
		addObserver(newElement[0], {childList: true, characterData:true, subtree:true}, function callback(mutations){
			var dummyElement = $(selector);
			var prevElement = dummyElement.prev();
			var parentElement = dummyElement.parent();
			if ( prevElement.length === 0 ) {
				dummyElement.remove();
				parentElement.prepend(newElement.clone(true, true));
			} else {
				dummyElement.remove();
				newElement.clone(true, true).insertAfter(prevElement);
			}
		});	
	};


	var ConfirmationCtrl = function ConfirmationCtrl() {
		var confirmationDialog;
		return {
			hide: function hide(){
				confirmationDialog = $('#buy_confirm_container').clone(true, true);
				$('#buy_confirm_container').remove();
			},
			show: function show(){
				if ( confirmationDialog ) {
					$('#bet_calculation_container').append(confirmationDialog);
				}
			},
		};
	};
	var confirmationCtrl = ConfirmationCtrl();

	var elementShapes = [
		function topbar(){
			cloneElement('#topbar');
		},
		function header(){
			cloneElement('#header');
		},
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
		function atleast() {
			$(selectors.atleast).children().remove();
			$('#dummyNewPage').contents().find('#date_start').children().each(function(){
				$(selectors.atleast).append($(this).clone(true, true));
			});
			syncElement('change', selectors.atleast, '#date_start');
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
		function duration_units() {
			syncElement('change', selectors.duration_units, '#duration_units');
		},
		function expiry_type() {
			syncElement('change', selectors.expiry_type, '#expiry_type');
		},
		function bet_currency() {
			syncElement('change', selectors.bet_currency, '#currency');
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
				broadcast('spotChanged');
			});
		},
		function x() {
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
			.click(function (event) {
				event.preventDefault();
				newElement[0].click();
			});
		},
		function resync() {
			var loading_container3 = $('#dummyNewPage')
				.contents()
				.find('#loading_container3');
			addObserver(loading_container3[0], observeStyleConfig, function callback() {
				syncElement(null, selectors.bet_underlying, '#underlying');
				syncElement(null, selectors.amount, '#amount');
				syncElement(null, selectors.duration_amount, '#duration_amount');
				syncElement(null, selectors.amount_type, '#amount_type');
				syncElement(null, selectors.duration_units, '#duration_units');
				syncElement(null, selectors.expiry_type, '#expiry_type');
				syncElement(null, selectors.bet_currency, '#currency');
				syncElement(null, selectors.atleast, '#date_start');
			});
			var loading_container2 = $('#dummyNewPage')
				.contents()
				.find('#loading_container2');
			addObserver(loading_container2[0], observeStyleConfig, function callback() {
				if ( loading_container2.css('display') === 'none' ) {
					broadcast('contractReady');
				} else {
					broadcast('contractProgress');
				}
			});
		},
		function confirmationDelete() {
			confirmationCtrl.hide();
		},
		function elementsAdded() {
			broadcast('elementsAdded');
		},
		function confirmation() {
			var newElement = $('#dummyNewPage')
				.contents()
				.find('#contract_confirmation_container');
			addObserver(newElement[0], observeStyleConfig, function callback(mutations) {
				if (mutations && mutations[0].oldValue !== $(mutations[0].target)
					.attr('style')) {
					if ($(mutations[0].target).css('display') === 'none') {
						confirmationCtrl.hide();
						broadcast('confirmationClosed');
					} else {
						confirmationCtrl.show();
						$('#bet-confirm-header').text($('#dummyNewPage').contents().find('#contract_purchase_heading').text());
						$('#contract-outcome-buyprice')
							.text('0.00');
						$('#contract-outcome-profit')
							.text('0.00');
						$('#contract-outcome-payout')
							.text('0.00');
					}
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
						$('#contract-outcome-buyprice')
							.text($('#dummyNewPage')
								.contents()
								.find('#contract_purchase_payout>p')
								.text());
						$('#contract-outcome-profit')
							.text($('#dummyNewPage')
								.contents()
								.find('#contract_purchase_profit>p')
								.text());
						$('#contract-outcome-label')
							.text($('#dummyNewPage')
								.contents()
								.find('#contract_purchase_profit')
								.contents()[0].textContent);
						$('#contract-outcome-payout')
							.text($('#dummyNewPage')
								.contents()
								.find('#contract_purchase_cost>p')
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
						$('#bet-confirm-header').text($('#dummyNewPage').contents().find('#contract_purchase_heading').text());
						broadcast('purchaseFinished');
					});
				}
			});
		},
	];

	var updateElements = function updateElements() {
		elementShapes.forEach(function (element) {
			element();
		});
	};

	var contractReady = false;
	window.addEventListener('contractReady', function(event) {
		contractReady = true;
	});
	window.addEventListener('contractProgress', function(event) {
		contractReady = false;
	});

	var addClickRedirection = function addClickRedirection(legacySelector, newElement) {
		$(legacySelector)
			.click(function (event) {
				event.preventDefault();
				if ( contractReady ) {
					newElement.click();
				} else {
					var click = function click(){
						newElement.click();
						window.removeEventListener('contractReady', click);
					};
					window.addEventListener('contractReady', click);
				}
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
		attributeOldValue: true,
		attributeFilter: ['style'],
	};

	var injectLegacyElements = function injectLegacyElements() {
		addLegacyElements();
		updateElements();
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
			triggerChange(duration_units[0]);
			var expiry_type = $('#dummyNewPage')
				.contents()
				.find('#expiry_type');
			expiry_type.val('duration');
			triggerChange(duration_units[0]);
			var contract_markets = $('#dummyNewPage')
				.contents()
				.find('#contract_markets');
			contract_markets.val('random');
			triggerChange(contract_markets[0]);
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
	var Spec = function Spec() {
		eval(GM_getResourceText('jasmine'));
		eval(GM_getResourceText('jasmine_boot'));
		eval(GM_getResourceText('unit_test'));
	};
	var run_unit_test = function run_unit_test() {
		Spec.call(window);
	};
	onReady(function () {
		return unsafeWindow.runUnitTest;
	}, function () {
		run_unit_test();
	});
})();
