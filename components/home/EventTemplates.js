import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import { useLanguage } from "../../localization";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = 123;
const CARD_SPACING = 12;

const EventTemplates = () => {
  const { isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("حفلات زفاف");
  const [scrollX] = useState(new Animated.Value(0));

  const categories = [
    "حفلات زفاف",
    "تخرج",
    "عيد ميلاد",
    "عقيقة",
    "مناقشة",
    "مناقشة",
    "مناقشة",
    "مناقشة",
  ];

  const templates = [
    {
      id: 1,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/25805b85ee9b7ab1a9bb9121e0ef8891b372b99b",
      category: "حفلات زفاف",
    },
    {
      id: 2,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/25805b85ee9b7ab1a9bb9121e0ef8891b372b99b",
      category: "حفلات زفاف",
    },
    {
      id: 3,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/25805b85ee9b7ab1a9bb9121e0ef8891b372b99b",
      category: "حفلات زفاف",
    },
    {
      id: 4,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f",
      category: "حفلات زفاف",
    },
    {
      id: 5,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f",
      category: "حفلات زفاف",
    },
    {
      id: 6,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/21c12591e92a8912acee9ab4558a81235964edeb",
      category: "حفلات زفاف",
    },
    {
      id: 7,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/6ceaeb628580de5c15c1b07c033f47c8dea87ee5",
      category: "حفلات زفاف",
    },
    {
      id: 8,
      image: "https://api.builder.io/api/v1/image/assets/TEMP/7981a8d15b57a32a9ae9da2da29600eb74edd874",
      category: "حفلات زفاف",
    },
  ];

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <Text style={[styles.title, isRTL && styles.titleRTL]}>
          قوالب المناسبات
        </Text>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={[
          styles.categoriesContent,
          isRTL && styles.categoriesContentRTL,
        ]}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => handleCategoryPress(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Templates */}
      <View style={styles.templatesContainer}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={[
            styles.templatesContent,
            isRTL && styles.templatesContentRTL,
          ]}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {templates.map((template, index) => {
            const inputRange = [
              (index - 1) * (CARD_WIDTH + CARD_SPACING),
              index * (CARD_WIDTH + CARD_SPACING),
              (index + 1) * (CARD_WIDTH + CARD_SPACING),
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.9, 1, 0.9],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.7, 1, 0.7],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={template.id}
                style={[
                  styles.templateCard,
                  {
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              >
                <View style={styles.cardBackground}>
                  <Image
                    source={{ uri: template.image }}
                    style={styles.templateImage}
                    resizeMode="cover"
                  />
                </View>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>

        {/* Page Indicators */}
        {/* <View style={styles.indicatorsContainer}>
          {templates.slice(0, 5).map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === 2 && styles.indicatorActive,
              ]}
            />
          ))}
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 16,
    borderRadius: 12,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    alignSelf: "stretch",
  },
  headerRTL: {},
  title: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    lineHeight: 24,
    letterSpacing: 0.08,
    textAlign: "right",
  },
  titleRTL: {
    textAlign: "right",
  },
  categoriesContainer: {
    width: "100%",
  },
  categoriesContent: {
    paddingRight: 0,
    gap: 8,
    flexDirection: "row-reverse",
  },
  categoriesContentRTL: {
    flexDirection: "row-reverse",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
  },
  categoryButtonActive: {
    backgroundColor: "#C28E5C",
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Cairo_500Medium",
    color: "#656565",
    lineHeight: 20,
    letterSpacing: 0.014,
  },
  categoryTextActive: {
    color: "#FFF",
  },
  templatesContainer: {
    width: "100%",
    alignItems: "center",
  },
  templatesContent: {
    paddingHorizontal: 0,
    gap: CARD_SPACING,
  },
  templatesContentRTL: {},
  templateCard: {
    width: CARD_WIDTH,
    height: 150,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.625 },
    shadowOpacity: 0.1,
    shadowRadius: 1.875,
    elevation: 3,
  },
  cardBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 3.738,
    backgroundColor: "#FFFAEA",
    overflow: "hidden",
  },
  templateImage: {
    width: 103,
    height: 138,
    borderRadius: 6.417,
    position: "absolute",
    left: 10,
    top: 6,
  },
//   indicatorsContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//     marginTop: 8,
//   },
//   indicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "rgba(0, 0, 0, 0.1)",
//   },
//   indicatorActive: {
//     backgroundColor: "#C28E5C",
//   },
});

export default EventTemplates;
