import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import TextInput from "../commen/TextInput";
import TextAreaInput from "../commen/TextAreaInput";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TAB_OPTIONS = [
  { key: "attendance", labelAr: "الحضور", labelEn: "Attendance" },
  { key: "maybe", labelAr: "ربما", labelEn: "Maybe" },
  { key: "absence", labelAr: "الاعتذار", labelEn: "Absence" },
];

const StepFour = () => {
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
    outputRange: [tabWidth * 2 + 16, tabWidth + 8, 0],
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
      <TextAreaInput
        name="invitationMessage"
        label="نص رسالة الدعوة"
        placeholder="ادخل نص الرسالة"
        rules={{ required: "نص رسالة الدعوة مطلوب" }}
        numberOfLines={4}
        maxLength={500}
      />

      {/* Auto Replies Section */}
      <View style={styles.autoRepliesContainer}>
        <Text style={styles.sectionLabel}>الردود التلقائية</Text>

        {/* Tabs */}
        <View style={styles.tabsWrapper}>
          <View style={styles.tabsContainer}>
            {TAB_OPTIONS.map((tab, index) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    { width: tabWidth },
                    isActive && styles.tabActive,
                  ]}
                  onPress={() => handleTabChange(tab.key, index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.tabText, isActive && styles.tabTextActive]}
                  >
                    {tab.labelAr}
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
            <TextInput
              name="attendanceAutoReply"
              label="رد تلقائى للحضور"
              placeholder="ادخل نص الرد التلقائى"
            />
          )}

          {activeTab === "maybe" && (
            <TextInput
              name="expectedAttendanceAutoReply"
              label="رد تلقائى لربما"
              placeholder="ادخل نص الرد التلقائى"
            />
          )}

          {activeTab === "absence" && (
            <TextInput
              name="absenceAutoReply"
              label="رد تلقائى للاعتذار"
              placeholder="ادخل نص الرد التلقائى"
            />
          )}
        </View>
      </View>

      {/* Optional Note */}
      <TextInput
        name="note"
        label={
          <Text>
            <Text style={styles.labelText}>أضف ملاحظة </Text>
            <Text style={styles.optionalText}>(اختياري)</Text>
          </Text>
        }
        placeholder="اضف ملاحظتك هنا"
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
  },
  tabsWrapper: {
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    minWidth: 80,
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#C28E5C",
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
