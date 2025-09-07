# 🎨 AyurSutra App Assets Guide

## Overview
This guide covers all the app icons, splash screens, and visual assets created for the AyurSutra Patient Companion App.

## 🎯 Design Philosophy

### **Ayurvedic Healing Theme**
- **Primary Color**: Healing Green (#2E7D32) - Represents growth, healing, and nature
- **Secondary Color**: Light Green (#4CAF50) - Represents vitality and wellness
- **Accent Colors**: Dosha-specific colors for different body types
- **Symbolism**: Sacred Om symbol, healing leaf, and dosha representations

### **Visual Elements**
- **Central Leaf**: Represents natural healing and growth
- **Om Symbol**: Sacred symbol representing the universe and consciousness
- **Dosha Symbols**: Vata (wind), Pitta (fire), Kapha (water), Tridosha (balance)
- **Circular Design**: Represents wholeness, completeness, and healing

## 📱 App Icons

### **Main App Icon (icon.svg)**
- **Size**: 1024x1024px
- **Design**: Central healing leaf with Om symbol
- **Colors**: Green gradient background with white leaf
- **Symbols**: Dosha symbols in corners
- **Usage**: Main app icon for all platforms

### **Adaptive Icon (adaptive-icon.svg)**
- **Size**: 1024x1024px
- **Design**: Simplified version for Android adaptive icons
- **Features**: Clean circular design with central leaf
- **Usage**: Android adaptive icon system

### **Favicon (favicon.svg)**
- **Size**: 32x32px
- **Design**: Minimalist version with essential elements
- **Usage**: Web browser favicon

### **Notification Icon (notification-icon.svg)**
- **Size**: 96x96px
- **Design**: App icon with notification bell
- **Usage**: Push notification icon

## 🌅 Splash Screens

### **Main Splash Screen (splash.svg)**
- **Size**: 1242x2688px (iPhone 12 Pro Max)
- **Design**: Full-screen gradient with centered logo
- **Elements**:
  - Healing green gradient background
  - Large central leaf with Om symbol
  - Dosha symbols around the logo
  - App title and tagline
  - Decorative elements

### **Responsive Sizes**
- **1242x2688**: iPhone 12 Pro Max, iPhone 13 Pro Max, iPhone 14 Plus
- **1125x2436**: iPhone X, iPhone XS, iPhone 11 Pro, iPhone 12, iPhone 13
- **828x1792**: iPhone XR, iPhone 11, iPhone 12 mini, iPhone 13 mini
- **750x1334**: iPhone 8, iPhone SE (2nd gen)
- **640x1136**: iPhone 5, iPhone 5s, iPhone SE (1st gen)

## 🎨 Color Palette

### **Primary Colors**
- **Healing Green**: #2E7D32 - Main brand color
- **Light Green**: #4CAF50 - Accent and highlights
- **Dark Green**: #1B5E20 - Text and emphasis
- **Leaf Green**: #E8F5E8 - Light backgrounds

### **Dosha Colors**
- **Vata (Air)**: #8E24AA - Purple, represents movement and creativity
- **Pitta (Fire)**: #F57C00 - Orange, represents transformation and energy
- **Kapha (Water)**: #1976D2 - Blue, represents stability and nourishment
- **Tridosha (Balance)**: #388E3C - Green, represents harmony

### **Status Colors**
- **Success**: #4CAF50 - Completed therapies
- **Warning**: #FF9800 - In-progress therapies
- **Info**: #2196F3 - Scheduled therapies
- **Error**: #F44336 - Cancelled therapies

## 📐 Technical Specifications

### **Icon Requirements**
- **Format**: PNG with transparency
- **Background**: Transparent or solid color
- **Quality**: High resolution, crisp edges
- **Platforms**: iOS, Android, Web

### **Splash Screen Requirements**
- **Format**: PNG
- **Background**: Solid color (#2E7D32)
- **Content**: Centered, properly scaled
- **Safe Area**: Account for notches and home indicators

### **File Naming Convention**
- **Icons**: `icon-[size].png`
- **Splash**: `splash-[width]x[height].png`
- **Adaptive**: `adaptive-icon-[size].png`
- **Favicon**: `favicon-[size].png`
- **Notification**: `notification-icon-[size].png`

## 🛠️ Asset Generation

### **SVG to PNG Conversion**
The provided SVG files need to be converted to PNG format for use in the app. Use one of these methods:

#### **Method 1: Online Converter**
1. Visit an online SVG to PNG converter
2. Upload the SVG files
3. Set the required dimensions
4. Download the PNG files
5. Place them in the `assets/` directory

#### **Method 2: Command Line Tools**
```bash
# Using ImageMagick
convert icon.svg -resize 1024x1024 icon.png
convert splash.svg -resize 1242x2688 splash.png

# Using Inkscape
inkscape --export-png=icon.png --export-width=1024 --export-height=1024 icon.svg
inkscape --export-png=splash.png --export-width=1242 --export-height=2688 splash.svg
```

#### **Method 3: Node.js Script**
```bash
# Install sharp
npm install sharp

# Run the conversion script
node scripts/convert-svg-to-png.js
```

### **Required PNG Files**
```
assets/
├── icon.png (1024x1024)
├── icon-512.png (512x512)
├── icon-256.png (256x256)
├── icon-128.png (128x128)
├── icon-64.png (64x64)
├── icon-32.png (32x32)
├── icon-16.png (16x16)
├── splash.png (1242x2688)
├── splash-1125x2436.png (1125x2436)
├── splash-828x1792.png (828x1792)
├── splash-750x1334.png (750x1334)
├── splash-640x1136.png (640x1136)
├── adaptive-icon.png (1024x1024)
├── adaptive-icon-512.png (512x512)
├── adaptive-icon-256.png (256x256)
├── favicon.png (32x32)
├── favicon-16.png (16x16)
├── favicon-32.png (32x32)
├── favicon-48.png (48x48)
├── notification-icon.png (96x96)
├── notification-icon-48.png (48x48)
└── notification-icon-24.png (24x24)
```

## 🎯 Platform-Specific Considerations

### **iOS**
- **App Icon**: 1024x1024px, no transparency
- **Splash Screen**: Multiple sizes for different devices
- **App Store**: High-resolution icon for store listing

### **Android**
- **Adaptive Icon**: 1024x1024px foreground, transparent background
- **Legacy Icon**: 512x512px for older Android versions
- **Notification Icon**: 96x96px, monochrome

### **Web**
- **Favicon**: 32x32px, 16x16px, 48x48px
- **PWA Icons**: 192x192px, 512x512px
- **Apple Touch Icon**: 180x180px

## 🚀 Implementation

### **Expo Configuration**
The `app.json` file has been configured with all the necessary asset references:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2E7D32"
    },
    "ios": {
      "icon": "./assets/icon.png",
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#2E7D32"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2E7D32"
      },
      "icon": "./assets/icon.png"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### **Testing Assets**
1. Run `expo start` to test the app
2. Check that icons appear correctly on all platforms
3. Verify splash screen displays properly
4. Test notification icons in push notifications

## 📋 Checklist

### **Asset Creation**
- [x] Main app icon (icon.svg)
- [x] Splash screen (splash.svg)
- [x] Adaptive icon (adaptive-icon.svg)
- [x] Favicon (favicon.svg)
- [x] Notification icon (notification-icon.svg)

### **PNG Conversion**
- [ ] Convert all SVG files to PNG
- [ ] Generate all required sizes
- [ ] Place files in assets directory
- [ ] Test on all platforms

### **Configuration**
- [x] Update app.json with asset references
- [x] Configure platform-specific settings
- [x] Set proper background colors
- [x] Configure notification icons

### **Testing**
- [ ] Test app icon on iOS
- [ ] Test app icon on Android
- [ ] Test splash screen on all devices
- [ ] Test notification icons
- [ ] Test web favicon

## 🎨 Design Assets Summary

The AyurSutra app assets feature a beautiful, healing-focused design that perfectly represents the Ayurvedic wellness journey. The central leaf symbolizes natural healing, while the Om symbol represents spiritual wellness. The dosha-specific colors provide visual cues for different body types, and the overall design creates a calming, professional appearance that patients will trust and find appealing.

The assets are designed to work seamlessly across all platforms while maintaining the app's healing-focused brand identity.