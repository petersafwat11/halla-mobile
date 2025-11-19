import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import EventList from "../components/events/EventList";
import EventDetails from "../components/events/EventDetails";
import SingleEventStats from "../components/events/SingleEventStats";

const EventsScreen = () => {
  const [currentView, setCurrentView] = useState("list"); // list, details, stats
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock events data - replace with actual data from API
  const mockEvents = [
    {
      id: "1",
      title: "حفل زفاف أحمد وفاطمة",
      status: "active",
      guestCount: 150,
      dateTime: "السبت، 12 /5/2022 - 7:00 مساءً",
      image: null,
      noResponse: 15,
      declined: 15,
      accepted: 120,
      description:
        "يسر عائلة الحاج ابراهيم كمال عبد الحليم  دعوتكم لحضور حفل الزفاف نجله فى قاعه الامير",
      location: "قاعة الامير",
      moderatorsCount: 2,
      stats: {
        accepted: 89,
        declined: 12,
        maybe: 23,
        pending: 26,
      },
    },
    {
      id: "2",
      title: "حفل زفاف أحمد وفاطمة",
      status: "ended",
      guestCount: 150,
      dateTime: "السبت، 12 /5/2022 - 7:00 مساءً",
      image: null,
      noResponse: 15,
      declined: 15,
      accepted: 120,
      description:
        "يسر عائلة الحاج ابراهيم كمال عبد الحليم  دعوتكم لحضور حفل الزفاف نجله فى قاعه الامير",
      location: "قاعة الامير",
      moderatorsCount: 2,
      stats: {
        accepted: 89,
        declined: 12,
        maybe: 23,
        pending: 26,
      },
    },
    {
      id: "3",
      title: "حفل زفاف أحمد وفاطمة",
      status: "ended",
      guestCount: 150,
      dateTime: "السبت، 12 /5/2022 - 7:00 مساءً",
      image: null,
      noResponse: 15,
      declined: 15,
      accepted: 120,
      description:
        "يسر عائلة الحاج ابراهيم كمال عبد الحليم  دعوتكم لحضور حفل الزفاف نجله فى قاعه الامير",
      location: "قاعة الامير",
      moderatorsCount: 2,
      stats: {
        accepted: 89,
        declined: 12,
        maybe: 23,
        pending: 26,
      },
    },
  ];

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setCurrentView("details");
  };

  const handleStatsPress = () => {
    setCurrentView("stats");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedEvent(null);
  };

  const handleBackToDetails = () => {
    setCurrentView("details");
  };

  const renderContent = () => {
    switch (currentView) {
      case "list":
        return (
          <EventList events={mockEvents} onEventPress={handleEventPress} />
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
            onBack={handleBackToDetails}
          />
        );
      default:
        return (
          <EventList events={mockEvents} onEventPress={handleEventPress} />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F4EF",
  },
  content: {
    flex: 1,
  },
});

export default EventsScreen;
