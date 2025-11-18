// Tickets API Service Layer

const API_BASE_URL = "https://labbe-backend-production.up.railway.app/api";

/**
 * Get all tickets for the authenticated user
 * @param {string} token - Auth token
 * @returns {Promise<{status: string, data: Array}>}
 */
export const getTicketsAPI = async (token) => {
  try {
    console.log("[TICKETS SERVICE] Getting all tickets");

    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[TICKETS SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[TICKETS SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to get tickets");
    }

    console.log("[TICKETS SERVICE] Tickets retrieved successfully");

    return data;
  } catch (error) {
    console.error("[TICKETS SERVICE] Get tickets error:", error.message);
    throw error;
  }
};

/**
 * Get a single ticket by ID
 * @param {string} ticketId - Ticket ID
 * @param {string} token - Auth token
 * @returns {Promise<{status: string, data: Object}>}
 */
export const getTicketAPI = async (ticketId, token) => {
  try {
    console.log("[TICKETS SERVICE] Getting ticket:", ticketId);

    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[TICKETS SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[TICKETS SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to get ticket");
    }

    console.log("[TICKETS SERVICE] Ticket retrieved successfully");

    return data;
  } catch (error) {
    console.error("[TICKETS SERVICE] Get ticket error:", error.message);
    throw error;
  }
};

/**
 * Create a new ticket
 * @param {Object} ticketData - { type, message }
 * @param {string} token - Auth token
 * @returns {Promise<{status: string, data: Object}>}
 */
export const createTicketAPI = async (ticketData, token) => {
  try {
    console.log("[TICKETS SERVICE] Creating ticket:", ticketData);

    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketData),
    });

    console.log("[TICKETS SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[TICKETS SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to create ticket");
    }

    console.log("[TICKETS SERVICE] Ticket created successfully");

    return data;
  } catch (error) {
    console.error("[TICKETS SERVICE] Create ticket error:", error.message);
    throw error;
  }
};

/**
 * Update a ticket
 * @param {string} ticketId - Ticket ID
 * @param {Object} updateData - Data to update
 * @param {string} token - Auth token
 * @returns {Promise<{status: string, data: Object}>}
 */
export const updateTicketAPI = async (ticketId, updateData, token) => {
  try {
    console.log("[TICKETS SERVICE] Updating ticket:", ticketId, updateData);

    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    console.log("[TICKETS SERVICE] Response status:", response.status);

    const data = await response.json();
    console.log("[TICKETS SERVICE] Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to update ticket");
    }

    console.log("[TICKETS SERVICE] Ticket updated successfully");

    return data;
  } catch (error) {
    console.error("[TICKETS SERVICE] Update ticket error:", error.message);
    throw error;
  }
};

/**
 * Delete a ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} token - Auth token
 * @returns {Promise<{status: string}>}
 */
export const deleteTicketAPI = async (ticketId, token) => {
  try {
    console.log("[TICKETS SERVICE] Deleting ticket:", ticketId);

    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[TICKETS SERVICE] Response status:", response.status);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete ticket");
    }

    console.log("[TICKETS SERVICE] Ticket deleted successfully");

    return { status: "success" };
  } catch (error) {
    console.error("[TICKETS SERVICE] Delete ticket error:", error.message);
    throw error;
  }
};
