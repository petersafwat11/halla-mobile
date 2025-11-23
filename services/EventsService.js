/**
 * EventsService - Centralized service for event creation and management
 * Handles all business logic, validation, and API calls for events
 */

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates a guest or moderator item
 * @param {Object} item - The item to validate
 * @param {string} item.name - Name of the person
 * @param {string} item.phone - Phone number (mobile)
 * @param {string} type - Type of item ('guest' or 'moderator')
 * @param {Array} existingList - List of existing items to check for duplicates
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateListItem = (item, type = "guest", existingList = []) => {
  const errors = {};
  const name = (item.name || "").trim();
  const phone = (item.phone || item.mobile || "").trim();

  // Validate name
  if (!name) {
    errors.name = type === "guest" ? "اسم الضيف مطلوب" : "اسم المشرف مط��وب";
  }

  // Validate phone
  if (!phone) {
    errors.phone = "رقم الجوال مطلوب";
  } else if (!/^5[0-9]{8}$/.test(phone)) {
    errors.phone = "رقم الجوال يجب أن يكون 9 أرقام ويبدأ بـ 5";
  }

  // Check for duplicate phone (exclude current item when editing)
  if (phone && !item.id) {
    const phoneExists = existingList.some(
      (existingItem) =>
        existingItem.phone === phone || existingItem.mobile === phone
    );
    if (phoneExists) {
      errors.phone = "هذا الرقم موجود بالفعل في القائمة";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates a row from CSV import
 * @param {Object} row - Row data from CSV
 * @param {number} index - Row index
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validateCSVRow = (row, index) => {
  const errors = [];

  if (!row.name || !row.name.trim()) {
    errors.push("الاسم مطلوب");
  }

  if (!row.mobile || !row.mobile.trim()) {
    errors.push("رقم الجوال مطلوب");
  } else if (!/^5[0-9]{8}$/.test(row.mobile)) {
    errors.push("رقم الجوال يجب أن يكون 9 أرقام ويبدأ بـ 5");
  }

  return { valid: errors.length === 0, errors };
};

// ============================================================================
// LIST MANAGEMENT HELPERS
// ============================================================================

/**
 * Adds a new item to a list (guest or moderator)
 * @param {Object} item - Item to add
 * @param {Array} currentList - Current list
 * @param {string} type - Type of item ('guest' or 'moderator')
 * @returns {Object} - { success: boolean, list: Array, error: string }
 */
export const addListItem = (item, currentList = [], type = "guest") => {
  const validation = validateListItem(item, type, currentList);

  if (!validation.isValid) {
    return {
      success: false,
      list: currentList,
      errors: validation.errors,
    };
  }

  const newItem = {
    id: Date.now(),
    name: item.name.trim(),
    phone: (item.phone || item.mobile || "").trim(),
  };

  return {
    success: true,
    list: [...currentList, newItem],
    errors: null,
  };
};

/**
 * Edits an existing item in a list
 * @param {number} id - ID of item to edit
 * @param {Object} updatedData - Updated data
 * @param {Array} currentList - Current list
 * @param {string} type - Type of item ('guest' or 'moderator')
 * @returns {Object} - { success: boolean, list: Array, error: string }
 */
export const editListItem = (
  id,
  updatedData,
  currentList = [],
  type = "guest"
) => {
  const validation = validateListItem(
    { ...updatedData, id },
    type,
    currentList
  );

  if (!validation.isValid) {
    return {
      success: false,
      list: currentList,
      errors: validation.errors,
    };
  }

  const updatedItem = {
    id,
    name: updatedData.name.trim(),
    phone: (updatedData.phone || updatedData.mobile || "").trim(),
  };

  const updatedList = currentList.map((item) =>
    item.id === id ? updatedItem : item
  );

  return {
    success: true,
    list: updatedList,
    errors: null,
  };
};

/**
 * Removes an item from a list
 * @param {number} id - ID of item to remove
 * @param {Array} currentList - Current list
 * @returns {Array} - Updated list
 */
export const removeListItem = (id, currentList = []) => {
  return currentList.filter((item) => item.id !== id);
};

/**
 * Removes multiple items from a list
 * @param {Array} ids - Array of IDs to remove
 * @param {Array} currentList - Current list
 * @returns {Array} - Updated list
 */
export const bulkRemoveListItems = (ids = [], currentList = []) => {
  return currentList.filter((item) => !ids.includes(item.id));
};

// ============================================================================
// CSV/EXCEL IMPORT/EXPORT HELPERS
// ============================================================================

/**
 * Generates CSV template data for guests or moderators
 * @param {string} type - Type of template ('guest' or 'moderator')
 * @returns {Object} - { headers: Array, sampleData: Array, fileName: string }
 */
export const generateCSVTemplate = (type = "guest") => {
  const headers = [
    { key: "name", label: type === "guest" ? "اسم الضيف" : "اسم المشرف" },
    { key: "mobile", label: "رقم الجوال" },
  ];

  const sampleData = [
    { name: "أحمد محمد", mobile: "512345678" },
    { name: "فاطمة علي", mobile: "598765432" },
  ];

  const fileName = type === "guest" ? "guests-template" : "moderators-template";

  return { headers, sampleData, fileName };
};

/**
 * Processes imported CSV data
 * @param {Array} importedData - Data from CSV file
 * @param {Array} currentList - Current list to check for duplicates
 * @param {string} type - Type of data ('guest' or 'moderator')
 * @returns {Object} - { validData: Array, errors: Array, duplicates: Array }
 */
export const processImportedCSV = (
  importedData = [],
  currentList = [],
  type = "guest"
) => {
  const existingPhones = currentList.map((item) => item.phone || item.mobile);
  const duplicates = [];
  const errors = [];
  const validData = [];

  importedData.forEach((item, index) => {
    const phone = (item.mobile || item.phone || "").trim();

    // Check if phone already exists
    if (existingPhones.includes(phone)) {
      duplicates.push({
        row: index + 2, // +2 because of header row and 0-index
        errors: ["هذا الرقم موجود بالفعل في القائمة"],
      });
      return;
    }

    // Validate the row
    const validation = validateCSVRow(item, index);
    if (!validation.valid) {
      errors.push({
        row: index + 2,
        errors: validation.errors,
      });
      return;
    }

    // Add to valid data and track phone
    validData.push({
      id: Date.now() + index,
      name: item.name.trim(),
      phone: phone,
    });
    existingPhones.push(phone);
  });

  return {
    validData,
    errors,
    duplicates,
  };
};

// ============================================================================
// STEP VALIDATION
// ============================================================================

/**
 * Validates if a step has all required data
 * @param {number} stepNumber - Step number (1-5)
 * @param {Object} formData - Form data object
 * @returns {boolean} - Whether step is valid
 */
export const validateStepData = (stepNumber, formData) => {
  switch (stepNumber) {
    case 1:
      // Event Details
      const hasValidEventTime =
        formData.eventTime &&
        typeof formData.eventTime === "string" &&
        formData.eventTime.trim() !== "";

      const hasValidEventName =
        formData.eventName &&
        typeof formData.eventName === "string" &&
        formData.eventName.trim() !== "";

      const hasValidAddress =
        formData.address?.address &&
        typeof formData.address.address === "string" &&
        formData.address.address.trim() !== "";

      return !!(
        formData.eventType &&
        hasValidEventName &&
        formData.eventDate &&
        hasValidEventTime &&
        hasValidAddress
      );

    case 2:
      // Guest List (at least one guest required)
      return !!(formData.guestList && formData.guestList.length > 0);

    case 3:
      // Template Selection (optional but should have selected template)
      return !!formData.selectedTemplate;

    case 4:
      // Invitation Settings
      return !!(
        formData.invitationMessage && formData.invitationMessage.trim() !== ""
      );

    case 5:
      // Final review step - all data should be valid
      return !!(
        formData.eventType &&
        formData.eventName &&
        formData.eventDate &&
        formData.eventTime &&
        formData.address?.address &&
        formData.guestList &&
        formData.guestList.length > 0 &&
        formData.selectedTemplate &&
        formData.invitationMessage &&
        formData.invitationMessage.trim() !== ""
      );

    default:
      return false;
  }
};

// ============================================================================
// API CALLS
// ============================================================================

/**
 * Transforms form data to API payload format
 * @param {Object} formData - Form data from react-hook-form
 * @returns {Object} - Transformed payload for API
 */
export const transformFormDataToPayload = (formData) => {
  return {
    eventDetails: {
      title: formData.eventName,
      type: formData.eventType,
      date: formData.eventDate,
      time: formData.eventTime,
      location: formData.address,
      description: formData.description || "",
    },
    guestList: (formData.guestList || []).map((guest) => ({
      name: guest.name,
      phone: guest.phone || guest.mobile,
      email: guest.email || "",
    })),
    supervisorsList: (formData.moderatorsList || []).map((moderator) => ({
      name: moderator.name,
      phone: moderator.phone || moderator.mobile,
    })),
    invitationSettings: {
      selectedTemplate: formData.selectedTemplate,
      invitationMessage: formData.invitationMessage,
      attendanceAutoReply: formData.attendanceAutoReply,
      absenceAutoReply: formData.absenceAutoReply,
      expectedAttendanceAutoReply: formData.expectedAttendanceAutoReply,
      templateImage: formData.templateImage,
      note: formData.note,
    },
    launchSettings: {
      sendSchedule: formData.sendSchedule || "now",
      scheduledDate: formData.scheduleDate,
      scheduledTime: formData.scheduleTime,
    },
  };
};

/**
 * Creates a new event via API
 * @param {Object} formData - Form data from react-hook-form
 * @param {Object} api - API instance (e.g., axios instance)
 * @returns {Promise} - API response
 */
export const createEvent = async (formData, api) => {
  try {
    const payload = transformFormDataToPayload(formData);
    const response = await api.post("/events", payload);
    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      data: null,
      error:
        error.response?.data?.message ||
        "فشل في إنشاء المناسبة. يرجى المحاولة مرة أخرى.",
    };
  }
};

/**
 * Updates an existing event via API
 * @param {string} eventId - Event ID
 * @param {Object} formData - Form data from react-hook-form
 * @param {Object} api - API instance
 * @returns {Promise} - API response
 */
export const updateEvent = async (eventId, formData, api) => {
  try {
    const payload = transformFormDataToPayload(formData);
    const response = await api.put(`/events/${eventId}`, payload);
    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      data: null,
      error:
        error.response?.data?.message ||
        "فشل في تحديث المناسبة. يرجى المحاولة مرة أخرى.",
    };
  }
};

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Returns default form values for create event
 * @returns {Object} - Default form values
 */
export const getDefaultFormValues = () => ({
  // Step 1 - Event Details
  eventType: "",
  eventName: "",
  eventDate: null,
  eventTime: "",
  address: {
    address: "",
    latitude: 24.7136,
    longitude: 46.6753,
    city: "",
    country: "",
  },
  description: "",

  // Step 2 - Guests and Moderators
  guestList: [],
  moderatorsList: [],

  // Step 3 - Template Selection and Customization
  selectedTemplate: null,
  templateImage: null,
  templateIntroduction: "",
  templateBrideName: "",
  templateGroomName: "",
  templateGuestMessage: "",
  templateClosingMessage: "",
  templatePrimaryColor: "#C0392B",
  templateFont: "Cairo",

  // Step 4 - Invitation Settings
  invitationMessage: "",
  attendanceAutoReply: "",
  absenceAutoReply: "",
  expectedAttendanceAutoReply: "",
  note: "",

  // Launch Settings
  sendSchedule: "now",
  scheduleDate: null,
  scheduleTime: "",
});

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Validation
  validateListItem,
  validateCSVRow,
  validateStepData,

  // List Management
  addListItem,
  editListItem,
  removeListItem,
  bulkRemoveListItems,

  // CSV Operations
  generateCSVTemplate,
  processImportedCSV,

  // API Operations
  createEvent,
  updateEvent,
  transformFormDataToPayload,

  // Defaults
  getDefaultFormValues,
};
