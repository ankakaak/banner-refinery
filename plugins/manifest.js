'use strict';

var fs = require('fs'),
    path = require('path');

var FOLEDER_NAME_REGEXP = /^(.*?)([_-\W]{0,3})(\d{2,4}[x]\d{2,4})/i;

var MANIFEST_FILENAME = 'manifest.json';

module.exports = function(grunt) {


    grunt.registerMultiTask('manifest', 'Creates manifest files for html5 banners', function() {

        var options = this.options({
            manifestPath: MANIFEST_FILENAME
        });

        var fileEntries = fs.readdirSync(path.resolve(options.dest));

        fileEntries = fileEntries.filter(function (entry) {

            return grunt.file.isDir(path.resolve(options.dest, entry));

        }).map(function (entry) {

            var targetPath = path.resolve(options.dest, entry, MANIFEST_FILENAME);

            var jsonManifest = null;

            if(grunt.file.exists(targetPath)){

                jsonManifest = JSON.parse(grunt.file.read(targetPath));

            } else {

                jsonManifest = JSON.parse(grunt.file.read(__dirname + '/' + options.manifestPath));

            }

            var tmpManifest = grunt.util._.clone(jsonManifest);

            var nameHint = FOLEDER_NAME_REGEXP.exec(entry);

            if(nameHint && nameHint[3]){

                tmpManifest.title = nameHint[1];

                var dims = nameHint[3].toLowerCase().split('x');

                tmpManifest.width = dims[0];
                tmpManifest.height = dims[1];

            } else {

                return grunt.fail.fatal('Error! No dimension in folder name: ' + entry, 3);

            }

            fs.readdirSync(path.resolve(options.dest, entry)).filter(function (fEntry) {

                return /\.html$/.test(fEntry);

            }).forEach(function (fEntry) {

                tmpManifest.source = fEntry;

            });


            return {
                path: path.resolve(options.dest, entry, MANIFEST_FILENAME),
                manifest: tmpManifest
            }
        });

        var numOfSuccess = 0;

        fileEntries.forEach(function (entryObj) {

            grunt.file.write(entryObj.path, JSON.stringify(entryObj.manifest, null, 4));

            numOfSuccess++;

        });

        grunt.log.ok(numOfSuccess + ' manifest ' + grunt.util.pluralize(numOfSuccess, 'file/files') + ' created.');

    });

};
