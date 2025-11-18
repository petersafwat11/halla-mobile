import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loginWithEmailAPI,
  sendOTPAPI,
  verifyOTPAPI,
  signupWithPhoneAPI,
  completeProfileAPI,
  forgotPasswordAPI,
  logoutAPI,
} from "../services/authService";

const AUTH_STORAGE_KEY = "@auth_state";

// Initial state
const initialState = {
  user: null,
  token: null,
  // 'checking' | 'loading' | 'authenticated' | 'unauthenticated'
  // 'checking' is used only while restoring session on app start
  status: "checking",
  error: null,
  // Temporary storage for multi-step flows
  tempMobile: null,
};

export const useAuthStore = create((set, get) => ({
  ...initialState,

  /**
   * Restore session from AsyncStorage on app start
   */
  restoreSession: async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const { user, token } = JSON.parse(storedAuth);
        set({
          user,
          token,
          status: "authenticated",
          error: null,
        });
        console.log("Session restored:", user);
      } else {
        set({ status: "unauthenticated" });
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      set({ status: "unauthenticated", error: error.message });
    }
  },

  /**
   * Persist auth state to AsyncStorage
   */
  persistAuth: async (user, token) => {
    try {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user, token })
      );
    } catch (error) {
      console.error("Failed to persist auth:", error);
    }
  },

  /**
   * Login with email and password
   */
  loginWithEmail: async ({ email, password }) => {
    set({ status: "loading", error: null });
    try {
      const { token, user } = await loginWithEmailAPI({ email, password });
      await get().persistAuth(user, token);
      set({
        user,
        token,
        status: "authenticated",
        error: null,
      });
      return { success: true };
    } catch (error) {
      set({
        status: "unauthenticated",
        error: error.message || "Login failed",
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Send OTP to mobile number (for login or signup)
   */
  sendOTP: async ({ mobile }) => {
    set({ status: "loading", error: null, tempMobile: mobile });
    try {
      await sendOTPAPI({ mobile });
      set({ status: "unauthenticated", error: null });
      return { success: true };
    } catch (error) {
      set({
        status: "unauthenticated",
        error: error.message || "Failed to send OTP",
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Verify OTP and login
   */
  verifyOTP: async ({ otp }) => {
    const { tempMobile } = get();
    if (!tempMobile) {
      return { success: false, error: "Mobile number not found" };
    }

    set({ status: "loading", error: null });
    try {
      const { token, user } = await verifyOTPAPI({ mobile: tempMobile, otp });
      await get().persistAuth(user, token);
      set({
        user,
        token,
        status: "authenticated",
        error: null,
        tempMobile: null,
      });
      return { success: true };
    } catch (error) {
      set({
        status: "unauthenticated",
        error: error.message || "Invalid OTP",
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Step 1: Signup with phone number only
   */
  signupWithPhone: async ({ mobile }) => {
    console.log("[AUTH STORE] Setting status to loading");
    set({ status: "loading", error: null, tempMobile: mobile });
    try {
      const { token, user } = await signupWithPhoneAPI({ mobile });
      // Store token temporarily for completing profile
      console.log("[AUTH STORE] API success, setting status to idle");
      set({
        token,
        user,
        status: "unauthenticated",
        error: null,
      });
      console.log("[AUTH STORE] Status set to idle, returning success");
      return { success: true };
    } catch (error) {
      console.log("[AUTH STORE] API failed, setting status to idle");
      set({
        status: "unauthenticated",
        error: error.message || "Signup failed",
        // Clear tempMobile on failure so UI stays on phone step
        tempMobile: null,
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Step 2: Complete profile with email, fullName, password
   */
  completeProfile: async ({ fullName, email, password }) => {
    const { token } = get();
    if (!token) {
      return { success: false, error: "No signup token found" };
    }

    set({ status: "loading", error: null });
    try {
      const { token: newToken, user } = await completeProfileAPI({
        username: fullName, // Map fullName to username for backend
        email,
        password,
        token,
      });
      await get().persistAuth(user, newToken);
      set({
        user,
        token: newToken,
        status: "authenticated",
        error: null,
        tempMobile: null,
      });
      return { success: true };
    } catch (error) {
      set({
        status: "unauthenticated",
        error: error.message || "Failed to complete profile",
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Request password reset
   */
  forgotPassword: async ({ email }) => {
    set({ status: "loading", error: null });
    try {
      await forgotPasswordAPI({ email });
      set({ status: "unauthenticated", error: null });
      return { success: true };
    } catch (error) {
      set({
        status: "unauthenticated",
        error: error.message || "Failed to send reset email",
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    const { token } = get();
    try {
      await logoutAPI(token);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      set({
        ...initialState,
        status: "unauthenticated",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      set({
        ...initialState,
        status: "unauthenticated",
      });
    }
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Get temp mobile (for multi-step flows)
   */
  getTempMobile: () => get().tempMobile,
}));
