import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'service24PROV',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '19',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      AutoHideSplashScreen: 'false',
      SplashScreenDelay: '10000',
      FadeSplashScreenDuration: '1000',
      SplashScreen: 'screen',
      ShowSplashScreen: 'true',
      ShowSplashScreenSpinner: 'false',
      SplashShowOnlyFirstTime: 'false',
      FadeSplashScreen: 'true',
      'cordova.plugins.diagnostic.modules': 'LOCATION WIFI CAMERA NOTIFICATIONS EXTERNAL_STORAGE'
    }
  }
};

export default config;
