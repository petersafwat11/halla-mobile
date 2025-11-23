import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventList from "../components/events/EventList";
import EventDetails from "../components/events/EventDetails";
import SingleEventStats from "../components/events/SingleEventStats";
import { TopBar } from "../components/plans";
import { getEventStats, getSingleEventStats } from "../services/eventsService2";
import { useAuthStore } from "../stores/authStore";

const EventsScreen = () => {
  const { token } = useAuthStore();
  const [currentView, setCurrentView] = useState("list"); // list, details, stats
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend data state
  const [eventsData, setEventsData] = useState({
    liveEvents: 0,
    endedEvents: 0,
    attendanceRate: 0,
    events: [],
  });
  const [eventDetails, setEventDetails] = useState(null);
  const [eventStats, setEventStats] = useState(null);

  // Fetch events data on mount
  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEventStats(token);
      setEventsData(data);
    } catch (err) {
      console.error("Error fetching events data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = async (event) => {
    try {
      // EventDetails uses data from getEventStats (already loaded)
      // No need to fetch again, just set the selected event
      setSelectedEvent(event);
      setCurrentView("details");
    } catch (err) {
      console.error("Error handling event press:", err);
      setError(err.message);
    }
  };

  const handleStatsPress = async () => {
    try {
      setLoading(true);
      // Fetch single event detailed stats using getSingleEventStats
      const stats = await getSingleEventStats(selectedEvent._id, token);
      setEventStats(stats);
      setCurrentView("stats");
    } catch (err) {
      console.error("Error fetching event stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedEvent(null);
  };

  const handleBackToDetails = () => {
    setCurrentView("details");
  };

  const handleBack = () => {
    if (currentView === "stats") {
      setCurrentView("details");
    } else if (currentView === "details") {
      setCurrentView("list");
      setSelectedEvent(null);
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case "list":
        return "المناسبات";
      case "details":
        return "تفاصيل المناسبة";
      case "stats":
        return "تفاصيل المناسبة";
      default:
        return "المناسبات";
    }
  };

  const renderContent = () => {
    if (loading && currentView === "list") {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C28E5C" />
        </View>
      );
    }

    if (error && currentView === "list") {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>خطأ في تحميل البيانات</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      );
    }

    switch (currentView) {
      case "list":
        return (
          <EventList
            events={eventsData.events}
            onEventPress={handleEventPress}
            liveEventsCount={eventsData.liveEvents}
            endedEventsCount={eventsData.endedEvents}
            attendanceRate={eventsData.attendanceRate}
          />
        );
      case "details":
        return (
          <EventDetails
            event={selectedEvent}
            onStatsPress={handleStatsPress}
            onBack={handleBackToList}
          />
        );
      case "stats":
        return (
          <SingleEventStats
            event={selectedEvent}
            stats={eventStats}
            onBack={handleBackToDetails}
            onRefresh={handleStatsPress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <TopBar title={getTitle()} showBack={true} onBack={handleBack} />
      <View style={styles.container}>{renderContent()}</View>
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
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#C28E5C",
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#656565",
    textAlign: "center",
  },
});

export default EventsScreen;
