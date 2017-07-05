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
const tail = new Tail(filename);

tail.on('line', (line) => {
  process.stdout.write(line);
})

tail.on('close', () => {
  console.log('watching stopped');
})

tail.watch();

setTimeout(() => {
  tail.close();
}, 3000);
```


MIT License. Copyright (c) 2017 Vladimir Kuznetsov
