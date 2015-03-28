var program = require('commander');

program
    .option('-t, --token <token>', 'Auth token')
    .option('-r, --room <room>', 'Room')
    .parse(process.argv);

module.exports = program;