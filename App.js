import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import {
  Cairo_300Light,
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_900Black,
} from "@expo-google-fonts/cairo";

import { LanguageProvider, useLanguage } from "./localization";
import { ToastProvider } from "./contexts/ToastContext";
import { useAuthStore } from "./stores/authStore";
import AppNavigator from "./navigation/AppNavigator";
import LanguageSelector from "./components/languagePrefrence/LanguageSelector";

// Keep splash screen visible until assets load
SplashScreen.preventAutoHideAsync();

/* ------------------------------------------------- */
/*                APP CONTENT (MAIN UI)              */
/* ------------------------------------------------- */

function AppContent() {
  const { hasSelectedLanguage, changeLanguage } = useLanguage();
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, []);

  const handleLanguageSelect = async (code) => {
    await changeLanguage(code);
  };

  // User must pick a language before using the app
  if (!hasSelectedLanguage) {
    return (
      <View style={styles.centered}>
        <LanguageSelector onLanguageSelect={handleLanguageSelect} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

/* ------------------------------------------------- */
/*                  ROOT CONTAINER                   */
/* ------------------------------------------------- */

function AppRoot() {
  const { direction } = useLanguage(); // "rtl" or "ltr"
  const [ready, setReady] = useState(false);

  // Load fonts & prepare app
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          Cairo_300Light,
          Cairo_400Regular,
          Cairo_600SemiBold,
          Cairo_700Bold,
          Cairo_900Black,
        });

        // Simulate slow loading (optional)
        await new Promise((res) => setTimeout(res, 1000));
      } catch (err) {
        console.warn(err);
      } finally {
        setReady(true);
      }
    }
    prepare();
  }, []);

  // Hide splash screen once layout is ready
  const onLayout = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync();
    }
  }, [ready]);

  // Root container style based on language direction
  const containerStyle = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          direction: direction,
        },
      }),
    [direction]
  );

  if (!ready) return null;

  return (
    <View style={containerStyle.container} onLayout={onLayout}>
      <AppContent />
    </View>
  );
}

/* ------------------------------------------------- */
/*                       MAIN APP                    */
/* ------------------------------------------------- */

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ToastProvider>
          <AppRoot />
        </ToastProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

/* ------------------------------------------------- */
/*                      STYLES                       */
/* ------------------------------------------------- */

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
