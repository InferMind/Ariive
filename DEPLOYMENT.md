# Arriive App Deployment Guide

This document provides comprehensive instructions for deploying the Arriive location-based alarm application to various environments.

## 📱 Mobile App Deployment

### Android APK Generation

#### Prerequisites
- Android Studio installed
- JDK 11+ installed
- Android SDK installed
- Signing keys generated

#### Generate Debug APK

1. **Build the web application**:
   \`\`\`bash
   npm run build:mobile
   npm run sync
   \`\`\`

2. **Open Android Studio**:
   \`\`\`bash
   npm run open:android
   \`\`\`

3. **Build Debug APK**:
   - In Android Studio, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - The APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Generate Release APK

1. **Generate a signing key** (if you don't have one):
   \`\`\`bash
   keytool -genkey -v -keystore arriive-release-key.keystore -alias arriive-key -keyalg RSA -keysize 2048 -validity 10000
   \`\`\`

2. **Configure signing in `android/app/build.gradle`**:
   ```gradle
   android {
     // ...
     signingConfigs {
       release {
         storeFile file("../../arriive-release-key.keystore")
         storePassword "your-store-password"
         keyAlias "arriive-key"
         keyPassword "your-key-password"
       }
     }
     buildTypes {
       release {
         signingConfig signingConfigs.release
         // ...
       }
     }
   }
   \`\`\`

3. **Build Release APK**:
   \`\`\`bash
   cd android
   ./gradlew assembleRelease
   \`\`\`

4. **Find the APK** at:
   \`\`\`
   android/app/build/outputs/apk/release/app-release.apk
   \`\`\`

### Google Play Store Deployment

1. **Create a Google Play Developer account** if you don't have one
2. **Create a new application** in the Google Play Console
3. **Prepare store listing**:
   - App name: Arriive
   - Short description
   - Full description
   - Screenshots
   - Feature graphic
   - Privacy policy URL
4. **Upload the signed APK** or App Bundle
5. **Complete the content rating questionnaire**
6. **Set up pricing and distribution**
7. **Submit for review**

## 🌐 Web Deployment

### Vercel Deployment

1. **Connect your GitHub repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Set environment variables** in the Vercel dashboard
4. **Deploy**

### Custom Server Deployment

1. **Build the application**:
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set up a Node.js server** or use a static file server
3. **Configure HTTPS** with a valid SSL certificate
4. **Set up environment variables**
5. **Deploy the `dist` directory**

## 🔄 CI/CD Pipeline

### GitHub Actions

Create a `.github/workflows/deploy.yml` file:

\`\`\`yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          distribution: 'adopt'
          java-version: '11'
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build web
        run: npm run build:mobile
      - name: Sync Capacitor
        run: npx cap sync android
      - name: Build Android
        run: |
          cd android
          ./gradlew assembleDebug
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk
\`\`\`

## 🔒 Security Configuration

### Environment Variables

Create a `.env.local` file for local development:

\`\`\`
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
\`\`\`

For production, set these variables in your hosting platform's dashboard.

### Content Security Policy

Add to `next.config.js`:

\`\`\`javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.example.com;"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];

module.exports = {
  // ...
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
\`\`\`

## 📊 Monitoring and Analytics

### Error Tracking

**Sentry Integration:**
\`\`\`typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
\`\`\`

### Performance Monitoring

**Google Analytics:**
\`\`\`typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}
\`\`\`

### Health Checks

**API Health Endpoint:**
\`\`\`typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
\`\`\`

## 🚀 Performance Optimization

### Build Optimization

**Next.js Configuration:**
\`\`\`typescript
// next.config.mjs
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  experimental: {
    optimizeCss: true
  }
}
\`\`\`

### Mobile Optimization

**Capacitor Configuration:**
\`\`\`typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3B82F6"
    }
  },
  android: {
    allowMixedContent: false,
    captureInput: true
  }
}
\`\`\`

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] ESLint warnings resolved
- [ ] Code review completed

### Security
- [ ] Environment variables configured
- [ ] API keys secured
- [ ] HTTPS enabled
- [ ] Security headers configured

### Performance
- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] Lazy loading implemented
- [ ] Caching configured

### Mobile
- [ ] Tested on physical devices
- [ ] Permissions configured
- [ ] App icons added
- [ ] Store metadata prepared

### Monitoring
- [ ] Error tracking configured
- [ ] Analytics implemented
- [ ] Health checks working
- [ ] Logging configured

## 🆘 Rollback Procedures

### Web Rollback
\`\`\`bash
# Revert to previous deployment
vercel --prod --force

# Or rollback specific commit
git revert <commit-hash>
git push origin main
\`\`\`

### Mobile Rollback
- Use app store rollback features
- Prepare hotfix releases
- Communicate with users via in-app messaging

---

**Need help with deployment? Contact our DevOps team or create an issue on GitHub.**
