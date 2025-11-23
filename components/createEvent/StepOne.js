import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { useLanguage } from "../../localization";
import DateTimePicker from "@react-native-community/datetimepicker";
import TextInput from "../commen/TextInput";
import EventTypeModal from "./eventTypeModal";
import Svg, { Path } from "react-native-svg";

const CalendarIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M6.66667 1.66663V4.16663M13.3333 1.66663V4.16663M2.91667 7.49996H17.0833M4.16667 3.33329H15.8333C16.7538 3.33329 17.5 4.07948 17.5 4.99996V16.6666C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6666V4.99996C2.5 4.07948 3.24619 3.33329 4.16667 3.33329Z"
      stroke="#C28E5C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 5V10L13.3333 11.6667M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z"
      stroke="#C28E5C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LocationIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M17.5 8.33329C17.5 14.1666 10 19.1666 10 19.1666C10 19.1666 2.5 14.1666 2.5 8.33329C2.5 6.34417 3.29018 4.43653 4.6967 3.03002C6.10322 1.6235 8.01088 0.833292 10 0.833292C11.9891 0.833292 13.8968 1.6235 15.3033 3.03002C16.7098 4.43653 17.5 6.34417 17.5 8.33329Z"
      stroke="#C28E5C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 10.8333C11.3807 10.8333 12.5 9.71396 12.5 8.33329C12.5 6.95262 11.3807 5.83329 10 5.83329C8.61929 5.83329 7.5 6.95262 7.5 8.33329C7.5 9.71396 8.61929 10.8333 10 10.8333Z"
      stroke="#C28E5C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="#656565"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EVENT_TYPES = [
  { value: "wedding", label: "زواج", emoji: "💍" },
  { value: "birthday", label: "عيد ميلاد", emoji: "🎂" },
  { value: "graduation", label: "تخرج", emoji: "🎓" },
  { value: "meeting", label: "اجتماع", emoji: "👥" },
  { value: "conference", label: "مؤتمر", emoji: "🎤" },
  { value: "other", label: "أخرى", emoji: "📅" },
];

const StepOne = () => {
  const { isRTL } = useLanguage();
  const { control, setValue, watch } = useFormContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);

  const eventType = watch("eventType");
  const eventDate = watch("eventDate");
  const eventTime = watch("eventTime");

  const getEventTypeLabel = () => {
    const type = EVENT_TYPES.find((t) => t.value === eventType);
    return type ? `${type.emoji} ${type.label}` : "اختر نوع المناسبة";
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setValue("eventDate", selectedDate, { shouldValidate: true });
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const hours12 = hours % 12 || 12;
      const timeString = `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
      setValue("eventTime", timeString, { shouldValidate: true });
    }
  };

  return (
    <View style={styles.container}>
      {/* Event Name */}
      <Controller
        control={control}
        name="eventName"
        rules={{ required: "اسم المناسبة مطلوب" }}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput
            label="اسم المناسبة"
            placeholder="أدخل اسم المناسبة"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message}
          />
        )}
      />

      {/* Event Type */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, isRTL && styles.labelRTL]}>نوع المناسبة</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowEventTypeModal(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.selectButtonText,
              !eventType && styles.selectButtonPlaceholder,
            ]}
          >
            {getEventTypeLabel()}
          </Text>
          <ChevronDownIcon />
        </TouchableOpacity>
      </View>

      {/* Event Date */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, isRTL && styles.labelRTL]}>تاريخ المناسبة</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <CalendarIcon />
          <Text
            style={[
              styles.selectButtonText,
              !eventDate && styles.selectButtonPlaceholder,
              { flex: 1 },
            ]}
          >
            {eventDate ? formatDate(eventDate) : "اختر تاريخ المناسبة"}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={eventDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Event Time */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, isRTL && styles.labelRTL]}>وقت المناسبة</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.7}
        >
          <ClockIcon />
          <Text
            style={[
              styles.selectButtonText,
              !eventTime && styles.selectButtonPlaceholder,
              { flex: 1 },
            ]}
          >
            {eventTime || "اختر وقت المناسبة"}
          </Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}

      {/* Location */}
      <Controller
        control={control}
        name="address.address"
        rules={{ required: "موقع المناسبة مطلوب" }}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput
            label="موقع المناسبة"
            placeholder="أدخل موقع المناسبة"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message}
            icon={<LocationIcon />}
          />
        )}
      />

      {/* Description (Optional) */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="وصف المناسبة (اختياري)"
            placeholder="أدخل وصف المناسبة"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={4}
          />
        )}
      />

      {/* Event Type Modal */}
      <EventTypeModal
        visible={showEventTypeModal}
        onClose={() => setShowEventTypeModal(false)}
        onSelect={(type) => {
          setValue("eventType", type, { shouldValidate: true });
          setShowEventTypeModal(false);
        }}
        selectedType={eventType}
        eventTypes={EVENT_TYPES}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#2c2c2c",
    marginBottom: 8,
    textAlign: "left",
  },
  labelRTL: {
    textAlign: "right",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#fff",
    minHeight: 50,
    paddingHorizontal: 16,
    gap: 12,
  },
  selectButtonText: {
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: "#2c2c2c",
  },
  selectButtonPlaceholder: {
    color: "#999",
  },
});

export default StepOne;
