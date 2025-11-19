import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const EventListItem = ({ event, onPress }) => {
  const { isRTL } = useLanguage();

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return { backgroundColor: "#EAF4EF", color: "#2A8C5B" };
      case "ended":
        return { backgroundColor: "#F2F2F2", color: "#656565" };
      default:
        return { backgroundColor: "#F2F2F2", color: "#656565" };
    }
  };

  const statusStyle = getStatusStyle(event.status);

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {/* Main Content */}
      <View style={[styles.contentRow, isRTL && styles.contentRowRTL]}>
        {/* Text Content */}
        <View style={[styles.textContent, isRTL && styles.textContentRTL]}>
          {/* Title and Status */}
          <View style={[styles.titleRow, isRTL && styles.titleRowRTL]}>
            <View
              style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}
            >
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {event.status === "active" ? "نشط" : "انتهت"}
              </Text>
            </View>
            <Text style={[styles.title, isRTL && styles.titleRTL]}>
              {event.title}
            </Text>
          </View>

          {/* Details */}
          <View style={[styles.details, isRTL && styles.detailsRTL]}>
            {/* Guest Count */}
            <View style={[styles.detailItem, isRTL && styles.detailItemRTL]}>
              <Text style={styles.detailText}>{event.guestCount} ضيف</Text>
              <Ionicons name="people-outline" size={12} color="#C28E5C" />
            </View>

            {/* Date and Time */}
            <View style={[styles.detailItem, isRTL && styles.detailItemRTL]}>
              <Text style={styles.detailText}>{event.dateTime}</Text>
              <Ionicons name="calendar-outline" size={12} color="#C28E5C" />
            </View>
          </View>
        </View>

        {/* Event Image */}
        <View style={styles.imageContainer}>
          {event.image ? (
            <Image source={{ uri: event.image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={24} color="#C28E5C" />
            </View>
          )}
        </View>
      </View>

      {/* Stats Row */}
      <View style={[styles.statsRow, isRTL && styles.statsRowRTL]}>
        <View style={[styles.statItem, isRTL && styles.statItemRTL]}>
          <Text style={styles.statLabel}>لم يرد: </Text>
          <Text style={styles.statValue}>{event.noResponse || 15}</Text>
          <View style={[styles.statDot, { backgroundColor: "#A0A0A0" }]} />
        </View>

        <View style={[styles.statItem, isRTL && styles.statItemRTL]}>
          <Text style={styles.statLabel}>معتذر: </Text>
          <Text style={styles.statValue}>{event.declined || 15}</Text>
          <View style={[styles.statDot, { backgroundColor: "#C0392B" }]} />
        </View>

        <View style={[styles.statItem, isRTL && styles.statItemRTL]}>
          <Text style={styles.statLabel}>موافق: </Text>
          <Text style={styles.statValue}>{event.accepted || 120}</Text>
          <View style={[styles.statDot, { backgroundColor: "#2A8C5B" }]} />
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.actionButtonText}>مشاهدة التفاصيل</Text>
        <Ionicons name="settings-outline" size={12} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderTopWidth: 1,
    borderRightWidth: 6,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#C28E5C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  containerRTL: {},
  contentRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  contentRowRTL: {
    flexDirection: "row-reverse",
  },
  textContent: {
    flex: 1,
    gap: 8,
  },
  textContentRTL: {
    alignItems: "flex-end",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
  titleRowRTL: {
    flexDirection: "row-reverse",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Cairo_500Medium",
    lineHeight: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    lineHeight: 24,
  },
  titleRTL: {
    textAlign: "right",
  },
  details: {
    gap: 8,
    alignItems: "flex-end",
  },
  detailsRTL: {},
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailItemRTL: {
    flexDirection: "row-reverse",
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#656565",
    lineHeight: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    marginBottom: 12,
  },
  statsRowRTL: {
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
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#C28E5C",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
    lineHeight: 16,
  },
});

export default EventListItem;
