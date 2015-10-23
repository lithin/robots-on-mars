describe('Robot', function() {
    var rewire = require('rewire');
    var sinon = require('sinon');
    var expect = require('chai').expect;
    var Robot = rewire('./robot');
    var robot;
    var mars;

    beforeEach(function() {
        mars = {
            hasTrace: sinon.stub(),
            addTrace: sinon.spy(),
            isRobotLost: sinon.stub()
        };
        Robot.__set__('mars', mars);
        robot = new Robot(1, 2, 'E');
    });

    it('has a position', function() {
        expect(robot.position).to.deep.equal({
            x: 1,
            y: 2
        });
    });

    it('has a previousPosition', function() {
        expect(robot.previousPosition).to.be.an('object');
        expect(robot.previousPosition).to.have.keys('x', 'y');
    });

    it('has a "facing" parameter', function() {
        expect(robot.facing).to.equal('E');
    });

    it('has a "isLost" parameter', function() {
        expect(robot.isLost).to.equal(false);
    });

    describe('moving forward', function() {
        beforeEach(function() {
            robot.position = {
                x: 1,
                y: 1
            };
        });

        it('has a register of movements along axis', function() {
            expect(robot.movements).to.have.keys('N', 'E', 'W', 'S');
        });

        it('can move north', function() {
            robot.movements.N();
            expect(robot.position).to.deep.equal({
                x: 1,
                y: 2
            });
        });

        it('can move south', function() {
            robot.movements.S();
            expect(robot.position).to.deep.equal({
                x: 1,
                y: 0
            });
        });

        it('can move west', function() {
            robot.movements.W();
            expect(robot.position).to.deep.equal({
                x: 0,
                y: 1
            });
        });

        it('can move east', function() {
            robot.movements.E();
            expect(robot.position).to.deep.equal({
                x: 2,
                y: 1
            });
        });
    });

    describe('run:', function() {
        beforeEach(function() {
            sinon.stub(console, 'log');
            sinon.stub(robot, 'move');
        });

        afterEach(function() {
            console.log.restore();
            robot.move.restore();
        });

        it('moves the robot according to the instructions', function() {
            robot.run('FFLFRF');

            expect(robot.move.calledWith('F')).to.equal(true);
            expect(robot.move.calledWith('L')).to.equal(true);
            expect(robot.move.calledWith('R')).to.equal(true);
            expect(robot.move.callCount).to.equal(6);
        });

        it('does not move anymore if it gets lost', function() {
            robot.isLost = true;

            robot.run('FFLFRF');

            expect(robot.move.called).to.equal(false);
        });

        it('logs its final position in the end', function() {
            robot.position = {
                x: 1,
                y: 1
            };
            robot.facing = 'E';

            robot.run('FFLFRF');

            expect(console.log.calledWith('1 1 E')).to.equal(true);
        });

        it('write previousPosition and LOST to the console.log string if the robot isLost', function() {
            robot.previousPosition = {
                x: 1,
                y: 1
            };
            robot.facing = 'E';
            robot.isLost = true;

            robot.run('FFLFRF');

            expect(console.log.calledWith('1 1 E LOST')).to.equal(true);
        });
    });

    describe('turn:', function() {
        it('turns robot to the right if given instruction R', function() {
            robot.facing = 'E';

            robot.turn('R');
            expect(robot.facing).to.equal('S');

            robot.turn('R');
            expect(robot.facing).to.equal('W');

            robot.turn('R');
            expect(robot.facing).to.equal('N');

            robot.turn('R');
            expect(robot.facing).to.equal('E');
        });

        it('turns robot to the left if given instruction L', function() {
            robot.facing = 'E';

            robot.turn('L');
            expect(robot.facing).to.equal('N');

            robot.turn('L');
            expect(robot.facing).to.equal('W');

            robot.turn('L');
            expect(robot.facing).to.equal('S');

            robot.turn('L');
            expect(robot.facing).to.equal('E');
        });
    });

    describe('go:', function() {
        beforeEach(function() {
            robot.position = {
                x: 1,
                y: 2
            };
            robot.facing = 'E';
        });

        it('skips instruction - return false - if the current position has a trace with the same direction', function() {
            mars.hasTrace.returns(true);

            expect(robot.go('F')).to.equal(false);
            expect(mars.hasTrace.calledWith(robot.position, 'E')).to.equal(true);
        });

        it('moves forward using the register, saving current position as previousPosition', function() {
            mars.isRobotLost.returns(false);
            sinon.stub(robot.movements, 'E');

            robot.go('F');

            expect(robot.movements.E.called).to.equal(true);
            expect(robot.previousPosition).to.deep.equal({
                x: 1,
                y: 2
            });
            expect(mars.isRobotLost.calledWith(robot.position)).to.equal(true);

            robot.movements.E.restore();
        });

        it('sets isLost to be true, and sets trace on mars, if it is lost after the move', function() {
            mars.isRobotLost.returns(true);
            sinon.stub(robot.movements, 'E');

            robot.go('F');

            expect(robot.isLost).to.equal(true);
            expect(mars.addTrace.calledWith(robot.previousPosition, 'E')).to.equal(true);

            robot.movements.E.restore();
        });
    });

    describe('move:', function() {
        beforeEach(function() {
            sinon.stub(robot, 'go');
            sinon.stub(robot, 'turn');
        });

        afterEach(function() {
            robot.go.restore();
            robot.turn.restore();
        });

        it('turns if instruction is R or L', function() {
            robot.move('R');
            expect(robot.turn.calledWith('R')).to.equal(true);

            robot.move('L');
            expect(robot.turn.calledWith('L')).to.equal(true);
        });

        it('goes if instruction is F', function() {
            robot.move('F');

            expect(robot.go.called).to.equal(true);
        });
    });
});
