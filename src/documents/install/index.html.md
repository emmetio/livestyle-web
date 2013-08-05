---
layout: page
title: Install
menuOrder: 2
---
Currently, LiveStyle works as a plugin for Google Chrome, Safari and Sublime Text.

## Sublime Text extension

You can install directly from Package Control.

1. Install [Package Control](http://wbond.net/sublime_packages/package_control/installation) first.
2. When installed, open Command Palette in ST editor and pick `Package Control: Install Package` command.
3. Find and install `LiveStyle` extension.

When installed, LiveStyle will automatically download require PyV8 extension. If you experience issues with automatic PyV8 installation, try to [install it manually](https://github.com/emmetio/pyv8-binaries#manual-installation).

*NB: if you have Emmet or TernJS extensions installed, make sure you have the most recent versions since they contain updates vital for LiveStyle extension.*

## Google Chrome extension

You can install LiveStyle directly from [Chrome Webstore](https://chrome.google.com/webstore/detail/diebikgmpmeppiilkaijjbdgciafajmg). When installed, you should see **LiveStyle** panel in DevTools:

![Chrome extension](/i/chrome-ext.png)

## Safari extension

Unfortunately, Safari doesn’t provide API to extend Web Inspector so you have to *hack it*. The LiveStyle extension is developed for latest Webkit Nightly and upcoming OS X Mavericks’ Safari.

First, you have to download latest [WebKit Nightly](http://nightly.webkit.org) and install it. Now you have two options to install extension: using automatic installer, available in Sublime Text extension and manual installation.

### Automatic installation via Sublime Text

In Sublime Text (with LiveStyle extension installed, of course), pick `Tools > Install LiveStyle for WebKit extension` menu item or  run `LiveStyle: Install WebKit extension` command from Command Palette.

If WebKit extension was installed correctly, you’ll see message asking you to restart WebKit. If it fails, try to use manual installation.

### Manual installation

1. Go to `/Applications/WebKit.app/Contents/Frameworks/<YOUR OSX VERSION>/WebInspectorUI.framework/Resources` folder, substitute `<YOUR OSX VERSION>` with your actual OSX version, e.g. `10.8`. You can get there by right-clicking on WebKit app and picking `Show Package Contents` menu item.
2. Download [LiveStyle extension](http://download.emmet.io/livestyle/livestyle-webkit.zip) and unpack its contents into `livestyle` (this name is important) subfolder of your current folder, e.g. `WebInspectorUI.framework/Resources`.
3. Open Web Inspectors’ `Main.html` file in text editor.
4. At the bottom of the `<head>` section, right before `WebInspector.loaded();` script, attach LiveStyle extension: `<script src="livestyle/livestyle.js"></script>`.
5. Restart WebKit and open Web Inspector.

----------

If everything installed correctly, you should see Emmet icon on the toolbar:

![WebKit extension](/i/webkit-ext.png)

Note that due to a hacky nature of this extension and fast WebKit Nightly update cycle (updated every day) it can break any time. If you’re happy with current WebKit Nightly build, I recommend you to skip all WebKit updates. Otherwise, you have to repeat all installation steps after each update.

----------

Learn [how to use](/usage/) LiveStyle.