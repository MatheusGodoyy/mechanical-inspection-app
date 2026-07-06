const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ignora pastas temporárias do Gradle dentro do projeto/node_modules
config.resolver.blockList = [
  /.*\/\.gradle\/.*/,
  /.*\\\.gradle\\.*/
];

module.exports = config;