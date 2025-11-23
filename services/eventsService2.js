// Events API Service Layer
// Centralized service for all event-related API calls

// Backend API Base URL
const API_BASE_URL =
  "https://labbe-backend-production.up.railway.app/api/events";

/**
 * Make authenticated API request
 * @param {string} endpoint - API endpoint
 * @param {string} token - Auth token from useAuthStore
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>}
 */
const authenticatedFetch = async (endpoint, token, options = {}) => {
  if (!token) {
    throw new Error("No authentication token found");
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

// ==================== HOME SCREEN APIs ====================

/**
 * Get user events with statistics for home screen
 * Returns: endedEvents, liveEvents, allEvents stats, and lastEvent details
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const getUserEventsWithStats = async (token) => {
  try {
    console.log("[EVENTS SERVICE] Fetching user events with stats...");

    const data = await authenticatedFetch("/my-events-stats", token);

    console.log("[EVENTS SERVICE] User events stats received:", {
      endedEvents: data.data.endedEvents.number,
      liveEvents: data.data.liveEvents.number,
      allEvents: data.data.allEvents.number,
      hasLastEvent: !!data.data.lastEvent,
    });

    return {
      endedEvents: data.data.endedEvents,
      liveEvents: data.data.liveEvents,
      allEvents: data.data.allEvents,
      lastEvent: data.data.lastEvent,
    };
  } catch (error) {
    console.error(
      "[EVENTS SERVICE] Error fetching user events stats:",
      error.message
    );
    throw error;
  }
};

// ==================== EVENTS SCREEN APIs ====================

/**
 * Get all events with detailed statistics for events screen
 * Returns: liveEvents count, endedEvents count, attendanceRate, and events array
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const getEventStats = async (token) => {
  try {
    console.log("[EVENTS SERVICE] Fetching event stats...");

    const data = await authenticatedFetch("/stats", token);

    console.log("[EVENTS SERVICE] Event stats received:", {
      liveEvents: data.data.liveEvents,
      endedEvents: data.data.endedEvents,
      attendanceRate: data.data.attendanceRate,
      eventsCount: data.data.events.length,
    });

    return {
      liveEvents: data.data.liveEvents,
      endedEvents: data.data.endedEvents,
      attendanceRate: data.data.attendanceRate,
      events: data.data.events,
    };
  } catch (error) {
    console.error(
      "[EVENTS SERVICE] Error fetching event stats:",
      error.message
    );
    throw error;
  }
};

// ==================== EVENT DETAILS APIs ====================

/**
 * Get single event by ID for viewing details
 * Returns: Full event object with populated guest list and host
 * @param {string} eventId - Event ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const getEventById = async (eventId, token) => {
  try {
    console.log("[EVENTS SERVICE] Fetching event by ID:", eventId);

    const data = await authenticatedFetch(`/${eventId}`, token);

    console.log("[EVENTS SERVICE] Event details received:", {
      eventId: data.data.event._id,
      title: data.data.event.eventDetails?.title,
      guestCount: data.data.event.guestList?.length || 0,
    });

    return data.data.event;
  } catch (error) {
    console.error(
      "[EVENTS SERVICE] Error fetching event by ID:",
      error.message
    );
    throw error;
  }
};

/**
 * Get single event statistics with detailed guest info
 * Returns: Event details, guests array, supervisors array, and overall status counts
 * @param {string} eventId - Event ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const getSingleEventStats = async (eventId, token) => {
  try {
    console.log("[EVENTS SERVICE] Fetching single event stats:", eventId);

    const data = await authenticatedFetch(`/stats/${eventId}`, token);

    console.log("[EVENTS SERVICE] Single event stats received:", {
      eventId: data.data.event.id,
      title: data.data.event.title,
      guestsCount: data.data.guests.length,
      supervisorsCount: data.data.supervisors.length,
    });

    return {
      event: data.data.event,
      guests: data.data.guests,
      supervisors: data.data.supervisors,
      declined: data.data.declined,
      confirmed: data.data.confirmed,
      noResponse: data.data.noResponse,
      maybe: data.data.maybe,
    };
  } catch (error) {
    console.error(
      "[EVENTS SERVICE] Error fetching single event stats:",
      error.message
    );
    throw error;
  }
};

// ==================== EVENT MANAGEMENT APIs ====================

/**
 * Update guest list
 * @param {string} eventId - Event ID
 * @param {Array} guestList - Updated guest list
 * @param {string} token - Auth token
 * @param {Array} supervisorsList - Updated supervisors list (optional)
 * @returns {Promise<Object>}
 */
export const updateGuestList = async (
  eventId,
  guestList,
  token,
  supervisorsList = null
) => {
  try {
    console.log("[EVENTS SERVICE] Updating guest list:", eventId);

    const body = { guestList };
    if (supervisorsList) {
      body.supervisorsList = supervisorsList;
    }

    const data = await authenticatedFetch(`/${eventId}/guests`, token, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    console.log("[EVENTS SERVICE] Guest list updated");

    return data.data.event;
  } catch (error) {
    console.error("[EVENTS SERVICE] Error updating guest list:", error.message);
    throw error;
  }
};

/**
 * Update invitation settings
 * @param {string} eventId - Event ID
 * @param {Object} invitationSettings - Updated invitation settings
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const updateInvitationSettings = async (
  eventId,
  invitationSettings,
  token
) => {
  try {
    console.log("[EVENTS SERVICE] Updating invitation settings:", eventId);

    const data = await authenticatedFetch(`/${eventId}/invitation`, token, {
      method: "PATCH",
      body: JSON.stringify({ invitationSettings }),
    });

    console.log("[EVENTS SERVICE] Invitation settings updated");

    return data.data.event;
  } catch (error) {
    console.error(
      "[EVENTS SERVICE] Error updating invitation settings:",
      error.message
    );
    throw error;
  }
};

/**
 * Delete an event
 * @param {string} eventId - Event ID
 * @param {string} token - Auth token
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId, token) => {
  try {
    console.log("[EVENTS SERVICE] Deleting event:", eventId);

    await authenticatedFetch(`/${eventId}`, token, {
      method: "DELETE",
    });

    console.log("[EVENTS SERVICE] Event deleted successfully");
  } catch (error) {
    console.error("[EVENTS SERVICE] Error deleting event:", error.message);
    throw error;
  }
};

// ==================== GUEST MANAGEMENT APIs ====================

/**
 * Add a new guest to an event
 * @param {string} eventId - Event ID
 * @param {Object} guestData - Guest data
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const addGuest = async (eventId, guestData, token) => {
  try {
    console.log("[EVENTS SERVICE] Adding guest to event:", eventId);

    const data = await authenticatedFetch(`/${eventId}/guests/add`, token, {
      method: "POST",
      body: JSON.stringify(guestData),
    });

    console.log("[EVENTS SERVICE] Guest added successfully");

    return data.data.guest;
  } catch (error) {
    console.error("[EVENTS SERVICE] Error adding guest:", error.message);
    throw error;
  }
};

/**
 * Update guest status
 * @param {string} eventId - Event ID
 * @param {string} guestId - Guest ID
 * @param {string} status - New status
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const updateGuestStatus = async (eventId, guestId, status, token) => {
  try {
    console.log("[EVENTS SERVICE] Updating guest status:", {
      eventId,
      guestId,
      status,
    });

    const data = await authenticatedFetch(
      `/${eventId}/guests/${guestId}/status`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );

    console.log("[EVENTS SERVICE] Guest status updated");

    return data.data.guest;
  } catch (error) {
    console.error(
      "[EVENTS SERVICE] Error updating guest status:",
      error.message
    );
    throw error;
  }
};

/**
 * Delete a guest from an event
 * @param {string} eventId - Event ID
 * @param {string} guestId - Guest ID
 * @param {string} token - Auth token
 * @returns {Promise<void>}
 */
export const deleteGuest = async (eventId, guestId, token) => {
  try {
    console.log("[EVENTS SERVICE] Deleting guest:", { eventId, guestId });

    await authenticatedFetch(`/${eventId}/guests/${guestId}`, token, {
      method: "DELETE",
    });

    console.log("[EVENTS SERVICE] Guest deleted successfully");
  } catch (error) {
    console.error("[EVENTS SERVICE] Error deleting guest:", error.message);
    throw error;
  }
};

// ==================== SUPERVISOR MANAGEMENT APIs ====================

/**
 * Add a supervisor to an event
 * @param {string} eventId - Event ID
 * @param {Object} supervisorData - Supervisor data
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const addSupervisor = async (eventId, supervisorData, token) => {
  try {
    console.log("[EVENTS SERVICE] Adding supervisor to event:", eventId);

    const data = await authenticatedFetch(`/${eventId}/supervisors`, token, {
      method: "POST",
      body: JSON.stringify(supervisorData),
    });

    console.log("[EVENTS SERVICE] Supervisor added successfully");

    return data.data.supervisor;
  } catch (error) {
    console.error("[EVENTS SERVICE] Error adding supervisor:", error.message);
    throw error;
  }
};

/**
 * Update supervisor information
 * @param {string} eventId - Event ID
 * @param {string} supervisorId - Supervisor ID
 * @param {Object} supervisorData - Updated supervisor data
 * @returns {Promise<Object>}
 */
export const updateSupervisor = async (
  eventId,
  supervisorId,
  supervisorData
) => {
  try {
    console.log("[EVENTS SERVICE] Updating supervisor:", {
      eventId,
      supervisorId,
    });

    const data = await authenticatedFetch(
      `/${eventId}/supervisors/${supervisorId}`,
      {
        method: "PATCH",
        body: JSON.stringify(supervisorData),
      }
    );

    console.log("[EVENTS SERVICE] Supervisor updated successfully");

    return data.data.supervisor;
  } catch (error) {
    console.error("[EVENTS SERVICE] Error updating supervisor:", error.message);
    throw error;
  }
};

/**
 * Delete a supervisor from an event
 * @param {string} eventId - Event ID
 * @param {string} supervisorId - Supervisor ID
 * @param {string} token - Auth token
 * @returns {Promise<void>}
 */
export const deleteSupervisor = async (eventId, supervisorId, token) => {
  try {
    console.log("[EVENTS SERVICE] Deleting supervisor:", {
      eventId,
      supervisorId,
    });

    await authenticatedFetch(`/${eventId}/supervisors/${supervisorId}`, token, {
      method: "DELETE",
    });

    console.log("[EVENTS SERVICE] Supervisor deleted successfully");
  } catch (error) {
    console.error("[EVENTS SERVICE] Error deleting supervisor:", error.message);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format event data for display
 * @param {Object} event - Raw event data from backend
 * @returns {Object} Formatted event data
 */
export const formatEventForDisplay = (event) => {
  if (!event) return null;

  return {
    id: event._id,
    title: event.eventDetails?.title || "Untitled Event",
    type: event.eventDetails?.type || "other",
    date: event.eventDetails?.date || null,
    time: event.eventDetails?.time || null,
    location: event.eventDetails?.location || null,
    description: event.eventDetails?.description || "",
    guestCount: event.guestList?.length || 0,
    status: event.status || "draft",
    createdAt: event.createdAt,
  };
};

/**
 * Format guest data for display
 * @param {Object} guest - Raw guest data from backend
 * @returns {Object} Formatted guest data
 */
export const formatGuestForDisplay = (guest) => {
  if (!guest) return null;

  return {
    id: guest._id || guest.guestId,
    name: guest.name || "",
    phone: guest.phone || "",
    email: guest.email || "not provided",
    status: guest.status || "invited",
    respondedAt: guest.respondAt || guest.rsvp?.respondedAt || null,
    addedBy: guest.addedBy || "Unknown",
  };
};

/**
 * Calculate response rate from guest list
 * @param {Array} guests - Array of guests
 * @returns {number} Response rate percentage
 */
export const calculateResponseRate = (guests) => {
  if (!guests || guests.length === 0) return 0;

  const respondedGuests = guests.filter(
    (g) => g.status === "confirmed" || g.status === "declined"
  );

  return Math.round((respondedGuests.length / guests.length) * 100);
};

/**
 * Group guests by status
 * @param {Array} guests - Array of guests
 * @returns {Object} Guests grouped by status
 */
export const groupGuestsByStatus = (guests) => {
  if (!guests) return {};

  return {
    confirmed: guests.filter((g) => g.status === "confirmed"),
    declined: guests.filter((g) => g.status === "declined"),
    maybe: guests.filter((g) => g.status === "maybe"),
    noResponse: guests.filter((g) => g.status === "no-response"),
    invited: guests.filter((g) => g.status === "invited"),
    attended: guests.filter((g) => g.status === "attended"),
  };
};
