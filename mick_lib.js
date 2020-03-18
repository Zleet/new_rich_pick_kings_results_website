// =============================================================================
// mick_lib.js
//
// A small library of useful javascript functions written by Michael McLarnon.
// =============================================================================
// Wrapper for console.log
// =============================================================================
function cl(message) {
	
	console.log(message);
	
	return;
}
// =============================================================================
// Wrapper for document.getElementById(). Returns the DOM element with id
// element_id.
// =============================================================================
function gebi(element_id) {
	
	var dom_element = document.getElementById(element_id);
	
	return dom_element;
}
// =============================================================================
// Display the element with element id element_id
// =============================================================================
function hola(element_id) {
	
	var element = document.getElementById(element_id);
	element.style.display = "block";
	
	return;
}
// =============================================================================
// Hide the element with id element_id
// =============================================================================
function adios(element_id) {
	
	var element = document.getElementById(element_id);
	element.style.display = "none";

	return;
}
// =============================================================================
// Return a random integer between min and max (both inclusive).
// =============================================================================
function randint(min, max) {
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// =============================================================================
// 1. find sentinel_string within big_string and remove everything before it
//    (if sentinel string is an empty string, skip this step)
// 2. extract the substring between start_string and end_string and return it
//    (without including start_string and end_string)
// =============================================================================
function extract_substring(big_string, sentinel_string, start_string,
                                                                end_string) {
    
    // search variables
    var loc;
    var start;
    var end;
    
    // if sentinel_string is not an empty string AND sentinel_string is in
    // big_string, locate it and remove everything before it
    if ((sentinel_string.length > 0)
        && (big_string.indexOf(sentinel_string) != -1)) {
        loc = big_string.indexOf(sentinel_string);
        big_string = big_string.substring(loc);
    }
    
    // find start_string and remove everything before it (also remove
    // start_string)
    loc = big_string.indexOf(start_string) + start_string.length;
    big_string = big_string.substring(loc);
    
    // find end_string and remove it and everything after it
    loc = big_string.indexOf(end_string);
    var extracted_substring = big_string.substring(0, loc);
    
    return extracted_substring;
}
// =============================================================================
