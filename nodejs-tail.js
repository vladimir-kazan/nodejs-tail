const EventEmitter = require('events');
const fs = require('fs');

const watcher = Symbol('watcher');

class Tail extends EventEmitter {

  constructor(filename, options) {
    super();
    if (!fs.existsSync(filename)) {
      throw new Error(`File ${filename} not found`);
    }
    this.filename = filename;
    this.options = Object.assign({
      persistent: true,
      recursive: false,
      encoding: 'utf8'
    }, options);
  }

  watch() {
    let { size: lastSize, mtime: lastTime } = fs.statSync(this.filename);
    this[watcher] = fs.watch(this.filename, this.options, (event) => {
      const { size, mtime } = fs.statSync(this.filename);
      const diff = size - lastSize;
      if (diff <= 0) {
        lastSize = size;
        lastTime = mtime;
        return;
      }
      const buffer = new Buffer(diff);
      const fd = fs.openSync(this.filename, 'r');
      fs.readSync(fd, buffer, 0, diff, lastSize);
      fs.closeSync(fd);
      lastSize = size;
      lastTime = mtime;
      buffer.toString().split('\\n').forEach((line) => {
        this.emit('line', line);
      });
    });
  }

  close() {
    if (this[watcher]) {
      this[watcher].close();
    }
    this.emit('close');
  }
}

module.exports = Tail;
