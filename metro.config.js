const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [__dirname];
config.resolver.blockList = [
  /\.local\/skills\/.*/,
  /\.local\/secondary_skills\/.*/,
  /\.local\/state\/.*/,
  /\.git\/.*/,
];

module.exports = config;
