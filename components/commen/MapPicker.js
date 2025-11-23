import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  TextInput as RNTextInput
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

const MapPicker = ({
  name,
  label,
  placeholder,
  disabled = false,
  rules,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState("");
        const [selectedLocation, setSelectedLocation] = useState(value || null);

        const handleSelectLocation = () => {
          onChange(selectedLocation);
          setIsOpen(false);
        };

        const displayValue = selectedLocation?.address || value?.address || "";

        return (
          <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
              style={[
                styles.inputContainer,
                error && styles.inputContainerError,
                disabled && styles.inputContainerDisabled,
              ]}
              onPress={() => !disabled && setIsOpen(true)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Ionicons
                name="location-outline"
                size={24}
                color="#C28E5C"
                style={styles.icon}
              />
              <Text
                style={[
                  styles.inputText,
                  !displayValue && styles.placeholderText,
                ]}
              >
                {displayValue || placeholder}
              </Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error.message}</Text>}

            <Modal
              visible={isOpen}
              transparent
              animationType="slide"
              onRequestClose={() => setIsOpen(false)}
            >
              <Pressable
                style={styles.overlay}
                onPress={() => setIsOpen(false)}
              >
                <Pressable
                  style={styles.modalContainer}
                  onPress={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <View
                    style={[styles.modalHeader]}
                  >
                    <TouchableOpacity
                      onPress={() => setIsOpen(false)}
                      hitSlop={8}
                    >
                      <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.modalTitleContainer}>
                      <Text
                        style={[
                          styles.modalTitle,
                        ]}
                      >
                        اختر الموقع
                      </Text>
                    </View>
                  </View>

                  {/* Search Input */}
                  <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                      <Ionicons
                        name="search-outline"
                        size={20}
                        color="#767676"
                        style={styles.searchIcon}
                      />
                      <RNTextInput
                        style={[
                          styles.searchInput,
                        ]}
                        placeholder="ابحث عن الموقع"
                        placeholderTextColor="#767676"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                    </View>
                  </View>

                  {/* Map Placeholder */}
                  <View style={styles.mapContainer}>
                    <View style={styles.mapPlaceholder}>
                      <Ionicons name="map-outline" size={60} color="#C28E5C" />
                      <Text style={styles.mapPlaceholderText}>
                        Map view will be displayed here
                      </Text>
                      <Text style={styles.mapPlaceholderSubtext}>
                        Integration with React Native Maps or similar library
                        required
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setIsOpen(false)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelButtonText}>إلغاء</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleSelectLocation}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.confirmButtonText}>تأكيد الموقع</Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </Pressable>
            </Modal>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%"
  },  label: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#2C2C2C",
    marginBottom: 8,
    paddingHorizontal: 8,
    textAlign: "left"
  },  inputContainer: {
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
    minHeight: 50
  },  inputContainerError: {
    borderColor: "#e74c3c"
  },
  inputContainerDisabled: {
    backgroundColor: "#f5f5f5",
    opacity: 0.6
  },
  icon: {
    marginRight: 0
  },  inputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    lineHeight: 24,
    letterSpacing: 0.08,
    textAlign: "right"
  },  placeholderText: {
    color: "#767676"
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#e74c3c",
    marginTop: 4,
    paddingHorizontal: 8,
    textAlign: "left"
  },  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end"
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%"
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2"
  },  modalTitleContainer: {
    flex: 1,
    alignItems: "flex-end"
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    lineHeight: 32,
    textAlign: "right"
  },  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16
  },
  searchInputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 12,
    backgroundColor: "#FFF",
    paddingHorizontal: 12
  },
  searchIcon: {
    marginLeft: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    paddingVertical: 12
  },  mapContainer: {
    flex: 1,
    paddingHorizontal: 24
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F4EF",
    borderRadius: 12,
    padding: 24
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontFamily: "Cairo_600SemiBold",
    color: "#2C2C2C",
    marginTop: 12,
    textAlign: "center"
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#767676",
    marginTop: 4,
    textAlign: "center"
  },
  modalActions: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2"
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6B392",
    backgroundColor: "#FFF",
    minWidth: 100,
    alignItems: "center"
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "Cairo_600SemiBold",
    color: "#6B4E33",
    lineHeight: 24,
    letterSpacing: 0.08
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#C28E5C",
    alignItems: "center"
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
    lineHeight: 24,
    letterSpacing: 0.08
  }
});

export default MapPicker;
