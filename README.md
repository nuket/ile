I Like Everything
=================

I Like Everything is a Google Chrome Extension designed to click all of the Like buttons it encounters on pages that a user is browsing.

It looks like this when it is running in a page:

![Countdown timer overlay.](https://raw.github.com/nuket/ile/master/what-it-does.png)

The plugin will currently wait between 5 and 60 seconds before clicking the Like button, this is what the red overlay text in the image will indicate, while also counting the seconds down.

The purpose of this plugin is to generate noise, possibly making it more difficult to separate the things we do Like from the things we don't. After all, if you Like everything, then really you don't Like anything. As a representation of one's interests, Like becomes even more meaningless.

At the moment, the plugin seeks out and clicks Like buttons created using the IFRAME method of embedding them in a page, as described in the Facebook developer documentation here: http://developers.facebook.com/docs/reference/plugins/like/

It does not currently seek out and click Like buttons in a Like Box, as described in the Facebook developer documentation here: http://developers.facebook.com/docs/reference/plugins/like-box/.

Installation
============

1. Grab https://github.com/nuket/ile/zipball/master
2. Unpack it anywhere on your disk.
3. In Google Chrome, open up chrome://extensions
4. Click the 'Load unpacked extension...' button.
5. Navigate to and select the folder containing the unpacked extension files on your disk.

The following things should show up in Google Chrome:

**Extension Information**

![Loaded extension info in chrome://extensions](https://raw.github.com/nuket/ile/master/loaded-extension-1.png)

**Browser Action Icon**

![Browser action Icon, for the extension](https://raw.github.com/nuket/ile/master/loaded-extension-2.png)

Feature Requests
================

Features that need to be added to the plugin (and for which I would be grateful for Pull Requests if I don't get to it first) include:

1. Like Box button clicking
2. Instant Like
3. Flip a coin to Like (Random Like)