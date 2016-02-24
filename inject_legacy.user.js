// ==UserScript==
// @run-at      document-start
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @name        inject_legacy
// @namespace   binary.com
// @include     https://www.binary.com/trading?l=EN
// @version     1
// @resource    bet_container http://yedooneanar.ourproject.org/bet_container.html
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

	};

	var dummyNewPage;

	var hideElement = function hideElement(obj) {
		obj.css('position', 'fixed');
		obj.css('left', '-9999px');
		obj.css('width', '0px');
		obj.css('height', '0px');
	};

	var removeAll = function removeAll() {
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

	var addNew = function addNew() {
		$('body')
			.append('<iframe style="border: 0px; position: fixed; left: 0px; top: 0px; height: 100%; width: 100%;" id="dummyNewPage" src="https://www.binary.com/trading?l=EN&dummyData=1"></iframe>');
		dummyNewPage = $('#dummyNewPage');
	};

	var pageReady = function pageReady(condition, callback) {
		var intervalID = setInterval(function () {
			if (condition()) {
				clearInterval(intervalID);
				callback();
			}
		}, 500);
	};

	var addMockElements = function addMockElements() {
		$('body')
			.append('<div id="mockElements"></div>');
		var mockElements = $('#mockElements');
		mockElements
			.append(GM_getResourceText('bet_container'));
		hideElement(mockElements);
		var bugged = false;
		Object.keys(selectors)
			.forEach(function (key) {
				if ($(selectors[key])
					.length !== 1) {
					bugged = true;
					console.log(key);
				}
			});
		if (!bugged) {
			console.log('All Mock Elements were added successfully');
		}
	};

	var addClickBinding = function addClickBinding(legacySelector, newElement) {
		$(legacySelector)
			.click(function (event) {
				event.preventDefault();
				newElement.click();
			});
	};

	var addBinding = function addBinding(newElement, legacySelector, binding, mutationConfig, callback) {
		if (newElement.length === 1) {
			binding(legacySelector, newElement);
			addObserver(newElement[0], mutationConfig, function (mutations) {
				callback(mutations);
			});
		}
	};

	var addTwoWayBindings = function addTwoWayBindings() {
		var mutationConfig = {
			attributes: true,
			attributeFilter: ['style'],
		};
		var purchase_button_top = $(dummyNewPage[0].contentDocument)
			.find('#purchase_button_top');
		var purchase_button_bottom = $(dummyNewPage[0].contentDocument)
			.find('#purchase_button_bottom');
		addBinding(purchase_button_top, selectors.btn_buybet_10, addClickBinding, mutationConfig, function (mutations) {
			if ( purchase_button_top.css('display') === 'none' ) {
				$('.price_box_first #bet_cal_buy').css('display', 'none');
			} else {
				$('.price_box_first #bet_cal_buy').css('display', 'block');
			}
		});
		addBinding(purchase_button_bottom, selectors.btn_buybet_20, addClickBinding, mutationConfig, function (mutations) {
			if ( purchase_button_bottom.css('display') === 'none' ) {
				$('.price_box_last #bet_cal_buy').css('display', 'none');
			} else {
				$('.price_box_first #bet_cal_buy').css('display', 'block');
			}
		});
	};

	var addObserver = function addObserver(el, config, callback) {
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var observer = new MutationObserver(function (mutations) {
			callback(mutations);
		});
		observer.observe(el, config);
	};

	var injectLegacyElements = function injectLegacyElements() {
		addMockElements();
		addTwoWayBindings();
	};

	pageReady(function () {
		var body = $('body');
		if (body.length > 0) {
			return true;
		} else {
			return false;
		}
	}, function () {
		removeAll();
		addNew();

		pageReady(function () {
			var amount = dummyNewPage.contents()
				.find('#amount');
			if (amount.length > 0) {
				return true;
			} else {
				return false;
			}
		}, function () {
			injectLegacyElements();
		});

	});
})();
