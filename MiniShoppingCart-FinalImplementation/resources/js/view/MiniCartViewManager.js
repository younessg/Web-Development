/* 
	Handles drawing mini cart when filled with orderlines or when empty,
	also handles re-drawing mini cart when upates from user take place
*/

var MiniCartViewManager = {

	miniCartView: '#mini-cart-div',	// Reference to the mini cart div in HTML

	// Generates html content when mini cart is populated
	drawMiniCart: function(miniCart){
		var headerHtml = '';
		var listViewHtml = '';
		var footerHtml = '';
		var content = '';

		// Let mini cart div expands more on mobile devices
		if(MobileDetector.isMobile()){
			$(this.miniCartView).css('width','90%');
		};

		if(!miniCart.isEmpty() && miniCart.isUpdated())
		{
			if(miniCart.isProductMissing()){
				headerHtml = this.createMiniCartHeader(miniCart);
			};
			listViewHtml = this.createListView(miniCart);
			footerHtml = this.createMiniCartFooter(miniCart);
			content = headerHtml + listViewHtml + footerHtml;
		} else {
			content = this.createEmptyMiniCart(miniCart);
		}
		$(this.miniCartView).empty();
		$(this.miniCartView).append(content);
		$(document).trigger('finishedDrawingMiniCart', null);
	},

	// Generates html for mini cart header
	createMiniCartHeader: function(miniCart){
		var htmlString = '<div id="mini-cart-hearder-main-div">';
		htmlString += '<div id="mini-cart-hearder-top-div">';
		htmlString += '<img src="resources/images/exclamation_mark.png" id="exclamation-mark-img"/>';
		htmlString += ' ' + miniCart.getTotalMissingOrderLines() + ' Unavialbale product</div>';
		htmlString += '<div id="mini-cart-header-bottom-div">Some product name</div>';
		htmlString += '</div>';
		return htmlString;
	},

	// Generates html for mini cart ordelines list
	createListView: function(miniCart){
		var orderLines = miniCart.getOrderLines();
		var htmlString = '<table id="order-lines-table">';
		var prodId = '';
		var count = 0;
		for (product in orderLines){
			count++;
			prodId = orderLines[product].getProductNumber();
			htmlString += '<div id="' + prodId + '">'; 
			/* Product image, name and the delete button ------------ */
			htmlString += '<tr id="orderline-images-txt-tr">';
			htmlString += '<td width="60"><img src="resources/images/product_images/' + orderLines[product].getProductImageName() + '" width="70" height="70" /></td>';
			htmlString += '<td width="383" colspan="2" id="product-name-td">' + orderLines[product].getProductName() + '</td>';			
			htmlString += '<td width="25"><img src="resources/images/remove_from_cart.png" width="20" height="20" class="removeOrderLineBtn" id="' + prodId + '"/></td>';
			htmlString += '</tr>';
			/* Unavailable product message when applicable ---------- */
			if(!orderLines[product].isAvailable()){
				htmlString += this.createUnavailableProductMessage();
			}
			/* Product quantity and value --------------------------- */
			htmlString += '<tr>';
			htmlString += '<td></td>';
			htmlString += '<td><input type="text" size="1" value="' + orderLines[product].getQuantity() + '" class="itemQuantity" id="' + prodId + '"/></td>';
			htmlString += '<td style="text-align:right">' + miniCart.getCurrency() + orderLines[product].getValue() + '</td>';
			htmlString += '<td></td>';
			htmlString += '</tr>';
			/* Draw horizontal line separating between orderlines -- */
			if( count < orderLines.length){
				htmlString += '<tr>';
				htmlString += '<td colspan="4"><hr id="order-line-hr"></td>';
				htmlString += '</tr>';
			} else {
				htmlString += '<tr><td colspan="4">&nbsp;</td></tr>';
			};
			htmlString += '</div>';
		}
		htmlString += '</table>';
		return htmlString;
	},

	// Generates html for mini cart footer, includes total quantity, price and checkout buttons
	createMiniCartFooter: function(miniCart){
		var htmlString = '<div style="background:#F5F5F5; height:9em;">';
		htmlString += '<div id="shopping-cart-footer-quantity-div">You have '+ miniCart.getTotalQuantity() +' items in the cart.</div>';
		htmlString += '<div id="shopping-cart-footer-value-div">';
		htmlString += '<p style="float: left;">Subtotal (' + miniCart.getCurrencyAbbr() + ')</p>';
		htmlString += '<p style="float: right;">' + miniCart.getCurrency() + miniCart.getTotalValue() + '</p>';
		htmlString += '</div>';
		htmlString += '<div id="shopping-cart-footer-buttons-div">';
		htmlString += '<div id="view-cart-div" style="float: left; background:#333;">VIEW CART</div>';
		htmlString += '<div id="checkout-div" style="float: right; background:#06F;">CHECKOUT</div>';
		htmlString += '</div>';
		htmlString += '</div>';
		return htmlString;
	},

	// Generates html content when mini cart is empty
	createEmptyMiniCart: function(miniCart){
		var htmlstring = '<p id="empty-cart-text-top-1">You have no items in your cart.</p>';
		htmlstring += '<p id="empty-cart-text-top-2">Continue shopping</p>';
		htmlstring += '<hr id="empty-cart-hr">';
		htmlstring += '<p id="empty-cart-text-bottom-1">You have ' + miniCart.getTotalQuantity() + ' items in your cart.</p>';
		htmlstring += '<div>';
		htmlstring += '<p id="empty-cart-text-bottom-2">Subtotal</p>'
		htmlstring += '<p id="empty-cart-text-bottom-3">' + miniCart.getCurrency() + miniCart.getTotalValue() + '.00</p>';
		htmlstring += '</div>';
		return htmlstring;
	},

	// Generates content for warning message for unavailable products
	createUnavailableProductMessage: function(){
		var htmlString = '<tr>';
		htmlString += '<td width="60"></td>';
		htmlString += '<td width="383" colspan="2" id="orderline-missing-product-txt-td">';
		htmlString += 'The product is no longer available.<br>Please remove it from yout cart.</td>';			
		htmlString += '<td width="25"></td>';
		htmlString += '</tr>';
		return htmlString;
	},

	// Toggles the mini cart visibility
	slideToggleMiniCart: function(){
		$(this.miniCartView).slideToggle('fast');	
	}
}