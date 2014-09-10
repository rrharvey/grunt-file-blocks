var FileProcessor = require('../lib/fileprocessor');
var grunt = require('grunt');
var _ = require('lodash');

var HtmlFileMock = function () {
    var html = grunt.file.read('spec/fixtures/sample.html').replace(/\r\n/g, '\n');
    var file = { content: html };
    return file;
};

var JsFileMock = function () {
    var html = grunt.file.read('spec/fixtures/sample.js').replace(/\r\n/g, '\n');
    var file = { content: html };
    return file;
};

var defaultConfig = {
    removeBlock: false,
    removeAnchors: false,
    removeFiles: false,
    templates: {
        'js': '<script src="${file}"></script>',
        'css': '<link href="${file}" rel="stylesheet" />',
        'ref': '/// <reference path="${file}" />',
        'raw': '${file}'
    },
    templatesFn: {}
};

describe('FileProcessor on HTML file', function () {
    var processor, blockConfigs;

    beforeEach(function () {
        blockConfigs = [
            _.extend({ name: 'reload' }, defaultConfig),
            _.extend({ name: 'styles' }, defaultConfig),
            _.extend({ name: 'app' }, defaultConfig),
        ];

        var file = new HtmlFileMock();
        processor = new FileProcessor(file);
    });

    it('should find blocks correctly', function () {
        var blocks = processor.getBlocks(blockConfigs);
        expect(blocks.length).toBe(3);
    });

    it("should not return blocks that aren't configured", function () {
        blockConfigs.shift();
        var blocks = processor.getBlocks(blockConfigs);
        expect(blocks.length).toBe(2);
    });

    it("should replace the contents of a block with correct content", function () {
        var blocks = processor.getBlocks(blockConfigs);
        var appBlock = _(blocks).find(function (b) {
            return b.name === 'app';
        });

        appBlock.template = '{{<%= file %>}}'
        appBlock.files = [
            'testfile.js',
            'anothertestfile.js'
        ];

        processor.processBlock(appBlock);

        expect(processor.file.content).toMatch('{{testfile.js}}');
        expect(processor.file.content).toMatch('{{anothertestfile.js}}');
    });

    it("should remove the entire block if the removeBlock option is true", function () {
        var block = {
            name: 'reload',
            config: {
                removeBlock: true
            },
            lines: [],
            files: []
        };

        processor.processBlock(block);

        //expect(processor.file.content).not.toMatch('fileblock:other');
        //expect(processor.file.content).not.toMatch('localhost:35729');
    });

    it("should remove the block anchors if the removeAnchors option is true", function () {
        var blocks = processor.getBlocks(blockConfigs);
        var stylesBlock = _(blocks).find(function (b) {
            return b.name === 'styles';
        });

        stylesBlock.config.removeAnchors = true;
        stylesBlock.files = [
            'styles1.css',
            'styles2.css'
        ];

        processor.processBlock(stylesBlock);

        // The block content should still be there
        expect(processor.file.content).toMatch('styles1.css');
        expect(processor.file.content).not.toMatch('fileblock:css styles');
    });
});