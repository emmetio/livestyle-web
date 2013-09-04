---
layout: page
title: Changelog
menuOrder: 5
---
## LiveStyle Milestone 1
<div class="release-date">September 5, 2013</div>

* **Public [Editor API](/editor-api/): authors can add support for new editors.**
* Sublime Text plugin doesn’t depends on LiveStyle JS core (and PyV8 as well) and works via [Editor API](/editor-api/). As a result: no more editor blocking on large CSS files and easier installation.
* The updated CSS property in DevTools is highlighted in Sublime Text.
* All unsaved changes in CSS files in Sublime Text are automatically applied in DevTools on page reload. This feature can be disabled in Chrome extension options.
* Better file associations hinting: associations saved for one page are automatically substituted for all pages of the same domain.
* Chrome Canary support.
* Better error reporting, especially for invalid CSS files.
* Many bug fixes and improvements.
