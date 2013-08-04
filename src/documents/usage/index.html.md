---
layout: page
title: How to use
menuOrder: 3
---
To start live CSS edit, simply follow these easy steps:

1. Start Sublime Text and open CSS file or create new one.
2. Start Chrome browser and go to the page you with to edit.
3. Open DevTools, go to *LiveStyle* panel and check `Enable LiveStyle for current page` option.
4. When enabled, you’ll see a list of page’s external stylesheets on the left and list of editor files on the right. Simply pick editor file that should be associated with browser one and you are done!

Note that editors’ files list is updated automatically every time you create, open or close files in editor.

**Important: you must keep DevTools opened during live edit session and for every window (in multi-view mode). You don’t have to be on LiveStyle panel all the time but DevTools must remain opened. Otherwise, incoming updates won’t be applied.** 

## Workflows

The LiveStyle source patching concept introduces a number of new workflows that you can use in web-site development.

### Simple mode

It’s a basic one-to-one live edit mode: simply associate any external CSS file in browser with editor one and start editing. All your editor changes will be automatically reflected in browser and your DevTools updates will be reflected in editor.

If your browser file is large enough, your editor updates might take some time to apply. If you want to speed things up or you don’t have external stylesheets on your, you can create a new stylesheet by pressing `Add file` button and use it for live update.

### Multi-view mode

Multi-view mode is ideal for tweaking responsive design. Open multiple windows of the same page and resize them for your RWD breakpoints. **DevTools must be opened for each window**, otherwise it won’t apply any updates. 

In multi-view mode:

* All editor updates will be applied to all windows.
* All DevTools updates will be applied to editor and all other windows with the same page.
* All LiveStyle panel updates (like file associations) will be automatically applied to all other windows with the same page.

### Multi-site mode

This mode is useful if your web project has different versions of desktop and mobile web-sites but shares the same CSS code base.

As in *Multi-view mode*, open a few windows with your web-sites versions and in LiveStyle panel associate your browser CSS files with *the same editor file*. LiveStyle will use editor file as a reference to patch your browser files with incoming updates, even from DevTools.

### Designer mode

*This is an experimental mode and is subject to change.*

This mode is for designers that work on large projects and don’t have direct access to CSS source. 

Imagine you’re such a designer and spotted an error in your production web-site. Instead of asking a developer to spend some time with you to fix these issues, you can fix them by yourself and send developer a patch so he can apply it later to original source.

All LiveStyle updates are recorded into “Patch history”, available in LiveStyle DevTools panel. A new patch history entry is created automatically every time you open/refresh web page. Click on “Patch history” popup entry to apply recorded patches, click on red icon on the right to download it.  

So, all you have to do is to tweak layout in DevTools and download the most recent patch history entry. You can send downloaded patch to developer so he can apply it to original CSS source.

Note that in this mode *you don’t need Sublime Text extension at all*, you just need DevTools extension.

### iOS Safari/web apps tweaking

You can use LiveStyle to tweak CSS in your web/PhoneGap/Titanium apps. LiveStyle integrates directly into Web Inspector so you just need to open it for your app/web-site running on iOS simulator or real device and use as described above.

Note that you can use Safari Web Inspector together with Chrome in *multi-site mode*.