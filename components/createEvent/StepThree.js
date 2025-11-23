import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated
} from "react-native";
import { useFormContext } from "react-hook-form";
import EventTemplates from "../home/EventTemplates";
import TextInput from "../commen/TextInput";
import TextAreaInput from "../commen/TextAreaInput";
import ColorPicker from "../commen/colorPicker";
import DropdownInput from "../commen/DropdownInput";
import PreviewInvitation from "./PreviewInvitation";
import Svg, { Path } from "react-native-svg";

// Calendar Icon
const CalendarIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 2V5"
      stroke="#C28E5C"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 2V5"
      stroke="#C28E5C"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.5 9.09009H20.5"
      stroke="#C28E5C"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
      stroke="#C28E5C"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.6947 13.7H15.7037"
      stroke="#C28E5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.6947 16.7H15.7037"
      stroke="#C28E5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9955 13.7H12.0045"
      stroke="#C28E5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9955 16.7H12.0045"
      stroke="#C28E5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.29431 13.7H8.30329"
      stroke="#C28E5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.29431 16.7H8.30329"
      stroke="#C28E5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Location Icon
const LocationIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M11.9999 13.4299C13.723 13.4299 15.1199 12.0331 15.1199 10.3099C15.1199 8.58681 13.723 7.18994 11.9999 7.18994C10.2768 7.18994 8.87988 8.58681 8.87988 10.3099C8.87988 12.0331 10.2768 13.4299 11.9999 13.4299Z"
      stroke="#C28E5C"
      strokeWidth="1.5"
    />
    <Path
      d="M3.6202 8.49C5.5902 -0.169998 18.4202 -0.159997 20.3802 8.5C21.5302 13.58 18.3702 17.88 15.6002 20.54C13.5902 22.48 10.4102 22.48 8.3902 20.54C5.6302 17.88 2.4702 13.57 3.6202 8.49Z"
      stroke="#C28E5C"
      strokeWidth="1.5"
    />
  </Svg>
);

const FONT_OPTIONS = [
  { label: "Cairo", value: "Cairo" },
  { label: "Inter", value: "Inter" },
  { label: "Roboto", value: "Roboto" },
  { label: "IBM Plex Sans Arabic", value: "IBM Plex Sans Arabic" },
  { label: "Noto Sans Arabic", value: "Noto Sans Arabic" },
  { label: "Amiri", value: "Amiri" }];

const StepThree = ({ selectedTemplate, onSelectTemplate }) => {
  const { control, watch, setValue } = useFormContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const formData = watch();
  const eventDate = formData.eventDate;
  const eventTime = formData.eventTime || "";
  const location = formData.address?.address || "";

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true
    }).start();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const arabicMonths = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر"];
    return `${d.getDate()} ${
      arabicMonths[d.getMonth()]
    } ${d.getFullYear()} , ${eventTime}`;
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplateId(template.id);
    // Store template data in form
    setValue("selectedTemplate", template, { shouldValidate: true });
    setValue("templateImage", template.image, { shouldValidate: true });

    // Call parent callback if provided
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Template Selection Section */}
        <View style={styles.templateSection}>
          <EventTemplates
            onSelectTemplate={handleTemplateSelect}
            selectedTemplateId={selectedTemplateId}
          />
        </View>

        {/* Form Title */}
        <Text style={styles.formTitle}>
          تصميم قالب الدعوة
        </Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Introduction/Opening */}
          <TextAreaInput
            name="templateIntroduction"
            label="مقدمة"
            placeholder="ادخل نص الرسالة"
            numberOfLines={4}
            maxLength={500}
          />

          {/* Bride's Name */}
          <TextInput
            name="templateBrideName"
            label="اسم العروسة"
            placeholder="ادخل اسم العروسة"
          />

          {/* Groom's Name */}
          <TextInput
            name="templateGroomName"
            label="اسم العريس"
            placeholder="ادخل اسم العريس"
          />

          {/* Message to Guests */}
          <TextInput
            name="templateGuestMessage"
            label="رساله للضيوف"
            placeholder="ادخل نص الرسالة"
          />

          {/* Event Timing (Read-only from Step 1) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              توقيت المناسبة
            </Text>
            <View
              style={styles.readOnlyInput}
            >
              <CalendarIcon />
              <Text
                style={styles.readOnlyText}
              >
                {formatDate(eventDate) || "22 مايو 2025 , 11:38 م"}
              </Text>
            </View>
          </View>

          {/* Event Location (Read-only from Step 1) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              عنوان الحفل
            </Text>
            <View
              style={styles.readOnlyInput}
            >
              <LocationIcon />
              <Text
                style={[
                  styles.readOnlyText,
                  !location && styles.placeholderText]}
              >
                {location || "ادخل عنوان الحفل"}
              </Text>
            </View>
          </View>

          {/* Closing Message */}
          <TextInput
            name="templateClosingMessage"
            label="رسالة ختامية"
            placeholder="ادخل نص الرسالة"
          />

          {/* Primary Color */}
          <ColorPicker
            name="templatePrimaryColor"
            label="اللون الأساسي"
            placeholder="اختر اللون الأساسى"
          />

          {/* Font Name */}
          <DropdownInput
            name="templateFont"
            label="الخط المطلوب"
            placeholder="مثل: inter, cairo"
            options={FONT_OPTIONS}
            modalTitle="اختر الخط"
          />

          {/* Preview Button */}
          <TouchableOpacity
            style={styles.previewButton}
            onPress={handlePreview}
            activeOpacity={0.8}
          >
            <Text style={styles.previewButtonText}>معاينة الدعوة</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Preview Modal */}
      <PreviewInvitation
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        eventTitle={formData.eventName || ""}
        invitationMessage={
          formData.invitationMessage || formData.templateIntroduction || ""
        }
        templateImage={formData.templateImage}
        templateData={{
          brideName: formData.templateBrideName,
          groomName: formData.templateGroomName
        }}
        eventDate={eventDate}
        eventTime={eventTime}
        location={location}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 24
  },
  templateSection: {
    marginBottom: 24
  },
  formTitle: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    lineHeight: 24,
    letterSpacing: 0.08,
    marginBottom: 16
    },  formContainer: {
    gap: 0
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#2C2C2C",
    marginBottom: 8,
    paddingHorizontal: 8
    },readOnlyInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderTopWidth: 1,
    borderRightWidth: 1.5,
    borderBottomWidth: 1,
    borderLeftWidth: 1.5,
    borderColor: "#DFDFDF",
    backgroundColor: "#FFF",
    minHeight: 48,
    gap: 12
  },  readOnlyText: {
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
  previewButton: {
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#C28E5C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  previewButtonText: {
    fontSize: 16,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
    lineHeight: 24,
    letterSpacing: 0.08
  }
});

export default StepThree;
