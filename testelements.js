var commands = ["$(\"a:contains('Profit Table')\")[0]",
"$(\"a:contains('x')\")[0]",
"$(\"[name=form0] button#bet_calculate\")[0]",
"$(\"[name=form0] button:contains('Get Prices')\")[0]",
"$(\"[name=orderform] button[name=btn_buybet_10]\")[0]",
"$(\"[name=orderform] button[name=btn_buybet_20]\")[0]",
"$(\"[name=orderform] button[name=btn_buybet_230]\")[0]",
"$(\"[name=orderform] button[name=btn_buybet_240]\")[0]",
"$(\"div#content\")[0]",
"$($(\"div#content\")[0]).text()",
"$(\"h4:contains('higher')\")[0]",
"$(\"[name=form0] input:text#amount\")[0]",
"$(\"[name=form0] input:text#duration_amount\")[0]",
"$(\"[name=form0] input:text[name=amount]\")[0]",
"$(\"[name=form0] select#duration_units\")[0]",
"$(\"[name=form0] select[name=amount_type]#amount_type.unbind_later\")[0]",
"$(\"[name=form0] select[name=underlying_symbol]#bet_underlying.unbind_later\")[0]",
"$(\"span.grd-grid-12.grd-with-top-padding.standin#contract-outcome-payout\")[0]",
"$($(\"span.grd-grid-12.grd-with-top-padding.standin#contract-outcome-payout\")[0]).text()",
"$(\"span.grd-grid-12.grd-with-top-padding.standin.loss#contract-outcome-profit\")[0]",
"$($(\"span.grd-grid-12.grd-with-top-padding.standin.loss#contract-outcome-profit\")[0]).text()",
"$(\"span.grd-grid-12.grd-with-top-padding.standout.profit#contract-outcome-profit\")[0]",
"$($(\"span.grd-grid-12.grd-with-top-padding.standout.profit#contract-outcome-profit\")[0]).text()",
"$(\"span#contract-outcome-label\")[0]",
"$($(\"span#contract-outcome-label\")[0]).text()",
"$(\"span#contract-outcome-profit\")[0]",
"$($(\"span#contract-outcome-profit\")[0]).text()",
"$(\"span#spot\")[0]",
"$($(\"span#spot\")[0]).text()",];


elements = [];
commands.forEach(function(command, index){
	if ( command.indexOf('text()') < 0 ) {
		var element = eval(command);
		if ( element ) {
			elements.push(element.outerHTML);
			console.log(index, ':', command, '::', element);
		}
	}
});
console.log(commands.length, elements);
