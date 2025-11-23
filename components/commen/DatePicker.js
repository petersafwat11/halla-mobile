import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const DatePicker = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  minimumDate,
  maximumDate,
  ...props
}) => {
  const { isRTL } = useLanguage();
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (date) {
      setSelectedDate(date);
      onChange(date);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const displayValue = selectedDate ? formatDate(selectedDate) : "";

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {label && (
        <Text style={[styles.label, isRTL && styles.labelRTL]}>{label}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          error && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
          isRTL && styles.inputContainerRTL,
        ]}
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar-outline"
          size={24}
          color="#C28E5C"
          style={[styles.icon, isRTL && styles.iconRTL]}
        />
        <Text
          style={[
            styles.inputText,
            !displayValue && styles.placeholderText,
            isRTL && styles.inputTextRTL,
          ]}
        >
          {displayValue || placeholder}
        </Text>
      </TouchableOpacity>
      {error && (
        <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
          {error}
        </Text>
      )}

      {show && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          textColor="#2C2C2C"
          {...props}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  containerRTL: {},
  label: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#2C2C2C",
    marginBottom: 8,
    paddingHorizontal: 8,
    textAlign: "left",
  },
  labelRTL: {
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderTopWidth: 1,
    borderRightWidth: 1.5,
    borderBottomWidth: 1,
    borderLeftWidth: 1.5,
    borderColor: "#DFDFDF",
    borderRadius: 12,
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 50,
  },
  inputContainerRTL: {
    flexDirection: "row-reverse",
  },
  inputContainerError: {
    borderColor: "#e74c3c",
  },
  inputContainerDisabled: {
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
  },
  icon: {
    marginRight: 0,
  },
  iconRTL: {
    marginRight: 0,
    marginLeft: 0,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    lineHeight: 24,
    letterSpacing: 0.08,
    textAlign: "right",
  },
  inputTextRTL: {
    textAlign: "right",
  },
  placeholderText: {
    color: "#767676",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#e74c3c",
    marginTop: 4,
    paddingHorizontal: 8,
    textAlign: "left",
  },
  errorTextRTL: {
    textAlign: "right",
  },
});

export default DatePicker;
