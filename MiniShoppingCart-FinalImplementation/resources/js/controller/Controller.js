/* 
	Handles user interaction with GUI objects
	loadButton, resetButton and removeOrderLineBtn, itemQuantity click / keypress events are handled here
*/

var Controller = {

	// Initialize controller
	init: function(jasonData, miniCart, miniCartViewManager, DOMIsReady){
		this.handleUserInteraction(jasonData, miniCart, miniCartViewManager, DOMIsReady);
	},
	
	// Handles user interaction
	handleUserInteraction: function (jasonData, miniCart, miniCartViewManager, DOMIsReady){		
			
		if(DOMIsReady){ // Checking if DOM is ready to prevent users interaction while DOM is being created

			// Populate mini cart with dummy data from JASON file
			$('#loadButton').click(function(event){
				miniCart.setOrderLines(jasonData.getJasonAsArray()); // Dummy data pushed to shopping cart from a JASON object				
				updateminiCartView();
			});
		
			// Clear mini cart from its content and reset it to empty
			$('#resetButton').click(function(event){
				miniCart.clear();				
				updateminiCartView();
			});
		
			// Handle removing an orderline from mini cart
			$('#mini-cart-div').on('click', '.removeOrderLineBtn', function(event){
				var prodId = event.target.id;
				var orderLineRef = '#'+event.target.id;
				$(orderLineRef).remove();
				miniCart.removeOrderLine(prodId);
				updateminiCartView();
			});
		
			// Handle quantity changes in mini cart
			$('#mini-cart-div').on('keypress', '.itemQuantity', function(event){
				var prodId = event.target.id;
				var newQuantity = event.target.value;
				var keycode = (event.keyCode ? event.keyCode : event.which);
				if (keycode == '13') {
					miniCart.updateOrderLineQuantity(prodId, newQuantity);
					updateminiCartView();
				}
			});
		
			// Show hide mini cart view / div
			$('#show-hide-mini-cart').click(function(event){				
				updateminiCartView();
				miniCartViewManager.slideToggleMiniCart();
			});
		};
		
		// Update mini cart view and its content
		function updateminiCartView(){
			miniCartViewManager.drawMiniCart(miniCart);
		};	

	}, // End of handleUserInteraction()
	
}; // End of Controller