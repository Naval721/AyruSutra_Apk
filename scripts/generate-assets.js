#!/usr/bin/env node

/**
 * Generate app assets from SVG files
 * This script converts SVG files to various PNG sizes required for the app
 */

const fs = require('fs');
const path = require('path');

// Create the assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// App icon sizes
const iconSizes = [
  { name: 'icon.png', size: 1024 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-256.png', size: 256 },
  { name: 'icon-128.png', size: 128 },
  { name: 'icon-64.png', size: 64 },
  { name: 'icon-32.png', size: 32 },
  { name: 'icon-16.png', size: 16 },
];

// Splash screen sizes
const splashSizes = [
  { name: 'splash.png', width: 1242, height: 2688 },
  { name: 'splash-1242x2688.png', width: 1242, height: 2688 },
  { name: 'splash-1125x2436.png', width: 1125, height: 2436 },
  { name: 'splash-828x1792.png', width: 828, height: 1792 },
  { name: 'splash-750x1334.png', width: 750, height: 1334 },
  { name: 'splash-640x1136.png', width: 640, height: 1136 },
];

// Adaptive icon sizes
const adaptiveIconSizes = [
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'adaptive-icon-512.png', size: 512 },
  { name: 'adaptive-icon-256.png', size: 256 },
];

// Favicon sizes
const faviconSizes = [
  { name: 'favicon.png', size: 32 },
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
];

// Notification icon sizes
const notificationIconSizes = [
  { name: 'notification-icon.png', size: 96 },
  { name: 'notification-icon-48.png', size: 48 },
  { name: 'notification-icon-24.png', size: 24 },
];

console.log('🎨 AyurSutra Asset Generator');
console.log('============================');

// Create placeholder files for now (in a real project, you'd use a library like sharp or canvas)
const createPlaceholderFile = (filename, width, height) => {
  const filePath = path.join(assetsDir, filename);
  
  // For now, we'll create a simple text file indicating the required size
  // In a real project, you would use a library like sharp to convert SVG to PNG
  const content = `# ${filename}
# Size: ${width}x${height}
# This file should be generated from the corresponding SVG file
# Use a tool like sharp, canvas, or imagemagick to convert SVG to PNG
`;
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created ${filename} (${width}x${height})`);
};

// Generate app icons
console.log('\n📱 Generating App Icons...');
iconSizes.forEach(({ name, size }) => {
  createPlaceholderFile(name, size, size);
});

// Generate splash screens
console.log('\n🌅 Generating Splash Screens...');
splashSizes.forEach(({ name, width, height }) => {
  createPlaceholderFile(name, width, height);
});

// Generate adaptive icons
console.log('\n🔄 Generating Adaptive Icons...');
adaptiveIconSizes.forEach(({ name, size }) => {
  createPlaceholderFile(name, size, size);
});

// Generate favicons
console.log('\n🌐 Generating Favicons...');
faviconSizes.forEach(({ name, size }) => {
  createPlaceholderFile(name, size, size);
});

// Generate notification icons
console.log('\n🔔 Generating Notification Icons...');
notificationIconSizes.forEach(({ name, size }) => {
  createPlaceholderFile(name, size, size);
});

console.log('\n✨ Asset generation complete!');
console.log('\n📝 Next Steps:');
console.log('1. Install a library like "sharp" or "canvas" to convert SVG to PNG');
console.log('2. Update this script to use the library for actual image conversion');
console.log('3. Or use an online SVG to PNG converter with the provided SVG files');
console.log('4. Place the generated PNG files in the assets directory');

console.log('\n🎨 SVG Files Created:');
console.log('- icon.svg (1024x1024) - Main app icon');
console.log('- splash.svg (1242x2688) - Splash screen');
console.log('- adaptive-icon.svg (1024x1024) - Android adaptive icon');
console.log('- favicon.svg (32x32) - Web favicon');
console.log('- notification-icon.svg (96x96) - Notification icon');