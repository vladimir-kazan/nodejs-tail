# nodejs-tail

Shortest NodeJs implementation of tail command without dependencies.
## Install

```js
yarn add nodejs-tail
```

## How to use

```js
const Tail = require('nodejs-tail');

const filename = 'some.log';
const watcher = new Tail(filename);

watcher.on('line', (line) => {
  process.stdout.write(line);
})

watcher.on('close', () => {
  console.log('watching stopped');
})

watcher.watch();

setTimeout(() => {
  watcher.close();
}, 3000);
```


MIT License. Copyright (c) 2017 Vladimir Kuznetsov
