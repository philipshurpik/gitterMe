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
            var events = room.listen();
            events.on('message', this.onNewMessage.bind(this));
        }.bind(this))
        .fail(function(err) {
            console.log('Error. Not possible to join the room: ' + roomName + "\n", err);
        });
};

Bot.prototype.onNewMessage = function(message) {
    var expression = message.text;
    var errorString = utils.checkExpression(expression);
    if (errorString.length > 0) {
        console.log(errorString);
        return;
    }
    expression = utils.trim(expression);
    try {
        var result = math.eval(expression);
        console.log("calc " + expression + " = " + result);
    }
    catch (exc) {
        console.log(exc);
    }
};

var utils = {
    trim: function(expression) {
        return expression.substr(expression.indexOf('calc') + 4).trim();
    },
    checkExpression: function(expression) {
        var regexp = new RegExp(/^[0-9+*().\-\/]+$/);
        if (expression.indexOf('calc') === -1) {
            return "Error! No 'calc' keyword in message!";
        }
        expression = utils.trim(expression);
        if (expression.length === 0) {
            return 'Error! Nothing to evaluate';
        }
        if (!regexp.test(expression)) {
            return 'Error! Invalid characters in expression';
        }
        return "";
    }
};

module.exports = new Bot();