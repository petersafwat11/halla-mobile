import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationSettingsSchema } from "../../utils/schemas/settingsSchema";
import { ToggleInput } from "../commen";
import { useLanguage, useTranslation } from "../../localization";
import { useToast } from "../../contexts/ToastContext";

const NotificationSettings = ({ initialData, onUpdate }) => {
  const { isRTL } = useLanguage();
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

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    mode: "onChange",
    defaultValues: initialData || defaultValues,
  });

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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t("notifications.appNotifications")}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              isRTL && styles.sectionDescriptionRTL,
            ]}
          >
            {t("notifications.appNotificationsDescription")}
          </Text>

          <View style={styles.togglesGroup}>
            <Controller
              control={control}
              name="appNotifications.eventUpdates"
              render={({ field: { onChange, value } }) => (
                <ToggleInput
                  label={t("notifications.eventUpdates")}
                  value={value}
                  onValueChange={onChange}
                  disabled={loading}
                />
              )}
            />

            <Controller
              control={control}
              name="appNotifications.eventDates"
              render={({ field: { onChange, value } }) => (
                <ToggleInput
                  label={t("notifications.eventDates")}
                  value={value}
                  onValueChange={onChange}
                  disabled={loading}
                />
              )}
            />

            <Controller
              control={control}
              name="appNotifications.packageRenewal"
              render={({ field: { onChange, value } }) => (
                <ToggleInput
                  label={t("notifications.packageRenewal")}
                  value={value}
                  onValueChange={onChange}
                  disabled={loading}
                />
              )}
            />

            <Controller
              control={control}
              name="appNotifications.systemInteractions"
              render={({ field: { onChange, value } }) => (
                <ToggleInput
                  label={t("notifications.systemInteractions")}
                  value={value}
                  onValueChange={onChange}
                  disabled={loading}
                />
              )}
            />
          </View>
        </View>

        {/* Email Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t("notifications.emailNotifications")}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              isRTL && styles.sectionDescriptionRTL,
            ]}
          >
            {t("notifications.emailNotificationsDescription")}
          </Text>

          <View style={styles.togglesGroup}>
            <Controller
              control={control}
              name="emailNotifications.eventUpdates"
              render={({ field: { onChange, value } }) => (
                <ToggleInput
                  label={t("notifications.eventUpdates")}
                  value={value}
                  onValueChange={onChange}
                  disabled={loading}
                />
              )}
            />

            <Controller
              control={control}
              name="emailNotifications.eventDates"
              render={({ field: { onChange, value } }) => (
                <ToggleInput
                  label={t("notifications.eventDates")}
                  value={value}
                  onValueChange={onChange}
                  disabled={loading}
                />
              )}
            />

            <Controller
              control={control}
              name="emailNotifications.packageRenewal"
              render={({ field: { onChange, value } }) => (
                <ToggleInput
                  label={t("notifications.packageRenewal")}
                  value={value}
                  onValueChange={onChange}
                  disabled={loading}
                />
              )}
            />

            <Controller
              control={control}
              name="emailNotifications.beforeSendingInvitations"
              render={({ field: { onChange, value } }) => (
                <ToggleInput
                  label={t("notifications.beforeSendingInvitations")}
                  value={value}
                  onValueChange={onChange}
                  disabled={loading}
                />
              )}
            />

            <Controller
              control={control}
              name="emailNotifications.afterSendingInvitations"
              render={({ field: { onChange, value } }) => (
                <ToggleInput
                  label={t("notifications.afterSendingInvitations")}
                  value={value}
                  onValueChange={onChange}
                  disabled={loading}
                />
              )}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View
          style={[styles.buttonContainer, isRTL && styles.buttonContainerRTL]}
        >
          <TouchableOpacity
            style={[styles.cancelButton, isRTL && styles.cancelButtonRTL]}
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
              isRTL && styles.saveButtonRTL,
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
  sectionTitleRTL: {
    textAlign: "right",
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionDescriptionRTL: {
    textAlign: "right",
  },
  togglesGroup: {
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  buttonContainerRTL: {
    flexDirection: "row-reverse",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c28e5c",
    alignItems: "center",
  },
  cancelButtonRTL: {
    // No specific RTL style needed
  },
  cancelButtonText: {
    color: "#c28e5c",
    fontSize: 15,
    fontFamily: "Cairo_600SemiBold",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#c28e5c",
    alignItems: "center",
  },
  saveButtonRTL: {
    // No specific RTL style needed
  },
  saveButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Cairo_600SemiBold",
  },
});

export default NotificationSettings;
