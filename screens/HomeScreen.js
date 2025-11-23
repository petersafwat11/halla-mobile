import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../localization";
import { Svg, Path, Ellipse } from "react-native-svg";
import {
  LastEvent,
  StatsCards,
  EventTemplates,
  MakeYourFirst,
  DropdownModal,
} from "../components/home";
import { TopBar } from "../components/plans";
import { getUserEventsWithStats } from "../services/eventsService2";
import { useAuthStore } from "../stores/authStore";

const HomeScreen = ({ navigation }) => {
  const { isRTL } = useLanguage();
  const { token } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend data state
  const [statsData, setStatsData] = useState({
    endedEvents: { number: 0, guestRespondRate: 0 },
    liveEvents: { number: 0, guestRespondRate: 0 },
    allEvents: { number: 0, guestRespondRate: 0 },
    lastEvent: null,
  });

  // Fetch data from backend on mount
  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserEventsWithStats(token);
      setStatsData(data);
    } catch (err) {
      console.error("Error fetching home data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManagePress = () => {
    setModalVisible(true);
  };

  const handleStepSelect = (stepId) => {
    console.log("Selected step:", stepId);
  };

  const handleCreateEvent = () => {
    // Navigate to CreateEventScreen
    if (navigation) {
      navigation.navigate("CreateEvent");
    }
  };

  // Check if user has events
  const hasEvents = statsData.lastEvent !== null;

  const topBarActions = (
    <View style={styles.topBarActions}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="notifications-outline" size={20} color="#F9F4EF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="chatbubbles-outline" size={20} color="#F9F4EF" />
      </TouchableOpacity>
    </View>
  );

  const greetingContent = (
    <View
      style={[styles.greetingContainer, isRTL && styles.greetingContainerRTL]}
    >
      <Text style={styles.greetingText}>مرحبا</Text>
      <Text style={styles.organizationName}>مؤسسة الحمد</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <TopBar
          // title="الرئيسية"
          rightContent={topBarActions}
          leftContent={greetingContent}
        />

        {/* Header with gradient background */}
        <View style={styles.header}>
          {/* Texture elements */}
          <View style={styles.textureLeft}>
            <View style={styles.textureLine1} />
            <View style={styles.textureLine2} />
          </View>
          <View style={styles.textureRight}>
            <View style={styles.textureLine1} />
            <View style={styles.textureLine2} />
          </View>

          {/* Last Event or Empty State */}
          <View style={styles.headerContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F9F4EF" />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>خطأ في تحميل البيانات</Text>
                <TouchableOpacity
                  onPress={fetchHomeData}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryText}>إعادة المحاولة</Text>
                </TouchableOpacity>
              </View>
            ) : hasEvents ? (
              <LastEvent
                event={statsData.lastEvent}
                onManagePress={handleManagePress}
              />
            ) : (
              <MakeYourFirst onCreatePress={handleCreateEvent} />
            )}
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Stats Cards */}
          {!loading && hasEvents && (
            <View style={styles.statsSection}>
              <StatsCards
                totalEvents={statsData.allEvents.number}
                activeEvents={statsData.liveEvents.number}
                endedEvents={statsData.endedEvents.number}
              />
            </View>
          )}

          {/* Event Templates */}
          <View style={styles.templatesSection}>
            <EventTemplates />
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Dropdown Modal */}
        <DropdownModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onStepSelect={handleStepSelect}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#C28E5C",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F4EF",
  },
  header: {
    backgroundColor: "#C28E5C",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    position: "relative",
    overflow: "hidden",
  },
  textureLeft: {
    position: "absolute",
    left: -190,
    top: -86,
    width: 460,
    height: 436,
    opacity: 0.8,
  },
  textureRight: {
    position: "absolute",
    right: -300,
    top: -86,
    width: 460,
    height: 436,
    opacity: 0.8,
  },
  textureLine1: {
    width: 470,
    height: 50,
    transform: [{ rotate: "129.229deg" }],
    opacity: 0.8,
    background:
      "radial-gradient(8420.27% 85.09% at 8.82% 45.53%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.00) 100%)",
    position: "absolute",
    top: 34,
  },
  textureLine2: {
    width: 495,
    height: 50,
    transform: [{ rotate: "129.229deg" }],
    opacity: 0.8,
    background:
      "radial-gradient(8420.27% 85.09% at 8.82% 45.53%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.00) 100%)",
    position: "absolute",
    left: 116,
    top: 0,
  },
  greetingWrapper: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 4,
  },
  logoContainerRTL: {
    flexDirection: "row-reverse",
  },
  greetingContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  greetingContainerRTL: {},
  greetingText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#FFF",
    lineHeight: 16,
    textAlign: "right",
  },
  organizationName: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#FFF",
    lineHeight: 24,
    letterSpacing: 0.08,
    textAlign: "right",
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  statsSection: {
    marginBottom: 16,
  },
  templatesSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 100,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F4EF",
    borderRadius: 12,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#C28E5C",
    textAlign: "center",
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#C28E5C",
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
  },
});

export default HomeScreen;
