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

var enablePluginCheckbox = document.getElementById('enablePluginCheckbox');
var enablePluginText     = document.getElementById('enablePluginText');

if (localStorage['pluginEnabled']) {
	enablePluginCheckbox.checked = true;
}

if (localStorage['isLoggedIn'] == 'true') {
	document.getElementById('mustLogin').setAttribute("style", "display: none;");
	document.getElementById('alreadyLoggedIn').setAttribute("style", "display: block;");
} else {
	document.getElementById('mustLogin').setAttribute("style", "display: block;");
	document.getElementById('alreadyLoggedIn').setAttribute("style", "display: none;");
}

function updateDisplay() {
	if (enablePluginCheckbox.checked == true) {
		console.log('Enabling "I Like Everything".');
		localStorage['pluginEnabled'] = 'true';
	} else {
		console.log('Disabling "I Like Everything".');
		delete localStorage['pluginEnabled'];
	}
}

enablePluginCheckbox.onclick = function() {
	updateDisplay();
};

enablePluginText.onclick = function() {
	enablePluginCheckbox.checked = !enablePluginCheckbox.checked;
	updateDisplay();
};
