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
  SignupMobileForm,
  OTPVerificationForm,
  CompleteProfileForm,
} from "../components/auth";

const { width } = Dimensions.get("window");

export default function SignupScreen({ navigation }) {
  const { t } = useTranslation("auth");
  const toast = useToast();
  const { sendOTP, verifyOTP, signup, status, getTempMobile } = useAuthStore();
  const [step, setStep] = useState("mobile"); // mobile, otp, complete
  const loading = status === "loading";

  const handleMobileSubmit = async (data) => {
    const result = await sendOTP(data);
    if (result.success) {
      toast.success(t("otp.description"));
      setStep("otp");
    } else {
      toast.error(result.error || t("errors.signupFailed"));
      return { success: false, fieldErrors: { mobile: result.error } };
    }
    return result;
  };

  const handleOTPVerification = async (data) => {
    const result = await verifyOTP(data);
    if (result.success) {
      toast.success(t("otp.verifyButton") + " " + t("common.success"));
      setStep("complete");
    } else {
      toast.error(result.error || t("errors.otpFailed"));
      return { success: false, fieldErrors: { otp: result.error } };
    }
    return result;
  };

  const handleCompleteProfile = async (data) => {
    const result = await signup(data);
    if (result.success) {
      toast.success(t("signup.signupButton") + " " + t("common.success"));
      // Navigation handled automatically by AppNavigator
    } else {
      toast.error(result.error || t("errors.signupFailed"));
      return { success: false, fieldErrors: { email: result.error } };
    }
    return result;
  };

  const handleEditPhone = () => {
    setStep("mobile");
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const renderStep = () => {
    switch (step) {
      case "mobile":
        return (
          <>
            <SignupMobileForm onSubmit={handleMobileSubmit} loading={loading} />
            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{t("signup.hasAccount")} </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>{t("signup.signIn")}</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case "otp":
        return (
          <OTPVerificationForm
            onSubmit={handleOTPVerification}
            onEditPhone={handleEditPhone}
            phoneNumber={`+966${getTempMobile()}`}
            loading={loading}
          />
        );
      case "complete":
        return (
          <CompleteProfileForm
            onSubmit={handleCompleteProfile}
            loading={loading}
          />
        );
      default:
        return null;
    }
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
          <View style={styles.content}>{renderStep()}</View>
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#c28e5c",
  },
});
