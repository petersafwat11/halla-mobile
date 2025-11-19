import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../localization";

const StatsCards = ({ stats }) => {
  const { isRTL } = useLanguage();

  const cards = [
    {
      label: "حضور",
      value: stats?.accepted || 89,
      icon: "checkmark-circle-outline",
      bgColor: "#EAF4EF",
      textColor: "#2A8C5B",
    },
    {
      label: "إعتذر",
      value: stats?.declined || 12,
      icon: "close-circle-outline",
      bgColor: "#F9EBEA",
      textColor: "#C0392B",
    },
    {
      label: "ربما",
      value: stats?.maybe || 23,
      icon: "help-circle-outline",
      bgColor: "#FEFCE8",
      textColor: "#CA8A04",
    },
    {
      label: "في الانتظار",
      value: stats?.pending || 26,
      icon: "time-outline",
      bgColor: "#F9FAFB",
      textColor: "#4B5563",
    },
  ];

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {cards.map((card, index) => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: card.bgColor }]}
        >
          <View style={[styles.cardContent, isRTL && styles.cardContentRTL]}>
            <Ionicons name={card.icon} size={12} color={card.textColor} />
            <Text
              style={[
                styles.label,
                { color: card.textColor },
                isRTL && styles.labelRTL,
              ]}
            >
              {card.label}
            </Text>
          </View>
          <Text
            style={[
              styles.value,
              { color: card.textColor },
              isRTL && styles.valueRTL,
            ]}
          >
            {card.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
  },
  containerRTL: {
    flexDirection: "row-reverse",
  },
  card: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    gap: 5,
    alignItems: "center",
  },
  cardContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  cardContentRTL: {},
  label: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    lineHeight: 16,
  },
  labelRTL: {
    textAlign: "center",
  },
  value: {
    fontSize: 20,
    fontFamily: "Cairo_700Bold",
    lineHeight: 28,
  },
  valueRTL: {
    textAlign: "center",
  },
});

export default StatsCards;
