var Block = require('../lib/block');
var _ = require('lodash');

var findScript3 = function (name) {
    return name === 'spec/fixtures/js/script3.js';
};

describe('Block', function () {
    var block, options;

    beforeEach(function () {
        var config = {
            src: 'spec/fixtures/js/*.js',
            removeBlock: false,
            removeAnchors: false,
            removeFiles: false
        };

        var jsFiles = [
            'spec/fixtures/js/script1.js',
            'spec/fixtures/js/script3.js'
        ];

        block = new Block('myblock', config);

        // mock of fileprocessor loading existing files from lines in the block
        block.files = jsFiles;
    });

    it('should not remove existing lines if the removeFiles option is false', function () {
        block.updateFiles();

        // Should add script2.js and leave script1.js and script3.js
        expect(block.files.length).toBe(3);
        expect(_(block.files).findIndex(findScript3)).toBe(1);
    });

    it('should remove existing lines if the the removeFiles option is true', function () {
        block.config.removeFiles = true;
        block.updateFiles();

        // Should add script2.js, leave script1.js and remove script3.js
        expect(block.files.length).toBe(2);
        expect(_(block.files).findIndex(findScript3)).toBe(-1);
    });

    it('should set the "changed" flag if lines were added or removed', function () {
        expect(block.changed).toBe(false);
        block.updateFiles();
        expect(block.changed).toBe(true);
    });

    it('should not set the "changed" flag if no lines were added or removed', function () {
        block.config.src = ['nomatch/*.js'];
        expect(block.changed).toBe(false);
        block.updateFiles();
        expect(block.changed).toBe(false);
    });
});