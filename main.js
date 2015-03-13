var spawn = require('child_process').spawn;

phantom = spawn('phantomjs', ['fb-parser.js']);

phantom.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

phantom.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

phantom.on('close', function (code) {
  console.log('child process exited with code ' + code);
});
