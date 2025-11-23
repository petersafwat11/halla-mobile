import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../commen/Button";

const DropdownSelector = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>
        {label}
      </Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Ionicons name="chevron-down" size={20} color="#292D32" />
        <Text style={styles.dropdownValue}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
};

const FeatureCard = ({
  feature,
  isEnabled,
  onToggle,
  quantity,
  onQuantityChange,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handleToggle = (value) => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })]).start();
    onToggle(value);
  };

  return (
    <Animated.View
      style={[styles.featureCard, { transform: [{ scale: scaleValue }] }]}
    >
      <View style={styles.featureHeader}>
        <View style={styles.featureInfo}>
          <View
            style={styles.featureTitleRow}
          >
            <Text style={styles.featureTitle}>
              {feature.name}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{feature.price}</Text>
            <Text style={styles.priceLabel}>﷼</Text>
          </View>
        </View>

        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: "#E5E7EA", true: "#d4a574" }}
          thumbColor="#FFF"
          ios_backgroundColor="#E5E7EA"
        />
      </View>
      <Text style={styles.featureDescription}>
        {feature.description}
      </Text>
    </Animated.View>
  );
};

const SimpleFeatureCard = ({
  feature,
  isEnabled,
  onToggle,
  quantity,
  onQuantityChange,
}) => {
  return (
    <View style={styles.simpleFeatureCard}>
      <View
        style={[
          styles.simpleFeatureHeader]}
      >
        <View
          style={[
            styles.simpleFeatureInfo]}
        >
          <Text style={styles.simpleFeatureTitle}>
            {feature.name}
          </Text>
          <View
            style={styles.simplePriceRow}
          >
            <Text style={styles.simplePrice}>{feature.price}</Text>
            <Text style={styles.simplePriceUnit}>{feature.unit}</Text>
            <Text style={styles.simpleQuantity}>{feature.quantity}</Text>
          </View>
        </View>
        {feature.hasQuantity && (
          <DropdownSelector
            value={quantity || "20"}
            onChange={onQuantityChange}
            options={["10", "20", "30", "50"]}
            label={feature.quantityLabel || "الضيوف"}
          />
        )}
      </View>
      <Text style={styles.simpleFeatureDescription}>
        {feature.description}
      </Text>
    </View>
  );
};

const AddionalFeatures = ({ selectedPlan, onConfirm, onBack }) => {
  const [enabledFeatures, setEnabledFeatures] = useState({});
  const [quantities, setQuantities] = useState({});

  const toggleFeature = (featureId) => {
    setEnabledFeatures((prev) => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  const updateQuantity = (featureId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [featureId]: value
    }));
  };

  const simpleFeatures = [
    {
      id: "reminder",
      name: "رسائل تذكير إضافية",
      price: "25/",
      unit: "تذكير",
      quantity: "1",
      description: "إرسال تذكير تلقائي قبل الموعد بـأيام من الحدث.",
      hasQuantity: true,
      quantityLabel: "الضيوف"
    },
    {
      id: "guests",
      name: "زيادة عدد الضيوف",
      price: "75/",
      unit: "ضيف",
      quantity: "250",
      description: "رفع الحد الأعلى للمدعوين حسب الحاجة",
      hasQuantity: true,
      quantityLabel: "الضيوف"
    },
    {
      id: "messages",
      name: "باقات الرسائل الإضافية",
      price: "50/",
      unit: "رساله",
      quantity: "100",
      description: "شراء حزم رسائل WhatsApp/SMS للإرسال الجماعي",
      hasQuantity: true,
      quantityLabel: "الرسائل"
    }];

  const toggleFeatures = [
    {
      id: "custom_report",
      name: "تقرير مخصص",
      price: "1 مناسبة/ 75",
      description: "تقرير تفصيلي حسب الحضور، التفاعل، التحليلات"
    },
    {
      id: "multi_qr",
      name: "QR متعدد النقاط (Multi-Entry)",
      price: "1 مناسبة/ 75",
      description: "تفعيل الدخول عبر عدة بوابات بنفس الـ QR"
    },
    {
      id: "custom_design",
      name: "تصميم دعوة مخصصة",
      price: "1 مناسبة/ 250",
      description: "إعداد دعوة جديدة كليًا حسب رغبة العميل"
    },
    {
      id: "direct_support",
      name: "دعم فني مباشر",
      price: "1 مناسبة/ 100",
      description: "أولوية الدعم عبر الهاتف أو واتساب أثناء الحدث"
    },
    {
      id: "advanced_protection",
      name: "حماية متقدمة للدعوة",
      price: "1 مرة واحدة/ 300",
      description: "إضافة كلمات مرور خاصة لبعض الضيوف"
    },
    {
      id: "custom_domain",
      name: "نطاق فرعي مخصص",
      price: "1 مرة واحدة/ 300",
      description: "إعداد نطاق مثل: invite.yourbrand.com"
    }];

  const handleConfirm = () => {
    const selectedFeatures = Object.keys(enabledFeatures)
      .filter((key) => enabledFeatures[key])
      .map((key) => {
        const feature = [...simpleFeatures, ...toggleFeatures].find(
          (f) => f.id === key
        );
        return {
          ...feature,
          quantity: quantities[key] || feature.quantity
        };
      });

    onConfirm(selectedFeatures);
  };

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
            عزز تجربتك بإضافات مميزة
          </Text>
          <Text style={styles.headerSubtitle}>
            اجعل مناسباتك أكثر تميزًا!
          </Text>
        </View>
      </View>

      {simpleFeatures.map((feature) => (
        <SimpleFeatureCard
          key={feature.id}
          feature={feature}
          isEnabled={enabledFeatures[feature.id]}
          onToggle={() => toggleFeature(feature.id)}
          quantity={quantities[feature.id]}
          onQuantityChange={(value) => updateQuantity(feature.id, value)}
        />
      ))}

      {toggleFeatures.map((feature) => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          isEnabled={enabledFeatures[feature.id]}
          onToggle={() => toggleFeature(feature.id)}
        />
      ))}

      <View style={styles.buttonContainer}>
        <Button
          text="الذهاب لتأكيد المعاملة"
          onPress={handleConfirm}
          size="large"
        />
      </View>
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
    height: 44
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
  simpleFeatureCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  simpleFeatureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    width: "100%"
  },  dropdownContainer: {
    gap: 4,
    alignItems: "flex-start"
  },
  dropdownLabel: {
    fontFamily: "Cairo_700Bold",
    fontSize: 12,
    color: "#656565"
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "#FFF",
    gap: 8,
    minWidth: 84
  },  dropdownValue: {
    fontFamily: "Cairo_400Regular",
    fontSize: 14,
    color: "#020817"
  },
  simpleFeatureInfo: {
    alignItems: "flex-start"
  },  simpleFeatureTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#020817",
    marginBottom: 4
  },
  simplePriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },  simplePrice: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#8A6541"
  },
  simplePriceUnit: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#8A6541"
  },
  simpleQuantity: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#8A6541"
  },
  simpleFeatureDescription: {
    fontFamily: "Cairo_400Regular",
    fontSize: 16,
    color: "#656565",
    lineHeight: 24
  },
  featureCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    width: "100%"
  },  featureInfo: {
    alignItems: "flex-start"
  },  featureTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4
  },  featureTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#020817"
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },  priceText: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#8A6541"
  },
  priceLabel: {
    fontFamily: "Cairo_700Bold",
    fontSize: 16,
    color: "#8A6541"
  },
  featureDescription: {
    fontFamily: "Cairo_400Regular",
    fontSize: 16,
    color: "#656565",
    lineHeight: 24
  },
  buttonContainer: {
    marginTop: 24
  },});

export default AddionalFeatures;
