import React from "react";
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  Animated,
} from "react-native";
import { useLanguage } from "../../localization";

const TextAreaInput = ({
  label,
  placeholder,
  value = "",
  onChangeText,
  onBlur,
  error,
  autoCapitalize = "sentences",
  editable = true,
  disabled = false,
  numberOfLines = 3,
  maxLength,
  ...props
}) => {
  const isDisabled = disabled || !editable;
  const { isRTL } = useLanguage();
  const [isFocused, setIsFocused] = React.useState(false);
  const animatedIsFocused = React.useRef(
    new Animated.Value(value ? 1 : 0)
  ).current;

  React.useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

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
          isDisabled && styles.inputContainerDisabled,
          isRTL && styles.inputContainerRTL,
        ]}
      >
        <RNTextInput
          style={[styles.textArea, isRTL && styles.textAreaRTL]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          autoCapitalize={autoCapitalize}
          editable={!isDisabled}
          multiline={true}
          numberOfLines={numberOfLines}
          textAlign={isRTL ? "right" : "left"}
          textAlignVertical="top"
          maxLength={maxLength}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
          {error}
        </Text>
      )}
      {maxLength && (
        <Text style={[styles.charCount, isRTL && styles.charCountRTL]}>
          {value?.length || 0} / {maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  containerRTL: {
    // No change needed
  },
  label: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#2c2c2c",
    marginBottom: 8,
    textAlign: "left",
    width: "100%",
  },
  labelRTL: {
    textAlign: "right",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#fff",
    minHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: "#2c2c2c",
    minHeight: 80,
    textAlignVertical: "top",
  },
  textAreaRTL: {
    textAlign: "right",
  },
  charCount: {
    fontSize: 11,
    fontFamily: "Cairo_400Regular",
    color: "#999",
    marginTop: 4,
    textAlign: "right",
  },
  charCountRTL: {
    textAlign: "left",
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

export default TextAreaInput;
