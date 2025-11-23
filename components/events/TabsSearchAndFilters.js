import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const TabsSearchAndFilters = ({
  onTabChange,
  onSearchChange,
  onFilterPress,
}) => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("guests");

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={[styles.tabsContainer, isRTL && styles.tabsContainerRTL]}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "guests" && styles.tabActive,
              isRTL && styles.tabRTL,
            ]}
            onPress={() => handleTabPress("guests")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "guests" && styles.tabTextActive,
                isRTL && styles.tabTextRTL,
              ]}
            >
              المدعوين
            </Text>
            <Ionicons
              name="people-outline"
              size={16}
              color={activeTab === "guests" ? "#2C2C2C" : "#656565"}
            />
          </TouchableOpacity>
          {activeTab === "guests" && <View style={styles.activeIndicator} />}
        </View>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "moderators" && styles.tabActive,
            isRTL && styles.tabRTL,
          ]}
          onPress={() => handleTabPress("moderators")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "moderators" && styles.tabTextActive,
              isRTL && styles.tabTextRTL,
            ]}
          >
            المشرفين
          </Text>
          <Ionicons
            name="people-outline"
            size={16}
            color={activeTab === "moderators" ? "#2C2C2C" : "#656565"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Search and Filter */}
      <View
        style={[styles.searchContainer, isRTL && styles.searchContainerRTL]}
      >
        {/* Search Input */}
        <View style={[styles.searchInput, isRTL && styles.searchInputRTL]}>
          <Ionicons name="search-outline" size={16} color="#767676" />
          <TextInput
            placeholder="اسم المدعو"
            placeholderTextColor="#656565"
            style={[styles.input, isRTL && styles.inputRTL]}
            onChangeText={onSearchChange}
          />
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          style={[styles.filterButton, isRTL && styles.filterButtonRTL]}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, isRTL && styles.filterTextRTL]}>
            التصفية
          </Text>
          <Ionicons name="options-outline" size={16} color="#767676" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
  },
  tabsContainerRTL: {
    flexDirection: "row-reverse",
  },
  tabWrapper: {
    position: "relative",
  },
  tab: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  tabRTL: {
    flexDirection: "row-reverse",
  },
  tabActive: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Cairo_700Bold",
    color: "#656565",
    lineHeight: 20,
  },
  tabTextRTL: {
    textAlign: "right",
  },
  tabTextActive: {
    color: "#2C2C2C",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#C28E5C",
    borderRadius: 9999,
  },
  divider: {
    height: 3,
    backgroundColor: "#F2F2F2",
    borderRadius: 9999,
    marginHorizontal: 12,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    gap: 16,
  },
  searchContainerRTL: {
    flexDirection: "row-reverse",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
  },
  filterButtonRTL: {
    flexDirection: "row-reverse",
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
    color: "#656565",
    lineHeight: 16,
  },
  filterTextRTL: {
    textAlign: "right",
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    height: 36,
  },
  searchInputRTL: {
    flexDirection: "row-reverse",
  },
  input: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
    color: "#656565",
    lineHeight: 16,
  },
  inputRTL: {
    textAlign: "right",
  },
});

export default TabsSearchAndFilters;
