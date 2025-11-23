import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, I18nManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import {
  Cairo_300Light,
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_900Black,
} from "@expo-google-fonts/cairo";
import * as SplashScreen from "expo-splash-screen";

import { LanguageProvider, useLanguage } from "./localization";
import { ToastProvider } from "./contexts/ToastContext";
import { useAuthStore } from "./stores/authStore";
import AppNavigator from "./navigation/AppNavigator";
import LanguageSelector from "./components/languagePrefrence/LanguageSelector";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Main app content component
function AppContent() {
  const { hasSelectedLanguage, changeLanguage, isRTL } = useLanguage();
  const restoreSession = useAuthStore((state) => state.restoreSession);

  // Set RTL direction based on language
  React.useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      // Note: In production, you might need to reload the app for RTL changes to take full effect
      // Updates.reloadAsync(); // Uncomment if using expo-updates
    }
  }, [isRTL]);

  // Restore auth session on mount
  React.useEffect(() => {
    restoreSession();
  }, []);

  const handleLanguageSelect = async (languageCode) => {
    await changeLanguage(languageCode);
  };

  // Show language selector if user hasn't selected a language yet
  if (!hasSelectedLanguage) {
    return (
      <View style={styles.container}>
        <LanguageSelector onLanguageSelect={handleLanguageSelect} />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Show main app navigation if language is selected
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          Cairo_300Light,
          Cairo_400Regular,
          Cairo_600SemiBold,
          Cairo_700Bold,
          Cairo_900Black,
        });

        // Artificially delay for one second to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ToastProvider>
          <View style={styles.container} onLayout={onLayoutRootView}>
            <AppContent />
          </View>
        </ToastProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
