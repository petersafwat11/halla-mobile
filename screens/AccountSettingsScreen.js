import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage, useTranslation } from "../localization";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "../contexts/ToastContext";
import AccountSettings from "../components/settings/AccountSettings";
import { updateAccountAPI } from "../services/settingsService";

export default function AccountSettingsScreen({ navigation }) {
  const { isRTL } = useLanguage();
  const { t } = useTranslation("settings");
  const toast = useToast();
  const { token } = useAuthStore();

  const handleAccountUpdate = async (data) => {
    const response = await updateAccountAPI(data, token);
    // Update user in auth store if needed
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
          {t("tabs.account")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Account Settings Content */}
      <AccountSettings onUpdate={handleAccountUpdate} />
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
});
