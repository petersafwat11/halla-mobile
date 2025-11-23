import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";
import { useAuthStore } from "../../stores/authStore";
import {
  addGuest,
  addSupervisor,
  updateSupervisor,
  deleteSupervisor,
} from "../../services/eventsService2";
import StatsCards from "./StatsCards";
import TabsSearchAndFilters from "./TabsSearchAndFilters";
import EventList from "./EventList";
import GuestListItem from "./GuestListItem";
import ModeratorListItem from "./ModeratorListItem";
import AddGuestOrModeratorPopup from "./AddGuestOrmoderatorPopup";

const SingleEventStats = ({ event, stats, onBack, onRefresh }) => {
  const { isRTL } = useLanguage();
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState("guests");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Format response date to Arabic
  const formatResponseDate = (respondAt) => {
    if (!respondAt) return "لم يرد بعد";
    const date = new Date(respondAt);
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format guests from backend data
  const guests = (stats?.guests || []).map((guest) => ({
    id: guest.guestId,
    name: guest.name || "ضيف",
    phone: guest.phone || "",
    email: guest.email || "not provided",
    status: guest.status === "confirmed" ? "accepted" : guest.status,
    responseDate: formatResponseDate(guest.respondAt),
    addedBy: guest.addedBy,
  }));

  // Format moderators from backend data
  const moderators = (stats?.supervisors || []).map((supervisor) => ({
    id: supervisor._id || supervisor.id,
    name: supervisor.name || "مشرف",
    phone: supervisor.phone || "",
  }));

  // Use stats from backend
  const guestStats = {
    accepted: stats?.confirmed || 0,
    declined: stats?.declined || 0,
    maybe: stats?.maybe || 0,
    pending: stats?.noResponse || 0,
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

  const handleAddPress = () => {
    setEditingItem(null);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setEditingItem(null);
  };

  const handlePopupSave = async (data) => {
    try {
      setPopupLoading(true);

      if (activeTab === "guests") {
        if (editingItem) {
          // Edit guest (not implemented yet)
          Alert.alert("تنبيه", "تعديل الضيف غير متاح حالياً");
        } else {
          // Add guest
          await addGuest(event._id || event.id, data, token);
          Alert.alert("نجاح", "تم إضافة الضيف بنجاح");
        }
      } else {
        if (editingItem) {
          // Edit moderator
          await updateSupervisor(
            event._id || event.id,
            editingItem.id,
            data,
            token
          );
          Alert.alert("نجاح", "تم تعديل المشرف بنجاح");
        } else {
          // Add moderator
          await addSupervisor(event._id || event.id, data, token);
          Alert.alert("نجاح", "تم إضافة المشرف بنجاح");
        }
      }

      setShowPopup(false);
      setEditingItem(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error saving:", error);
      Alert.alert("خطأ", error.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setPopupLoading(false);
    }
  };

  const handleModeratorEdit = (moderator) => {
    setEditingItem(moderator);
    setShowPopup(true);
  };

  const handleModeratorDelete = async (moderator) => {
    try {
      await deleteSupervisor(event._id || event.id, moderator.id, token);
      Alert.alert("نجاح", "تم حذف المشرف بنجاح");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting moderator:", error);
      Alert.alert("خطأ", error.message || "حدث خطأ أثناء الحذف");
    }
  };

  const currentData = activeTab === "guests" ? guests : moderators;
  const ListItemComponent =
    activeTab === "guests" ? GuestListItem : ModeratorListItem;

  return (
    <View style={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statsCardHeader}>
            <Text
              style={[styles.statsCardTitle, isRTL && styles.statsCardTitleRTL]}
            >
              متابعة الحضور
            </Text>
          </View>
          <StatsCards stats={guestStats} />
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
                : {
                    moderator: item,
                    onEdit: handleModeratorEdit,
                    onDelete: handleModeratorDelete,
                  })}
              index={index}
            />
          ))}
        </ScrollView>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        activeOpacity={0.7}
        onPress={handleAddPress}
      >
        <View style={styles.floatingButtonInner}>
          <Ionicons name="person-add-outline" size={30} color="#FFF" />
        </View>
      </TouchableOpacity>

      {/* Add Guest/Moderator Popup */}
      <AddGuestOrModeratorPopup
        visible={showPopup}
        onClose={handlePopupClose}
        onSave={handlePopupSave}
        type={activeTab === "guests" ? "guest" : "moderator"}
        initialData={editingItem}
        loading={popupLoading}
      />
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
  reminderButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  reminderButtonText: {
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
  },
  statsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 12,
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
    marginHorizontal: 12,
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
    bottom: 100,
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
