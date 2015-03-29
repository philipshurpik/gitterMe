var Bot = require('./app/bot');
var program = require('commander');
var config = require('./config');

program
    .option('-t, --token <token>', 'Auth token')
    .option('-r, --room <room>', 'Room')
    .parse(process.argv);

new Bot({
    room: program.room || config.defaultRoom,
    token: program.token || config.authToken
});