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
import { accountSettingsSchema } from "../../utils/schemas/settingsSchema";
import {
  TextInput,
  EmailInput,
  PasswordInput,
  Button,
  OTPInput,
} from "../commen";
import { useLanguage, useTranslation } from "../../localization";
import { useAuthStore } from "../../stores/authStore";
import { useToast } from "../../contexts/ToastContext";

const AccountSettings = ({ onUpdate }) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslation("settings");
  const toast = useToast();
  const { user } = useAuthStore();

  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(accountSettingsSchema),
    mode: "onChange",
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const emailValue = watch("email");

  const handleSendVerificationCode = async () => {
    setIsVerifyingEmail(true);
    try {
      // TODO: Call API to send verification code
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowVerificationInput(true);
      toast.success(t("account.verificationCodeSent"));
    } catch (error) {
      toast.error(error.message || t("account.verificationCodeError"));
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error(t("account.invalidVerificationCode"));
      return;
    }

    setIsVerifyingEmail(true);
    try {
      // TODO: Call API to verify code
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(t("account.emailVerified"));
      setShowVerificationInput(false);
      setVerificationCode("");
    } catch (error) {
      toast.error(error.message || t("account.verificationError"));
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updateData = {
        username: data.username,
        email: data.email,
      };

      if (data.newPassword) {
        updateData.password = data.newPassword;
        updateData.passwordConfirm = data.confirmPassword;
      }

      await onUpdate(updateData);
      toast.success(t("account.updateSuccess"));
      reset(data);
    } catch (error) {
      toast.error(error.message || t("account.updateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t("account.personalInfo")}
          </Text>

          <View style={styles.inputsGroup}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={t("account.fullName")}
                  placeholder={t("account.fullNamePlaceholder")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  disabled={loading}
                  error={errors.username && t(errors.username.message)}
                />
              )}
            />

            <View style={styles.emailWrapper}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <EmailInput
                    label={t("account.email")}
                    placeholder={t("account.emailPlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    disabled={loading}
                    error={errors.email && t(errors.email.message)}
                  />
                )}
              />

              {!showVerificationInput && (
                <TouchableOpacity
                  style={[styles.verifyButton, isRTL && styles.verifyButtonRTL]}
                  onPress={handleSendVerificationCode}
                  disabled={isVerifyingEmail || !emailValue}
                  activeOpacity={0.7}
                >
                  <Text style={styles.verifyButtonText}>
                    {isVerifyingEmail
                      ? t("account.sending")
                      : t("account.sendCode")}
                  </Text>
                </TouchableOpacity>
              )}

              {showVerificationInput && (
                <View style={styles.verificationGroup}>
                  <OTPInput
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    length={6}
                  />
                  <TouchableOpacity
                    style={[
                      styles.verifyCodeButton,
                      (isVerifyingEmail || verificationCode.length !== 6) &&
                        styles.verifyCodeButtonDisabled,
                    ]}
                    onPress={handleVerifyCode}
                    disabled={isVerifyingEmail || verificationCode.length !== 6}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.verifyCodeButtonText}>
                      {isVerifyingEmail
                        ? t("account.verifying")
                        : t("account.verifyCode")}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Change Password Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t("account.changePassword")}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              isRTL && styles.sectionDescriptionRTL,
            ]}
          >
            {t("account.changePasswordDescription")}
          </Text>

          <View style={styles.inputsGroup}>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label={t("account.newPassword")}
                  placeholder={t("account.newPasswordPlaceholder")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  disabled={loading}
                  error={errors.newPassword && t(errors.newPassword.message)}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label={t("account.confirmPassword")}
                  placeholder={t("account.confirmPasswordPlaceholder")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  disabled={loading}
                  error={
                    errors.confirmPassword && t(errors.confirmPassword.message)
                  }
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
            <Text style={styles.cancelButtonText}>{t("account.cancel")}</Text>
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
              {loading ? t("account.saving") : t("account.saveChanges")}
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
  inputsGroup: {
    width: "100%",
  },
  emailWrapper: {
    width: "100%",
  },
  verifyButton: {
    backgroundColor: "#c28e5c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  verifyButtonRTL: {
    alignSelf: "flex-start",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
  },
  verificationGroup: {
    marginTop: 16,
    width: "100%",
  },
  verifyCodeButton: {
    backgroundColor: "#c28e5c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  verifyCodeButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  verifyCodeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c28e5c",
    alignItems: "center",
    maxWidth: 140,
  },
  cancelButtonRTL: {
    // No specific RTL style needed
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
  saveButtonRTL: {
    // No specific RTL style needed
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

export default AccountSettings;
