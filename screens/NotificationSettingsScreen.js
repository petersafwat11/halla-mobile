import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage, useTranslation } from "../localization";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "../contexts/ToastContext";
import NotificationSettings from "../components/settings/NotificationSettings";
import {
  getNotificationPreferencesAPI,
  updateNotificationPreferencesAPI,
} from "../services/settingsService";

export default function NotificationSettingsScreen({ navigation }) {
  const { isRTL } = useLanguage();
  const { t } = useTranslation("settings");
  const toast = useToast();
  const { token } = useAuthStore();

  const [notificationPreferences, setNotificationPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationPreferences();
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header with Back Button */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity
          style={[styles.backButton, isRTL && styles.backButtonRTL]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isRTL ? "chevron-forward" : "chevron-back"}
            size={24}
            color="#2c2c2c"
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
          {t("tabs.notifications")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Notification Settings Content */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerRTL: {
    flexDirection: "row-reverse",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backButtonRTL: {
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Cairo_700Bold",
    color: "#2c2c2c",
    flex: 1,
    textAlign: "center",
  },
  headerTitleRTL: {
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
