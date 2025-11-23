import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const SearchAndFilter = ({ onSearch, onFilterPress, searchQuery }) => {
  const { isRTL } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleFilterPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onFilterPress && onFilterPress();
  };

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {/* Search Input */}
      <View style={[styles.searchContainer, isFocused && styles.searchFocused]}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#2C2C2C"
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, isRTL && styles.searchInputRTL]}
          placeholder="ابحث عن أي شيء..."
          placeholderTextColor="#656565"
          value={searchQuery}
          onChangeText={onSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {/* Filter Button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, isRTL && styles.filterTextRTL]}>
            تصفية
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  containerRTL: {
    flexDirection: "row-reverse",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48,
  },
  searchFocused: {
    borderColor: "#C28E5C",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Cairo_400Regular",
    fontSize: 16,
    color: "#2C2C2C",
  },
  searchInputRTL: {
    textAlign: "right",
  },
  filterButton: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  filterText: {
    fontFamily: "Cairo_400Regular",
    fontSize: 14,
    color: "#656565",
  },
  filterTextRTL: {
    textAlign: "right",
  },
});

export default SearchAndFilter;
