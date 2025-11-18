// Auth API Service Layer
// This is where all backend API calls will be made

// TODO: Replace with your actual backend URL
// For Android Emulator, use 10.0.2.2 instead of localhost
// For iOS Simulator or physical device on same network, use localhost or your computer's IP
const API_BASE_URL = "https://labbe-backend-production.up.railway.app/api/auth"; // Android Emulator
// const API_BASE_URL = "http://localhost:8000/api/auth"; // iOS Simulator
// const API_BASE_URL = "http://192.168.1.X:8000/api/auth"; // Physical device (replace X with your IP)

/**
 * Login with email and password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{token: string, user: Object}>}
 */
export const loginWithEmailAPI = async ({ email, password }) => {
  try {
    console.log("[AUTH SERVICE] Login attempt:", { email });
    console.log("[AUTH SERVICE] API URL:", `${API_BASE_URL}/login`);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("[AUTH SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[AUTH SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    console.log("[AUTH SERVICE] Login successful:", data.user?.email);

    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("[AUTH SERVICE] Login error:", error.message);
    throw error;
  }
};

/**
 * Send OTP to mobile number
 * @param {Object} data - { mobile }
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendOTPAPI = async ({ mobile, type = "login" }) => {
  try {
    console.log("[AUTH SERVICE] Sending OTP to:", mobile, "Type:", type);

    const response = await fetch(`${API_BASE_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: mobile, type }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }

    console.log("[AUTH SERVICE] OTP sent successfully to:", mobile);

    return {
      success: true,
      message: data.message || "OTP sent successfully",
    };
  } catch (error) {
    console.error("[AUTH SERVICE] Send OTP error:", error);
    throw error;
  }
};

/**
 * Verify OTP code
 * @param {Object} data - { mobile, otp }
 * @returns {Promise<{token: string, user: Object}>}
 */
export const verifyOTPAPI = async ({ mobile, otp }) => {
  try {
    console.log("[AUTH SERVICE] Verifying OTP for:", mobile, "Code:", otp);
    console.log("[AUTH SERVICE] OTP provider not configured yet - using mock");

    // TODO: Integrate with backend OTP verification
    // const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phoneNumber: mobile, code: otp }),
    // });
    // const data = await response.json();
    // if (!response.ok) throw new Error(data.message);
    // return data;

    // Mock verification (accept any 6-digit code for now)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (otp && otp.length === 6) {
      console.log("[AUTH SERVICE] OTP verified successfully (mock)");
      return {
        token: "mock-jwt-token-otp-" + Date.now(),
        user: {
          id: "user-" + Date.now(),
          phoneNumber: mobile,
          name: "Mobile User",
        },
      };
    }

    throw new Error("Invalid OTP code");
  } catch (error) {
    console.error("[AUTH SERVICE] Verify OTP error:", error);
    throw error;
  }
};

/**
 * Step 1: Signup with phone number only
 * @param {Object} data - { mobile }
 * @returns {Promise<{token: string, user: Object}>}
 */
export const signupWithPhoneAPI = async ({ mobile }) => {
  try {
    console.log("[AUTH SERVICE] Signup with phone:", mobile);

    const response = await fetch(`${API_BASE_URL}/signup/host`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: mobile,
      }),
    });

    console.log("[AUTH SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[AUTH SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    console.log("[AUTH SERVICE] Signup with phone successful");

    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("[AUTH SERVICE] Signup error:", error.message);
    throw error;
  }
};

/**
 * Step 2: Complete profile with email, username, password
 * @param {Object} data - { username, email, password, token }
 * @returns {Promise<{token: string, user: Object}>}
 */
export const completeProfileAPI = async ({
  username,
  email,
  password,
  token,
}) => {
  try {
    console.log("[AUTH SERVICE] Complete profile:", { username, email });

    const response = await fetch(`${API_BASE_URL}/complete-host-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        email,
        password,
        passwordConfirm: password,
      }),
    });

    console.log("[AUTH SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[AUTH SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to complete profile");
    }

    console.log(
      "[AUTH SERVICE] Profile completed successfully:",
      data.user?.email
    );

    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("[AUTH SERVICE] Complete profile error:", error.message);
    throw error;
  }
};

/**
 * Request password reset
 * @param {Object} data - { email }
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const forgotPasswordAPI = async ({ email }) => {
  try {
    console.log("[AUTH SERVICE] Forgot password request for:", email);

    const response = await fetch(`${API_BASE_URL}/forgotPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset email");
    }

    console.log("[AUTH SERVICE] Password reset email sent successfully");

    return {
      success: true,
      message: data.message || "Password reset email sent",
    };
  } catch (error) {
    console.error("[AUTH SERVICE] Forgot password error:", error.message);
    throw error;
  }
};

/**
 * Logout (optional backend call)
 * @param {string} token - Auth token
 * @returns {Promise<void>}
 */
export const logoutAPI = async (token) => {
  try {
    console.log("[AUTH SERVICE] Logging out");

    // Optional: Call backend to invalidate token
    if (token) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    console.log("[AUTH SERVICE] Logged out successfully");
  } catch (error) {
    console.error("[AUTH SERVICE] Logout error:", error);
    // Don't throw - we still want to clear local state
  }
};
