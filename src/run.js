var Robot = require('./robot');
var mars = require('./mars');
var fs = require('fs');
var path = require('path');
var fileName = path.resolve('./src/input.txt');
var input;

var init = function() {
    var lines;
    var marsPositionArray;
    var i;
    var robot;
    var robotPositionArray;

    input = fs.readFileSync(fileName, 'utf-8');
    lines = input.split('\n');

    marsPositionArray = lines[0].split(' ');
    mars.init(parseInt(marsPositionArray[0], 10), parseInt(marsPositionArray[1], 10));

    for (i = 1; i < lines.length; i += 3) {
        robotPositionArray = lines[i].split(' ');
        robot = new Robot(parseInt(robotPositionArray[0], 10), parseInt(robotPositionArray[1], 10), robotPositionArray[2]);
        robot.run(lines[i + 1]);
    }
}

module.exports = {
    init: init
};
