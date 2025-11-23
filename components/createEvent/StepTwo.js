import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFormContext } from "react-hook-form";
import { useLanguage } from "../../localization";
import EventsService from "../../services/EventsService";
import TextInput from "../commen/TextInput";
import Button from "../commen/Button";
import ListOfGuestsORModerators from "./ListOfGuestsORModerators";
import Svg, { Path } from "react-native-svg";

const AddIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 4.16663V15.8333M4.16667 10H15.8333"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ListIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M6.66667 5H17.5M6.66667 10H17.5M6.66667 15H17.5M2.5 5H2.50833M2.5 10H2.50833M2.5 15H2.50833"
      stroke="#C28E5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StepTwo = ({ guestList = [], moderatorsList = [] }) => {
  const { isRTL } = useLanguage();
  const { setValue, watch } = useFormContext();
  const formData = watch();

  const [activeTab, setActiveTab] = useState("guests");
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showModeratorModal, setShowModeratorModal] = useState(false);

  // Guest form state
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestErrors, setGuestErrors] = useState({});

  // Moderator form state
  const [moderatorName, setModeratorName] = useState("");
  const [moderatorPhone, setModeratorPhone] = useState("");
  const [moderatorErrors, setModeratorErrors] = useState({});

  // ============================================================================
  // GUEST HANDLERS
  // ============================================================================

  const handleAddGuest = useCallback(() => {
    const guest = {
      name: guestName,
      phone: guestPhone,
    };

    const result = EventsService.addListItem(guest, formData.guestList, "guest");

    if (result.success) {
      setValue("guestList", result.list, { shouldValidate: true });
      setGuestName("");
      setGuestPhone("");
      setGuestErrors({});
    } else {
      setGuestErrors(result.errors);
    }
  }, [guestName, guestPhone, formData.guestList, setValue]);

  const handleEditGuest = useCallback(
    (id, updatedGuest) => {
      const result = EventsService.editListItem(
        id,
        updatedGuest,
        formData.guestList,
        "guest"
      );
      if (result.success) {
        setValue("guestList", result.list, { shouldValidate: true });
        return { success: true };
      }
      return { success: false, errors: result.errors };
    },
    [formData.guestList, setValue]
  );

  const handleRemoveGuest = useCallback(
    (id) => {
      Alert.alert("حذف ضيف", "هل أنت متأكد من حذف هذا الضيف؟", [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: () => {
            const updatedList = EventsService.removeListItem(
              id,
              formData.guestList
            );
            setValue("guestList", updatedList, { shouldValidate: true });
          },
        },
      ]);
    },
    [formData.guestList, setValue]
  );

  // ============================================================================
  // MODERATOR HANDLERS
  // ============================================================================

  const handleAddModerator = useCallback(() => {
    const moderator = {
      name: moderatorName,
      phone: moderatorPhone,
    };

    const result = EventsService.addListItem(
      moderator,
      formData.moderatorsList || [],
      "moderator"
    );

    if (result.success) {
      setValue("moderatorsList", result.list, { shouldValidate: true });
      setModeratorName("");
      setModeratorPhone("");
      setModeratorErrors({});
    } else {
      setModeratorErrors(result.errors);
    }
  }, [moderatorName, moderatorPhone, formData.moderatorsList, setValue]);

  const handleEditModerator = useCallback(
    (id, updatedModerator) => {
      const result = EventsService.editListItem(
        id,
        updatedModerator,
        formData.moderatorsList || [],
        "moderator"
      );
      if (result.success) {
        setValue("moderatorsList", result.list, { shouldValidate: true });
        return { success: true };
      }
      return { success: false, errors: result.errors };
    },
    [formData.moderatorsList, setValue]
  );

  const handleRemoveModerator = useCallback(
    (id) => {
      Alert.alert("حذف مشرف", "هل أنت متأكد من حذف هذا المشرف؟", [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: () => {
            const updatedList = EventsService.removeListItem(
              id,
              formData.moderatorsList || []
            );
            setValue("moderatorsList", updatedList, { shouldValidate: true });
          },
        },
      ]);
    },
    [formData.moderatorsList, setValue]
  );

  const currentList = activeTab === "guests" ? guestList : moderatorsList;
  const currentCount = currentList?.length || 0;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "guests" && styles.tabActive]}
          onPress={() => setActiveTab("guests")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "guests" && styles.tabTextActive,
            ]}
          >
            الضيوف
          </Text>
          {guestList.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{guestList.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "moderators" && styles.tabActive]}
          onPress={() => setActiveTab("moderators")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "moderators" && styles.tabTextActive,
            ]}
          >
            المشرفين
          </Text>
          {moderatorsList.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{moderatorsList.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Add Form */}
      {activeTab === "guests" ? (
        <View style={styles.form}>
          <TextInput
            label="اسم الضيف"
            placeholder="أدخل اسم الضيف"
            value={guestName}
            onChangeText={setGuestName}
            error={guestErrors.name}
          />
          <TextInput
            label="رقم الجوال"
            placeholder="5xxxxxxxx"
            value={guestPhone}
            onChangeText={setGuestPhone}
            keyboardType="phone-pad"
            error={guestErrors.phone}
          />
          <Button
            text="إضافة ضيف"
            onPress={handleAddGuest}
            disabled={!guestName.trim() || !guestPhone.trim()}
          />
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            label="اسم المشرف"
            placeholder="أدخل اسم المشرف"
            value={moderatorName}
            onChangeText={setModeratorName}
            error={moderatorErrors.name}
          />
          <TextInput
            label="رقم الجوال"
            placeholder="5xxxxxxxx"
            value={moderatorPhone}
            onChangeText={setModeratorPhone}
            keyboardType="phone-pad"
            error={moderatorErrors.phone}
          />
          <Button
            text="إضافة مشرف"
            onPress={handleAddModerator}
            disabled={!moderatorName.trim() || !moderatorPhone.trim()}
          />
        </View>
      )}

      {/* View List Button */}
      {currentCount > 0 && (
        <TouchableOpacity
          style={styles.viewListButton}
          onPress={() => {
            if (activeTab === "guests") {
              setShowGuestModal(true);
            } else {
              setShowModeratorModal(true);
            }
          }}
          activeOpacity={0.7}
        >
          <ListIcon />
          <Text style={styles.viewListButtonText}>
            عرض القائمة ({currentCount})
          </Text>
        </TouchableOpacity>
      )}

      {/* Guest List Modal */}
      <ListOfGuestsORModerators
        visible={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="قائمة الضيوف"
        list={guestList}
        type="guest"
        onEdit={handleEditGuest}
        onRemove={handleRemoveGuest}
      />

      {/* Moderator List Modal */}
      <ListOfGuestsORModerators
        visible={showModeratorModal}
        onClose={() => setShowModeratorModal(false)}
        title="قائمة المشرفين"
        list={moderatorsList}
        type="moderator"
        onEdit={handleEditModerator}
        onRemove={handleRemoveModerator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  tabActive: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontFamily: "Cairo_600SemiBold",
    color: "#656565",
  },
  tabTextActive: {
    color: "#C28E5C",
  },
  badge: {
    backgroundColor: "#C28E5C",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Cairo_700Bold",
    color: "#FFF",
  },
  form: {
    marginBottom: 24,
  },
  viewListButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#C28E5C",
    gap: 8,
  },
  viewListButtonText: {
    fontSize: 16,
    fontFamily: "Cairo_600SemiBold",
    color: "#C28E5C",
  },
});

export default StepTwo;
