/*
	Used for initializing couple objects such us the mini cart and
	mini cart currency needed by the remianing parts of the code
*/

$(document).ready(function() {

	// Initialize mini cart currency
	MiniCartCurrency.init('$','USD');

	// Initialize mini cart
	MiniCart.init(MiniCartCurrency);

	// DOM is ready
	var DOMIsReady = true;

	// Initialize controller
	Controller.init(JasonData, MiniCart, MiniCartViewManager, DOMIsReady);
});