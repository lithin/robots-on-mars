describe('Mars', function() {
    var rewire = require('rewire');
    var sinon = require('sinon');
    var expect = require('chai').expect;
    var mars = rewire('./mars');

    describe('init', function() {
        afterEach(function() {
            mars.__set__('boundaries', {});
        });

        it('sets outer boundaries', function() {
            mars.init(10, 15);

            expect(mars.__get__('boundaries')).to.deep.equal({
                x: 10,
                y: 15
            });
        });

        it('returns false if any boundary is bigger than 50', function() {
            expect(mars.init(51, 1)).to.equal(false);
            expect(mars.__get__('boundaries')).to.deep.equal({});
        });

        it('returns false if any boundary is smaller than 1', function() {
            expect(mars.init(48, 0)).to.equal(false);
            expect(mars.__get__('boundaries')).to.deep.equal({});
        });
    });

    describe('isRobotLost', function() {
        beforeEach(function() {
            mars.init(10, 15);
        });

        it('returns false if robot has position within boundaries', function() {
            expect(mars.isRobotLost({
                x: 9,
                y: 14
            })).to.equal(false);
        });

        it('returns true if robot has position outside of boundaries', function() {
            expect(mars.isRobotLost({
                x: 10,
                y: 14
            })).to.equal(true);

            expect(mars.isRobotLost({
                x: 9,
                y: 15
            })).to.equal(true);

            expect(mars.isRobotLost({
                x: -1,
                y: 15
            })).to.equal(true);

            expect(mars.isRobotLost({
                x: 4,
                y: -1
            })).to.equal(true);
        });
    });

    describe('hasTrace', function() {
        beforeEach(function() {
            mars.__set__('traces', {
                'W': [{
                    x: 0,
                    y: 10
                }]
            });
        });

        afterEach(function() {
            mars.__set__('traces', {});
        });

        it('returns true if a trace with same position and direction exists', function() {
            expect(mars.hasTrace({
                    x: 0,
                    y: 10
                },
                'W')).to.equal(true);
        });

        it('returns false if direction has a trace but position does not', function() {
            expect(mars.hasTrace({
                    x: 1,
                    y: 10
                },
                'W')).to.equal(false);
        });

        it('returns false if position has a trace but direction does not', function() {
            expect(mars.hasTrace({
                    x: 0,
                    y: 10
                },
                'E')).to.equal(false);
        });
    });

    describe('addTrace', function() {
        it('adds the trace', function() {
            mars.__set__('traces', {
                'E': [{
                    x: 0,
                    y: 10
                }]
            });

            mars.addTrace({
                x: 12,
                y: 10
            }, 'E');
            
            expect(mars.__get__('traces')).to.deep.equal({
                'E': [{
                    x: 0,
                    y: 10
                }, {
                    x: 12,
                    y: 10
                }]
            });
        });
    });
});
