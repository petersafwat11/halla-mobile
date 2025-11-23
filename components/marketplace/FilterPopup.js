import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const FilterPopup = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [selectedCountry, setSelectedCountry] = useState("الكل");
  const [selectedEventType, setSelectedEventType] = useState("الكل");
  const [selectedPrice, setSelectedPrice] = useState("الكل");
  const [selectedSection, setSelectedSection] = useState("1");

  const countryOptions = [
    "الكل",
    "السعودية",
    "الإمارات",
    "الكويت",
    "قطر",
    "البحرين",
    "عمان"];

  const eventTypeOptions = [
    "الكل",
    "حفلات زفاف",
    "حفلات تخرج",
    "مناسبات شركات",
    "حفلات أعياد ميلاد",
    "مناسبات دينية"];

  const priceOptions = [
    "الكل",
    "أقل من 500 ريال",
    "500 - 1000 ريال",
    "1000 - 2000 ريال",
    "أكثر من 2000 ريال"];

  const sections = [
    { id: "1", name: "قسم 1", count: 15 },
    { id: "2", name: "قسم 2", count: 15 },
    { id: "3", name: "قسم 3", count: 15 },
    { id: "4", name: "قسم 4", count: 15 },
    { id: "5", name: "قسم 5", count: 15 },
    { id: "6", name: "قسم 6", count: 15 },
    { id: "7", name: "قسم 7", count: 15 },
    { id: "8", name: "قسم 8", count: 15 },
    { id: "9", name: "قسم 9", count: 15 },
    { id: "10", name: "قسم 10", count: 15 }];

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.popup,
            {
              transform: [{ translateY: slideAnim }],
            }]}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#2C2C2C" />
            </TouchableOpacity>
            <Text style={styles.title}>
              الفلاتر
            </Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Country Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.label}>البلد</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCountry}
                  onValueChange={(value) => setSelectedCountry(value)}
                  style={styles.picker}
                >
                  {countryOptions.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Event Type Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.label}>
                نوع المناسبة
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedEventType}
                  onValueChange={(value) => setSelectedEventType(value)}
                  style={styles.picker}
                >
                  {eventTypeOptions.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Price Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.label}>السعر</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedPrice}
                  onValueChange={(value) => setSelectedPrice(value)}
                  style={styles.picker}
                >
                  {priceOptions.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Sections Dropdown */}
            <View style={styles.filterGroup}>
              <Text style={styles.label}>
                الأقسام
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedSection}
                  onValueChange={(value) => setSelectedSection(value)}
                  style={styles.picker}
                >
                  {sections.map((section) => (
                    <Picker.Item
                      key={section.id}
                      label={`${section.name} (${section.count})`}
                      value={section.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedCountry("الكل");
                setSelectedEventType("الكل");
                setSelectedPrice("الكل");
                setSelectedSection("1");
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>إعادة تعيين</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.applyButtonText}>تطبيق الفلاتر</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  popup: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.8,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },title: {
    fontSize: 18,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    textAlign: "center",
    flex: 1,
  },placeholder: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  filterGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: "Cairo_600SemiBold",
    color: "#2C2C2C",
    marginBottom: 8,
    textAlign: "right",
  },
  pickerContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
    flexDirection: "row",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C28E5C",
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: "Cairo_600SemiBold",
    color: "#C28E5C",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#C28E5C",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
  },
});

export default FilterPopup;
