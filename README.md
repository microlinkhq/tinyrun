<div align="center">
  <img src="https://github.com/microlinkhq/cdn/raw/master/dist/logo/banner.png#gh-light-mode-only" alt="microlink cdn">
  <img src="https://github.com/microlinkhq/cdn/raw/master/dist/logo/banner-dark.png#gh-dark-mode-only" alt="microlink cdn">
  <br>
  <br>
</div>

![Last version](https://img.shields.io/github/tag/microlinkhq/tinyrun.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/microlinkhq/tinyrun.svg?style=flat-square)](https://coveralls.io/github/microlinkhq/tinyrun)
[![NPM Status](https://img.shields.io/npm/dm/tinyrun.svg?style=flat-square)](https://www.npmjs.org/package/tinyrun)

**tinyrun** executes multiple commands in parallel with minimal footprint (~2KB).

It can run one-off commands:

```
tinyrun "pnpm build" "pnpm build:docs"
```

or commands that keep running in background:

```
tinyrun --names "HTTP" "node examples/server.js"

HTTP started pid=13030
HTTP Server is listening on port 3000
c^CHTTP Received shutdown signal, shutting down gracefully...
HTTP Closed out remaining connections
HTTP cmd='node examples/server.js' exitCode=0 signalCode=null duration=2s
```

## Install

```bash
$ npm install tinyrun --global
```

## Usage

### as CLI

Just `tinyrun --help` to see all the options availables.

### as module

Check [how CLI is implemented](/bin/index.js) to see how it's interacting with the core module.

## Related

- [tinyspawn](https://github.com/Kikobeats/tinyspawn) – A minimalistic wrapper around Node.js `child_process.spawn` API.

## License

**tinyrun** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/microlinkhq/tinyrun/blob/master/LICENSE.md) License.<br>
Inspired by [Stanko Tadić](https://muffinman.io/blog/node-script-to-run-multiple-commands-in-parallel/). Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/microlinkhq/tinyrun/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/kikobeats) · Twitter [@kikobeats](https://twitter.com/kikobeats)
