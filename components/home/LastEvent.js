import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const LastEvent = ({ event, onManagePress }) => {
  if (!event) return null;

  // Format backend data
  const title = event.eventDetails?.title || event.title || "مناسبة بدون عنوان";
  const guestCount =
    event.guestList?.status?.confirmed +
      event.guestList?.status?.declined +
      event.guestList?.status?.maybe || 0;

  // Format date and time
  const formatDateTime = () => {
    if (event.eventDetails?.date) {
      const date = new Date(event.eventDetails.date);
      const dateStr = date.toLocaleDateString("ar-SA", {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric"
      });
      const timeStr = event.eventDetails?.time || "";
      return `${dateStr}${timeStr ? " - " + timeStr : ""}`;
    }
    return event.dateTime || "";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
      case "draft":
        return { backgroundColor: "#F9F4EF", color: "#C28E5C", text: "محفوظة" };
      case "ended":
        return { backgroundColor: "#F2F2F2", color: "#656565", text: "انتهت" };
      default:
        return { backgroundColor: "#F9F4EF", color: "#C28E5C", text: "محفوظة" };
    }
  };

  const statusStyle = getStatusStyle(event.status);

  // Get guest stats from backend format
  const confirmed = event.guestList?.status?.confirmed || 0;
  const declined = event.guestList?.status?.declined || 0;
  const maybe = event.guestList?.status?.maybe || 0;

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.contentRow}>
        {/* Text Content */}
        <View style={styles.textContent}>
          {/* Title and Status */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {title}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusStyle.backgroundColor }]}
            >
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {statusStyle.text}
              </Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.details}>
            {/* Guest Count */}
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={12} color="#C28E5C" />
              <Text style={styles.detailText}>{guestCount} ضيف</Text>
            </View>

            {/* Date and Time */}
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={12} color="#C28E5C" />
              <Text style={styles.detailText}>{formatDateTime()}</Text>
            </View>
          </View>
        </View>

        {/* Event Image */}
        <View style={styles.imageContainer}>
          {event.image ? (
            <Image source={{ uri: event.image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <View style={styles.placeholderRect} />
            </View>
          )}
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{maybe}</Text>
          <Text style={styles.statLabel}>لم يرد: </Text>
          <View style={[styles.statDot, { backgroundColor: "#A0A0A0" }]} />
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{declined}</Text>
          <Text style={styles.statLabel}>معتذر: </Text>
          <View style={[styles.statDot, { backgroundColor: "#C0392B" }]} />
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{confirmed}</Text>
          <Text style={styles.statLabel}>موافق: </Text>
          <View style={[styles.statDot, { backgroundColor: "#2A8C5B" }]} />
        </View>
      </View>

      {/* Manage Button */}
      <TouchableOpacity
        style={styles.manageButton}
        onPress={onManagePress}
        activeOpacity={0.7}
      >
        <Text style={styles.manageButtonText}>إدارة المناسبة</Text>
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
    gap: 12,
    borderTopWidth: 1,
    borderRightWidth: 6,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#C28E5C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },contentRow: {
    flexDirection: "row",
    gap: 16
  },  textContent: {
    flex: 1,
    gap: 8,
    justifyContent: "center"
  },  titleRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12
  },  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 9999
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Cairo_500Medium",
    lineHeight: 16,
    letterSpacing: 0.06
  },
  title: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    lineHeight: 24,
    letterSpacing: 0.024
  },details: {
    gap: 8,
    alignItems: "flex-end"
  },  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },  detailText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#656565",
    lineHeight: 16,
    letterSpacing: 0.06
  },
  imageContainer: {
    width: 54,
    height: 56,
    borderRadius: 8,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center"
  },
  placeholderRect: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F2F2F2"
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F7F7F7",
    borderRadius: 8
  },  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },  statLabel: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    lineHeight: 16
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 9999
  },
  manageButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#C28E5C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 32
  },
  manageButtonText: {
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
    lineHeight: 16,
    letterSpacing: 0.06
  }
});

export default LastEvent;
