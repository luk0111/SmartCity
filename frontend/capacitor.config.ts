import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartcity.app',
  appName: 'SmartCity',
  webDir: 'dist',
  server: {
    cleartext : true
  }
};

export default config;
