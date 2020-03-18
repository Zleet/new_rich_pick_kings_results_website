// =============================================================================
// Rich Pick Kings Result Webpage by Michael McLarnon
// Version 1.0 begun Friday 6th March 2020
// =============================================================================
// globals go here

// global to hold a copy of karl marked fixtures indexed by id
var indexed_karl_marked_fixtures = -1;

// global to hold a copy of entries indexed by id
var indexed_entries = -1;

// global handle for the total points per user bar chart displayed on the
// date range view screen
var date_range_total_points_per_player_bar_chart = -1;

// global handle for the percentage of total points per player pie chart
// displayed on the date range view screen
var date_range_percentage_of_total_points_per_player_pie_chart = -1;

// usernames to names conversions
var usernames_and_names = {
				"karldale"	: "Karl",
				"Miktor"	: "Michael",
				"adrian"	: "Adrian",
				"bert"		: "Bert",
				"chris"		: "Chris",
				"stevie"	: "Stevie",
				"alf"		: "Alf",
				"colin"		: "Colin"
							};
// =============================================================================
// =============================================================================
function initialise_page() {
	
	// display the leaderboard
	leaderboard_navigation_button_has_been_pressed();

	// rebuild karl marked fixtures so that the karl marked fixtures can be
	// looked up by id
	build_indexed_karl_marked_fixtures();
	
	// rebuild entries so that they can be looked up by id
	build_indexed_entries();
	
	return;
}
// =============================================================================
// Stick a version of karl marked fixtures where each fixture object can be
// looked up by id. Stick it in the global variable
// indexed_karl_marked_fixtures. Each key in the global object will be a
// fixture id and each key will be a karl marked fixture object.
// =============================================================================
function build_indexed_karl_marked_fixtures() {

	// clear out the global object
	indexed_karl_marked_fixtures = {};
	
	// loop through the fixtures in the global karls_marked_fixtures and stick
	// each one in the global indexed_karl_marked_fixtures, with the key being
	// the fixture id
	var total_karl_marked_fixtures = karls_marked_fixtures.length;
	for (var i = 0; i < total_karl_marked_fixtures; ++i) {
		var fixture = karls_marked_fixtures[i];
		var fixture_id = fixture["id"];
		indexed_karl_marked_fixtures[fixture_id] = JSON.parse(
												JSON.stringify(fixture)
															)
	}

	return;
}
// =============================================================================
// Build a version of entries where each entry can be looked up by id.
// This object will be stored as the global variable indexed_entries.
// Each key in this global object will be an entry id and each value will be
// an entry object.
// =============================================================================
function build_indexed_entries() {

	// clear out the global object
	indexed_entries = {};
	
	// loop through the entries in the global array entries and stick each entry
	// object in the global object indexed_entries, with each key being the
	// entry id
	var total_entries = entries.length;
	for (var i = 0; i < total_entries; ++i) {
		var entry = entries[i];
		var entry_id = entry["id"];
		indexed_entries[entry_id] = entry;
	}
	
	return;
}
// =============================================================================
// Hide all the main divs.
// =============================================================================
function hide_all_divs() {
	
	var main_divs =	[	"leaderboard_div",
						"entry_history_div",
						"date_range_view_div"
					];
	
	for (var i = 0; i < main_divs.length; ++i) {
		var current_div_id = main_divs[i];
		adios(current_div_id);
	}

	return;
}
// =============================================================================
// Called when the LEADERBOARD button is pressed at the top of the page.
// =============================================================================
function leaderboard_navigation_button_has_been_pressed() {
	
	// calculate the leaderboard stats
	var leaderboard_stats = calculate_leaderboard_stats();
	
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// sort the user stats objects in leaderboard_stats into order of total
	// points, from greatest to least total points
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// build an array containing all the total points values
	var all_total_points_values = [];
	for (var i = 0; i < leaderboard_stats.length; ++i) {
		var user_stats_object = leaderboard_stats[i];
		var match_points = user_stats_object["total_match_points_won"];
		var correct_score_points = user_stats_object[
										"total_correct_score_points_won"];
		var total_points = match_points + correct_score_points;
		total_points = round_to_two_decimal_places(total_points);
		if (all_total_points_values.indexOf(total_points) == -1) {
			all_total_points_values.push(total_points);
		}
	}
	// sort the points from greatest to least
	all_total_points_values.sort(function(a, b) {return b - a;});
	// use all_total_points_values to rebuild leaderboard stats with the
	// user stats objects in order of total points, from greatest to least
	var rebuilt_leaderboard_stats = [];
	for (var i = 0; i < all_total_points_values.length; ++i) {
		var current_points_value = all_total_points_values[i];
		// find all the user stats objects that match the current points value
		// and push them onto rebuilt leaderboard stats
		for (var j = 0; j < leaderboard_stats.length; ++j) {
			var user_stats_object = leaderboard_stats[j];
			var user_total_points = (
				user_stats_object["total_match_points_won"]
				+ user_stats_object["total_correct_score_points_won"]
									);
			user_total_points = round_to_two_decimal_places(user_total_points);
			var delta = 0.001;
			var points_diff = Math.abs(
				current_points_value - user_total_points
										);
			// test print for karl
			if (points_diff < delta) {
				rebuilt_leaderboard_stats.push(
					JSON.parse(JSON.stringify(user_stats_object))
												);
			}
		}
	}
	leaderboard_stats = rebuilt_leaderboard_stats;

	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// build the html for the leaderboard div and stick it in the
	// leaderboard div. Stats that will appear in the leaderboard table
	// will be:
	// 1. username
	// 2. total entries
	// 3. total match results correct
	// 4. total correct scores correct
	// 5. total match points won
	// 6. total correct score points won
	// 7. total points won
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// spacer above leaderboard title
	var html='<table align="center"><tr><td></td></tr></table>';
	// leaderboard title
	html += '<table align="center"><tr>';
	html += '<td style="font: 20pt arial;">';
	html += 'LEADERBOARD</td></tr></table>';
	// leaderboard table
	html += '<table align="center" style="border: 2px solid red; ';
	html += 'border-radius: 10px; padding: 10px;">';
	// column headers
	html += '<tr>';
	html += '<td style="text-align: right;" valign="bottom"><strong>';
	html += 'USERNAME</strong></td>';
	html += '<td style="width: 10px;"></td>';	// spacer cell
	html += '<td style="text-align: right;" valign="bottom">';
	html += '<strong>TOTAL<br>ENTRIES</strong></td>';
	html += '<td style="width: 10px;"></td>';	// spacer cell
	html += '<td style="text-align: right;" valign="bottom">';
	html += '<strong>TOTAL<br>MATCH<br>RESULTS</strong><br>';
	html += 'CORRECT</td>';
	html += '<td style="width: 10px;"></td>';	// spacer cell
	html += '<td style="text-align: right;" valign="bottom">';
	html += '<strong>TOTAL<br>CORRECT<br>SCORES</strong><br>';
	html += 'CORRECT</td>';
	html += '<td style="width: 10px;"></td>';	// spacer cell
	html += '<td style="text-align: right;" valign="bottom">';
	html += '<strong>TOTAL<br>MATCH<br>POINTS</strong>';
	html += '<br>WON</td>';
	html += '<td style="width: 10px;"></td>';	// spacer cell
	html += '<td style="text-align: right;" valign="bottom">';
	html += '<strong>TOTAL<br>CORRECT<br>SCORE<br>';
	html += 'POINTS<br>WON</strong></td>';
	html += '<td style="width: 10px;"></td>';	// spacer cell
	html += '<td style="text-align: right;" valign="bottom">';
	html += '<strong>TOTAL<br>POINTS<br>WON</strong></td>';
	html += '</tr>';
	for (var i = 0; i < leaderboard_stats.length; ++i) {
		var user_stats_object = leaderboard_stats[i];
		// start of row
		html += '<tr>';
		// username
		html += '<td style="text-align: right;">';
		html += user_stats_object["username"] + '</td>';
		// spacer cell
		html += '<td style="width: 10px;"></td>';
		// total entries
		html += '<td style="text-align: right;">';
		html += user_stats_object["total_entries"].toString();
		html += '</td>';
		// spacer cell
		html += '<td style="width: 10px;"></td>';
		// total match results correct
		html += '<td style="text-align: right;">';
		html += user_stats_object["total_match_results_correct"].toString();
		html += '</td>';
		// spacer cell
		html += '<td style="width: 10px;"></td>';
		// total correct scores correct
		html += '<td style="text-align: right;">';
		html += user_stats_object["total_correct_scores_correct"].toString();
		html += '</td>';
		// spacer cell
		html += '<td style="width: 10px;"></td>';
		// total match points won
		html += '<td style="text-align: right;">';
		var total_match_points_won = user_stats_object["total_match_points_won"];
		var total_match_points_string = total_match_points_won.toString();
		total_match_points_string = ensure_float_string_has_two_places(
													total_match_points_string);
		html += total_match_points_string;
		html += '</td>';
		// spacer cell
		html += '<td style="width: 10px;"></td>';
		// total correct score points won
		html += '<td style="text-align: right;">';
		var total_correct_score_points = user_stats_object[
											"total_correct_score_points_won"];
		total_correct_score_points_string = total_correct_score_points.toString();
		total_correct_score_points_string = ensure_float_string_has_two_places(
											total_correct_score_points_string);
		html += total_correct_score_points_string;

		html += '</td>';
		// spacer cell
		html += '<td style="width: 10px;"></td>';
		// total points won
		var correct_score_points = user_stats_object[
											"total_correct_score_points_won"];
		var match_points = user_stats_object["total_match_points_won"];
		var total_points = correct_score_points + match_points;
		total_points = round_to_two_decimal_places(total_points);
		var total_points_string = total_points.toString();
		total_points_string = ensure_float_string_has_two_places(
														total_points_string);
		html += '<td style="text-align: right;">';
		html += total_points_string + '</td>';
		// end of row
		html += '</tr>';
	}
	// end of leaderboard table
	html += '</table>';

	// stick the html for the leaderboard screen in the leaderboard div
	var leaderboard_div = gebi("leaderboard_div");
	leaderboard_div.innerHTML = html;
	
	// hide all the divs
	hide_all_divs();
	
	// display the leaderboard div
	hola("leaderboard_div");
	
	return;
}
// =============================================================================
// Called when the ENTRY HISTORY button is pressed at the top of the page.
// =============================================================================
function entry_history_button_has_been_pressed() {

	// build an array containing all the usernames
	var usernames = [];
	for (var i = 0; i < entries.length; ++i) {
		var entry = entries[i];
		var username = entry["username"];
		if (usernames.indexOf(username) == -1) {
			usernames.push(username);
		}
	}

	// build the html for the user selection dropdown menu
	var dd_menu = '<select id="entry_history_user_selection_dropdown_menu">';
	dd_menu += '<option value="select_a_user">Select a user...</option>';
	// user lines
	for (var i = 0; i < usernames.length; ++i) {
		var username = usernames[i];
		dd_menu += '<option value="' + username + '">';
		dd_menu += username + '</option>'
	}
	// end of dropdown menu
	dd_menu += '</select>';

	// build the html for the entry history div.
	// This will be:
	// <user selection dropdown menu> <back button> <forward button>
	var html = '<table align="center">';
	html += '<tr>';
	html += '<td>';
	html += dd_menu;
	html += '</td>';
	// spacer cell
	html += '<td style="width: 10px;"></td>';
	// back and forward buttons
	html += '<td>';
	html += '<button id="entry_history_user_back_button"><</button>';
	html += '</td>';
	html += '<td>';
	html += '<button id="entry_history_user_forward_button">></button>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	// entry history table div
	html += '<div id="entry_history_table_div"></div>';
	
	// stick the html in the entry history div
	var entry_history_div = gebi("entry_history_div");
	entry_history_div.innerHTML = html;
	
	// attach an onchange event listener to the select user dropdown menu,
	// to rebuild the entry_history_div
	var dropdown_menu = gebi("entry_history_user_selection_dropdown_menu");
	dropdown_menu.addEventListener("change",
							entry_history_user_dropdown_menu_has_changed);
	
	// attach an onclick event listener to the back button
	var back_button = gebi("entry_history_user_back_button");
	back_button.addEventListener("click",
								entry_history_back_button_has_been_clicked);
	
	// attach an onclick event listener to the forward button
	var forward_button = gebi("entry_history_user_forward_button");
	forward_button.addEventListener("click",
								entry_history_forward_button_has_been_clicked);
	
	// hide all the divs
	hide_all_divs();
	
	// display the entry history div
	hola("entry_history_div");
	
	// select a random user
	var random_index = randint(0, usernames.length - 1);
	var user_to_set = usernames[random_index];
	
	// set the selection in the user selection dropdown menu to the random
	// users we've just selected
	var user_selection_dropdown_menu = gebi(
								"entry_history_user_selection_dropdown_menu");
	user_selection_dropdown_menu.value = user_to_set;
	
	// rebuild the user entry history table for the user currently selected in
	// the user selection dropdown menu
	entry_history_user_dropdown_menu_has_changed();

	return;
}
// =============================================================================
// Called when the user selection dropdown menu changes on the entry history
// screen.
// =============================================================================
function entry_history_user_dropdown_menu_has_changed() {
	
	// get the current selection from the dropdown menu
	var dd_menu = gebi("entry_history_user_selection_dropdown_menu");
	var dd_selection = dd_menu.options[dd_menu.selectedIndex].value;
	
	// if the user has selected a user, rebuild the user history table for the
	// user the user has selected
	if (dd_selection != 'select_a_user') {
		rebuild_entry_history_for_single_user();
	}
	
	return;
}
// =============================================================================
// Rebuild the entry history table for the user currently selected in the
// entry history user selection dropdown menu on the entry history screen.
// =============================================================================
function rebuild_entry_history_for_single_user() {
	
	// get the current user selection from the dropdown menu
	var dd_menu = gebi("entry_history_user_selection_dropdown_menu");
	var dd_selection = dd_menu.options[dd_menu.selectedIndex].value;
	
	// if the user has selected "Select a user..." from the dropdown menu,
	// clear out the entry_history_table_div and return
	if (dd_selection == 'select_a_user') {
		var entry_history_table_div = gebi("entry_history_table_div");
		entry_history_table_div.innerHTML = '';
		return;
	}

	// if we've fallen through, the user has selected a user from the dropdown
	// menu. Build the entry history table for the selected user and stick it
	// in the entry_history_table_div
	var selected_user = dd_selection;
	// get all the marked entries for the selected user
	var selected_user_marked_entries = marked_entries[selected_user];
	
	// loop through marked entries for the selected user. For each marked
	// entry, calculate the epoch datetime for the fixture that matches that
	// entry and push it onto the array epoch datetimes
	var epoch_datetimes = [];
	for (var i = 0; i < selected_user_marked_entries.length; ++i) {
		var marked_entry = selected_user_marked_entries[i];
		var fixture_id = marked_entry["fixture_id"];
		var fixture = indexed_karl_marked_fixtures[fixture_id];
		var epoch_datetime = build_epoch_datetime_from_karl_marked_fixture(
																	fixture);
		if (epoch_datetimes.indexOf(epoch_datetime) == -1) {
			epoch_datetimes.push(epoch_datetime);
		}
	}
	
	// sort out marked entries for the selected user into datetime order
	epoch_datetimes = epoch_datetimes.sort(function(a, b) {return a - b;});
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// loop through the epoch datetimes (now in datetime order) and build an
	// array containing all the user marked entries for the current user
	// in datetime order
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var single_user_entries_in_datetime_order = [];
	for (var i = 0; i < epoch_datetimes.length; ++i) {
		var current_epoch_datetime = epoch_datetimes[i];
		// find all the current user marked entries that were entries for
		// fixtures that took place at current_epoch_datetime
		for (var j = 0; j < selected_user_marked_entries.length; ++j) {
			var current_marked_entry = selected_user_marked_entries[j];
			var current_fixture_id = current_marked_entry["fixture_id"];
			var current_fixture = indexed_karl_marked_fixtures[
													current_fixture_id];
			var current_fixture_epoch_datetime = build_epoch_datetime_from_karl_marked_fixture(
														current_fixture);
			if (current_fixture_epoch_datetime == current_epoch_datetime) {
				single_user_entries_in_datetime_order.push(current_marked_entry);
			}
		}
	}
	
	// +++++++++++++++++++++++++++++++++++++++++
	// build the html for the user history table
	// +++++++++++++++++++++++++++++++++++++++++
	// start of table
	var html = '<table align="center">';
	// column headers; these will be:
	// ENTRY #,DATE,TIME,HOME TEAM,AWAY TEAM,MATCH PREDICTION,SCORE PREDICTION,
	// FT_RESULT,MATCH POINTS WON,CORRECT SCORE POINTS WON,TOTAL POINTS WON
	html += '<tr>';
	html += '<td valign="bottom" class="entry_history_header_cell">';
	html += '<strong>#</strong></td>';
	html += '<td valign="bottom" class="entry_history_header_cell"><strong>';
	html += 'DATE</strong></td>';
	html += '<td valign="bottom" class="entry_history_header_cell"><strong>TIME';
	html += '</strong></td>';
	html += '<td valign="bottom" class="entry_history_header_cell"><strong>HOME';
	html += '<br>TEAM</strong></td>';
	html += '<td valign="bottom" class="entry_history_header_cell"><strong>AWAY';
	html += '<br>TEAM</strong></td>';
	html += '<td valign="bottom" class="entry_history_header_cell">';
	html += '<strong>';
	html += 'FULL-TIME<br>RESULT';
	html += '</strong></td>';
	html += '<td valign="bottom" class="entry_history_header_cell">';
	html += '<strong>MATCH';
	html += '<br>PREDICTION';
	html += '</strong></td>';
	html += '<td valign="bottom" class="entry_history_header_cell">';
	html += '<strong>MATCH<br>POINTS<br>WON';
	html += '</strong></td>';	
	html += '<td valign="bottom" class="entry_history_header_cell">';
	html += '<strong>SCORE';
	html += '<br>PREDICTION';
	html += '</strong></td>';
	html += '<td valign="bottom" class="entry_history_header_cell">';
	html += '<strong>CORRECT<br>SCORE<br>POINTS';
	html += '<br>WON</strong></td>';
	html += '<td valign="bottom" class="entry_history_header_cell">';
	html += '<strong>TOTAL<br>POINTS<br>WON';
	html += '</strong></td>';
	html += '</tr>';	
	// individual entry lines
	for (var i = 0; i < single_user_entries_in_datetime_order.length; ++i) {
		var marked_entry = single_user_entries_in_datetime_order[i];
		var fixture_id = marked_entry["fixture_id"];
		// var fixture = karls_marked_fixtures[fixture_id];
		// indexed_karl_marked_fixtures
		var fixture = indexed_karl_marked_fixtures[fixture_id];
		var entry_id = marked_entry["entry_id"];
		var entry = indexed_entries[entry_id];
		// start of line
		html += '<tr>';
		// number (i + 1)
		html += '<td class="entry_history_cell">';
		html += (i + 1) + '</td>';
		// date
		var date_string = fixture["day"] + '/' + fixture["month"] + '/';
		date_string += fixture["year"].substring(2);
		html += '<td class="entry_history_cell">';
		html += date_string + '</td>';
		// time
		var time_string = '';
		if (fixture["hour"].length == 1) {
			time_string += '0';
		}
		time_string += fixture["hour"];
		time_string += ':';
		if (fixture["minute"].length == 1) {
			time_string += '0';
		}
		time_string += fixture["minute"];
		html += '<td class="entry_history_cell">';
		html += time_string + '</td>';
		// home team
		html += '<td class="entry_history_team_cell">';
		html += fixture["home_team"] + '</td>';
		// away team
		html += '<td class="entry_history_team_cell">';
		html += fixture["away_team"] + '</td>';
		// full-time result
		var ft_result_string = '-';
		if (Array.isArray(fixture["htft_result"])) {
			if (fixture["htft_result"].length == 4) {
				ft_result_string = fixture["htft_result"][2].toString() + '-';
				ft_result_string += fixture["htft_result"][3].toString();
			}
		}
		html += '<td class="entry_history_ft_result_cell">';
		html += ft_result_string + '</td>';
		// match prediction
		var match_prediction = entry["team_to_win_match"];
		if (match_prediction == "draw") {
			match_prediction = "Draw";
		}
		html += '<td class="entry_history_match_prediction_cell">';
		html += match_prediction + '</td>';
		// match points won
		var match_points_won = marked_entry["match_points_won"];
		var match_points_won_string;
		if (match_points_won === 0) {
			match_points_won_string = '-';
		} else {
			match_points_won_string = match_points_won.toString();
			match_points_won_string = ensure_float_string_has_two_places(
													match_points_won_string);
		}		
		html += '<td class="entry_history_match_prediction_cell">';
		html += match_points_won_string + '</td>';
		// ++++++++++++++++
		// score prediction
		// ++++++++++++++++
		// get correct score prediction
		var correct_score_prediction = entry["correct_score"];
		// if user predicted away team win, reverse the correct score string
		// before we stick it in the table
		var correct_score_team_prediction = entry["correct_score_team"];
		if ((correct_score_team_prediction == "away")
			&& (correct_score_prediction != 'Other')) {
			var elements = correct_score_prediction.split('-');
			correct_score_prediction = elements[1] + '-' + elements[0];
		}
		// stick the user's predicted correct score in the table
		html += '<td class="entry_history_score_prediction_cell">';
		html += correct_score_prediction + '</td>';
		// correct score points won
		var correct_score_points_won = marked_entry["correct_score_points_won"];
		var correct_score_points_won_string;
		if (correct_score_points_won === 0) {
			correct_score_points_won_string = '-';
		} else {
			correct_score_points_won_string = correct_score_points_won.toString();
			correct_score_points_won_string = ensure_float_string_has_two_places(
												correct_score_points_won_string);
		}
		html += '<td class="entry_history_score_prediction_cell">';
		html += correct_score_points_won_string + '</td>';
		// total points won
		var total_points_won = parseFloat(marked_entry["match_points_won"]);
		total_points_won += parseFloat(marked_entry["correct_score_points_won"]);
		total_points_won = round_to_two_decimal_places(total_points_won);
		var total_points_won_string;
		if (total_points_won === 0) {
			total_points_won_string = '-';
		} else {
			total_points_won_string = total_points_won.toString();
			total_points_won_string = ensure_float_string_has_two_places(
													total_points_won_string);
		}
		html += '<td class="entry_history_total_points_cell">';
		html += total_points_won_string + '</td>';
		// end of line
		html += '</tr>';
	}
	// end of table
	html += '</table>';

	// stick the html for the user history table in the entry_history_table_div
	var entry_history_table_div = gebi("entry_history_table_div");
	entry_history_table_div.innerHTML = html;
	
	return;
}
// =============================================================================
// Work out the epoch datetime for when a fixture took place.
// =============================================================================
function build_epoch_datetime_from_karl_marked_fixture(fixture) {
	
	var d = new Date(
			parseInt(fixture["year"]),
			parseInt(fixture["month"]) - 1,	// adjusted to 0 to 11
			parseInt(fixture["day"]),
			parseInt(fixture["hour"]),
			parseInt(fixture["minute"]),
			0,						// seconds
			0						// milliseconds
						);
	epoch_datetime = d.getTime();
	
	return epoch_datetime;
}
// =============================================================================
// Called when the back button on the entry history screen is clicked.
// =============================================================================
function entry_history_back_button_has_been_clicked() {
	
	// get all the options for the user selection dropdown menu in an array
	var dd_menu = gebi("entry_history_user_selection_dropdown_menu");
	var dd_menu_option_elements = dd_menu.options;
	var dd_menu_option_values = [];
	for (var i = 0; i < dd_menu_option_elements.length; ++i) {
		var option_element = dd_menu_option_elements[i];
		var option_value = option_element.value;
		dd_menu_option_values.push(option_value);
	}
	
	// get the option currently displayed in the user selection dropdown menu
	var current_value = dd_menu.options[dd_menu.selectedIndex].value;
	
	// find out the index of the currently selected option in the dropdown
	// menu and decrement it
	var current_index = dd_menu_option_values.indexOf(current_value);
	--current_index;
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// if the index is now 0 ("Select a user...") or -1 (off the end of
	// the array):
	// 1. set the current index back to the last index in the array
	//    (total users - 1 (???))
	// 2. set the newly selected user in the dropdown menu
	// 3. rebuild the user history table for the user now displayed in the
	//    dropdown menu
	// 4. return
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	if ((current_index == -1) || (current_index === 0)) {
		current_index = dd_menu_option_values.length - 1;
		current_value = dd_menu_option_values[current_index];
		dd_menu.value = current_value;
		rebuild_entry_history_for_single_user();
		return;
	}

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// if we've fallen through, the index is now 1 or greater, so:
	// 1. set the newly selected user in the dropdown menu
	// 2. rebuild the user history table for the user now displayed in the
	//    dropdown menu
	// 3. return
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	current_value = dd_menu_option_values[current_index];
	dd_menu.value = current_value;
	rebuild_entry_history_for_single_user();
	return;
}
// =============================================================================
// Called when the forward button on the entry history screen is clicked.
// =============================================================================
function entry_history_forward_button_has_been_clicked() {
	
	// get all the options for the user selection dropdown menu in an array
	var dd_menu = gebi("entry_history_user_selection_dropdown_menu");
	var dd_menu_option_elements = dd_menu.options;
	var dd_menu_option_values = [];
	for (var i = 0; i < dd_menu_option_elements.length; ++i) {
		var option_element = dd_menu_option_elements[i];
		var option_value = option_element.value;
		dd_menu_option_values.push(option_value);
	}
	
	// get the option currently displayed in the user selection dropdown menu
	var current_value = dd_menu.options[dd_menu.selectedIndex].value;
	
	// find out the index of the currently selected option in the dropdown
	// menu and increment it
	var current_index = dd_menu_option_values.indexOf(current_value);
	++current_index;
	
	// if current index is greater than dd_menu_option_values.length - 1,
	// set it to 1
	if (current_index > dd_menu_option_values.length - 1) {
		current_index = 1;
	}
	
	// set new user in user selection dropdown menu
	current_value = dd_menu_option_values[current_index];
	dd_menu.value = current_value;

	// rebuild entry history table for currently selected user
	rebuild_entry_history_for_single_user();
	
	return;
}
// =============================================================================
// Called when the DATE RANGE VIEW button is pressed at the top of the page.
// =============================================================================
function date_range_view_button_has_been_pressed() {
	
	// build the html for the date range view div
	var html = '<table align="center"><tr><td style="font: 24pt arial;">';
	html += 'DATE RANGE VIEW</td></table>';
	
	// build the html for the start date dropdown menu
	var start_date_dropdown_menu_html = build_date_selection_dropdown_menu(
														'1/6/19', '30/6/20');
	// stick the menu id in the start date dropdown menu
	// {{menu_id_goes_here}}
	start_date_dropdown_menu_html = start_date_dropdown_menu_html.replace(
		'{{menu_id_goes_here}}', 'date_range_view_start_date_dropdown_menu');
	
	// build the html for the end date dropdown menu
	var end_date_dropdown_menu_html = build_date_selection_dropdown_menu(
														'1/6/19', '30/6/20');
	// stick the menu id in the end date dropdown menu
	end_date_dropdown_menu_html = end_date_dropdown_menu_html.replace(
		'{{menu_id_goes_here}}', 'date_range_view_end_date_dropdown_menu');
	
	// build a horizontally centered table containing the start date dropdown menu
	// and the end date dropdown menu
	html += '<table align="center">';
	html += '<tr>';
	html += '<td style="text-align: center;"><strong>START DATE</strong></td>';
	html += '<td></td>';
	html += '<td style="text-align: center;"><strong>END DATE</strong></td>';
	html += '</tr>';

	html += '<tr>';
	html += '<td>' + start_date_dropdown_menu_html + '</td>';
	html += '<td style="width: 50px"></td>';	// spacer cell
	html += '<td>' + end_date_dropdown_menu_html + '</td>';
	html += '</tr>';
	html += '<table>';
	
	// build a horizontally centered table containing:
	//
	// 1. the titles for the two graphs
	//    (TOTAL POINTS PER USER and % OF TOTAL POINTS PER USER)
	// 2. the two graphs
	html += '<table align="center">';
	// row containing graph titles
	html += '<tr>';
	html += '<td style="text-align: center;"><strong>TOTAL POINTS PER USER';
	html += '</strong></td>';
	html += '<td style="width: 10px;"></td>';	// horizontal spacer cell
	html += '<td style="text-align: center;"><strong>% OF TOTAL POINTS PER USER';
	html += '</strong></td>';
	html += '</tr>';
	// row containing two graphs
	html += '<tr>';
	html += '<td><canvas id="user_total_points_bar_chart_canvas" width="400" ';
	html += 'height="250" style="border: 2px solid red; border-radius: 10px;">';
	html += '</canvas></td>';
	html += '<td style="width: 10px;"></td>';	// horizontal spacer cell
	html += '<td><canvas id="user_percentage_points_pie_chart_canvas" ';
	html += 'width="400" height="250" style="border: 2px solid red; ';
	html += 'border-radius: 10px;"></canvas></td>';
	html += '</tr>';
	// spacer row
	html += '<tr><td style="height: 10px;"></td><td></td><td></td></tr>';
	// row containing two tables:
	// 1. total points per user table
	// 2. % of total points per user pie chart
	html += '<tr>';
	html += '<td id="total_points_per_user_table_cell"></td>';
	html += '<td></td>';
	html += '<td id="percentage_of_total_points_per_user_table_cell"></td>';
	html += '</tr>';
	// end of table
	html += '</table>';

	// stick the html in the date range view div
	var date_range_view_div = gebi("date_range_view_div");
	date_range_view_div.innerHTML = html;
	
	// attach onchange eventlistener to the start date dropdown menu
	var start_date_dropdown_menu = gebi(
						"date_range_view_start_date_dropdown_menu");
	start_date_dropdown_menu.addEventListener("change",
						date_range_view_start_date_dropdown_menu_has_changed);
	// attach onchange eventlistener to the end date dropdown menu
	var end_date_dropdown_menu = gebi(
						"date_range_view_end_date_dropdown_menu");
	end_date_dropdown_menu.addEventListener("change",
						date_range_view_end_date_dropdown_menu_has_changed);
	
	// hide all the divs
	hide_all_divs();
	
	// display the date range view div
	hola("date_range_view_div");
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// let's set up an initial date range using the start date dropdown menu
	// and the end date dropdown menu. Let's say:
	// Monday 6th January 2020 to Sunday 12th January 2020
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// set start date dropdown value to Monday 6th January 2020
	var start_dropdown_menu = gebi("date_range_view_start_date_dropdown_menu");
	start_dropdown_menu.value = "1578312000000";
	// set end date dropdown menu value to Sunday 12th January 2020
	var end_dropdown_menu = gebi("date_range_view_end_date_dropdown_menu");
	end_dropdown_menu.value = "1578830400000";
	// rebuild the two graphs to give the user something pretty to look at
	rebuild_date_range_view_information();

	return;
}
// =============================================================================
// Called when the start date dropdown menu on the date range view screen
// changes.
// =============================================================================
function date_range_view_start_date_dropdown_menu_has_changed() {
		
	rebuild_date_range_view_information();

	return;
}
// =============================================================================
// Called when the end date dropdown menu on the date range view screen
// changes.
// =============================================================================
function date_range_view_end_date_dropdown_menu_has_changed() {

	rebuild_date_range_view_information();
	
	return;
}
// =============================================================================
// Rebuild the information in the date range view. This consists of:
// 1. A bar chart displaying how many points each player won over the selected
//    date range (from greatest to least)
// 2. A pie chart displaying what percentage of total points won over the date
//    range belongs to each player.
// 3. A table below the TOTAL POINTS PER USER graph, containing:
//    1. a line stating the total number of points won in the time period
//    2. a table listing each player and the total number of points that player
//       won (these should be listed in order of points won, from greatest to
//       least)
// 4. A table below the % OF TOTAL POINTS PER USER pie chart, listing all the
//    users and the percentage of total poitns won in the time period by each
//    user, from greatest to least.
// =============================================================================
function rebuild_date_range_view_information() {
	
	// get the start epoch datetime
	var start_date_selection_menu = gebi(
								"date_range_view_start_date_dropdown_menu");
	var start_epoch_datetime = parseInt(start_date_selection_menu.value);
	
	// get the end epoch datetime
	var end_date_selection_menu = gebi(
								"date_range_view_end_date_dropdown_menu");
	var end_epoch_datetime = parseInt(end_date_selection_menu.value);
	
	// if the end epoch datetime isn't after the start epoch datetime:
	// 1. alert the user to this
	// 2. return without doing anything else
	if (end_epoch_datetime <= start_epoch_datetime) {
		alert("Please select an END DATE that comes after the START DATE.");
		return;
	}

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// if we've fallen through, we've got an end epoch datetime that comes after
	// the start epoch datetime. Rebuild the two graphs and the information
	// below them.
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	
	// adjust start epoch datetime to 00:01 on the same day
	var start_epoch_datetime = adjust_epoch_datetime_to_time_on_same_day(
												start_epoch_datetime, "00:01");
	
	// adjust end epoch datetime to 23:59 on the same day
	var end_epoch_datetime = adjust_epoch_datetime_to_time_on_same_day(
												end_epoch_datetime, "23:59");
	
	// build an array containing all marked entries (not indexed by username)
	var all_marked_entries = [];
	var entry_keys = Object.keys(marked_entries);
	for (var i = 0; i < entry_keys.length; ++i) {
		var username = entry_keys[i];
		var entries_for_single_user = marked_entries[username];
		for (var j = 0; j < entries_for_single_user.length; ++j) {
			var entry = entries_for_single_user[j];
			all_marked_entries.push(JSON.parse(
									JSON.stringify(entry)
												)
									);
		}
	}

	// find all the marked entries for fixtures that take place between
	// start_epoch_datetime and end_epoch_datetime
	var marked_entries_in_date_range = [];
	for (var i = 0; i < all_marked_entries.length; ++i) {
		marked_entry = all_marked_entries[i];
		// var fixture = indexed_karl_marked_fixtures
		var fixture_id = marked_entry["fixture_id"];
		var fixture = indexed_karl_marked_fixtures[fixture_id];
		// get the epoch datetime for the fixture
		// build_epoch_datetime_from_karl_marked_fixture(fixture)
		var epoch_datetime = build_epoch_datetime_from_karl_marked_fixture(
																		fixture);
		
		// if the epoch datetime for the fixture lies between
		// start_epoch_datetime and end_epoch_datetime, push the marked_entry
		// onto the array marked_entries_in_date_range
		if ((epoch_datetime >= start_epoch_datetime)
				&& (epoch_datetime <= end_epoch_datetime)) {
			marked_entries_in_date_range.push(marked_entry);
		}
	}
	
	// build a list of users with entries in the date range
	var users = [];
	for (var i = 0; i < marked_entries_in_date_range.length; ++i) {
		var marked_entry = marked_entries_in_date_range[i];
		var entry_id = marked_entry["entry_id"];
		var entry = indexed_entries[entry_id];
		var user = entry["username"];
		if (users.indexOf(user) == -1) {
			users.push(user);
		}
	}

	// work out how many points each user won for the fixtures that took place
	// between start_epoch_datetime and end_epoch_datetime
	var users_and_points = {};
	// set initial points for all users to zero
	for (var i = 0; i < users.length; ++i) {
		var username = users[i];
		users_and_points[username] = 0;
	}
	// loop through all marked_entries_in_date_range and add up all the points
	// for all users
	for (var i = 0; i < marked_entries_in_date_range.length; ++i) {
		var marked_entry = marked_entries_in_date_range[i];
		var total_points_from_entry = parseFloat(marked_entry["match_points_won"]);
		total_points_from_entry += parseFloat(
							marked_entry["correct_score_points_won"]);
		// get user
		var entry_id = marked_entry["entry_id"];
		var entry = indexed_entries[entry_id];
		var user = entry["username"];
		// add the points to the users's total in users_and_points
		users_and_points[user] += total_points_from_entry;
	}
	// round the points for all users to 2 decimal places
	for (var i = 0; i < users.length; ++i) {
		var user = users[i];
		users_and_points[user] = round_to_two_decimal_places(
													users_and_points[user]);
	}
	
	// work out the total number of points won in the selected time period
	var total_points_for_all_users = 0;
	for (var i = 0; i < users.length; ++i) {
		var user = users[i];
		total_points_for_all_users += users_and_points[user];
	}
	total_points_for_all_users = round_to_two_decimal_places(
												total_points_for_all_users);
	
	// work out what percentage of total points each user won in the selected
	// time period
	var one_percent_of_total_points = total_points_for_all_users / 100;
	var users_and_percentages = {};
	for (var i = 0; i < users.length; ++i) {
		var user = users[i];
		var user_points = users_and_points[user];
		var user_percentage = user_points / one_percent_of_total_points;
		users_and_percentages[user] = round_to_two_decimal_places(
														user_percentage);
	}

	// build a bar chart displaying total points won by each user
	// (vertical or horizontal?)
	build_total_points_per_user_bar_chart_for_date_range_view(
														users_and_points);
	
	// build the pie chart containing the percentage of total points won in
	// the timed period for each user
	build_percentage_of_total_points_per_user_pie_chart_for_date_range_view(
														users_and_percentages);

	// build the table below the TOTAL POINTS PER USER bar chart, containing a
	// list of users and the total points they won, in order, from greatest
	// number of users to least
	build_total_points_per_user_table(users_and_points);

	// build the table below the % OF TOTAL POINTS PER USER, containing a list
	// of users and the percentage of total points they won, from greatest
	// percentage of total points to least
	build_percentage_of_total_points_per_user_table(users_and_percentages);

	return;
}
// =============================================================================
// Build the horizontal bar chart displaying total points per user in the
// object users_and_points
// =============================================================================
function build_total_points_per_user_bar_chart_for_date_range_view(
															users_and_points) {

	// get all the points values
	var all_points_values = [];
	var users = Object.keys(users_and_points);
	for (var i = 0; i < users.length; ++i) {
		var user = users[i];
		var user_points = users_and_points[user];
		all_points_values.push(user_points);
	}
	
	// sort the points values from greatest to smallest
	all_points_values.sort(function(a, b) {return b - a;});
	
	// build an array of user names in the same order as the points list we've
	// just sorted
	var sorted_users = [];
	// loop through points value
	for (var i = 0; i < all_points_values.length; ++i) {
		var current_points_value = all_points_values[i];
		// loop through users; if we find a user that has the current points
		// value AND that user's name hasn't been pushed onto sorted_users,
		// push the user's name onto sorted users
		for (var j = 0; j < users.length; ++j) {
			var username = users[j];
			var current_user_points_value = users_and_points[username];
			var delta = 0.001;
			if ((Math.abs(current_points_value - current_user_points_value) < delta)
				&& (sorted_users.indexOf(username) == -1)) {
				sorted_users.push(username);
			}
		}
	}
	
	// rebuild sorted users as sorted actual names to use in graph
	var sorted_actual_names = [];
	for (var i = 0; i < sorted_users.length; ++i) {
		var user = sorted_users[i];
		var actual_name = usernames_and_names[user];
		sorted_actual_names.push(actual_name);
	}
	
	// set the global font colour for all fonts in charts to yellow
	Chart.defaults.global.defaultFontColor = "yellow";

	// colours to use for the bars
	var bar_colours_to_use = ["chartreuse", "red", "orange", "aqua"];

	// build an array containing the bar colours
	var bar_colours = [];
	while (bar_colours.length < sorted_users.length) {
		var current_index = bar_colours.length % bar_colours_to_use.length;
		var current_colour = bar_colours_to_use[current_index];
		bar_colours.push(current_colour);
	}

	// format the data for the horizontal bar chart
	var data = {
		"labels"	: sorted_actual_names,
		"datasets"	: [{
			"label"				: "",	// was "Total Points per Player"
			"backgroundColor"	: bar_colours,
			// "barThickness"		: 10,
			"borderColor"		: "yellow",
			"data"				: all_points_values
					}]
				};
	
	// if a total points per player bar chart has been created previously, we
	// need to destroy it before we create a new one
	if (date_range_total_points_per_player_bar_chart != -1) {
		date_range_total_points_per_player_bar_chart.destroy();
	}
	
	// get the canvas for the horizontal bar chart
	var bar_chart_canvas = gebi("user_total_points_bar_chart_canvas");
	var ctx = bar_chart_canvas.getContext("2d");

	// build the bar chart displaying total points per player won in the
	// time period for each user. Store the reference in the global
	// variable date_range_total_points_per_player_bar_chart
	date_range_total_points_per_player_bar_chart = new Chart(ctx, {
									"type"		: "bar",
									"data"		: data,
									"options"	: {}
											});

	return;
}
// =============================================================================
// Build the pie chart containing the percentage of total points won in
// the timed period for each user.
// =============================================================================
function build_percentage_of_total_points_per_user_pie_chart_for_date_range_view(
														users_and_percentages) {

	// get all the percentage values
	var all_percentage_values = [];
	var users = Object.keys(users_and_percentages);
	for (var i = 0; i < users.length; ++i) {
		var user = users[i];
		var user_percentage = users_and_percentages[user];
		all_percentage_values.push(user_percentage);
	}
	
	// sort the percentage values from greatest to smallest
	all_percentage_values.sort(function(a, b) {return b - a;});
	
	// build an array of user names in the same order as the percentage values
	// list we've just sorted
	var sorted_users = [];
	// loop through percentage values
	for (var i = 0; i < all_percentage_values.length; ++i) {
		var current_percentage_value = all_percentage_values[i];
		// loop through users; if we find a user that has the current percentage
		// value AND that user's name hasn't been pushed onto sorted_users,
		// push the user's name onto sorted users
		for (var j = 0; j < users.length; ++j) {
			var username = users[j];
			var current_user_percentage_value = users_and_percentages[username];
			var delta = 0.001;
			if ((Math.abs(current_percentage_value - current_user_percentage_value) < delta)
				&& (sorted_users.indexOf(username) == -1)) {
				sorted_users.push(username);
			}
		}
	}

	// rebuild sorted users as sorted actual names to use in graph
	var sorted_actual_names = [];
	for (var i = 0; i < sorted_users.length; ++i) {
		var user = sorted_users[i];
		var actual_name = usernames_and_names[user];
		sorted_actual_names.push(actual_name);
	}
	
	// set the global font colour for all fonts in charts to yellow
	Chart.defaults.global.defaultFontColor = "yellow";

	// colours to use for the bars
	var bar_colours_to_use = ["chartreuse", "red", "orange", "aqua", "purple",
								"white", "yellow", "black", "grey"];

	// build an array containing the bar colours
	var bar_colours = [];
	while (bar_colours.length < sorted_users.length) {
		var current_index = bar_colours.length % bar_colours_to_use.length;
		var current_colour = bar_colours_to_use[current_index];
		bar_colours.push(current_colour);
	}

	// format the data for the percentage of total points pie chart
	var data = {
		"labels"	: sorted_actual_names,
		"datasets"	: [{
			"label"				: "% Total Points Per Player",
			"backgroundColor"	: bar_colours,
			// "barThickness"		: 10,
			"borderColor"		: "yellow",
			"data"				: all_percentage_values
					}]
				};
	
	// if a percentage of total points per player pie chart has been created
	// previously, we need to destroy it before we create a new one
	if (date_range_percentage_of_total_points_per_player_pie_chart != -1) {
		date_range_percentage_of_total_points_per_player_pie_chart.destroy();
	}

	// get the canvas for the pie chart
	var pie_chart_canvas = gebi("user_percentage_points_pie_chart_canvas");
	var ctx = pie_chart_canvas.getContext("2d");

	// build the pie chart displaying percentage of total points per player
	// won in the time period for each user. Store the reference in the global
	// variable date_range_percentage_of_total_points_per_player_pie_chart
	date_range_percentage_of_total_points_per_player_pie_chart = new Chart(ctx, {
									"type"		: "pie",
									"data"		: data,
									"options"	: {}
											});

	return;
}
// =============================================================================
// Build the table below the TOTAL POINTS PER USER bar chart, containing a
// list of users and the total points they won, in order, from greatest
// number of users to least.
// =============================================================================
function build_total_points_per_user_table(users_and_points) {
	
	// build an array containing all the points values
	var all_points_values = [];
	var users = Object.keys(users_and_points);
	for (var i = 0; i < users.length; ++i) {
		var user = users[i];
		var user_points = users_and_points[user];
		all_points_values.push(user_points);
	}
	
	// sort points values into order, from greatest to latest
	all_points_values.sort(function(a, b) {return b - a;});
	
	// use all_points_values to build an array of users, from most points to
	// least
	var users_in_points_order = [];
	for (var i = 0; i < all_points_values.length; ++i) {
		var current_points_value = all_points_values[i];
		// find all users with the current points value and - if the user
		// hasn't already been added to users_in_points_order, push the user
		// on there
		var delta = 0.001;
		for (var j = 0; j < users.length; ++j) {
			var user = users[j];
			var user_points = users_and_points[user];
			if ((Math.abs(current_points_value - user_points) < delta)
				&& (users_in_points_order.indexOf(user) == -1)) {
				users_in_points_order.push(user);
			}
		}
	}
	
	// build the html for the TOTAL POINTS PER USER table
	var html = '<table align="center" style="border: 2px solid red;';
	html += 'border-radius: 10px; padding: 10px;">';
	html += '<tr><td colspan="3" style="text-align: center;"><strong>';
	html += 'TOTAL POINTS PER USER</strong></td></tr>';
	for (var i = 0; i < users_in_points_order.length; ++i) {
		var user = users_in_points_order[i];
		var actual_name = usernames_and_names[user];
		var user_points = users_and_points[user];
		user_points = user_points.toString();
		user_points = ensure_float_string_has_two_places(user_points);
		// build table row
		html += '<tr>';
		html += '<td style="text-align: right; color: orange;"><strong>';
		html += actual_name + '</strong></td>';
		html += '<td style="width: 5px;"></td>'; // spacer cell
		html += '<td style="text-align: right; color: chartreuse;"><strong>';
		html += user_points + '</strong></td>';
		html += '</tr>';
	}
	html += '</table>';

	// stick the html for the table in the total_points_per_user_table_cell
	var table_cell = gebi("total_points_per_user_table_cell");
	table_cell.innerHTML = html;

	return;
}
// =============================================================================
// Build the table below the % OF TOTAL POINTS PER USER, containing a list
// of users and the percentage of total points they won, from greatest
// percentage of total points to least.
// =============================================================================
function build_percentage_of_total_points_per_user_table(users_and_percentages) {
	
	// build an array containing all the percentage values
	var all_percentage_values = [];
	var users = Object.keys(users_and_percentages);
	for (var i = 0; i < users.length; ++i) {
		var user = users[i];
		var user_percentage = users_and_percentages[user];
		all_percentage_values.push(user_percentage);
	}
	
	// sort percentage values into order, from greatest to latest
	all_percentage_values.sort(function(a, b) {return b - a;});
	
	// use all_percentage_values to build an array of users, from greatest
	// percentage to least
	var users_in_percentage_order = [];
	for (var i = 0; i < all_percentage_values.length; ++i) {
		var current_percentage_value = all_percentage_values[i];
		// find all users with the current percentage value and - if the user
		// hasn't already been added to users_in_percentage_order, push the user
		// on there
		var delta = 0.001;
		for (var j = 0; j < users.length; ++j) {
			var user = users[j];
			var user_percentage = users_and_percentages[user];
			if ((Math.abs(current_percentage_value - user_percentage) < delta)
				&& (users_in_percentage_order.indexOf(user) == -1)) {
				users_in_percentage_order.push(user);
			}
		}
	}

	cl("users in percentage order:");
	cl(users_in_percentage_order);

	// build the html for the % OF TOTAL POINTS PER USER table
	var html = '<table align="center" style="border: 2px solid red;';
	html += 'border-radius: 10px; padding: 10px;">';
	html += '<tr><td colspan="3" style="text-align: center;"><strong>';
	html += '% OF TOTAL POINTS PER USER</strong></td></tr>';
	for (var i = 0; i < users_in_percentage_order.length; ++i) {
		var user = users_in_percentage_order[i];
		var actual_name = usernames_and_names[user];
		var user_percentage = users_and_percentages[user];
		user_percentage = user_percentage.toString();
		user_percentage = ensure_float_string_has_two_places(user_percentage);
		// build table row
		html += '<tr>';
		html += '<td style="text-align: right; color: orange;"><strong>';
		html += actual_name + '</strong></td>';
		html += '<td style="width: 5px;"></td>'; // spacer cell
		html += '<td style="text-align: right; color: chartreuse;"><strong>';
		html += user_percentage + '</strong></td>';
		html += '</tr>';
	}
	html += '</table>';

	// stick the html for the table in the
	// percentage_of_total_points_per_user_table_cell
	var table_cell = gebi("percentage_of_total_points_per_user_table_cell");
	table_cell.innerHTML = html;

	return;
}
// =============================================================================
// Given an epoch datetime and a time string in the format "23:59",
// work out the epoch datetime for that time on the same day and return that
// new epoch datetime.
// =============================================================================
function adjust_epoch_datetime_to_time_on_same_day(
												epoch_datetime, time_string) {
	
	// parse string string into hours and minutes
	var time_string = time_string.trim();
	var elements = time_string.split(':');
	var hour_string = elements[0].trim();
	var hour = parseInt(hour_string);
	var minute_string = elements[1].trim();
	var minute = parseInt(minute_string);
	
	// build new date and set the hour and time
	var d = new Date(epoch_datetime);
	d.setHours(hour);
	d.setMinutes(minute);
		
	// get the new epoch datetime and return it
	var new_epoch_datetime = d.getTime();
	
	return new_epoch_datetime;
}
// =============================================================================
// Helper function for date_range_view_button_has_been_pressed().
// Given a start_date_string and an end_date_string, both in the format
// '23/11/20', build the html for a dropdown menu containing all the dates
// from the start date to the end date (inclusive) and return it.
// ============================================================================
function build_date_selection_dropdown_menu(start_date_string, end_date_string) {

	// parse the start_date_string and work out the epoch datetime for 12 noon
	// on that date
	var start_epoch_datetime = build_epoch_datetime_from_date_string(
														start_date_string);
	
	// parse the end_date_string and work out the epoch datetime for 12 noon
	// on that date
	var end_epoch_datetime = build_epoch_datetime_from_date_string(
														end_date_string);

	// build an array containing all the epoch datetimes for 12 noon on all
	// dates from the start date to the end date
	var epoch_datetimes = [];
	var milliseconds_in_one_day = 1000 * 60 * 60 * 24 * 0.95;
	var current_epoch_datetime = start_epoch_datetime;
	while (current_epoch_datetime < end_epoch_datetime) {
		// build date object from current epoch datetime
		var date_object = new Date(current_epoch_datetime);
		// set time in date object to 12 noon
		date_object.setHours(12);
		date_object.setMinutes(0);
		// get the epoch datetime from the date object
		var date_object_epoch_datetime = date_object.getTime();
		// if the epoch datetime isn't already in the array epoch_datetimes,
		// push it on there
		if (epoch_datetimes.indexOf(date_object_epoch_datetime) == -1) {
			epoch_datetimes.push(date_object_epoch_datetime);
		}
		// move to next day
		current_epoch_datetime += milliseconds_in_one_day;
	}
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++
	// build the html for the date selection dropdown menu
	// +++++++++++++++++++++++++++++++++++++++++++++++++++
	var html = '<select id={{menu_id_goes_here}}>';
	// loop through epoch datetimes and build a selection option for each one
	for (var i = 0; i < epoch_datetimes.length; ++i) {
		var epoch_datetime = epoch_datetimes[i];
		// build a date string in the format 'Monday 23rd March 2020'
		var date_string = build_date_string_from_epoch_datetime(
															epoch_datetime);
		// build the html for the current option in the dropdown menu.
		// It will have the epoch datetime (in string form) for a value and
		// the date string for the text that appears for the option in the
		// dropdown menu
		html += '<option value="' + epoch_datetime + '">' + date_string ;
		html += '</option>';
	}
	// end of dropdown menu
	html += '</select>';

	return html;
}
// ============================================================================
// From a date string in the format '23/11/20' calculate the epoch datetime
// for 12 noon on that date and return it.
// ============================================================================
function build_epoch_datetime_from_date_string(date_string) {

	// parse the date string
	date_string = date_string.trim();
	var elements = date_string.split('/');
	// get day
	var day = parseInt(elements[0].trim());
	// get month
	var month = parseInt(elements[1].trim());
	// get year
	var year_string = elements[2].trim();
	if (year_string.length == 2) {
		year_string = '20' + year_string;
	}
	var year = parseInt(year_string);
	
	// build a new date object for the date
	var d = new Date(
					year,
					month - 1,	// adjust to range of 0 to 11
					day,
					0,			// hour
					0,			// minute
					0,			// seconds
					0			// milliseconds
					);
	// set the date object time to 12 noon
	d.setHours(12);
	d.setMinutes(0);
	// get the epoch datetime from the date object
	var epoch_datetime = d.getTime();

	return epoch_datetime;
}
// ============================================================================
// From an epoch datetime, build a date string in the format
// 'Monday 23rd March 2020' and return it.
// ============================================================================
function build_date_string_from_epoch_datetime(epoch_datetime) {

	// create new Date object from epoch datetime
	var d = new Date(epoch_datetime);
	
	// get day of week
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
				"Saturday"];
	var day_of_week = d.getDay();
	var day_string = days[day_of_week];
	
	// get day of month
	var days_of_month_with_suffixes = [
		"",
		"1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
		"11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th",
		"20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th",
		"29th", "30th", "31st"];
	var day_of_month = d.getDate();
	var day_of_month_with_suffix = days_of_month_with_suffixes[day_of_month];
	
	// get month
	var months = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November",
					"December"];
	var month_index = d.getMonth();
	var month_string = months[month_index];
	
	// get year
	var year = d.getFullYear();
		
	// build date string (e.g. 'Monday 21st January 2020')
	var date_string = day_string + ' ' + day_of_month_with_suffix + ' ';
	date_string += month_string + ' ' + year;

	return date_string;
}
// =============================================================================
// Calculate all the stats for the leaderboard.
// =============================================================================
function calculate_leaderboard_stats() {
	
	// get a list of all the users
	var users = Object.keys(marked_entries);
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// loop through users and calculate the leaderboard stats for each user.
	// For each user, calculate the following stats:
	// 1. username
	// 2. total entries
	// 3. total match results correct
	// 4. total correct scores correct
	// 5. total match points won
	// 6. total correct score points won
	// 7. total points won
	// and build a user stats object in the form:
	// {
	//	"username"							: "Miktor",
	//	"total_entries"						: 234,
	//	"total_match_results_correct"		: 56,
	//	"total_correct_scores_correct"		: 9,
	//	"total_match_points_won"			: 123.65,
	//	"total_correct_score_points_won"	: 34.65
	// }
	// NOTE: total points won doesn't need to be stored in each user stats
	// object, since it is the sum of total_match_points_won and
	// total_correct_score_points_won.
	// Push each user stats object onto the array leaderboard_stats
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var leaderboard_stats = [];
	for (var i = 0; i < users.length; ++i) {
		var user = users[i];
		// get all the resulted entries for the current user
		var marked_entries_for_current_user = marked_entries[user];
		// loop through resulted entries for the current user and calculate
		// all the stats
		var total_entries = marked_entries_for_current_user.length;
		var total_match_results_correct = 0;
		var total_correct_scores_correct = 0;
		var total_match_points_won = 0;
		var total_correct_score_points_won = 0;
		for (var j = 0; j < total_entries; ++j) {
			var marked_entry = marked_entries_for_current_user[j];
			total_match_points_won += parseFloat(marked_entry["match_points_won"]);
			total_correct_score_points_won += parseFloat(
									marked_entry["correct_score_points_won"]);
			if (parseFloat(marked_entry["match_points_won"]) > 0) {
				++total_match_results_correct;
			}
			if (parseFloat(marked_entry["correct_score_points_won"]) > 0) {
				++total_correct_scores_correct;
			}
		}
		// round two figures
		total_correct_score_points_won = round_to_two_decimal_places(
											total_correct_score_points_won);
		total_match_points_won = round_to_two_decimal_places(
											total_match_points_won);
		// build user stats object
		var user_stats_object = {
			"username"							: user,
			"total_entries"						: total_entries,
			"total_match_results_correct"		: total_match_results_correct,
			"total_correct_scores_correct"		: total_correct_scores_correct,
			"total_match_points_won"			: total_match_points_won,
			"total_correct_score_points_won"	: total_correct_score_points_won
								};
		// push user stats object onto the array leaderboard_stats
		leaderboard_stats.push(user_stats_object);
	}
	
	return leaderboard_stats;
}
// =============================================================================
// Round number_to_round to two decimal places, then return it.
// =============================================================================
function round_to_two_decimal_places(number_to_round) {
	
	number_to_round = number_to_round * 100;
	number_to_round = Math.floor(number_to_round);
	var rounded_number = number_to_round / 100;
	
	return rounded_number;
}
// =============================================================================
// Ensure a float string in the format "123.4" has two decimal places.
// =============================================================================
function ensure_float_string_has_two_places(float_string) {
	
	var last_index = float_string.length - 1;
	var dot_index = float_string.indexOf('.');
	if (last_index - dot_index == 1) {
		float_string += '0';
	}

	return float_string;
}
// =============================================================================
