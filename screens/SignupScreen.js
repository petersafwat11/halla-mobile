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
  const {
    signupWithPhone,
    completeProfile,
    status,
    getTempMobile,
    tempMobile,
  } = useAuthStore();
  // Derive step from tempMobile in auth store: if we have a temp phone, go to complete profile
  const step = tempMobile ? "complete" : "mobile"; // mobile, complete
  const loading = status === "loading";

  // Debug: Log step and status changes
  React.useEffect(() => {
    console.log("[SIGNUP] Step changed to:", step);
    console.log("[SIGNUP] Status:", status);
    console.log("[SIGNUP] Loading:", loading);
  }, [step, status, loading]);

  const handleMobileSubmit = async (data) => {
    console.log("[SIGNUP] Submitting phone:", data);
    const result = await signupWithPhone(data);
    console.log("[SIGNUP] Result:", result);
    if (result.success) {
      console.log("[SIGNUP] Success! Changing step to complete");
      toast.success("Phone number registered!");
      // Step will automatically switch to "complete" because tempMobile is set in auth store
    } else {
      console.log("[SIGNUP] Failed:", result.error);
      toast.error(result.error || t("errors.signupFailed"));
      return { success: false, fieldErrors: { mobile: result.error } };
    }
    return result;
  };

  const handleCompleteProfile = async (data) => {
    console.log("[SIGNUP] Submitting complete profile:", data);
    const result = await completeProfile(data);
    console.log("[SIGNUP] Complete profile result:", result);
    console.log("[SIGNUP] Complete profile result success:", result.success);
    console.log("[SIGNUP] Complete profile result error:", result.error);
    if (result.success) {
      console.log("[SIGNUP] Complete profile success!");
      toast.success(t("signup.signupButton") + " " + t("common.success"));
      // Navigation handled automatically by AppNavigator
    } else {
      console.log("[SIGNUP] Complete profile failed:", result.error);
      toast.error(result.error || t("errors.signupFailed"));
      return { success: false, fieldErrors: { email: result.error } };
    }
    return result;
  };

  const handleEditPhone = () => {
    console.log("[SIGNUP] Editing phone");
    // Clearing tempMobile will bring us back to the mobile step
    // (we can rely on logout or a dedicated action if needed)
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
