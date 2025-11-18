import React, { useState } from "react";
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const MobileInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  disabled = false,
  countryCode = "+966",
  ...props
}) => {
  const { isRTL } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {label && (
        <Text style={[styles.label, isRTL && styles.labelRTL]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
          isRTL && styles.inputContainerRTL,
        ]}
      >
        <Ionicons
          name="call-outline"
          size={20}
          color="#999"
          style={[styles.icon, isRTL && styles.iconRTL]}
        />
        <RNTextInput
          style={[styles.input, isRTL && styles.inputRTL]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          keyboardType="phone-pad"
          editable={!disabled}
          textAlign={isRTL ? "right" : "left"}
          {...props}
        />
        <View style={[styles.countryCode, isRTL && styles.countryCodeRTL]}>
          <Text style={styles.countryCodeText}>{countryCode}</Text>
        </View>
      </View>
      {error && (
        <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    alignItems: "flex-start",
  },
  containerRTL: {
    alignItems: "flex-start",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#fff",
    minHeight: 50,
    paddingHorizontal: 16,
    width: "100%",
  },
  inputContainerRTL: {
    flexDirection: "row-reverse",
  },
  inputContainerFocused: {
    borderColor: "#c28e5c",
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: "#e74c3c",
  },
  inputContainerDisabled: {
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
  },
  icon: {
    marginRight: 8,
  },
  iconRTL: {
    marginRight: 0,
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: "#2c2c2c",
    paddingVertical: 12,
  },
  inputRTL: {
    textAlign: "right",
  },
  countryCode: {
    paddingLeft: 12,
    marginLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#e0e0e0",
  },
  countryCodeRTL: {
    paddingLeft: 0,
    paddingRight: 12,
    marginLeft: 0,
    marginRight: 12,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  countryCodeText: {
    fontSize: 15,
    fontFamily: "Cairo_600SemiBold",
    color: "#2c2c2c",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#e74c3c",
    marginTop: 4,
    textAlign: "left",
  },
  errorTextRTL: {
    textAlign: "right",
  },
});

export default MobileInput;
