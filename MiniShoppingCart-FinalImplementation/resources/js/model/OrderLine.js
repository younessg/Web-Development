/* 
	Holds the state and behaviour of a single orderline and other relevant attributes
*/

var OrderLine = {

	productNumber: 0,			// product number
	productName: '',			// product name
	productImageName: '',		// product image
	price: 0,					// product price
	productQuantity: 0,			// product quantity
	productAvailable: false,	// Flag for the product availability
	value: 0,					// Orderline value is price times quantity

	// Set product number
	setProductNumber: function(prodNumber){
		this.productNumber = prodNumber;
	},

	// Get product number
	getProductNumber: function(){
		return this.productNumber;
	},

	// Set product name
	setProductName: function(prodName){
		this.productName = prodName;
	},

	// Get product name
	getProductName: function(){
		return this.productName;
	},

	// Set product image name, as in name.jpg
	setProductImageName: function(prodImageName){
		this.productImageName = prodImageName;
	},

	// Get product image name, as in name.jpg
	getProductImageName: function(){
		return this.productImageName;
	},

	// Set product price
	setPrice: function(prodPrice){
		this.price = prodPrice;
	},

	// Get product price
	getPrice: function(){
		return this.price;
	},

	// Set product quantity
	setQuantity: function (quantity){
		this.productQuantity = quantity;
	},

	// Get product quantity
	getQuantity: function(){
		return this.productQuantity;
	},

	// Return true if a product is available, otherwise false
	isAvailable: function(){
		return this.productAvailable;
	},

	// Set the product availability
	setProductAvailable: function(available){
		this.productAvailable = available;
	},

	// Set the orderline total value
	setValue: function(price, quantity){
		this.value = price * quantity;
	},

	// Returns the orderline total value	
	getValue: function(){
		return this.value;
	},

	// Updates total value of an orderline, mainly invoked when a user changes quanity
	// for a given product in the mini cart
	updateValue: function(quantity){
		this.setValue(this.price, quantity);
	},
}
