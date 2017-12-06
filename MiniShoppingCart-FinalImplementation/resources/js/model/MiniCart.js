/* 
	Holds the state of the mini cart, its behavior and some other relevant attributes
*/

var MiniCart = {

	orderLines: '',				// Orderlines place holder
	totalQuantity: 0,			// Total quantity per mini cart
	totalValue: 0,				// Total value per mini cart
	empty: true,				// Flag if mini cart is empty or not
	updated: false,				// Flag if mini cart has been updated or not
	missingOrderlinesCount: 0,	// Place holder for total unavailable products/orderline(s)

	// Used for initializing mini cart
	init: function(currency){
		// Make sure "MiniCartViewManager" draws mini cart content only if users update the cart
		$(document).bind('finishedDrawingMiniCart', setUpdatedStatus);
		function setUpdatedStatus(){this.updated = false};
		this.setCurrency(currency.getCurrencySymbol());
		this.setCurrencyAbbr(currency.getCurrencyAbbr());
	},

	// Generate orderlines based on received data
	setOrderLines: function(data){
		var price, quantity = 0;
		this.clear(); // Needed mostly to make sure we have a fresh/empty array to work with
		for(obj in data){
			this.orderLines[obj] = Object.create(OrderLine);
			this.orderLines[obj].setProductNumber(data[obj].productNumber);
			this.orderLines[obj].setProductName(data[obj].productName);
			this.orderLines[obj].setProductImageName(data[obj].productImageName);
			price = data[obj].price;
			quantity = data[obj].productQuantity;
			this.orderLines[obj].setPrice(price);
			this.orderLines[obj].setProductAvailable(data[obj].productAvailable);
			this.orderLines[obj].setQuantity(quantity);
			this.orderLines[obj].setValue(price, quantity);
		};
		this.empty = this.orderLines.length > 0 ? false : true; 
		this.updated = true;
	},

	// Returns all order lines in the mini cart
	getOrderLines: function()
	{
		return this.orderLines;
	},

	// Set totaly quantity for the mini cart
	setTotalQantity: function(quantity){
		this.totalQuantity = quantity;
	},

	// This is measured in terms of qunatity, returns total amount of items in the mini cart
	getTotalQuantity: function(){
		var totalItems = 0;
		if(!this.isEmpty()){
			for (order in this.orderLines){
				totalItems += parseInt(this.orderLines[order].getQuantity());
			};
		};
		return totalItems;
	},

	// Checks if the mini cart is empty, zero items present in it
	isEmpty: function(){
		return this.empty == true;
	},

	// This is measured in terms of money value, returns total value of the mini cart
	getTotalValue: function(){
		var totalValue = 0;
		if(!this.isEmpty()){
			for (order in this.orderLines){
				totalValue += this.orderLines[order].getValue();
			}
		}
		return totalValue;
	},

	// Updates an orderline in the cart, fetched by product id
	updateOrderLineQuantity: function(productId, newQuantity){
		for (order in this.orderLines) {
			if(this.orderLines[order].productNumber == productId){
				this.orderLines[order].setQuantity(newQuantity);
			};
		};
		this.setOrderLines(this.orderLines);
	},

	// Removes an orderline in the cart, fetched by product id
	removeOrderLine: function(productId){
		if(!this.isEmpty()){
			for (order in this.orderLines) {
				if(this.orderLines[order].productNumber == productId){
					this.orderLines.splice(order, 1);
				};
			};
			this.setOrderLines(this.orderLines);
		};
	},

	// Checks if an orderline / product is missing
	isProductMissing: function(){
		var count = 0;
		if(!this.isEmpty()){
			for (order in this.orderLines){
				if(!this.orderLines[order].isAvailable()){
					count++;
				};
			};
		};
		this.setTotalMissingOrderLines(count);
		return count > 0;
	},

	// clear/reset the mini cart
	clear: function(){
		this.orderLines = new Array();
		this.totalQuantity = 0;
		this.totalValue = 0;
		this.empty = true;
		this.updated = true;
	},

	// Should return true if the mini cart has been updated, otherwise false
	isUpdated: function(){
		return this.updated;
	},

	// Set total unavailable orderlines/products
	setTotalMissingOrderLines : function(count){
		this.missingOrderlinesCount = count;
	},

	// get total unavailable orderlines/products
	getTotalMissingOrderLines : function(){
		return this.missingOrderlinesCount;		
	},

	// Get the mini cart currency
	getCurrency: function(){return this.currency;},

	// Set the mini cart currency
	setCurrency: function(cur){this.currency = cur;},

	// Get the mini cart currency abbrevaiation, three letters format
	getCurrencyAbbr: function() {return this.currencyAbbr;},

	// Set the mini cart currency abbrevaiation, three letters format
	setCurrencyAbbr: function(symbol){this.currencyAbbr = symbol;},
}