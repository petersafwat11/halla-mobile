import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import EventListItem from "./EventListItem";
const EventList = ({ events, onEventPress, ListItemComponent = EventListItem }) => {
  const renderItem = ({ item, index }) => (
    <ListItemComponent
      event={item}
      onPress={() => onEventPress(item)}
      index={index}
    />
  );

  if (!events || events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          لا توجد مناسبات حالياً
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={(item, index) =>
        item._id || item.id || index.toString()
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 24
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Cairo_500Medium",
    color: "#656565"
  },});

export default EventList;
