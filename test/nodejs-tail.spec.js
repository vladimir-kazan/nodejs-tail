const assert = require('assert');
const cluster = require('cluster');
const fs = require('fs');
const path = require('path');
const Tail = require('..');

const filename = path.join(__dirname, 'test.log');


function before() {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
  fs.writeFileSync(filename, '');
}

function after() {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
}

function startTail(tail) {
  return new Promise((resolve, reject) => {
    let counter = 0;
    let closeCalled = false;
    console.log(111);
    tail.on('line', (line) => {
      process.stdout.write(line);
      counter += 1;
    });
    tail.on('close', () => {
      closeCalled = true;
      resolve({ counter, closeCalled });
    });
    tail.watch();
  });
}

before();

if (cluster.isMaster) {
  const tail = new Tail(filename);
  let counter = 0;
  let closeCalled = false;
  console.log(111);
  tail.on('line', (line) => {
    console.log(line);
    counter += 1;
  });
  tail.on('close', () => {
    closeCalled = true;
  });
  tail.watch();
  // startTail(tail).then((data) => {
  //   // assert
  //   assert.ok(data.closeCalled);
  // }, () => { console.log('er'); });
  
  // start log emulation in separate process
  // cluster.fork();
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    // tail.close();
  });

} else if (cluster.isWorker) {
  // emulate logger 
  const testData = [
    'First line\n',
    'Second line\n',
    'Third line\n',
    'Fourth line\nFifth line\n'
  ];

  testData.forEach((item, idx, ar) => {
    setTimeout(() => {
      fs.appendFileSync(filename, item);
      process.stdout.write('f: ' + item);
      if (idx + 1 === ar.length) {
        cluster.worker.kill();
      }
    }, 1000 * (idx + 1));
  });
}
