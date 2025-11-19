import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";
import StatsCards from "./StatsCards";
import TabsSearchAndFilters from "./TabsSearchAndFilters";
import EventList from "./EventList";
import GuestListItem from "./GuestListItem";
import ModeratorListItem from "./ModeratorListItem";

const SingleEventStats = ({ event, onBack }) => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("guests");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual data
  const guests = [
    {
      id: "1",
      name: "احمد كمال سمير",
      phone: "966656555",
      email: "ads@outlook.com",
      status: "declined",
      responseDate: "الثلاثاء  12 مايو | 12:50م",
    },
    {
      id: "2",
      name: "احمد كمال سمير",
      phone: "966656555",
      email: "ads@outlook.com",
      status: "accepted",
      message: "الف مبروك للعروسين",
      responseDate: "الثلاثاء  12 مايو | 12:50م",
    },
    {
      id: "3",
      name: "احمد كمال سمير",
      phone: "966656555",
      email: "ads@outlook.com",
      status: "accepted",
      message: "الف مبروك للعروسين",
      responseDate: "الثلاثاء  12 مايو | 12:50م",
    },
  ];

  const moderators = [
    { id: "1", name: "أحمد كمال ابراهيم", phone: "96605196749" },
    { id: "2", name: "محمد علي حسن", phone: "96605196750" },
  ];

  const stats = {
    accepted: event?.stats?.accepted || 89,
    declined: event?.stats?.declined || 12,
    maybe: event?.stats?.maybe || 23,
    pending: event?.stats?.pending || 26,
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleFilterPress = () => {
    // Handle filter button press
    console.log("Filter pressed");
  };

  const currentData = activeTab === "guests" ? guests : moderators;
  const ListItemComponent =
    activeTab === "guests" ? GuestListItem : ModeratorListItem;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity
          onPress={() => {}}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>رسالة تذكيرية</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
          تفاصيل المناسبة
        </Text>

        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={16}
            color="#F9F4EF"
          />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statsCardHeader}>
            <Text style={[styles.statsCardTitle, isRTL && styles.statsCardTitleRTL]}>
              متابعة الحضور
            </Text>
          </View>
          <StatsCards stats={stats} />
        </View>
      </View>

      {/* Tabs, Search, and List */}
      <View style={styles.listContainer}>
        <TabsSearchAndFilters
          onTabChange={handleTabChange}
          onSearchChange={handleSearchChange}
          onFilterPress={handleFilterPress}
        />

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {currentData.map((item, index) => (
            <ListItemComponent
              key={item.id}
              {...(activeTab === "guests"
                ? { guest: item }
                : { moderator: item })}
              index={index}
            />
          ))}
        </ScrollView>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingButton} activeOpacity={0.7}>
        <View style={styles.floatingButtonInner}>
          <Ionicons name="person-add-outline" size={30} color="#FFF" />
        </View>
      </TouchableOpacity>
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
    width: 24,
    height: 24,
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
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
    lineHeight: 16,
  },
  statsContainer: {
    padding: 24,
  },
  statsCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsCardHeader: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  statsCardTitle: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    lineHeight: 24,
    textAlign: "right",
  },
  statsCardTitleRTL: {
    textAlign: "right",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  floatingButton: {
    position: "absolute",
    right: 24,
    bottom: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 105,
    backgroundColor: "#C28E5C",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SingleEventStats;
