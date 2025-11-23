# Create Event Feature - Structure Documentation

## Overview

This document outlines the architecture and flow of the Create Event feature in the React Native app. The structure is designed to be clean, maintainable, and follows best practices.

## Architecture

### 1. Service Layer (`services/EventsService.js`)

Centralized business logic and helper functions for event creation.

#### Functions:

**Validation Helpers:**

- `validateListItem(item, type, existingList)` - Validates guest/moderator items
- `validateCSVRow(row, index)` - Validates CSV import rows
- `validateStepData(stepNumber, formData)` - Validates each step's required data

**List Management:**

- `addListItem(item, currentList, type)` - Adds guest/moderator to list
- `editListItem(id, updatedData, currentList, type)` - Edits existing item
- `removeListItem(id, currentList)` - Removes single item
- `bulkRemoveListItems(ids, currentList)` - Removes multiple items

**CSV Operations:**

- `generateCSVTemplate(type)` - Generates template for export
- `processImportedCSV(importedData, currentList, type)` - Processes imported CSV data

**API Operations:**

- `createEvent(formData, api)` - Creates new event via API
- `updateEvent(eventId, formData, api)` - Updates existing event
- `transformFormDataToPayload(formData)` - Transforms form data to API format

**Defaults:**

- `getDefaultFormValues()` - Returns default form values

### 2. Screen Layer (`screens/CreateEventScreen.js`)

Main screen component that orchestrates the entire create event flow.

#### Key Features:

- **Step Management**: Handles navigation between 4 steps
- **Form State**: Uses react-hook-form for form management
- **Validation**: Real-time validation using EventsService
- **Handlers**: Centralized handlers for guests and moderators
- **Submission**: Handles final form submission

#### Props Passed to Step Components:

**StepOne:**

- Uses FormProvider context directly

**StepTwo:**

- `guestList` - Current guest list
- `moderatorsList` - Current moderator list
- `onAddGuest` - Handler to add guest
- `onEditGuest` - Handler to edit guest
- `onRemoveGuest` - Handler to remove guest
- `onBulkRemoveGuests` - Handler to bulk remove guests
- `onImportGuests` - Handler to import guests from CSV
- `onAddModerator` - Handler to add moderator
- `onEditModerator` - Handler to edit moderator
- `onRemoveModerator` - Handler to remove moderator
- `onImportModerators` - Handler to import moderators from CSV

**StepThree:**

- `selectedTemplate` - Currently selected template
- `onSelectTemplate` - Handler to select template

**StepFour:**

- `invitationMessage` - Invitation message text
- `attendanceAutoReply` - Auto reply for attendance
- `absenceAutoReply` - Auto reply for absence
- `expectedAttendanceAutoReply` - Auto reply for expected attendance
- `note` - Additional notes

### 3. Component Layer (`components/createEvent/`)

#### Components to Create:

**StepHeader.js**

- Displays current step, title, and description
- Shows step progress indicator

**PrevAndNextBtns.js**

- Navigation buttons (Previous/Next/Submit)
- Handles loading state
- Disables next button when step is invalid

**StepOne.js**

- Event details form (type, name, date, time, address)
- Uses FormProvider context from react-hook-form

**StepTwo.js**

- Guest and moderator management
- Tabs to switch between guests and moderators
- Add/Edit/Remove functionality
- CSV import/export
- List display with search and filter

**StepThree.js**

- Template selection grid
- Template preview
- Template customization

**StepFour.js**

- Invitation message editor
- Auto-reply settings
- WhatsApp preview
- Notes section

**Supporting Components:**

**List.js**

- Reusable list component for guests/moderators
- Search and filter functionality
- Bulk actions support

**ListHeaderAndTabs.js**

- Header with tabs for switching between guests/moderators
- Action buttons (Add, Import, Export)

**GuestListItem.js**

- Individual guest list item
- Edit/Delete actions

**ModeratorsListItem.js**

- Individual moderator list item
- Edit/Delete actions

**EditGuestOrModeratorsModal.js**

- Modal for adding/editing guests or moderators
- Form validation
- Reusable for both guests and moderators

**EventSummary.js**

- Summary view of all event details
- Used for final review before submission

## Data Flow

### Form Data Structure:

```javascript
{
  // Step 1 - Event Details
  eventType: string,
  eventName: string,
  eventDate: Date,
  eventTime: string,
  address: {
    address: string,
    latitude: number,
    longitude: number,
    city: string,
    country: string,
  },
  description: string,

  // Step 2 - Guests and Moderators
  guestList: [
    {
      id: number,
      name: string,
      phone: string,
    }
  ],
  moderatorsList: [
    {
      id: number,
      name: string,
      phone: string,
    }
  ],

  // Step 3 - Template Selection
  selectedTemplate: {
    id: number,
    name: string,
    image: string,
    data: object,
  },
  templateImage: File,

  // Step 4 - Invitation Settings
  invitationMessage: string,
  attendanceAutoReply: string,
  absenceAutoReply: string,
  expectedAttendanceAutoReply: string,
  note: string,

  // Launch Settings
  sendSchedule: 'now' | 'later',
  scheduleDate: Date,
  scheduleTime: string,
}
```

## Step Validation Rules

### Step 1 (Event Details):

- Event type is required
- Event name is required
- Event date is required
- Event time is required
- Address is required

### Step 2 (Guests & Moderators):

- At least one guest is required
- Moderators are optional
- Each guest/moderator must have name and phone
- Phone must be 9 digits starting with 5
- No duplicate phone numbers

### Step 3 (Template Selection):

- Template selection is required

### Step 4 (Invitation Settings):

- Invitation message is required
- Other fields are optional

## CSV Import/Export Format

### Headers:

- Arabic: `اسم الضيف`, `رقم الجوال`
- Keys: `name`, `mobile`

### Sample Data:

```csv
اسم الضيف,رقم الجوال
أحمد محمد,512345678
فاطمة علي,598765432
```

## API Integration

### Create Event Endpoint:

```javascript
POST /events
Body: {
  eventDetails: {...},
  guestList: [...],
  supervisorsList: [...],
  invitationSettings: {...},
  launchSettings: {...}
}
```

### Update Event Endpoint:

```javascript
PUT /events/:id
Body: {
  eventDetails: {...},
  guestList: [...],
  supervisorsList: [...],
  invitationSettings: {...},
  launchSettings: {...}
}
```

## Usage Example

### In CreateEventScreen:

```javascript
import EventsService from "../services/EventsService";

// Add guest
const handleAddGuest = (guest) => {
  const result = EventsService.addListItem(guest, formData.guestList, "guest");
  if (result.success) {
    setValue("guestList", result.list);
  }
  return result;
};

// Validate step
const isValid = EventsService.validateStepData(currentStep, formData);

// Submit event
const result = await EventsService.createEvent(formData, apiInstance);
```

## Best Practices

1. **Separation of Concerns**: Business logic in service, UI logic in components
2. **Reusability**: Single service functions for both guests and moderators
3. **Validation**: Centralized validation logic
4. **Error Handling**: Consistent error format across all functions
5. **Type Safety**: Clear function signatures and return types
6. **Performance**: useCallback and useMemo for optimization
7. **Accessibility**: RTL support and proper labels

## Next Steps

1. Create UI components in `components/createEvent/`
2. Implement CSV import/export functionality
3. Add template selection and customization
4. Integrate with actual API endpoints
5. Add loading states and error handling UI
6. Implement WhatsApp preview
7. Add form persistence (save draft)
8. Add unit tests for EventsService

## Notes

- All text is in Arabic (RTL support required)
- Phone validation is specific to Saudi Arabia format (9 digits starting with 5)
- CSV import should handle errors gracefully and show validation messages
- Template customization should update preview in real-time
- Form state should be preserved when navigating between steps
