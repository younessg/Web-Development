/*
	Used for initializing couple objects such as the MobileDetector
	and ImagesFactory, also to create the images
*/

$(document).ready(function() {

	// Initializing the images factory
	ImagesFactory.init(MobileDetector.isMobile());

	// Creates the image, will be based on the context, if mobile otherwise desktop / PC etc
	ImagesFactory.createImage(null); // passing null value as image source just to keep things simple

	// We could have used a controller to call a view manager to update the display
	// Skipped to keep things simple!

});