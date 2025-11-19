import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const ModeratorListItem = ({ moderator }) => {
  const { isRTL } = useLanguage();

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {/* Left Content */}
      <View style={[styles.leftContent, isRTL && styles.leftContentRTL]}>
        <View style={[styles.nameSection, isRTL && styles.nameSectionRTL]}>
          <Text style={[styles.name, isRTL && styles.nameRTL]}>
            {moderator.name || "أحمد كمال ابراهيم"}
          </Text>
          <Text style={[styles.phone, isRTL && styles.phoneRTL]}>
            {moderator.phone || "96605196749"}
          </Text>
        </View>
      </View>

      {/* Crown Icon */}
      <View style={styles.crownContainer}>
        <Ionicons name="ribbon-outline" size={24} color="#C28E5C" />
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
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  containerRTL: {
    flexDirection: "row-reverse",
  },
  leftContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  leftContentRTL: {
    flexDirection: "row-reverse",
  },
  nameSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 4,
  },
  nameSectionRTL: {},
  name: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#2C2C2C",
    lineHeight: 20,
  },
  nameRTL: {
    textAlign: "right",
  },
  phone: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#656565",
    lineHeight: 16,
  },
  phoneRTL: {
    textAlign: "right",
  },
  crownContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ModeratorListItem;
