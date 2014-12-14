---
layout: page
title: LiveStyle Alpha
menuHidden: true
---
This is a new LiveStyle 0.9 public alpha release.

## Highlights

* **LESS and SCSS support**. This release supports bi-directional editing of LESS and SCSS (not SASS). LiveStyle uses its own preprocessor implementations (there are many reasons to not use official parsers and sourcemaps) so things may not work as expected and some features are missing. Please report about missing preprocessor features you *really* use [here](https://github.com/livestyle/issues/issues).
* **Generic browser client**. Now you can add a small JS library into your page and get live updates from editor and DevTools delivered to all connected browsers.
* **New UI**. You don’t have to open DevTools anymore, simply enable LiveStyle from browser action icon.
* Entire LiveStyle codebase was rewritten from scratch: many bugs are gone, new bugs introduced :)
* Most components of LiveStyle (except core that does all the magic) are open-source and available here: https://github.com/livestyle

## Installation

### Google Chrome Extension

* Download [LiveStyle 0.9 Alpha](http://download.emmet.io/livestyle-alpha.crx)
* In Chrome, go to Preferences > Extensions.
* Drag’n’drop downloaded `livestyle-alpha.crx` file into Extensions page.

### Sublime Text extension

Current plugin was tested in Sublime Text 3 and may not work in Sublime Text 2.

* In Sublime Text, pick Preference > Browse Packages... menu item to open `Packages` folder.
* Create `LiveStyle` folder in it
* [Download package ZIP](https://github.com/livestyle/sublime-text/archive/master.zip) and extract its *contents* into a newly created `LiveStyle` folder.
* Restart Sublime Text.

You can also checkout [git repo](https://github.com/livestyle/sublime-text) to get automatic updates if your have Package Control installed.


## LESS and SCSS support

LiveStyle uses its own LESS and SCSS parsers in order to provide fast and precise bi-directional updates, unavailable in official preprocessors and sourcemaps. Built-in preprocessors has the following differences:

* *Missing variables and mixins are legal*. Unlike official preprocessors, LiveStyle won’t break if it can’t find variable or mixin. For example, if you try to compile [dropdowns.less](https://github.com/twbs/bootstrap/blob/master/less/dropdowns.less) file of Bootstrap with official LESS preprocessor, you’ll receive error telling that some variables are missing. That’s because Bootstrap assumes you have to compile [bootstrap.less](https://github.com/twbs/bootstrap/blob/master/less/bootstrap.less) that adds all required variables and mixins into a scope. In LiveStyle it’s perfectly valid to edit such files: you’ll get updates for rules and properties that doesn’t use external variables/mixins. To add external variables and mixins, simply `@import` them or add as global dependencies (see below).
* *Not all features are supported*. I’ve been working hard to make LiveStyle pass official LESS and SCSS unit tests but some features may be missing or work incorrectly. If you found an issue with invalid or missing preprocessor feature, please report it [here](https://github.com/livestyle/issues/issues).

### Adding global dependencies for preprocessors

As noted above, you can edit stylesheets that assume—when compiled—that some variables and mixins will be `@import`’ed elsewhere. In order to add those variables into current stylesheet, you can either `@import` containg stylesheet or *add stylesheets as global dependencies*: in this case *any stylesheet* you’re editing will have access to variables and mixins defined in dependencies.

To add stylesheets as global dependencies, you have to edit [Project file](http://www.sublimetext.com/docs/3/projects.html) in Sublime Text and add `globals` array into `livestyle` section, containing references to stylesheets, like so:

```
{
	...
	"livestyle": {
		"globals": ["./less/variables.less", "/path/to/global/mixins.less"]
	}
}
```

### “Safe patching” mode

LiveStyle uses a so-called “Safe Patching” mode in order to apply changes to preprocessor stylesheet coming from broswer. 

Let’s consider the following example. You may have the following LESS stylesheet:

```
@a: 100px;
@b: 50px;
div {
	width: @a;
}
```

...which compiles into

```
div {
	width: 100px;
}
```

Now, when you set `width` property to `50px` in DevTools, how the original LESS stylesheet should be updated? Possible values are:

* `width: 50px;`
* `@a: 50px;`
* `width: @b;`
* `width: @a / 2;`
* `width: @a - @b;`
* ...millions of other valid combinations.

Of course, the simplest solution for LiveStyle would be to replace preprocessor value with updated one, e.g. `width: 50px;`. But this is also the most dangerous way to update original stylesheet because *you will loose variable reference*.

LiveStyle tries to be smart and apply the safest patch: it simply adds or removes difference between previous and current value. In other words, it will update your LESS file to `width: @a - 50;`: it still keeps reference to `@a` and it’s easier for you as stylesheet author to spot these changes later and update stylesheet as required. The “safe patching” works for numbers and colors.

## Generic browser client

LiveStyle features generic browser client that you can add to your web-page, open it in any modern browser and get live updates delivered to this browser. For example, you can edit stylesheet in editor and Chrome DevTools and see how page is updated live in all opened browsers.

To enable live updates for other browsers, simply add the following script into your web-page:

```
<script src="http://<your ip>:54000/livestyle-client.js"></script>
```

`<your ip>` is your local machine IP address: it can be `127.0.0.1` if you’re opening browsers on the same machine or your local network IP you’re opening page on virtual machines or mobile devices. Contact your network administrator about how to get your local network IP.

The only browser requirement is WebSocket support, which is available in IE > 10 and all current Chrome, Firefox, Opera and mobile browsers.

> Note that generic browser client only applies changes coming from editor and Chrome DevTools, it won’t detect changes from other browser’s developer tools.

## Error reporting

During alpha, LiveStyle does excessive logging of debug data. To get access to this debug data do the following:

* In Chrome, go to Preferences > Extensions.
* Check “Developer mode” in upper right corner.
* Find LiveStyle in extensions list and click on `background.html` link to open DevTools.
* In opened DevTools window, open Console tab to see debug log.

Please attach this log (don’t forget to expand some log entries) with your [issue report](https://github.com/livestyle/issues/issues) when something goes wrong.

Also, LiveStyle logs some errors and warnings that belong to stylesheets you’re editing. If something wrong happens with your stylesheet, the LiveStyle icon will glow red for a few seconds and you’ll see “Show Error log” link in LiveStyle popup: you can use this log to fix errors in your stylesheets.