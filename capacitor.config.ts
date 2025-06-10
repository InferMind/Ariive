import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.arriive.app",
  appName: "Arriive",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3B82F6",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
    LocalNotifications: {
      smallIcon: "ic_stat_location",
      iconColor: "#3B82F6",
    },
    Geolocation: {
      permissions: {
        android: {
          highAccuracy: true,
        },
      },
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    backgroundColor: "#3B82F6",
    buildOptions: {
      keystorePath: "arriive-release-key.keystore",
      keystoreAlias: "arriive-key",
    },
  },
}

export default config
