require('should');
var ChangeTip = require('../../src/changetip');

describe('ChangeTip', function () {
    it('Should create a instance of the ChangeTip API', function () {
        var change_tip = new ChangeTip();
        change_tip.should.be.an.instanceOf(ChangeTip);
    });

    it('Singleton should return an instance of the ChangeTip API', function () {
        var instance = ChangeTip.get_instance();
        instance.should.be.an.instanceOf(ChangeTip);
    });

    it('Singleton should always be the same instance returned', function () {
        var instanceA = ChangeTip.get_instance(),
            instanceB = ChangeTip.get_instance();

        instanceA.should.be.equal(instanceB);
    });
});