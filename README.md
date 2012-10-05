I Like Everything
=================

I Like Everything is a Chrome Extension designed to click all of the Like buttons it encounters on pages that a user is browsing.

It looks like this when it is running in a page:

![Countdown timer overlay.](https://raw.github.com/nuket/ile/master/what-it-does.png)

The purpose of this plugin is to generate noise, possibly making it more difficult to separate the things we do Like from the things we don't. After all, if you Like everything, then really you don't Like anything. As a representation of our interests, Like becomes even more meaningless.

At the moment, the plugin seeks out and clicks Like buttons created using the IFRAME method of embedding them in a page, as described in the Facebook developer documentation here: http://developers.facebook.com/docs/reference/plugins/like/

It does not currently seek out and click Like buttons in a Like Box, as described in the Facebook developer documentation here: http://developers.facebook.com/docs/reference/plugins/like-box/.

Installation
============

Notes
=====

The plugin will currently wait between 5 and 60 seconds before clicking the Like button.

Feature Requests
================

Features that need to be added to the plugin (and for which I would be grateful for Pull Requests) include:

1. Like Box button clicking
2. Instant Like
3. Flip a coin to Like (Random Like)