# Arriive - Location-Based Alarm App

Arriive is a mobile application that alerts you when you're approaching your destination. Set alarms based on GPS location and get notified when you're within a specified distance of your destination.

## 🌟 Features

- **Location-Based Alarms**: Set alarms that trigger when you're near a destination
- **Custom Proximity**: Choose how far from your destination you want to be notified
- **Custom Ringtones**: Use built-in sounds or add your own custom ringtones
- **Background Tracking**: Alarms work even when the app is in the background
- **Alarm History**: View a history of your triggered alarms
- **Dark Mode**: Choose between light and dark themes
- **User Profiles**: Create and manage your user profile
- **Subscription Plans**: Free and premium plans with different features

## 🛠️ Tech Stack

- **Framework**: Next.js with React
- **Mobile**: Capacitor for native mobile functionality
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Authentication**: Custom auth implementation (can be replaced with Firebase, Auth0, etc.)
- **Geolocation**: Capacitor Geolocation plugin
- **Notifications**: Capacitor Local Notifications plugin
- **Storage**: Local storage and Capacitor Filesystem

## 📋 Prerequisites

- Node.js (v18+)
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)
- Java JDK 11+

## 🚀 Getting Started

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/arriive-app.git
cd arriive-app

# Install dependencies
npm install
\`\`\`

### Development

\`\`\`bash
# Run web development server
npm run dev

# Build for mobile
npm run build:mobile

# Add Android platform
npx cap add android

# Sync web code with native projects
npm run sync

# Open in Android Studio
npm run open:android
\`\`\`

### Building APK

\`\`\`bash
# Build debug APK
npm run android

# For release APK, follow the steps in DEPLOYMENT.md
\`\`\`

## 📱 Mobile Development

### Android Setup

1. Install Android Studio
2. Install Android SDK (API level 30+)
3. Set up Android Virtual Device or connect physical device
4. Run `npm run android` to build and deploy

### Custom Ringtones

The app supports custom ringtones with the following features:

- Upload audio files (MP3, WAV, OGG, M4A)
- Preview sounds before selection
- Manage custom ringtone library
- Set different ringtones for different alarms

## 📄 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](./API.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Capacitor](https://capacitorjs.com/) for native mobile functionality
- [Lucide Icons](https://lucide.dev/) for beautiful icons
