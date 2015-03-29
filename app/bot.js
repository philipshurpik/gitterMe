var Gitter = require('node-gitter');
var math = require('mathjs');
var cli = require('./cli-config');
var config = require('./config');

function Bot() {
    var token = cli.token || config.authToken;
    var room = cli.room || config.defaultRoom;
    this.init(token, room);
}

Bot.prototype.init = function(token, room) {
    this.activeUser = undefined;
    this.gitter = new Gitter(token);
    this.gitter.currentUser()
        .then(function(user) {
            console.log('You are logged in as:', user.username);
            this.activeUser = user.username;
        }.bind(this))
        .fail(function(err) {
            console.log('Error: Unable to login. \nPossibly invalid token: ' + token + "\n", err);
        })
        .then(this.joinRoom.bind(this, room));
};

Bot.prototype.joinRoom = function(roomName) {
    this.gitter.rooms.join(roomName)
        .then(function(room) {
            console.log('Joined room: ', room.name);
            var events = room.listen();
            events.on('message', this.onNewMessage.bind(this, room));
        }.bind(this))
        .fail(function(err) {
            console.log('Error: Not possible to join the room: ' + roomName + "\n", err);
        });
};

Bot.prototype.onNewMessage = function(room, message) {
    if (message.fromUser.username === this.activeUser) {
        return;
    }
    try {
        var expression = message.text;
        expression = Bot.utils.checkExpression(expression);
        var result = math.eval(expression);
        Bot.utils.send(room, expression + "=" + result);
    }
    catch (exc) {
        Bot.utils.send(room, message.text + ". Expression Error: " + exc.message);
    }
};

Bot.utils = {
    send: function(room, message) {
        room.send(message);
        console.log((new Date()).toLocaleString() + ": " + message);
    },
    trim: function(expression) {
        return expression.substr(expression.indexOf('calc') + 4).trim();
    },
    checkExpression: function(expression) {
        var regexp = new RegExp(/^[0-9+*().\-\/ ]+$/);
        if (expression.indexOf('calc') === -1) {
            throw new Error("No 'calc' keyword in message!");
        }
        expression = Bot.utils.trim(expression);
        if (expression.length === 0) {
            throw new Error("Nothing to evaluate");
        }
        if (!regexp.test(expression)) {
            throw new Error("Invalid characters in expression");
        }
        return expression;
    }
};

module.exports = new Bot();