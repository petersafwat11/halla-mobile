import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { useLanguage } from "../../localization";
import TextInput from "../commen/TextInput";
import TextAreaInput from "../commen/TextAreaInput";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TAB_OPTIONS = [
  { key: "attendance", labelAr: "الحضور", labelEn: "Attendance" },
  { key: "maybe", labelAr: "ربما", labelEn: "Maybe" },
  { key: "absence", labelAr: "الاعتذار", labelEn: "Absence" },
];

const StepFour = () => {
  const { isRTL } = useLanguage();
  const { control } = useFormContext();
  const [activeTab, setActiveTab] = useState("attendance");
  const tabAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH - 32);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTabChange = (tabKey, index) => {
    setActiveTab(tabKey);
    Animated.spring(tabAnimation, {
      toValue: index,
      useNativeDriver: true,
      tension: 68,
      friction: 10,
    }).start();
  };

  const getTabWidth = () => {
    return (containerWidth - 48) / 3; // Account for padding and gaps
  };

  const tabWidth = getTabWidth();
  const indicatorTranslateX = tabAnimation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: isRTL
      ? [tabWidth * 2 + 16, tabWidth + 8, 0]
      : [0, tabWidth + 8, tabWidth * 2 + 16],
  });

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      {/* Invitation Message */}
      <Controller
        control={control}
        name="invitationMessage"
        rules={{ required: "نص رسالة الدعوة مطلوب" }}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextAreaInput
            label="نص رسالة الدعوة"
            placeholder="ادخل نص الرسالة"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message}
            numberOfLines={4}
            maxLength={500}
          />
        )}
      />

      {/* Auto Replies Section */}
      <View style={styles.autoRepliesContainer}>
        <Text style={[styles.sectionLabel, isRTL && styles.sectionLabelRTL]}>
          الردود التلقائية
        </Text>

        {/* Tabs */}
        <View style={styles.tabsWrapper}>
          <View style={[styles.tabsContainer, isRTL && styles.tabsContainerRTL]}>
            {TAB_OPTIONS.map((tab, index) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    { width: tabWidth },
                  ]}
                  onPress={() => handleTabChange(tab.key, index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.tabTextActive,
                    ]}
                  >
                    {isRTL ? tab.labelAr : tab.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Animated Indicator */}
          <View style={styles.indicatorContainer}>
            <Animated.View
              style={[
                styles.indicator,
                {
                  width: tabWidth,
                  transform: [{ translateX: indicatorTranslateX }],
                },
              ]}
            />
          </View>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "attendance" && (
            <Controller
              control={control}
              name="attendanceAutoReply"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="رد تلقائى للحضور"
                  placeholder="ادخل نص الرد التلقائى"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          )}

          {activeTab === "maybe" && (
            <Controller
              control={control}
              name="expectedAttendanceAutoReply"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="رد تلقائى لربما"
                  placeholder="ادخل نص الرد التلقائى"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          )}

          {activeTab === "absence" && (
            <Controller
              control={control}
              name="absenceAutoReply"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="رد تلقائى للاعتذار"
                  placeholder="ادخل نص الرد التلقائى"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          )}
        </View>
      </View>

      {/* Optional Note */}
      <Controller
        control={control}
        name="note"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={
              <Text>
                <Text style={styles.labelText}>أضف ملاحظة </Text>
                <Text style={styles.optionalText}>(اختياري)</Text>
              </Text>
            }
            placeholder="اضف ملاحظتك هنا"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  autoRepliesContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#DFDFDF",
    backgroundColor: "#FDFDFD",
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#2C2C2C",
    marginBottom: 12,
    textAlign: "left",
  },
  sectionLabelRTL: {
    textAlign: "right",
  },
  tabsWrapper: {
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tabsContainerRTL: {
    flexDirection: "row-reverse",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    minWidth: 80,
    flex: 1,
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#656565",
  },
  tabTextActive: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#2C2C2C",
  },
  indicatorContainer: {
    height: 3,
    backgroundColor: "#F2F2F2",
    borderRadius: 9999,
    marginTop: 4,
    overflow: "hidden",
  },
  indicator: {
    height: "100%",
    backgroundColor: "#C28E5C",
    borderRadius: 9999,
  },
  tabContent: {
    marginTop: 8,
  },
  labelText: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#2C2C2C",
  },
  optionalText: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#767676",
  },
});

export default StepFour;
