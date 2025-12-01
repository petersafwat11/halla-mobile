import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationSettingsSchema } from "../../utils/schemas/settingsSchema";
import { ToggleInput } from "../commen";
import { useTranslation } from "../../localization";
import { useToast } from "../../contexts/ToastContext";

const NotificationSettings = ({ initialData, onUpdate }) => {
  const { t } = useTranslation("settings");
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const defaultValues = {
    appNotifications: {
      eventUpdates: true,
      eventDates: true,
      packageRenewal: true,
      systemInteractions: true,
    },
    emailNotifications: {
      eventUpdates: false,
      eventDates: false,
      packageRenewal: false,
      beforeSendingInvitations: false,
      afterSendingInvitations: false,
    },
  };

  const methods = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = methods;

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onUpdate(data);
      toast.success(t("notifications.updateSuccess"));
      reset(data);
    } catch (error) {
      toast.error(error.message || t("notifications.updateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset(initialData || defaultValues);
  };

  return (
    <FormProvider {...methods}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* App Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("notifications.appNotifications")}
            </Text>
            <Text style={[styles.sectionDescription]}>
              {t("notifications.appNotificationsDescription")}
            </Text>

            <View style={styles.togglesGroup}>
              <ToggleInput
                name="appNotifications.eventUpdates"
                label={t("notifications.eventUpdates")}
                disabled={loading}
              />

              <ToggleInput
                name="appNotifications.eventDates"
                label={t("notifications.eventDates")}
                disabled={loading}
              />

              <ToggleInput
                name="appNotifications.packageRenewal"
                label={t("notifications.packageRenewal")}
                disabled={loading}
              />

              <ToggleInput
                name="appNotifications.systemInteractions"
                label={t("notifications.systemInteractions")}
                disabled={loading}
              />
            </View>
          </View>

          {/* Email Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("notifications.emailNotifications")}
            </Text>
            <Text style={[styles.sectionDescription]}>
              {t("notifications.emailNotificationsDescription")}
            </Text>

            <View style={styles.togglesGroup}>
              <ToggleInput
                name="emailNotifications.eventUpdates"
                label={t("notifications.eventUpdates")}
                disabled={loading}
              />

              <ToggleInput
                name="emailNotifications.eventDates"
                label={t("notifications.eventDates")}
                disabled={loading}
              />

              <ToggleInput
                name="emailNotifications.packageRenewal"
                label={t("notifications.packageRenewal")}
                disabled={loading}
              />

              <ToggleInput
                name="emailNotifications.beforeSendingInvitations"
                label={t("notifications.beforeSendingInvitations")}
                disabled={loading}
              />

              <ToggleInput
                name="emailNotifications.afterSendingInvitations"
                label={t("notifications.afterSendingInvitations")}
                disabled={loading}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading || !isDirty}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>
                {t("notifications.cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!isDirty || loading) && styles.saveButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isDirty || loading}
              activeOpacity={0.7}
            >
              <Text style={styles.saveButtonText}>
                {loading
                  ? t("notifications.saving")
                  : t("notifications.saveChanges")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Cairo_700Bold",
    color: "#2c2c2c",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  togglesGroup: {
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c28e5c",
    alignItems: "center",
    maxWidth: 140,
  },
  cancelButtonText: {
    color: "#c28e5c",
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#c28e5c",
    alignItems: "center",
    maxWidth: 140,
  },
  saveButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
  },
});

export default NotificationSettings;
