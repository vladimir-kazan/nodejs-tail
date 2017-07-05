const assert = require('assert');
const path = require('path');

const Tail = require('..');

const filename = path.join(__dirname, 'test.log');

const watcher = new Tail(filename);
watcher.on('line', (line) => {
  process.stdout.write(line);
})
watcher.on('close', () => {
  console.log('Closed');
})
watcher.watch();
setTimeout(() => {
  watcher.close();
}, 5000);