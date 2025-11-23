import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { useFormContext } from "react-hook-form";
import { useLanguage } from "../../localization";
import Svg, { Path } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Icons
const PeopleIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M11.9997 4.77325C11.9597 4.76659 11.9131 4.76659 11.8731 4.77325C10.9531 4.73992 10.2197 3.98659 10.2197 3.05325C10.2197 2.09992 10.9864 1.33325 11.9397 1.33325C12.8931 1.33325 13.6597 2.10659 13.6597 3.05325C13.6531 3.98659 12.9197 4.73992 11.9997 4.77325Z"
      stroke="#C28E5C"
      strokeWidth="0.692308"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.313 9.62669C12.2263 9.78003 13.233 9.62003 13.9396 9.14669C14.8796 8.52003 14.8796 7.49336 13.9396 6.86669C13.2263 6.39336 12.2063 6.23336 11.293 6.39336"
      stroke="#C28E5C"
      strokeWidth="0.692308"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.98031 4.77325C4.02031 4.76659 4.06698 4.76659 4.10698 4.77325C5.02698 4.73992 5.76031 3.98659 5.76031 3.05325C5.76031 2.09992 4.99365 1.33325 4.04031 1.33325C3.08698 1.33325 2.32031 2.10659 2.32031 3.05325C2.32698 3.98659 3.06031 4.73992 3.98031 4.77325Z"
      stroke="#C28E5C"
      strokeWidth="0.692308"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.66663 9.62669C3.75329 9.78003 2.74663 9.62003 2.03996 9.14669C1.09996 8.52003 1.09996 7.49336 2.03996 6.86669C2.75329 6.39336 3.77329 6.23336 4.68663 6.39336"
      stroke="#C28E5C"
      strokeWidth="0.692308"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.0007 9.75323C7.9607 9.74657 7.91404 9.74657 7.87404 9.75323C6.95404 9.7199 6.2207 8.96657 6.2207 8.03323C6.2207 7.0799 6.98737 6.31323 7.9407 6.31323C8.89403 6.31323 9.6607 7.08657 9.6607 8.03323C9.65404 8.96657 8.9207 9.72657 8.0007 9.75323Z"
      stroke="#C28E5C"
      strokeWidth="0.692308"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.06047 11.8532C5.12047 12.4799 5.12047 13.5066 6.06047 14.1332C7.12714 14.8466 8.8738 14.8466 9.94047 14.1332C10.8805 13.5066 10.8805 12.4799 9.94047 11.8532C8.88047 11.1466 7.12714 11.1466 6.06047 11.8532Z"
      stroke="#C28E5C"
      strokeWidth="0.692308"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UserSearchIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M8.00033 7.99992C9.84127 7.99992 11.3337 6.50753 11.3337 4.66658C11.3337 2.82564 9.84127 1.33325 8.00033 1.33325C6.15938 1.33325 4.66699 2.82564 4.66699 4.66658C4.66699 6.50753 6.15938 7.99992 8.00033 7.99992Z"
      stroke="#C28E5C"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.27344 14.6667C2.27344 12.0867 4.84012 10 8.00012 10"
      stroke="#C28E5C"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.1333 14.2667C13.3115 14.2667 14.2667 13.3115 14.2667 12.1333C14.2667 10.9551 13.3115 10 12.1333 10C10.9551 10 10 10.9551 10 12.1333C10 13.3115 10.9551 14.2667 12.1333 14.2667Z"
      stroke="#C28E5C"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.6667 14.6667L14 14"
      stroke="#C28E5C"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M5.33301 1.33325V3.33325"
      stroke="#C28E5C"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.667 1.33325V3.33325"
      stroke="#C28E5C"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.6667 2.33325C12.8867 2.45325 14 3.29992 14 6.43325V10.5533C14 13.2999 13.3333 14.6733 10 14.6733H6C2.66667 14.6733 2 13.2999 2 10.5533V6.43325C2 3.29992 3.11333 2.45992 5.33333 2.33325H10.6667Z"
      stroke="#C28E5C"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.8337 11.7334H2.16699"
      stroke="#C28E5C"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.99967 5.5C7.17967 5.5 6.48634 5.94667 6.48634 6.81333C6.48634 7.22667 6.67967 7.54 6.97301 7.74C6.56634 7.98 6.33301 8.36667 6.33301 8.82C6.33301 9.64667 6.96634 10.16 7.99967 10.16C9.02634 10.16 9.66634 9.64667 9.66634 8.82C9.66634 8.36667 9.43301 7.97333 9.01967 7.74C9.31967 7.53333 9.50634 7.22667 9.50634 6.81333C9.50634 5.94667 8.81967 5.5 7.99967 5.5ZM7.99967 7.39333C7.65301 7.39333 7.39967 7.18667 7.39967 6.86C7.39967 6.52667 7.65301 6.33333 7.99967 6.33333C8.34634 6.33333 8.59967 6.52667 8.59967 6.86C8.59967 7.18667 8.34634 7.39333 7.99967 7.39333ZM7.99967 9.33333C7.55967 9.33333 7.23967 9.11333 7.23967 8.71333C7.23967 8.31333 7.55967 8.1 7.99967 8.1C8.43967 8.1 8.75967 8.32 8.75967 8.71333C8.75967 9.11333 8.43967 9.33333 7.99967 9.33333Z"
      fill="#C28E5C"
    />
  </Svg>
);

const LocationIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M7.99992 8.95321C9.14867 8.95321 10.0799 8.02197 10.0799 6.87321C10.0799 5.72446 9.14867 4.79321 7.99992 4.79321C6.85117 4.79321 5.91992 5.72446 5.91992 6.87321C5.91992 8.02197 6.85117 8.95321 7.99992 8.95321Z"
      stroke="#C28E5C"
    />
    <Path
      d="M2.41379 5.65992C3.72712 -0.113413 12.2805 -0.106746 13.5871 5.66659C14.3538 9.05325 12.2471 11.9199 10.4005 13.6933C9.06046 14.9866 6.94046 14.9866 5.59379 13.6933C3.75379 11.9199 1.64712 9.04659 2.41379 5.65992Z"
      stroke="#C28E5C"
    />
  </Svg>
);

const EventSummary = () => {
  const { isRTL } = useLanguage();
  const { watch } = useFormContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const formData = watch();
  const eventName = formData.eventName || "حفل زفاف أحمد و��نى";
  const eventType = formData.eventType || "wedding";
  const guestCount = formData.guestList?.length || 0;
  const moderatorCount = formData.moderatorsList?.length || 0;
  const eventDate = formData.eventDate;
  const eventTime = formData.eventTime || "";
  const location = formData.address?.address || "";
  const description = formData.description || formData.invitationMessage || "";
  const selectedTemplate = formData.selectedTemplate;

  const formatDate = (date) => {
    if (!date) return "12 مارس , 21:51";
    const d = new Date(date);
    const arabicMonths = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    return `${d.getDate()} ${arabicMonths[d.getMonth()]} , ${eventTime}`;
  };

  const getEventTypeLabel = () => {
    const types = {
      wedding: "حفل زفاف",
      birthday: "عيد ميلاد",
      graduation: "تخرج",
      meeting: "اجتماع",
      conference: "مؤتمر",
      other: "مناسبة",
    };
    return types[eventType] || "حفل زفاف";
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Invitation Card Preview */}
      {selectedTemplate && (
        <View style={styles.invitationCardContainer}>
          <View style={styles.invitationCard}>
            <Image
              source={{ uri: selectedTemplate.image || "https://api.builder.io/api/v1/image/assets/TEMP/d47980f85af7f53df813182927f2251f8ab2a2dc?width=646" }}
              style={styles.invitationImage}
              resizeMode="cover"
            />
          </View>
        </View>
      )}

      {/* Event Header */}
      <View style={[styles.eventHeader, isRTL && styles.eventHeaderRTL]}>
        <Text style={[styles.eventTypeLabel, isRTL && styles.eventTypeLabelRTL]}>
          {getEventTypeLabel()}
        </Text>
        <Text style={[styles.eventName, isRTL && styles.eventNameRTL]}>
          {eventName}
        </Text>
      </View>

      {/* Event Metrics */}
      <View style={styles.metricsCard}>
        {/* Row 1: Guests and Moderators */}
        <View style={[styles.metricsRow, isRTL && styles.metricsRowRTL]}>
          {/* Guests */}
          <View style={[styles.metric, isRTL && styles.metricRTL]}>
            <View style={styles.iconContainer}>
              <PeopleIcon />
            </View>
            <View style={[styles.metricContent, isRTL && styles.metricContentRTL]}>
              <Text style={[styles.metricLabel, isRTL && styles.metricLabelRTL]}>
                ضيف مدعو
              </Text>
              <Text style={styles.metricValue}>{guestCount}</Text>
            </View>
          </View>

          {/* Moderators */}
          <View style={[styles.metric, isRTL && styles.metricRTL]}>
            <View style={styles.iconContainer}>
              <UserSearchIcon />
            </View>
            <View style={[styles.metricContent, isRTL && styles.metricContentRTL]}>
              <Text style={[styles.metricLabel, isRTL && styles.metricLabelRTL]}>
                مشرف
              </Text>
              <Text style={styles.metricValue}>{moderatorCount}</Text>
            </View>
          </View>
        </View>

        {/* Row 2: Date and Location */}
        <View style={[styles.metricsRow, styles.metricsRowBottom, isRTL && styles.metricsRowRTL]}>
          {/* Location */}
          <View style={[styles.metric, isRTL && styles.metricRTL]}>
            <View style={styles.iconContainer}>
              <LocationIcon />
            </View>
            <View style={[styles.metricContent, isRTL && styles.metricContentRTL]}>
              <Text style={[styles.metricLabel, isRTL && styles.metricLabelRTL]}>
                العنوان
              </Text>
              <Text style={styles.metricValue} numberOfLines={1}>
                {location || "250"}
              </Text>
            </View>
          </View>

          {/* Date/Time */}
          <View style={[styles.metric, isRTL && styles.metricRTL]}>
            <View style={styles.iconContainer}>
              <CalendarIcon />
            </View>
            <View style={[styles.metricContent, isRTL && styles.metricContentRTL]}>
              <Text style={[styles.metricLabel, isRTL && styles.metricLabelRTL]}>
                التوقيت
              </Text>
              <Text style={styles.metricValue} numberOfLines={1}>
                {formatDate(eventDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Event Details */}
      {description && (
        <View style={styles.detailsCard}>
          <Text style={[styles.detailsTitle, isRTL && styles.detailsTitleRTL]}>
            تفاصيل المناسبة
          </Text>
          <Text style={[styles.detailsText, isRTL && styles.detailsTextRTL]}>
            {description}
          </Text>
        </View>
      )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  invitationCardContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  invitationCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  invitationImage: {
    width: "100%",
    height: Platform.select({
      ios: 134,
      android: 134,
      default: Math.min(SCREEN_WIDTH * 0.35, 150),
    }),
    borderRadius: 6.417,
  },
  eventHeader: {
    marginBottom: 16,
    alignItems: "flex-start",
  },
  eventHeaderRTL: {
    alignItems: "flex-end",
  },
  eventTypeLabel: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#2C2C2C",
    marginBottom: 4,
    textAlign: "left",
  },
  eventTypeLabelRTL: {
    textAlign: "right",
  },
  eventName: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    textAlign: "left",
  },
  eventNameRTL: {
    textAlign: "right",
  },
  metricsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F5ECE4",
    padding: 16,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricsRowRTL: {
    flexDirection: "row-reverse",
  },
  metricsRowBottom: {
    marginBottom: 0,
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
    minWidth: Platform.select({
      ios: 140,
      android: 140,
      default: 160,
    }),
  },
  metricRTL: {
    flexDirection: "row-reverse",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C28E5C",
    justifyContent: "center",
    alignItems: "center",
  },
  metricContent: {
    flex: 1,
    alignItems: "flex-start",
  },
  metricContentRTL: {
    alignItems: "flex-end",
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#656565",
    marginBottom: 2,
    textAlign: "left",
  },
  metricLabelRTL: {
    textAlign: "right",
  },
  metricValue: {
    fontSize: 14,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F5ECE4",
    padding: 16,
  },
  detailsTitle: {
    fontSize: 14,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    marginBottom: 8,
    textAlign: "left",
  },
  detailsTitleRTL: {
    textAlign: "right",
  },
  detailsText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    lineHeight: 16,
    textAlign: "left",
  },
  detailsTextRTL: {
    textAlign: "right",
  },
});

export default EventSummary;
