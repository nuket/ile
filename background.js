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

//
// Allows the injected code to access setting stored in localStorage.
//
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.method == "getLocalStorage")
		sendResponse( {
			data: localStorage[request.key]
		});
	else
		sendResponse({}); // Ignore.
});

//
// Set the plugin to be enabled on the first run after installation.
//
if (!(localStorage['firstRunDone'] == 'true')) {
	localStorage['pluginEnabled'] = 'true';
	localStorage['firstRunDone']  = 'true';
}

//
// We need a way to check if the user is logged in or not w/o using the 
// Facebook Javascript API.
//
// There's some info here about the cookie values:
// http://dragon.ak.fbcdn.net/cfs-ak-snc6/84992/979/395701387118444_1090193793.pdf
//
// It looks like the following cookies are only set when a user is logged in:
// c_user, presence, sub, p
// 
// We watch the .facebook.com cookie to see if it ever changes state, and if so, 
// if c_user comes or goes, then we know the user has logged in or out.
//
function checkFacebookLoginState() {
	chrome.cookies.getAll({}, function(cookies) {
		var isLoggedIn = 0;
		
		for (var i in cookies) {
			// console.log(cookies[i]);
			switch (cookies[i].name) {
			case 'c_user':
			case 'presence':
			case 'sub':
			case 'p':
				isLoggedIn++;
				break;
			}
		};
		
		// Now if we think the user's logged in, set the localStorage flag accordingly.
		if (isLoggedIn) {
			localStorage['isLoggedIn'] = 'true';
		} else {
			localStorage['isLoggedIn'] = 'false';
		}
	});	
}

//
// Run this at least once when starting the plugin.
//
checkFacebookLoginState();

//
// Register an onChanged handler for all *.facebook.com cookies.
//
chrome.cookies.onChanged.addListener(function(changeInfo) {
	checkFacebookLoginState();
});