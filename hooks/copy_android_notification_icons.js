#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var rootDest = 'platforms/android/app/src/main/res';
var files = [{
  'resources/android/icon/drawable-hdpi-icon.png':
     path.join(rootDest, 'drawable-hdpi/ic_stat_onesignal_default.png')
}, {
  'resources/android/icon/drawable-mdpi-icon.png':
    path.join(rootDest, 'drawable-mdpi/ic_stat_onesignal_default.png')
}, {
  'resources/android/icon/drawable-xhdpi-icon.png':
    path.join(rootDest, 'drawable-xhdpi/ic_stat_onesignal_default.png')
}, {
  'resources/android/icon/drawable-xxhdpi-icon.png':
    path.join(rootDest, 'drawable-xxhdpi/ic_stat_onesignal_default.png')
}, {
  'resources/android/icon/drawable-xxxhdpi-icon.png':
    path.join(rootDest, 'drawable-xxxhdpi/ic_stat_onesignal_default.png')
}];

function createFolder(pathAbsolute) {
  if (!fs.existsSync(pathAbsolute)) {
    fs.mkdirSync(pathAbsolute);
  }

  console.log('Folder ready ', pathAbsolute);
}

module.exports = function(context) {
  var root = context.opts.projectRoot;

  createFolder(path.join(root, rootDest, 'drawable-hdpi'));
  createFolder(path.join(root, rootDest, 'drawable-mdpi'));
  createFolder(path.join(root, rootDest, 'drawable-xhdpi'));
  createFolder(path.join(root, rootDest, 'drawable-xxhdpi'));
  createFolder(path.join(root, rootDest, 'drawable-xxxhdpi'));

  files.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
      var src = path.join(root, key);
      var dest = path.join(root, obj[key]);

      if (fs.existsSync(src) && fs.existsSync(path.dirname(dest))) {
        fs.createReadStream(src).pipe(fs.createWriteStream(dest));

        console.log('Copied ' + src + ' to ' + dest);
      }
    });
  });
};