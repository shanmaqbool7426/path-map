export default {
  expo: {
    name: 'PathPilot AI',
    slug: 'pathpilot-ai',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'pathpilot',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0A0E1A',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.pathpilot.ai',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#0A0E1A',
      },
      package: 'com.pathpilot.ai',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#0A0E1A',
          image: './assets/images/splash.png',
          imageWidth: 200,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      openaiApiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      openaiBaseUrl: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    },
  },
};
