var ImagesFactory = {
	
	isMobile: null, // place holder for a value determining if we are in
					// a mobile context or not

	imagesPlaceHolder: '.images_place_holder', 	// Reference to the images place holder in index.html
												// Kept static for the moment for simplicity!

	// Initialize images factory
	init: function(context){
		this.isMobile = context;
	},

	// Returns void, creates an image and populate the target area in index.html
	createImage: function(source){

		// source
		// IS INTENTIONALY NOT USED HERE, can be used if needed to pull your own image

		var imageHTML = null;
		if(this.isMobile){
			imageHTML = '<img src="images/mobile.png" alt="my mobile!" class="myImage">'
		} else {
			imageHTML = '<img src="images/Windows-PC.jpg" alt="my desktop!" class="myImage">'
		};

		$(this.imagesPlaceHolder).empty(); // empty place holder from previous image
		$(this.imagesPlaceHolder).append(imageHTML);
	}
}