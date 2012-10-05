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
 * Runs a submit call on the detected Like buttons.
 * 
 * http://stackoverflow.com/questions/9915311/chrome-extension-code-vs-content-scripts-vs-injected-scripts?rq=1
 * http://stackoverflow.com/questions/9602022/chrome-extension-retrieving-gmails-original-message
 * http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script/9517879#9517879
 * http://stackoverflow.com/questions/9263671/google-chome-application-shortcut-how-to-auto-load-javascript/9310273#9310273
 * http://userscripts.org/scripts/review/112070#root_footer
 */

var DEBUG = true;

// If we're not debugging anymore, turn off the console logging.
if (!DEBUG) {
	var console = {};
	console.log = function(){};
}

console.log('Running "I Like Everything" in the webpage execution context.');

// Keeps a strong reference to the overlay objects, and the timeout values.
var overlayTable = [];

//
// Goes through the overlayTable and processes each entry in turn, updating
// the timeout text until it is time to remove the overlay.
//
function timerCallback() {
	var i;
	var overlayEntry;
	
	for (i = 0; i < overlayTable.length; ++i) {
		overlayEntry = overlayTable[i];
		if (overlayEntry.timeout) {
			overlayEntry.overlay.innerHTML = overlayEntry.timeout;
			overlayEntry.timeout--;
		} else {
			clearInterval(overlayEntry.timerId);
			overlayEntry.overlay.parentNode.removeChild(overlayEntry.overlay);
			overlayTable.shift();
			
			// After changing the length of the array, must restart for().
			i = 0;
		}
	}
}

//
// Creates an overlay DIV that is positioned z-axis above and aligned at the top/left 
// to the Like button's form element.
// 
// This overlay DIV counts down the seconds until the Like is fired.
//
function createTimeoutOverlay(formElement, timeout) {
	var timeoutOverlay = document.createElement('div');

	formElement.setAttribute("style", "position: relative;");
	formElement.appendChild(timeoutOverlay);

	var style = "position: absolute; top: 0; left: 0; font-weight: bold; text-align: center; color: white; background-color: red; opacity: .75; z-index: 1000;";
	style += ("width: "       + formElement.clientWidth  + "px; ");
	style += ("height: "      + formElement.clientHeight + "px; ");
	style += ("line-height: " + formElement.clientHeight + "px; ");

	timeoutOverlay.setAttribute("style", style);
	
	// Now create the countdown timer entry, push it into the array 
	// before running setInterval.
	var overlayEntry = {};
	overlayTable.push(overlayEntry);
	overlayEntry.overlay = timeoutOverlay;
	overlayEntry.timeout = Math.floor(timeout / 1000); 
	overlayEntry.timerId = setInterval(timerCallback, 1000);
}

//
// Sets up the actions necessary to trigger a Like click and keep the 
// user informed about when that will happen.
//
function triggerLikeClick(data) {
	var i;
	var formElement;
	
	var likeFormIds = data;
	// console.log(likeFormIds);
	
	for (i = 0; i < likeFormIds.length; ++i) {
		// Find the form element.
		formElement = document.getElementById(likeFormIds);
		// console.log(formElement);
		
		// Submit the form after a random delay from [5 .. 60) seconds.
		var timeout = ((Math.random() * 55) + 5) * 1000;
		console.log('Submitting Like on form ' + formElement.id + ' in ' + timeout + ' milliseconds.');
		
		// This creates an informational overlay, e.g. how many seconds until the Like happens.
		createTimeoutOverlay(formElement, timeout);
		
		// This sets up a timer in parallel to actually fire the Like about 250ms 
		// after the overlay disappears.
		setTimeout(function(){ var E = formElement; E.submit(); }, timeout + 250);
	}
};
