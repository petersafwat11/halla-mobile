import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage, useTranslation } from "../../localization";

const TicketCard = ({ ticket, onDelete, onEdit, index }) => {
  const { t } = useTranslation("tickets");

  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      tension: 50,
      friction: 7,
      useNativeDriver: true
    }).start();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f39c12";
      case "inProgress":
        return "#3498db";
      case "resolved":
        return "#27ae60";
      case "closed":
        return "#95a5a6";
      default:
        return "#f39c12";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return { date: `${year}-${month}-${day}`, time: `${hours}:${minutes}` };
  };

  const { date, time } = formatDate(ticket.createdAt);
  const statusColor = getStatusColor(ticket.status);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }]}
    >
      {/* Top Section: Status and Actions */}
      <View style={styles.top}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${statusColor}20` }]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {t(`status.${ticket.status}`)}
          </Text>
        </View>

        <View style={styles.actions}>
          {ticket.status === "pending" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(ticket)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={16} color="#3498db" />
              <Text style={[styles.actionText, styles.editText]}>
                {t("card.edit")}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(ticket._id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#e74c3c" />
            <Text style={[styles.actionText, styles.deleteText]}>
              {t("card.delete")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Type */}
      <Text style={styles.type}>
        {t(`types.${ticket.type}`)}
      </Text>

      {/* Bottom Section: Date and Message */}
      <View style={styles.bottom}>
        <View style={styles.dateContainer}>
          <Text style={styles.createdLabel}>
            {t("card.created")}
          </Text>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>

        <Text
          style={styles.message}
          numberOfLines={2}
        >
          {ticket.message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },  statusText: {
    fontSize: 13,
    fontFamily: "Cairo_600SemiBold"
  },
  actions: {
    flexDirection: "row",
    gap: 12
  },  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },  actionText: {
    fontSize: 13,
    fontFamily: "Cairo_600SemiBold"
  },
  editText: {
    color: "#3498db"
  },
  deleteText: {
    color: "#e74c3c"
  },
  type: {
    fontSize: 18,
    fontFamily: "Cairo_700Bold",
    color: "#2c2c2c",
    marginBottom: 12
  },  bottom: {
    gap: 8
  },  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },  createdLabel: {
    fontSize: 13,
    fontFamily: "Cairo_600SemiBold",
    color: "#666"
  },  date: {
    fontSize: 13,
    fontFamily: "Cairo_400Regular",
    color: "#666"
  },  time: {
    fontSize: 13,
    fontFamily: "Cairo_400Regular",
    color: "#999"
  },  message: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#666",
    lineHeight: 20
  },});

export default TicketCard;
