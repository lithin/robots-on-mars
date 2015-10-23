describe('Run', function() {
    var rewire = require('rewire');
    var sinon = require('sinon');
    var path = require('path');
    var expect = require('chai').expect;
    var run = rewire('./run');
    var mars;
    var Robot;
    var robot;

    describe('init', function() {
        beforeEach(function() {
            run.__set__('fileName', path.resolve('./src/testInput.txt'));

            mars = {
                init: sinon.spy()
            };
            run.__set__('mars', mars);

            robot = {
                run: sinon.spy()
            };
            Robot = sinon.stub().returns(robot);
            run.__set__('Robot', Robot);

            run.init();
        });

        afterEach(function() {
            run.__set__('fileName', path.resolve('./src/input.txt'));
        });

        it('reads input from a text file', function() {
            expect(run.__get__('input')).to.equal('10 2\n1 1 E\nRFRFRFRF\n\n3 2 N\nFRRF');
        });

        it('initialises mars', function() {
            expect(mars.init.calledWith(10, 2)).to.equal(true);
        });

        it('creates all robots', function() {
        	expect(Robot.calledWith(1, 1, 'E')).to.equal(true);
        	expect(Robot.calledWith(3, 2, 'N')).to.equal(true);
        	expect(Robot.calledTwice).to.equal(true);
        	expect(Robot.calledWithNew()).to.equal(true);
        });

        it('runs instructions for all robots', function() {
        	expect(robot.run.calledWith('RFRFRFRF')).to.equal(true);
        	expect(robot.run.calledWith('FRRF')).to.equal(true);
        	expect(robot.run.calledTwice).to.equal(true);
        });
    });
});
