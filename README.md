# vscode-cdecl

An extension to help you make sense of C gibberish, based off of the logic behind the excellent https://cdecl.org/.

## Features

TODO

## Release Notes

### 1.0.0

Initial release. TODO

## Hacking

All of the core logic is based off of a program called `cdecl`, which has existed in one form or another for around 20 years. The version included in this extension is available at [wasabifan/cdecl-blocks-js](https://github.com/WasabiFan/cdecl-blocks-js) which is a lightly-modified fork of [ridiculousfish/cdecl-blocks](https://github.com/ridiculousfish/cdecl-blocks). The modifications included are to enable `cdecl` to be compiled into JavaScript using Emscripten for hosting within the extension. The "binary" cdecl engine is checked into this repo as `out/cdecl.js` and should not be modified manually.

Build and debug tasks will be picked up automatically after opening the repo in VSCode. You will need to run `npm install` once before building.
