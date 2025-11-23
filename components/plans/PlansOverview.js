import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../commen/Button";

const { width } = Dimensions.get("window");

const PlanCard = ({ plan, onSelect }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true
    }).start();
  };

  const getBorderColor = () => {
    switch (plan.tier) {
      case "lite":
        return "#CEA57D";
      case "pro":
        return "#C28E5C";
      case "elite":
        return "#513C27";
      default:
        return "#CEA57D";
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        { 
          borderBottomColor: getBorderColor(),
          transform: [{ scale: scaleValue }]
        }]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            {plan.tier === "lite" && (
              <Ionicons name="flash-outline" size={20} color="#D6B392" />
            )}
            {plan.tier === "pro" && (
              <Ionicons name="star-outline" size={20} color="#B18154" />
            )}
            {plan.tier === "elite" && (
              <Ionicons name="diamond-outline" size={20} color="#6B4E33" />
            )}
          </View>
          <Text style={styles.planTitle}>
            {plan.name}
          </Text>
        </View>
        <Text style={styles.planDescription}>
          {plan.description}
        </Text>
        
        {plan.guestSelector && (
          <View style={styles.guestSelector}>
            <View style={styles.dropdown}>
              <Ionicons name="chevron-down" size={16} color="#767676" />
              <Text style={styles.dropdownText}>25 ضيف</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceUnit}>/شهر</Text>
        <View style={styles.priceRow}>
          <Text style={styles.currencyIcon}>﷼</Text>
          <Text style={styles.price}>{plan.price}</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View
            key={index}
            style={styles.featureRow}
          >
            <View style={styles.checkmark}>
              <Ionicons name="checkmark" size={16} color="#C28E5C" />
            </View>
            <Text style={styles.featureText}>
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <Button
        text="اختيار"
        onPress={() => onSelect(plan)}
        variant="secondary"
        size="medium"
        style={styles.selectButton}
        textStyle={styles.selectButtonText}
      />
    </Animated.View>
  );
};

const PlansOverview = ({ onSelectPlan }) => {
  const plans = [
    {
      id: "lite",
      tier: "lite",
      name: "منصتك لايت",
      description: "إدارة الفعالية من قبل العميل",
      price: "225",
      guestSelector: true,
      features: [
        "ما يصل إلى 5 مناسبات",
        "ما يصل إلى 25 ضيف",
        "القوالب الأساسية",
        "إشعارات البريد الإلكتروني",
        "الدعم القياسي"]
    },
    {
      id: "pro",
      tier: "pro",
      name: "منصتك برو",
      description: "إدارة الفعاليات عن طريق منصة هلا",
      price: "225",
      guestSelector: true,
      features: [
        "ما يصل إلى 20 مناسبة",
        "ما يصل إلى 200 ضيف",
        "قوالب متميزة",
        "الرسائل القصيرة + إشعارات البريد الإلكتروني",
        "العلامة التجارية المخصصة",
        "الدعم ذو الأولوية",
        "التحليلات المتقدمة"]
    },
    {
      id: "elite",
      tier: "elite",
      name: "منصتك إيليت",
      description: "إدارة المنصة عبر حساب الأعمال بواجهة مخصصة",
      price: "225",
      guestSelector: false,
      features: [
        "أحداث غير محدودة",
        "عدد غير محدود من الضيوف",
        "نظام تصميم مخصص",
        "مدير حساب مخصص",
        "الوصول إلى واجهة برمجة التطبيقات",
        "حل العلامة البيضاء",
        "دعم متميز 24/7",
        "عمليات التكامل المخصصة"]
    }];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.stepIndicator}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepText}>1/2</Text>
          </View>
        </View>
        <View>
          <Text style={styles.headerTitle}>
            اختر باقتك الجديدة
          </Text>
          <Text style={styles.headerSubtitle}>
            اختر الباقة التي تناسب احتياجاتك
          </Text>
        </View>
      </View>

      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onSelect={onSelectPlan}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F4EF"
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },stepIndicator: {
    width: 44,
    height: 44,
    position: "relative"
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: "#C28E5C",
    backgroundColor: "#F9F4EF",
    justifyContent: "center",
    alignItems: "center"
  },
  stepText: {
    fontFamily: "Cairo_700Bold",
    fontSize: 14,
    color: "#C28E5C"
  },
  headerTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#2C2C2C",
    marginBottom: 4
  },
  headerSubtitle: {
    fontFamily: "Cairo_400Regular",
    fontSize: 16,
    color: "#656565"
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 28,
    paddingBottom: 16,
    marginBottom: 24,
    borderBottomWidth: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  cardHeader: {
    marginBottom: 12
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16
  },  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center"
  },
  planTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#2C2C2C"
  },
  planDescription: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
    color: "#656565",
    marginBottom: 16
  },
  guestSelector: {
    alignItems: "flex-start"
  },  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "#FFF",
    gap: 8,
    minWidth: 100
  },
  dropdownText: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
    color: "#2C2C2C"
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    marginBottom: 12,
    paddingHorizontal: 4
  },  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  price: {
    fontFamily: "Cairo_700Bold",
    fontSize: 18,
    color: "#2C2C2C"
  },
  currencyIcon: {
    fontSize: 16,
    color: "#2C2C2C"
  },
  priceUnit: {
    fontFamily: "Cairo_500Medium",
    fontSize: 12,
    color: "#656565",
    paddingBottom: 6
  },
  featuresContainer: {
    paddingHorizontal: 4,
    gap: 8,
    marginBottom: 16
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12
  },  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F5ECE4",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2
  },
  featureText: {
    flex: 1,
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
    color: "#2C2C2C",
    lineHeight: 16
  },
  selectButton: {
    backgroundColor: "#F5ECE4",
    marginTop: 8
  },
  selectButtonText: {
    color: "#6B4E33",
    fontFamily: "Cairo_600SemiBold"
  },});

export default PlansOverview;
