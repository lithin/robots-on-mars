var traces = {};
var boundaries = {};

var init = function(x, y) {
    if (x > 50 || y > 50 || x < 1 || y < 1) {
        return false;
    }

    boundaries = {
        x: x,
        y: y
    };
};

var isRobotLost = function(position) {
    if (position.x > boundaries.x || position.x < 0 || position.y > boundaries.y || position.y < 0) {
        return true;
    }

    return false;
};

var hasTrace = function(position, direction) {
    var traceInDirection = traces[direction] || [];
    var tracePosition;
    var i;

    for (i = 0; i < traceInDirection.length; i++) {
        tracePosition = traceInDirection[i];
        if (tracePosition.x === position.x && tracePosition.y === position.y) {
            return true;
        }
    }

    return false;
};

var addTrace = function(position, direction) {
    var traceInDirection = traces[direction];

    if (!traceInDirection) {
        traceInDirection = traces[direction] = [];
    }

    traceInDirection.push(position);
};

// expose public functions
module.exports = {
    init: init,
    isRobotLost: isRobotLost,
    hasTrace: hasTrace,
    addTrace: addTrace
};
