const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for better compatibility
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;