// ============================================================================
// Mickalytics
// ============================================================================
function send_analytics_report() {

	// +++++++++++++
	// get user info
	// +++++++++++++
	var time_opened = new Date();
	var timezone = new Date().getTimezoneOffset()/60;

	var page_on = window.location.pathname;
	var referrer = document.referrer;
	var total_previous_sites = history.length;
	
	var browser_name = navigator.appName;
	var browser_engine = navigator.product;
	var browser_version_1a = navigator.appVersion;
	var browser_version_1b = navigator.userAgent;
	var browser_language = navigator.language;
	var browser_online = navigator.onLine;
	var browser_platform = navigator.platform;

	var java_enabled = navigator.javaEnabled();
	
	// test print
	
	// build object containing all user info
	
	// create a unique user id by hashing certain pieces of the user
	// information
	
	
	// send user info object to the backend


	return;
}
// ============================================================================
// var info={

    // javaEnabled(){return navigator.javaEnabled()},
    // dataCookiesEnabled(){return navigator.cookieEnabled},
    // dataCookies1(){return document.cookie},
    // dataCookies2(){return decodeURIComponent(document.cookie.split(";"))},
    // dataStorage(){return localStorage},

    // sizeScreenW(){return screen.width},
    // sizeScreenH(){return screen.height},
    // sizeDocW(){return document.width},
    // sizeDocH(){return document.height},
    // sizeInW(){return innerWidth},
    // sizeInH(){return innerHeight},
    // sizeAvailW(){return screen.availWidth},
    // sizeAvailH(){return screen.availHeight},
    // scrColorDepth(){return screen.colorDepth},
    // scrPixelDepth(){return screen.pixelDepth},


    // latitude(){return position.coords.latitude},
    // longitude(){return position.coords.longitude},
    // accuracy(){return position.coords.accuracy},
    // altitude(){return position.coords.altitude},
    // altitudeAccuracy(){return position.coords.altitudeAccuracy},
    // heading(){return position.coords.heading},
    // speed(){return position.coords.speed},
    // timestamp(){return position.timestamp},

    // };