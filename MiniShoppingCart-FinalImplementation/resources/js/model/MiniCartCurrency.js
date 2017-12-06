/*
	Mini cart currency object
*/

var MiniCartCurrency = {
	currencySymbol: '$', 		// Currency symbol such as $, £, € etc, default is $
	currencyAbbr: 'USD', 		// Currency abbreviation such as USD, SEK, EUR etc, default is USD

	// Used for initializing mini cart currency object
	init: function(currency, currencyAbbr){
		this.currencySymbol = currency;
		this.currencyAbbr = currencyAbbr;
	},

	// Set mini cart currency symbol
	setCurrencySymbol: function(symbol){
		this.currencySymbol = symbol;
	},
	
	// Get mini cart currency symbol
	getCurrencySymbol: function(){
		return this.currencySymbol;
	},

	// Set mini cart currency abbreviation
	setCurrencyAbbr: function(abbrev){
		this.currencyAbbr = abbrev;
	},
	
	// Get mini cart currency symbol
	getCurrencyAbbr: function(){
		return this.currencyAbbr;
	},
}