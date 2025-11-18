// Settings API Service Layer

const API_BASE_URL = "https://labbe-backend-production.up.railway.app/api";

/**
 * Update host account data
 * @param {Object} data - { username, email, password, passwordConfirm }
 * @param {string} token - Auth token
 * @returns {Promise<{status: string, user: Object}>}
 */
export const updateAccountAPI = async (data, token) => {
  try {
    console.log("[SETTINGS SERVICE] Updating account:", {
      username: data.username,
      email: data.email,
    });

    const response = await fetch(`${API_BASE_URL}/auth/host/updateData`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log("[SETTINGS SERVICE] Response status:", response.status);

    const responseData = await response.json();
    console.log("[SETTINGS SERVICE] Response data:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update account");
    }

    console.log("[SETTINGS SERVICE] Account updated successfully");

    return responseData;
  } catch (error) {
    console.error("[SETTINGS SERVICE] Update account error:", error.message);
    throw error;
  }
};

/**
 * Get notification preferences
 * @param {string} token - Auth token
 * @returns {Promise<{status: string, data: Object}>}
 */
export const getNotificationPreferencesAPI = async (token) => {
  try {
    console.log("[SETTINGS SERVICE] Getting notification preferences");

    const response = await fetch(`${API_BASE_URL}/host/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[SETTINGS SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[SETTINGS SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to get notification preferences");
    }

    console.log(
      "[SETTINGS SERVICE] Notification preferences retrieved successfully"
    );

    return data;
  } catch (error) {
    console.error(
      "[SETTINGS SERVICE] Get notification preferences error:",
      error.message
    );
    throw error;
  }
};

/**
 * Update notification preferences
 * @param {Object} data - { appNotifications, emailNotifications }
 * @param {string} token - Auth token
 * @returns {Promise<{status: string, data: Object}>}
 */
export const updateNotificationPreferencesAPI = async (data, token) => {
  try {
    console.log("[SETTINGS SERVICE] Updating notification preferences:", data);

    const response = await fetch(`${API_BASE_URL}/host/notifications`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log("[SETTINGS SERVICE] Response status:", response.status);

    const responseData = await response.json();
    console.log("[SETTINGS SERVICE] Response data:", responseData);

    if (!response.ok) {
      throw new Error(
        responseData.message || "Failed to update notification preferences"
      );
    }

    console.log(
      "[SETTINGS SERVICE] Notification preferences updated successfully"
    );

    return responseData;
  } catch (error) {
    console.error(
      "[SETTINGS SERVICE] Update notification preferences error:",
      error.message
    );
    throw error;
  }
};

/**
 * Send email verification code
 * @param {string} token - Auth token
 * @returns {Promise<{status: string, message: string}>}
 */
export const sendEmailVerificationCodeAPI = async (token) => {
  try {
    console.log("[SETTINGS SERVICE] Sending email verification code");

    const response = await fetch(
      `${API_BASE_URL}/auth/host/sendEmailVerificationCode`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("[SETTINGS SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[SETTINGS SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to send verification code");
    }

    console.log("[SETTINGS SERVICE] Verification code sent successfully");

    return data;
  } catch (error) {
    console.error(
      "[SETTINGS SERVICE] Send verification code error:",
      error.message
    );
    throw error;
  }
};

/**
 * Verify email with code
 * @param {string} code - Verification code
 * @param {string} token - Auth token
 * @returns {Promise<{status: string, message: string}>}
 */
export const verifyEmailAPI = async (code, token) => {
  try {
    console.log("[SETTINGS SERVICE] Verifying email with code");

    const response = await fetch(`${API_BASE_URL}/auth/host/verifyEmail`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ verificationCode: code }),
    });

    console.log("[SETTINGS SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[SETTINGS SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify email");
    }

    console.log("[SETTINGS SERVICE] Email verified successfully");

    return data;
  } catch (error) {
    console.error("[SETTINGS SERVICE] Verify email error:", error.message);
    throw error;
  }
};
