import React from "react";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "./TextInput";

const EmailInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  disabled,
}) => {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      error={error}
      disabled={disabled}
      keyboardType="email-address"
      autoCapitalize="none"
      style={{ textAlign: "left", writingDirection: "ltr" }}
      icon={<Ionicons name="mail-outline" size={20} color="#999" />}
    />
  );
};

export default EmailInput;
