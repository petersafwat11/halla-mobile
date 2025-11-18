import React, { createContext, useContext, useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { i18nConfig } from "../config/i18nConfig";
import { languageStorage } from "../../utils/languageStorage";

const LanguageContext = createContext({});

const LANGUAGE_STORAGE_KEY = "@app_language";

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(
    i18nConfig.defaultLocale
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

  // Initialize language on app start
  useEffect(() => {
    initializeLanguage();
  }, []);

  // Listen for device locale changes
  useEffect(() => {
    const handleLocalizationChange = () => {
      if (!currentLanguage) {
        const deviceLocale = i18nConfig.getDeviceLocale();
        changeLanguage(deviceLocale);
      }
    };

    // Note: expo-localization doesn't have event listeners like react-native-localize
    // The app will use the locale detected at startup
    // For dynamic locale changes, you'd need to implement app state change detection

    return () => {
      // Cleanup if needed
    };
  }, [currentLanguage]);

  const initializeLanguage = async () => {
    try {
      // Check if user has already selected a language
      const hasSelected = await languageStorage.hasSelectedLanguage();
      setHasSelectedLanguage(hasSelected);

      if (hasSelected) {
        // Use saved language if user has selected one
        const savedLanguage = await languageStorage.getLanguage();
        if (savedLanguage && i18nConfig.locales.includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage);
          await i18n.changeLanguage(savedLanguage);
        } else {
          // Fallback to default if saved language is invalid
          setCurrentLanguage(i18nConfig.defaultLocale);
          await i18n.changeLanguage(i18nConfig.defaultLocale);
        }
      } else {
        // Don't auto-detect device language, let user choose
        // Set to default but don't mark as selected
        setCurrentLanguage(i18nConfig.defaultLocale);
        await i18n.changeLanguage(i18nConfig.defaultLocale);
      }
    } catch (error) {
      console.error("Error initializing language:", error);
      // Fallback to default locale
      setCurrentLanguage(i18nConfig.defaultLocale);
      await i18n.changeLanguage(i18nConfig.defaultLocale);
      setHasSelectedLanguage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode) => {
    try {
      if (i18nConfig.locales.includes(languageCode)) {
        setCurrentLanguage(languageCode);
        await i18n.changeLanguage(languageCode);
        await languageStorage.saveLanguage(languageCode);
        setHasSelectedLanguage(true);
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const isRTL = () => {
    return i18nConfig.isRTL(currentLanguage);
  };

  const getDirection = () => {
    return i18nConfig.getDirection(currentLanguage);
  };

  const contextValue = {
    currentLanguage,
    changeLanguage,
    isRTL: isRTL(),
    direction: getDirection(),
    availableLanguages: i18nConfig.locales,
    isLoading,
    hasSelectedLanguage,
  };

  if (isLoading) {
    // Return a loading component or null while initializing
    return null;
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageProvider;
