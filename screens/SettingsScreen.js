import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage, useTranslation } from "../localization";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "../contexts/ToastContext";
import SettingsTabs from "../components/settings/SettingsTabs";

export default function SettingsScreen({ navigation }) {
  const { isRTL } = useLanguage();
  const { t } = useTranslation("settings");
  const toast = useToast();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast.success(t("tabs.logout") + " " + "successfully");
  };

  const handleTabChange = (tabId) => {
    if (tabId === "about" || tabId === "privacy" || tabId === "terms") {
      // TODO: Navigate to static pages
      toast.info("Coming soon");
      return;
    }

    // Navigate to the specific settings screen
    if (tabId === "account") {
      navigation.navigate("AccountSettings");
    } else if (tabId === "notifications") {
      navigation.navigate("NotificationSettings");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
          {t("title")}
        </Text>
      </View>

      {/* Settings Tabs List */}
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <SettingsTabs
            activeTab={null}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerRTL: {
    // No specific RTL style needed
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Cairo_700Bold",
    color: "#2c2c2c",
  },
  headerTitleRTL: {
    textAlign: "right",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
});
