/*
 * Copyright (C) 2012 Max Vilimpoc
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
 * Loaded for every matched page.
 * 
 * Performs the following actions:
 * 
 * 1. Highlights Like buttons with a red 2px border.
 * 2. Injects a script into the running page to click those Likes. 
 * 
 * References:
 * 
 * http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script/9517879#9517879
 * http://stackoverflow.com/questions/9263671/google-chome-application-shortcut-how-to-auto-load-javascript/9310273#9310273
 * http://stackoverflow.com/questions/10527625/google-chrome-extension-script-injections/10529675#10529675
 * http://stackoverflow.com/questions/8982312/how-to-disable-facebook-hotkeys-with-chrome-extension/8994454#8994454
 *
 *
 * There are three types of Like buttons I've seen in the wild so far:
 * 
 * 1. Embedded in a form, inside of a div with class "pluginConnectButton".
 *    Example: http://www.usmagazine.com/
 * 2. One inside of a span with class "PageLikeButton".
 *    Example: http://www.facebook.com/fordfiesta
 * 3. One used in the fbTimelineFeedbackHeader system, which is the "Like Comment Share" bar.
 *    Example: http://www.facebook.com/UsWeekly
 * 
 * <span class="PageLikeButton"><label class="uiButton uiButtonOverlay uiButtonLarge" id="timelineHeadlineLikeButton" for="uiossfq39"><i class="mrs img sp_4gjg43 sx_22fe7e"></i><input value="Like" data-profileid="20531511510" type="submit" id="uiossfq39"></label><label class="PageLikedButton uiHoverButton hidden_elem uiButton uiButtonOverlay uiButtonLarge" id="uiossfq40" for="uiossfq42"><i class="mrs img sp_1jdzvo sx_ae9636"></i><input value="Liked" data-profileid="20531511510" type="submit" id="uiossfq42"></label></span>
 * <input value="Like" data-profileid="20531511510" type="submit" id="uiossfq39">
 */

var DEBUG = true;

// If we're not debugging anymore, turn off the console logging.
if (!DEBUG) {
	var console = {};
	console.log = function(){};
}

var runEverything = function() {
	console.log('Running "I Like Everything" in the content script execution context.');

	// Highlight the Like buttons.
	// $('.pluginConnectButton').css("border", "2px solid red");

	// Used to pass form element IDs to the injected script.
	var likeFormIds = [];

	// Gather up the form element IDs.
	$.each($('.pluginConnectButton'), function(index, item) {
		// console.log(item);
		
		var likeForm = $(item).parent()[0];
		// console.log(likeForm);
		// console.log(likeForm.id);
		
		// Detect which items have not yet been Liked.
		// Those which have use a form action attribute set to /plugins/like/disconnect.
		if (-1 != $(likeForm).attr('action').search(/\/plugins\/like\/connect/)) {
			likeFormIds.push(likeForm.id);
		}
	});

	// If and only if there are Like buttons, AND 
	// once all of the Like form element IDs have been gathered,
	// inject code into the running webpage's execution context.

	if (likeFormIds.length) {
		var inject = document.createElement('script');
		inject.src = chrome.extension.getURL("inject.js") + "?" + (new Date().getTime()); // disable caching.
		inject.onload = function() {
			// Callback soup time.
			
			// When the injection is complete, pass the list of form element IDs
			// to the triggerLikeClick() function in the injected script.
			var trigger = document.createElement('script');
			trigger.text = "triggerLikeClick(" + JSON.stringify(likeFormIds) + ");";
			(document.head || document.documentElement).appendChild(trigger);

			this.parentNode.removeChild(this);
		};
		(document.head || document.documentElement).appendChild(inject);
	}
};

// Fetch the plugin-enabled setting from local storage. 
//
// Since the execution contexts are different, we have to send a request
// to the background.js page to fetch data from the Extension's localStorage.

chrome.extension.sendRequest({method: "getLocalStorage", key: "pluginEnabled"}, function(response) {
	// console.log("I Like Everything plugin enabled: " + (response.data ? response.data : "false"));
	if (response.data == 'true') {
		chrome.extension.sendRequest({method: "getLocalStorage", key: "isLoggedIn"}, function(response) {
			if (response.data == 'true') {
				runEverything();
			}
		});
	}
});
