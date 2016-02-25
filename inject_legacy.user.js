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
		spot: "#spot",
	};

	var dummyNewPage;

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
		$('body')
			.append('<iframe style="border: 0px; position: fixed; left: 0px; top: 0px; height: 100%; width: 100%;" id="dummyNewPage" src="https://www.binary.com/trading?l=EN&dummyData=1"></iframe>');
		dummyNewPage = $('#dummyNewPage');
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

	var addEventRedirection = function addEventRedirection(eventName, legacySelector, newElement){
		$(legacySelector)
			.on(eventName, function (event) {
				event.preventDefault();
				newElement.val(event.target.value);
				newElement[0].dispatchEvent(new Event('change'));
			});
		newElement
			.on(eventName, function (event) {
				$(legacySelector).val(event.target.value);
			});
	};

	var syncElement = function syncElement(eventType, legacySelector, newSelector){
		var newElement = $(dummyNewPage[0].contentDocument)
			.find(newSelector);
		$(legacySelector).val(newElement.val());
		addEventRedirection(eventType, legacySelector, newElement);
	};

	var elementShapes = {
		underlying: function underlying() {
			syncElement('change', selectors.bet_underlying, '#underlying');
		},
		amount: function amount() {
			syncElement('input', selectors.amount, '#amount');
		},
		duration_amount: function duration_amount() {
			syncElement('input', selectors.duration_amount, '#duration_amount');
		},
		amount_type: function amount_type() {
			syncElement('change', selectors.amount_type, '#amount_type');
		},
		spot: function spot() {
			var newElement = $(dummyNewPage[0].contentDocument)
				.find('#spot');
			addObserver(newElement[0], {childList: true}, function callback(){
				$(selectors.spot).text(newElement.text());
				$(selectors.spot).attr('class', newElement.attr('class'));
			});
		},
	};

	var updateElements = function updateElements() {
		Object.keys(elementShapes).forEach(function(element){
			elementShapes[element]();
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

	var mutationConfig = {
		attributes: true,
		attributeFilter: ['style'],
	};

	var bindings = [
		function addPurchaseTop() {
			var purchase_button_top = $(dummyNewPage[0].contentDocument)
				.find('#purchase_button_top');
			addClickRedirection(selectors.btn_buybet_10, purchase_button_top);
			addObserver(purchase_button_top[0], mutationConfig, function (mutations) {
				if (purchase_button_top.css('display') === 'none') {
					$('.price_box_first #bet_cal_buy')
						.css('display', 'none');
				} else {
					$('.price_box_first #bet_cal_buy')
						.css('display', 'block');
				}
			});
		},
		function addPurchaseBottom() {
			var purchase_button_bottom = $(dummyNewPage[0].contentDocument)
				.find('#purchase_button_bottom');
			addClickRedirection(selectors.btn_buybet_20, purchase_button_bottom);
			addObserver(purchase_button_bottom[0], mutationConfig, function (mutations) {
				if (purchase_button_bottom.css('display') === 'none') {
					$('.price_box_last #bet_cal_buy')
						.css('display', 'none');
				} else {
					$('.price_box_last #bet_cal_buy')
						.css('display', 'block');
				}
			});
		},
	];

	var addTwoWayBindings = function addTwoWayBindings() {
		bindings.forEach(function (binding) {
			binding();
		});
	};

	var injectLegacyElements = function injectLegacyElements() {
		addLegacyElements();
		updateElements();
		addTwoWayBindings();
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
			var progress = dummyNewPage.contents()
				.find('#trading_init_progress');
			if (progress.css('display') === 'none') {
				return true;
			} else {
				return false;
			}
		}, function () {
			var contract_markets = dummyNewPage.contents().find('#contract_markets');
			contract_markets.val('random');
			contract_markets[0].dispatchEvent(new Event('change'));
			onReady(function () {
				var underlying = dummyNewPage.contents()
					.find('#underlying>option:nth-child(1)');
				if ( underlying.text().indexOf('Random') > -1 ) {
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
