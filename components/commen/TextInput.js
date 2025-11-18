import React from "react";
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  Animated,
} from "react-native";
import { useLanguage } from "../../localization";

const TextInput = ({
  label,
  placeholder,
  value = "",
  onChangeText,
  onBlur,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  editable = true,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  icon,
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
        {icon && (
          <View
            style={[styles.iconContainer, isRTL && styles.iconContainerRTL]}
          >
            {icon}
          </View>
        )}
        <RNTextInput
          style={[
            styles.input,
            isRTL && styles.inputRTL,
            icon && (isRTL ? styles.inputWithIconRTL : styles.inputWithIcon),
            multiline && styles.inputMultiline,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!isDisabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlign={isRTL ? "right" : "left"}
          {...props}
        />
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
  inputWithIcon: {
    paddingLeft: 8,
  },
  inputWithIconRTL: {
    paddingRight: 8,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  iconContainer: {
    marginRight: 8,
  },
  iconContainerRTL: {
    marginRight: 0,
    marginLeft: 8,
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

export default TextInput;
