import React from "react";
import { View, Text, Switch, StyleSheet, Animated } from "react-native";
import { useLanguage } from "../../localization";

const ToggleInput = ({
  label,
  value,
  onValueChange,
  disabled = false,
  description,
}) => {
  const { isRTL } = useLanguage();
  const [scaleValue] = React.useState(new Animated.Value(1));

  const handlePress = () => {
    if (!disabled) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        isRTL && styles.containerRTL,
        { transform: [{ scale: scaleValue }] },
      ]}
    >
      <View style={[styles.labelContainer, isRTL && styles.labelContainerRTL]}>
        <Text
          style={[
            styles.label,
            isRTL && styles.labelRTL,
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text style={[styles.description, isRTL && styles.descriptionRTL]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={(val) => {
          handlePress();
          onValueChange(val);
        }}
        disabled={disabled}
        trackColor={{ false: "#e0e0e0", true: "#d4a574" }}
        thumbColor={value ? "#c28e5c" : "#f4f3f4"}
        ios_backgroundColor="#e0e0e0"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  containerRTL: {
    flexDirection: "row-reverse",
  },
  labelContainer: {
    flex: 1,
    marginRight: 16,
  },
  labelContainerRTL: {
    marginRight: 0,
    marginLeft: 16,
  },
  label: {
    fontSize: 15,
    fontFamily: "Cairo_600SemiBold",
    color: "#2c2c2c",
    marginBottom: 4,
  },
  labelRTL: {
    textAlign: "right",
  },
  labelDisabled: {
    color: "#999",
  },
  description: {
    fontSize: 13,
    fontFamily: "Cairo_400Regular",
    color: "#666",
    lineHeight: 18,
  },
  descriptionRTL: {
    textAlign: "right",
  },
});

export default ToggleInput;
