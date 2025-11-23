import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const EventDetails = ({ event, onStatsPress, onBack }) => {
  const { isRTL } = useLanguage();

  // Format backend data
  const title = event.eventDetails?.title || event.title || "مناسبة بدون عنوان";
  const eventType = event.eventDetails?.type || event.type || "أخرى";
  const location = event.eventDetails?.location || event.location || "غير محدد";
  const description =
    event.eventDetails?.description || event.description || "";

  // Format date and time
  const formatDateTime = () => {
    const eventDate = event.eventDetails?.date || event.date;
    const eventTime = event.eventDetails?.time || event.time;
    if (eventDate) {
      const date = new Date(eventDate);
      const dateStr = date.toLocaleDateString("ar-SA", {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      return `${dateStr}${eventTime ? " - " + eventTime : ""}`;
    }
    return event.dateTime || "غير محدد";
  };

  // Calculate guest count and moderators
  const guestCount = event.guestList?.length || event.totalInvites || 0;
  const moderatorsCount =
    event.supervisorsList?.length || event.moderatorsCount || 0;

  // Get guest stats
  const confirmed =
    event.confirmed ||
    event.guestList?.filter((g) => g.status === "confirmed").length ||
    0;
  const declined =
    event.declined ||
    event.guestList?.filter((g) => g.status === "declined").length ||
    0;
  const noResponse =
    event.noResponse ||
    event.maybe ||
    event.invited ||
    event.guestList?.filter((g) =>
      ["no-response", "maybe", "invited"].includes(g.status)
    ).length ||
    0;

  return (
    <View style={styles.container}>
      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Image */}
        <View style={styles.imageWrapper}>
          <View style={styles.imageContainer}>
            {event.image ? (
              <Image source={{ uri: event.image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>INVITATION</Text>
                <Text style={styles.placeholderSubtext}>Dear, Lorem Ipsum</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.imageOverlay} activeOpacity={0.7}>
            <Ionicons name="eye-outline" size={12} color="#C28E5C" />
          </TouchableOpacity>
        </View>

        {/* Event Title */}
        <View style={[styles.titleSection, isRTL && styles.titleSectionRTL]}>
          <Text style={[styles.eventType, isRTL && styles.eventTypeRTL]}>
            {eventType === "wedding"
              ? "حفل زفاف"
              : eventType === "birthday"
              ? "عيد ميلاد"
              : eventType === "graduation"
              ? "تخرج"
              : "مناسبة"}
          </Text>
          <Text style={[styles.eventTitle, isRTL && styles.eventTitleRTL]}>
            {title}
          </Text>
        </View>

        {/* Info Cards */}
        <View style={[styles.infoCard, isRTL && styles.infoCardRTL]}>
          {/* Row 1 */}
          <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
            {/* Guest Count */}
            <View style={[styles.infoItemHalf, isRTL && styles.infoItemRTL]}>
              <View style={styles.iconContainer}>
                <Ionicons name="people-outline" size={16} color="#C28E5C" />
              </View>

              <View
                style={[styles.infoContent, isRTL && styles.infoContentRTL]}
              >
                <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>
                  ضيف مدعو
                </Text>
                <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>
                  {guestCount}
                </Text>
              </View>
            </View>

            {/* Moderators */}
            <View style={[styles.infoItemHalf, isRTL && styles.infoItemRTL]}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-add-outline" size={16} color="#C28E5C" />
              </View>

              <View
                style={[styles.infoContent, isRTL && styles.infoContentRTL]}
              >
                <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>
                  مشرف
                </Text>
                <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>
                  {moderatorsCount}
                </Text>
              </View>
            </View>
          </View>

          {/* Row 2 */}
          <View style={[styles.infoRow, isRTL && styles.infoRowRTL]}>
            {/* Date Time */}
            <View style={[styles.infoItemHalf, isRTL && styles.infoItemRTL]}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={16} color="#C28E5C" />
              </View>

              <View
                style={[styles.infoContent, isRTL && styles.infoContentRTL]}
              >
                <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>
                  التوقيت
                </Text>
                <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>
                  {formatDateTime()}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={[styles.infoItemHalf, isRTL && styles.infoItemRTL]}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={16} color="#C28E5C" />
              </View>

              <View
                style={[styles.infoContent, isRTL && styles.infoContentRTL]}
              >
                <Text style={[styles.infoLabel, isRTL && styles.infoLabelRTL]}>
                  العنوان
                </Text>
                <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>
                  {location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View
          style={[styles.descriptionCard, isRTL && styles.descriptionCardRTL]}
        >
          <Text
            style={[
              styles.descriptionTitle,
              isRTL && styles.descriptionTitleRTL,
            ]}
          >
            تفاصيل المناسبة
          </Text>
          <Text
            style={[styles.descriptionText, isRTL && styles.descriptionTextRTL]}
          >
            {description || "لا يوجد وصف للمناسبة"}
          </Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, isRTL && styles.statsCardRTL]}>
          <View style={[styles.statItem, isRTL && styles.statItemRTL]}>
            <Text style={styles.statLabel}>لم يرد: </Text>
            <Text style={styles.statValue}>{noResponse}</Text>
            <View style={[styles.statDot, { backgroundColor: "#A0A0A0" }]} />
          </View>

          <View style={[styles.statItem, isRTL && styles.statItemRTL]}>
            <Text style={styles.statLabel}>معتذر: </Text>
            <Text style={styles.statValue}>{declined}</Text>
            <View style={[styles.statDot, { backgroundColor: "#C0392B" }]} />
          </View>

          <View style={[styles.statItem, isRTL && styles.statItemRTL]}>
            <Text style={styles.statLabel}>موافق: </Text>
            <Text style={styles.statValue}>{confirmed}</Text>
            <View style={[styles.statDot, { backgroundColor: "#2A8C5B" }]} />
          </View>
        </View>

        {/* Stats Button */}
        <TouchableOpacity
          style={styles.statsButton}
          onPress={onStatsPress}
          activeOpacity={0.7}
        >
          <Text style={styles.statsButtonText}>احصائيات المناسبة</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F4EF",
  },
  header: {
    backgroundColor: "#C28E5C",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRTL: {
    flexDirection: "row-reverse",
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#FFF",
    textAlign: "center",
    flex: 1,
  },
  headerTitleRTL: {
    textAlign: "center",
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  imageWrapper: {
    position: "relative",
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#0D4D4D",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
    fontFamily: "Cairo_700Bold",
    color: "#C28E5C",
  },
  placeholderSubtext: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#C28E5C",
    marginTop: 4,
  },
  imageOverlay: {
    position: "absolute",
    left: 24,
    top: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(5px)",
    padding: 8,
    borderRadius: 4,
  },
  titleSection: {
    alignItems: "flex-end",
    gap: 8,
  },
  titleSectionRTL: {},
  eventType: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#2C2C2C",
    lineHeight: 20,
  },
  eventTypeRTL: {
    textAlign: "right",
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    lineHeight: 24,
  },
  eventTitleRTL: {
    textAlign: "right",
  },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: "#F5ECE4",
  },
  infoCardRTL: {},
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  infoRowRTL: {
    flexDirection: "row-reverse",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  infoItemRTL: {
    flexDirection: "row-reverse",
  },
  infoItemHalf: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
    minWidth: "48%",
    maxWidth: "48%",
  },
  infoItemFull: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
  },
  infoItemFullRTL: {
    flexDirection: "row-reverse",
  },
  infoContent: {
    alignItems: "center",
  },
  infoContentRTL: {
    alignItems: "flex-end",
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#656565",
    lineHeight: 16,
  },
  infoLabelRTL: {
    textAlign: "right",
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    lineHeight: 20,
  },
  infoValueRTL: {
    textAlign: "center",
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
  descriptionCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: "#F5ECE4",
  },
  descriptionCardRTL: {},
  descriptionTitle: {
    fontSize: 14,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    lineHeight: 20,
  },
  descriptionTitleRTL: {
    textAlign: "right",
  },
  descriptionText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    lineHeight: 16,
  },
  descriptionTextRTL: {
    textAlign: "right",
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
  },
  statsCardRTL: {
    flexDirection: "row-reverse",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statItemRTL: {
    flexDirection: "row-reverse",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    lineHeight: 16,
  },
  statValue: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    lineHeight: 16,
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 9999,
  },
  statsButton: {
    backgroundColor: "#C28E5C",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  statsButtonText: {
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
    lineHeight: 16,
  },
});

export default EventDetails;
