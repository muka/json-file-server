# json-file-server

Serve files over http, additionally serving the listing of directories as json

## Running

`PORT=8080 BASE_PATH=~/ node index.js`

## Usage example

List files

`curl http://localhost:3002/`

```js
[ { size: 241, type: 'file', name: '.eslintrc.yml' },
  { size: 4096, type: 'dir', name: '.git' },
  { size: 13, type: 'file', name: '.gitignore' },
  { size: 1067, type: 'file', name: 'LICENSE' },
  { size: 18, type: 'file', name: 'README.md' },
  { size: 2132, type: 'file', name: 'index.js' },
  { size: 4096, type: 'dir', name: 'node_modules' },
  { size: 14770, type: 'file', name: 'package-lock.json' },
  { size: 313, type: 'file', name: 'package.json' } ]
```

Download file

`curl http://localhost:3002/README.md `

## Configuration

- `PORT` to listen
- `BASE_PATH` to serve from
