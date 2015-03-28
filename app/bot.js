var Gitter = require('node-gitter');
var cli = require('./cli-config');
var config = require('./config');

function Bot() {
    var token = cli.token || config.authToken;
    var room = cli.room || config.defaultRoom;
    this.init(token, room);
}

Bot.prototype.init = function(token, room) {
    this.gitter = new Gitter(token);
    this.gitter.currentUser()
        .then(function(user) {
            console.log('You are logged in as:', user.username);
        })
        .fail(function(err) {
            console.log('Error. Unable to login. \nPossibly invalid token: ' + token + "\n", err);
        })
        .then(this.joinRoom.bind(this, room));
};

Bot.prototype.joinRoom = function(roomName) {
    this.gitter.rooms.join(roomName)
        .then(function(room) {
            console.log('Joined room: ', room.name);
        })
        .fail(function(err) {
            console.log('Error. Not possible to join the room: ' + roomName + "\n", err);
        });
};

module.exports = new Bot();