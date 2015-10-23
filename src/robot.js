var mars = require('./mars');

var Robot = function(x, y, facing) {
    this.position = {
        x: x,
        y: y
    };
    this.previousPosition = {
        x: null,
        y: null
    };
    this.isLost = false;
    this.facing = facing;
    this.movements = {
        N: (function() {
            this.position.y++;
        }).bind(this),
        E: (function() {
            this.position.x++
        }).bind(this),
        S: (function() {
            this.position.y--
        }).bind(this),
        W: (function() {
            this.position.x--
        }).bind(this)
    }
}

Robot.prototype.run = function(instructions) {
    var letter;

    while (instructions && !this.isLost) {
        letter = instructions.substr(0, 1);

        this.move(letter);

        instructions = instructions.substr(1);
    }

    if (this.isLost) {
        console.log(this.previousPosition.x + ' ' + this.previousPosition.y + ' ' + this.facing + ' LOST');
    } else {
        console.log(this.position.x + ' ' + this.position.y + ' ' + this.facing);
    }
};

Robot.prototype.move = function(action) {
    if (action === 'F') {
        this.go();
    } else {
        this.turn(action);
    }
};

Robot.prototype.turn = function(direction) {
    var directions = ['E', 'S', 'W', 'N'];
    var index = directions.indexOf(this.facing);;
    var newDirection;

    if (direction === 'R') {
        newDirection = directions[++index] || 'E';
    } else if (direction === 'L') {
        newDirection = directions[--index] || 'N';
    }

    this.facing = newDirection;
};

Robot.prototype.go = function() {
    if (mars.hasTrace(this.position, this.facing)) {
        return false;
    }

    this.previousPosition.x = this.position.x;
    this.previousPosition.y = this.position.y;
    this.movements[this.facing]();

    if (mars.isRobotLost(this.position)) {
    	mars.addTrace(this.previousPosition, this.facing);
        this.isLost = true;
    }
};

module.exports = Robot;
