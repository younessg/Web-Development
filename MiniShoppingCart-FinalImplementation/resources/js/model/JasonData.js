/* 
	JavaScript Document
	An array holding raw data which will populate the shopping cart
*/

var JasonData = {

	rawData: '[{"productNumber": 411, "productName": "Apple, Ingrid Marie, healthy, chewy and not much more", "productImageName": "apple.png", "productQuantity": 2, "price": 1, "productAvailable": true}, {"productNumber": 132, "productName": "Baseball, round used for baseball, quite boring", "productImageName": "ball.png", "productQuantity": 1, "price": 3, "productAvailable": false }, {"productNumber": 567, "productName": "Golden key, where it leads is a mystery but at the same time an adventure", "productImageName": "key.png", "productQuantity": 3, "price": 999, "productAvailable": true}, {"productNumber": 578, "productName": "Leather shoes, slightly worn with a hole in right sole", "productImageName": "shoes.png", "productQuantity": 1, "price": 49,   "productAvailable": true}, {"productNumber": 243, "productName": "Umbrella, Blue wooden handle sturdy lightweight construction. Storm approved up to 1000 storm units", "productImageName": "umbrella.png", "productQuantity": 1, "price": 17, "productAvailable": true}]',

	// Parse JASON data as an array
	getJasonAsArray: function(){
		var data = JSON.parse(this.rawData);
		var dataAsArray = [];
		for (d in data) {
			dataAsArray.push(data[d]);
		}
		return dataAsArray;
	},
}