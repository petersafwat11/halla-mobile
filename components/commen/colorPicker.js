import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const ColorPicker = ({
  label,
  value = "#c28e5c",
  onChangeColor,
  error,
  disabled = false,
  showPresets = true,
}) => {
  const { isRTL } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const presetColors = [
    { color: "#c28e5c", name: "ذهبي" },
    { color: "#d6b392", name: "بيج فاتح" },
    { color: "#8b6f47", name: "بني" },
    { color: "#a0845c", name: "كراميل" },
    { color: "#e74c3c", name: "أحمر" },
    { color: "#3498db", name: "أزرق" },
    { color: "#2ecc71", name: "أخضر" },
    { color: "#f39c12", name: "برتقالي" },
    { color: "#9b59b6", name: "بنفسجي" },
    { color: "#1abc9c", name: "تركواز" },
    { color: "#34495e", name: "رمادي داكن" },
    { color: "#95a5a6", name: "رمادي فاتح" },
  ];

  const handleColorSelect = (color) => {
    setCustomColor(color);
    onChangeColor?.(color);
  };

  const handleCustomColorChange = (text) => {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    setCustomColor(text);
    if (hexPattern.test(text)) onChangeColor?.(text);
  };

  const isColorSelected = (color) =>
    value?.toLowerCase() === color.toLowerCase();

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {label && (
        <Text style={[styles.label, isRTL && styles.labelRTL]}>{label}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.colorDisplay,
          error && styles.colorDisplayError,
          disabled && styles.colorDisplayDisabled,
        ]}
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled}
      >
        <View style={[styles.colorPreview, { backgroundColor: value }]} />
        <Text style={[styles.colorValue, isRTL && styles.colorValueRTL]}>
          {value}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color="#656565"
          style={[styles.icon, isRTL && styles.iconRTL]}
        />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
          {error}
        </Text>
      )}

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isRTL && styles.modalContentRTL]}>
            <View style={[styles.modalHeader, isRTL && styles.modalHeaderRTL]}>
              <Text style={[styles.modalTitle, isRTL && styles.modalTitleRTL]}>
                اختر اللون
              </Text>

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#2C2C2C" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={false}
            >
              {showPresets && (
                <View style={styles.presetsSection}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isRTL && styles.sectionTitleRTL,
                    ]}
                  >
                    الألوان الشائعة
                  </Text>

                  <View style={styles.colorGrid}>
                    {presetColors.map((item) => (
                      <TouchableOpacity
                        key={item.color}
                        style={[
                          styles.colorOption,
                          isColorSelected(item.color) &&
                            styles.colorOptionSelected,
                        ]}
                        onPress={() => handleColorSelect(item.color)}
                      >
                        <View
                          style={[
                            styles.colorCircle,
                            { backgroundColor: item.color },
                          ]}
                        >
                          {isColorSelected(item.color) && (
                            <Ionicons name="checkmark" size={20} color="#fff" />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.colorName,
                            isRTL && styles.colorNameRTL,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.customSection}>
                <Text
                  style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}
                >
                  لون مخصص
                </Text>

                <View
                  style={[
                    styles.customColorContainer,
                    isRTL && styles.customColorContainerRTL,
                  ]}
                >
                  <View
                    style={[
                      styles.customColorPreview,
                      { backgroundColor: customColor },
                    ]}
                  />

                  <RNTextInput
                    style={[
                      styles.customColorInput,
                      isRTL && styles.customColorInputRTL,
                    ]}
                    value={customColor}
                    onChangeText={handleCustomColorChange}
                    placeholder="#c28e5c"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    maxLength={7}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.applyButtonText}>تطبيق</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: "100%" },
  containerRTL: {},
  label: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#2c2c2c",
    marginBottom: 8,
    textAlign: "left",
  },
  labelRTL: { textAlign: "right" },

  colorDisplay: {
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
  colorDisplayError: { borderColor: "#e74c3c" },
  colorDisplayDisabled: { backgroundColor: "#f5f5f5", opacity: 0.6 },

  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },

  colorValue: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: "#2c2c2c",
  },
  colorValueRTL: { textAlign: "right" },

  icon: { marginLeft: "auto" },
  iconRTL: { marginLeft: 0, marginRight: "auto" },

  errorText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#e74c3c",
    marginTop: 4,
    textAlign: "left",
  },
  errorTextRTL: { textAlign: "right" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalHeaderRTL: { flexDirection: "row-reverse" },

  modalTitle: {
    fontSize: 18,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    flex: 1,
  },
  modalTitleRTL: { textAlign: "right" },

  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  modalBody: { flex: 1 },
  modalBodyContent: { padding: 20 },

  presetsSection: { marginBottom: 24 },

  sectionTitle: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#2c2c2c",
    marginBottom: 12,
  },
  sectionTitleRTL: { textAlign: "right" },

  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  colorOption: {
    alignItems: "center",
    gap: 6,
    width: "22%",
  },
  colorOptionSelected: {
    transform: [{ scale: 1.05 }],
  },

  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  colorName: {
    fontSize: 11,
    fontFamily: "Cairo_400Regular",
    color: "#656565",
    textAlign: "center",
  },

  customSection: { marginBottom: 20 },

  customColorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  customColorContainerRTL: { flexDirection: "row-reverse" },

  customColorPreview: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },

  customColorInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: "#2c2c2c",
    paddingVertical: 8,
  },
  customColorInputRTL: { textAlign: "right" },

  applyButton: {
    backgroundColor: "#C28E5C",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 15,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
  },
});

export default ColorPicker;
