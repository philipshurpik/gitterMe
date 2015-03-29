var program = require('commander');
var Bot = require('./app/bot');

program
    .option('-t, --token <token>', 'Auth token')
    .option('-r, --room <room>', 'Room')
    .parse(process.argv);

new Bot(program);