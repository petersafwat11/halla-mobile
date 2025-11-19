import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { useLanguage } from "../../localization";
import VendorCard from "./VendorCard";

const VendorCards = ({ vendors, onVendorCallPress, loading, refreshing, onRefresh }) => {
  const { isRTL } = useLanguage();

  const renderItem = ({ item, index }) => (
    <VendorCard
      vendor={item}
      onCallPress={onVendorCallPress}
      index={index}
    />
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#C28E5C" />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, isRTL && styles.emptyTextRTL]}>
          لا توجد نتائج
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={vendors}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmpty}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 24,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: "Cairo_400Regular",
    fontSize: 16,
    color: "#656565",
  },
  emptyTextRTL: {
    textAlign: "right",
  },
});

export default VendorCards;
