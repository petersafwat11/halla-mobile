import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "../localization";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "../contexts/ToastContext";
import NotificationSettings from "../components/settings/NotificationSettings";
import {
  getNotificationPreferencesAPI,
  updateNotificationPreferencesAPI,
} from "../services/settingsService";
import { TopBar } from "../components/plans";

export default function NotificationSettingsScreen({ navigation }) {
  const { t, currentLanguage, isRTL } = useTranslation("settings");
  const toast = useToast();
  const { token } = useAuthStore();

  const [notificationPreferences, setNotificationPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(
      "[NotificationSettingsScreen] Mounted | Language:",
      currentLanguage,
      "| RTL:",
      isRTL
    );
    loadNotificationPreferences();

    return () => {
      console.log("[NotificationSettingsScreen] Unmounted");
    };
  }, []);

  const loadNotificationPreferences = async () => {
    setLoading(true);
    try {
      const response = await getNotificationPreferencesAPI(token);
      setNotificationPreferences(response.data);
    } catch (error) {
      console.error("Failed to load notification preferences:", error);
      toast.error(error.message || "Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (data) => {
    const response = await updateNotificationPreferencesAPI(data, token);
    setNotificationPreferences(data);
    return response;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <TopBar title={t("tabs.notifications")} showBack={true} />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c28e5c" />
          </View>
        ) : (
          <NotificationSettings
            initialData={notificationPreferences}
            onUpdate={handleNotificationUpdate}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#C28E5C",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
  },
});
