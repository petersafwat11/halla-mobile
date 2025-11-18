import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "../localization";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "../contexts/ToastContext";
import {
  EmailLoginForm,
  MobileLoginForm,
  OTPVerificationForm,
} from "../components/auth";
import { Button } from "../components/commen";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation("auth");
  const toast = useToast();
  const { loginWithEmail, sendOTP, verifyOTP, status, getTempMobile } =
    useAuthStore();
  const [loginMode, setLoginMode] = useState("email"); // email or mobile
  const [step, setStep] = useState("input"); // input or otp
  const loading = status === "loading";

  const handleEmailLogin = async (data) => {
    const result = await loginWithEmail(data);
    if (result.success) {
      toast.success(t("login.loginButton") + " " + t("common.success"));
      // Navigation handled automatically by AppNavigator
    } else {
      toast.error(result.error || t("errors.loginFailed"));
      return { success: false, fieldErrors: { email: result.error } };
    }
    return result;
  };

  const handleMobileLogin = async (data) => {
    const result = await sendOTP(data);
    if (result.success) {
      toast.success(t("otp.description"));
      setStep("otp");
    } else {
      toast.error(result.error || t("errors.otpFailed"));
      return { success: false, fieldErrors: { mobile: result.error } };
    }
    return result;
  };

  const handleOTPVerification = async (data) => {
    const result = await verifyOTP(data);
    if (result.success) {
      toast.success(t("login.loginButton") + " " + t("common.success"));
      // Navigation handled automatically by AppNavigator
    } else {
      toast.error(result.error || t("errors.otpFailed"));
      return { success: false, fieldErrors: { otp: result.error } };
    }
    return result;
  };

  const handleEditPhone = () => {
    setStep("input");
  };

  const toggleLoginMode = () => {
    setLoginMode(loginMode === "email" ? "mobile" : "email");
    setStep("input");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgetPassword");
  };

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {step === "input" ? (
              <>
                {loginMode === "email" ? (
                  <EmailLoginForm
                    onSubmit={handleEmailLogin}
                    loading={loading}
                  />
                ) : (
                  <MobileLoginForm
                    onSubmit={handleMobileLogin}
                    loading={loading}
                  />
                )}

                {/* Forgot Password */}
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  style={styles.forgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>
                    {t("login.forgotPassword")}
                  </Text>
                </TouchableOpacity>

                {/* Toggle Login Mode */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>{t("login.or")}</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button
                  text={
                    loginMode === "email"
                      ? t("login.loginWithMobile")
                      : t("login.loginWithEmail")
                  }
                  onPress={toggleLoginMode}
                  variant="outline"
                />

                {/* Signup Link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>{t("login.noAccount")} </Text>
                  <TouchableOpacity onPress={handleSignup}>
                    <Text style={styles.signupLink}>{t("login.signUp")}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <OTPVerificationForm
                onSubmit={handleOTPVerification}
                onEditPhone={handleEditPhone}
                phoneNumber={`+966${getTempMobile()}`}
                loading={loading}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  content: {
    paddingHorizontal: width > 768 ? 80 : width > 480 ? 40 : 24,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#c28e5c",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#999",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#666",
  },
  signupLink: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#c28e5c",
  },
});
