import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const TopBar = ({ title, onBack, showBack = false }) => {
  const { isRTL } = useLanguage();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C28E5C" />
      
      <View style={[styles.content, isRTL && styles.contentRTL]}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isRTL ? "chevron-forward" : "chevron-back"}
              size={24}
              color="#F9F4EF"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, isRTL && styles.titleRTL]}>{title}</Text>
        </View>

        <TouchableOpacity style={styles.reminderButton}>
          <Text style={styles.reminderText}>رسالة تذكيرية</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#C28E5C",
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 57,
  },
  contentRTL: {
    flexDirection: "row-reverse",
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },
  titleRTL: {
    textAlign: "center",
  },
  reminderButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reminderText: {
    fontFamily: "Cairo_600SemiBold",
    fontSize: 12,
    color: "#FFF",
  },
});

export default TopBar;
