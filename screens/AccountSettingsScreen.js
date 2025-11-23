import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "../localization";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "../contexts/ToastContext";
import AccountSettings from "../components/settings/AccountSettings";
import { updateAccountAPI } from "../services/settingsService";
import { TopBar } from "../components/plans";

export default function AccountSettingsScreen({ navigation }) {
  const { t } = useTranslation("settings");
  const toast = useToast();
  const { token } = useAuthStore();

  const handleAccountUpdate = async (data) => {
    const response = await updateAccountAPI(data, token);
    // Update user in auth store if needed
    return response;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <TopBar title={t("tabs.account")} showBack={true} />
        <AccountSettings onUpdate={handleAccountUpdate} />
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
});
