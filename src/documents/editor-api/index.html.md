---
layout: page
title: Editor API
menuOrder: 4
---
This document describes public API of LiveStyle browser extension that can be used by third-party developers to implement LiveStyle features in text editors.

> Current API is in alpha state and is subject to change in near future. Developers can use [GitHub page](https://github.com/emmetio/livestyle-web/blob/master/src/documents/editor-api/index.html.md) to track any changes in API.

## Requirements

LiveStyle browser extension (**client**) uses Websockets to communicate with editor (**server**) and uses messages in JSON format. All calculations (see [How LiveStyle works](http://livestyle.emmet.io/about/#how-livestyle-works)) are performed in browser extension so editor plugins don’t have to implement them.

In order to implement all LiveStyle features, the editor must be able to:

* create Websockets server and manage all connected clients;
* handle all changes in opened text buffer (e.g. detect changes in opened document on user input).

## Handshaking

**Client** automatically tries to connect to Websockets server using the `ws://127.0.0.1:54000/browser` URL (the port can be changed on extensions‘ Options page). If extension can’t connect to the server with the following URL, it will try to re-connect after 2 seconds.

When connected successfully, **server** receives from connected **client** the following message:

```json
{
	"action": "handshake",
	"data": {
		"id": "chrome",
		"supports": ["css"]
	}
}

```

All messages uses action/data convention: the `action` contains string with action name and `data` key contains object with additional action arguments.

The message above contains the following data keys:

* `id` (`String`): identifier of connected client.
* `supports`: (`Array`): array of syntaxes supported by client. Currently, it contains `css` value only, but in future versions may support additional syntaxes like `less`, `scss` etc.

> Note that `id` key is not a unique client identifier. Some browsers (like WebKit) will open multiple connections with the same `id` (a separate connection for each Web Inspector instance). This key is used for debugging mostly.

For every connected client, **server** must *identify itself* with the following message:

```json
{
	"action": "id",
	"data": {
		"id": "editor_id",
		"title": "Editor name",
		"icon": "data:URL",
		"files": ["/path/to/file1.css", "/path/to/file2.css"]
	}
}
```

Data keys:

* `id` (`String`): arbitrary editor identifier
* `title` (`String`): editor name
* `icon` (`String`): a base64-encoded editor icon, 16×16 pixels.
* `files` (`Array`): a list of unique absolute paths of all currently opened editor files of supported syntax (see `supports` key of `handshake` message).

> Note: for untitled files (e.g. newly created, but not saved) it is recommended to use `<untitled:SOME_ID>` naming scheme (all file names must be unique) although it’s not strictly required.

## Pushing updates

When user changes content of the file, **server** must calculate patch from these changes and dispatch it to all connected clients.

To calculate a patch, **server** should follow this algorithm:

1. Get contents of edited file *before* and *after* actual change.
2. Choose one of the connected **clients** that can calculate a patch for the documents‘ syntax (see `supports` key of `handshake` message).
3. Send the following message to the chosen **client**:

```json
{
	"action": "diff",
	"data": {
		"file": "/path/to/file.css",
		"syntax": "css",
		"source1": "body{padding:1px;}",
		"source2": "body{padding:2px;}"
	}
}
```

Data keys:

* `file` (`<any>`): any identifier that can be used to identify file when calculation is complete.
* `syntax` (`String`): document syntax. Currently, only `css` is supported.
* `source1` (`String`): content of given file *before* actual update was made.
* `source2` (`String`): content of given file *after* it was updated.

The **client** will calculate a difference between two document states and respond with the following socket message:

```json
{
	"action": "diff",
	"data": {
		"file": "/path/to/file.css", 
		"success": true,
		"result": {
			"patches": […],
			"source": "body{padding:2px;}"
		}
	}
}
```

Data keys:

* `file` (`<any>`): a file identifier sent in **server**-initiated `diff` message.
* `success` (`Boolean`): a flag indicating if diff was performed successfully.
* `result` (`Object` or `String`): if `success` key is `false`, contains error message (`String`) describing the reason why diff can’t be performed. Otherwise, contains `Object` with actual patches and last file source (essentially, it’s a `source2` value from **server**-initiated `diff` message).

Authors should keep in mind that diff is performed asynchronously and it might take some time for **client** to respond. During this timeout, a user can change file a few times. 

If updates are made during this timeout, **server** should *batch* any diff messages until **client** responds either with successful or failed message. For example, a **server** can internally mark edited file as “dirty” and send new `diff` message after receiving response from **client** using `result.source` as `source1` value and current file content as `source2`.

--------

When patch is calculated, **server** should send `update` message to all connected clients:

```json
{
	"action": "update",
	"data": {
		"editorFile": "/path/to/file.css",
		"patch": […]
	}
}
```

Data keys:

* `editorFile` (`String`): a full path to editor file (the one was sent in `id` message).
* `patch` (`Array`): array of patches, received in `diff` message.

The `update` message is universal: it is dispatched every time a resource was changed either in browser or editor. Thus, it must be handled by all endpoints except the one that sent this message.

Let’s say you have **clientA** and **clientB** connected to **server**. If **server** initiated `update` message then it must be dispatched to **clientA** and **clientB**. If **clientA** initiated `update` message, it should be handled by **server** and **clientB** (e.g. handled by **server** and then dispatched to all clients except **clientA**).

## Applying updates

When **server** receives `update` message it should apply given `patch` to `editorFile`.

To apply a patch, **server** should follow this algorithm:

1. Choose one of the connected **clients** that can handle current documents‘ syntax (see `supports` key of `handshake` message).
2. Send the following message to the chosen **client**:

```json
{
	"action": "patch",
	"data": {
		"file": "/path/to/file.css",
		"syntax": "css",
		"patches": [...],
		"source": "body{padding:2px;}"
	}
}
```

Data keys:

* `file` (`<any>`): any identifier that can be used to identify file when patching is complete.
* `syntax` (`String`): document syntax. Currently, only `css` is supported.
* `patches` (`Array`): array of patches to apply (received from `update` message).
* `source` (`String`): current file content.

After a patch was applied, **server** will receive the following message:

```json
{
	"action": "patch",
	"data": {
		"file": "/path/to/file.css",
		"success": true,
		"result": {
			"content": "body{padding:2px;}",
			"selection": [1, 2]
		}
	}
}
```

* `file` (`<any>`): a file identifier sent in **server**-initiated `patch` message.
* `success` (`Boolean`): a flag indicating if patching was performed successfully.
* `result` (`Object` or `String`): if `success` key is `false`, contains error message (`String`) describing the reason why patch can’t be applied. Otherwise, contains `Object` with patched file content. The optional `selection` key contains character indexes in `content` that should be selected. Most likely `selection` key will contain indexes of updated property‘s value. Note that the `selection` key may be absent or equal to `null`.

Since patching is performed asynchronously and may take some time, it is possible that **server** will receive more `update` messages during patching. In this case **server** should batch all incoming patches by simply concatenating them and send them all together when current patching is complete.

Sample patch batching code:

```js
var patches = [];

…

// received updates
patches = patches.concat(message.result.patch);

// received more updates
patches = patches.concat(message.result.patch);

// send `patches` when current patching process is complete

```

## Managing files

When user opens or closes file in editor, **server** must send the following message with actual list of available files:

```json
{
	"action": "updateFiles",
	"data": ["/path/to/file1.css", "/path/to/file2.css"]
}
```

The `data` key should contain an array of unique absolute paths of all currently opened editor files of supported syntax (see `supports` key of `handshake` message).

When a file was renamed (for example, user saved a newly created, untitled file), **server** can notify clients with the following message:

```json
{
	"action": "renameFile",
	"data": {
		"oldname": "/path/to/old_name.css",
		"newname": "/path/to/new_name.css"
	}
}
```

## Pushing unsaved changes

A common use case in front-end development is when user has to reload current page to see document changes. In this case, all unsaved changes in CSS will be lost.

To solve the issue, **client** sends the following message on each page load event:

```json
{
	"action": "requestUnsavedFiles",
	"data": {
		"files": ["/path/to/file1.css", "/path/to/file2.css", "<untitled:1>"]
	}
}
```

The `files` key contains a list of editor files, *associated* with browser ones. These are absolute paths, sent in `id` or `updateFiles` messages.

When **server** receives this message, it should create a payload of *actually modified files* with their pristine and current content. For untitled files, a pristine content should be an empty string. 

Send payload to **client** that initiated `requestUnsavedFiles` request as follows:

```json
{
	"action": "unsavedFiles",
	"data": {
		"files": [
			{
				"file": "/path/to/file1.css",
				"pristine": "body{padding:1px;}",
				"content": "body{padding:2px;}"
			},
			{
				"file": "<untitled:1>",
				"pristine": "",
				"content": "p{margin:10px;}"
			}
		]
	}
}
```

After receiving this message, **client** will calculate patches and silently apply them to associated browser files.

> Note that user can disable this feature in LiveStyle preferences. In this case, `requestUnsavedFiles` message won’t be sent.
