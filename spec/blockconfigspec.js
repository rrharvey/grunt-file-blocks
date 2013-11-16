var BlockConfig = require('../lib/blockconfig');
var _ = require('lodash');

var fileConfig1 = {
    src: 'test/fixtures/sample.js',
    dest: 'tmp/sample_dev.js',
    blocks: {
        'references': { src: 'test/fixtures/js/*.js' }
    }
};

var options = {
    removeBlock: false,
    removeAnchors: true,
    removeFiles: false
};

describe('BlockConfig', function () {
    var blockConfig;

    beforeEach(function () {
        blockConfig = new BlockConfig('myblock', fileConfig1, options);
    });

    it('should convert a src that is a string into an array', function () {
        expect(_.isArray(blockConfig.src)).toBe(true);
        expect(blockConfig.src[0]).toEqual(fileConfig1.src);
    });

    it('should apply default options to the configuration', function () {
        expect(_.isUndefined(blockConfig.removeBlock)).toBe(false);
        expect(_.isUndefined(blockConfig.removeAnchors)).toBe(false);
        expect(_.isUndefined(blockConfig.removeFiles)).toBe(false);
    });
});