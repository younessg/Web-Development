/* 
	Responsible for detecting if the application is running
	on a mobile device or not.
*/
var MobileDetector = {
	// Returns true if Android mobile, otherwise null
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
	// Returns true if BlackBerry mobile, otherwise null
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
	// Returns true if iOS mobile, otherwise null
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
	// Returns true if Opera mobile, otherwise null
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
	// Returns true if Windos mobile, otherwise null
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
	// Returns true otherwise null
    isMobile: function() {
        return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
    }
};