const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable Fast Refresh (hot reloading)
config.resetCache = true;

module.exports = config;

