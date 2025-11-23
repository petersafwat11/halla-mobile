import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const ModeratorListItem = ({ moderator, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذا المشرف؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: () => onDelete && onDelete(moderator)
      }]);
  };

  return (
    <View style={styles.container}>
      {/* Crown Icon */}
      <View style={styles.crownContainer}>
        <Ionicons name="ribbon-outline" size={24} color="#C28E5C" />
      </View>
      {/* Left Content */}
      <View style={styles.leftContent}>
        <View style={styles.nameSection}>
          <Text style={styles.name}>
            {moderator.name || "أحمد كمال ابراهيم"}
          </Text>
          <Text style={styles.phone}>
            {moderator.phone || "96605196749"}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(moderator)}
          >
            <Ionicons name="create-outline" size={20} color="#C28E5C" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#C0392B" />
          </TouchableOpacity>
        )}
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: "flex-start",
    gap: 8
  },leftContent: {
    flexDirection: "row",
    // justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    // flex: 1
  },  nameSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 4
  },  name: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#2C2C2C",
    lineHeight: 20
  },  phone: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#656565",
    lineHeight: 16
  },  crownContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center"
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: "auto"
  },  actionButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F5F5F5"
  }
});

export default ModeratorListItem;
