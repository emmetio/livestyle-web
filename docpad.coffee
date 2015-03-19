path = require 'path'
safeps = require 'safeps'

docpadConfig = {
	gulpArgs: ['html']
	templateData:
		site:
			author: "Sergey Chikuyonok"
			name: "Emmet LiveStyle"

	environments:
		production:
			gulpArgs: ['full', '--production']

	events:
		# Extend server so it can respond to cache-reset assets
		serverAfter: ({server}) ->
			reCache = /^\/-\/.+?\//
			server.get reCache, (req, res, next) ->
				req.url = req.url.replace reCache, '/'
				next()

			server.get /^\/blog\/([\w\-]+)\/?$/, (req, res, next) ->
				req.url = req.url.replace(/\/$/, '') + '.html'
				next()

		writeAfter: (opts, next) ->
			config = @docpad.getConfig()
			rootPath = config.rootPath
			gulpPath = path.join(rootPath, 'node_modules', '.bin', 'gulp')
			command = [gulpPath].concat(config.gulpArgs or [])

			safeps.spawn(command, {cwd: rootPath, output: true}, next)
			@

		# Supply headers with named anchors
		renderDocument: (opts) ->
			{extension,file} = opts

			if file.type is 'document' and extension is 'html'
				opts.content = opts.content.replace /<(h\d)>(.+?)<\/\1>/g, (str, name, header) ->
					if /<a\s+[^>]*name="/.test(header)
						return str

					# strip tags
					# console.log header
					anchor = header.replace /<\/?\w+(?:\s.+?)*>/g, '';
					anchor = anchor
						.trim()
						.replace(/\s+/g, '-')
						.replace(/[^\w\-]/g, '')
						.toLowerCase()

					"<#{name}><a name=\"#{anchor}\" href=\"\##{anchor}\" class=\"anchor\"></a>#{header}</#{name}>"
}

module.exports = docpadConfig