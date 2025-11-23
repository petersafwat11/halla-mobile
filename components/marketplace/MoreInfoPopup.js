import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "../../localization";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MoreInfoPopup = ({ visible, vendor, onClose }) => {
  const { isRTL } = useLanguage();
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!vendor) {
    return null;
  }

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (url) => {
    Linking.openURL(url);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Image */}
            <View style={styles.header}>
              <Image
                source={{
                  uri:
                    vendor.image ||
                    "https://api.builder.io/api/v1/image/assets/TEMP/fcdfb1891ef72b7b32774a9d251821471803e423",
                }}
                style={styles.headerImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={[
                  "rgba(0, 0, 0, 0.60)",
                  "rgba(0, 0, 0, 0.40)",
                  "rgba(0, 0, 0, 0.70)",
                ]}
                style={styles.gradient}
              />

              <View style={styles.headerContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>

                <Text
                  style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}
                >
                  {vendor.name}
                </Text>
              </View>
            </View>

            {/* Content Sections */}
            <View style={styles.content}>
              {/* Service Duration */}
              <View style={styles.infoCard}>
                <View
                  style={[styles.infoHeader, isRTL && styles.infoHeaderRTL]}
                >
                  <View style={styles.iconBadge}>
                    <Ionicons name="time-outline" size={14} color="#2563EB" />
                  </View>
                  <Text
                    style={[styles.infoTitle, isRTL && styles.infoTitleRTL]}
                  >
                    مدة تنفيذ الخدمة
                  </Text>
                </View>
                <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>
                  {vendor.duration || "8-12 ساعة"}
                </Text>
              </View>

              {/* Price Range */}
              <View style={styles.infoCard}>
                <View
                  style={[styles.infoHeader, isRTL && styles.infoHeaderRTL]}
                >
                  <View style={[styles.iconBadge, styles.iconBadgeYellow]}>
                    <Ionicons name="cash-outline" size={14} color="#D97706" />
                  </View>
                  <Text
                    style={[styles.infoTitle, isRTL && styles.infoTitleRTL]}
                  >
                    نطاق السعر
                  </Text>
                </View>
                <Text style={[styles.infoValue, isRTL && styles.infoValueRTL]}>
                  {vendor.priceRange || "2,500 دولار - 8,000 دولار"}
                </Text>
              </View>

              {/* What's Included */}
              <View style={styles.includedCard}>
                <Text
                  style={[
                    styles.includedTitle,
                    isRTL && styles.includedTitleRTL,
                  ]}
                >
                  ما هو مدرج
                </Text>

                <View style={styles.includedList}>
                  {(
                    vendor.included || [
                      "جلسة تصوير الخطوبة",
                      "حقوق الطباعة متضمنة",
                      "خيارات التصوير الفوتوغرافي بالطائرات بدون طيار",
                      "ألبوم صور رقمي",
                      "تغطية ليوم كامل",
                    ]
                  ).map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.includedItem,
                        isRTL && styles.includedItemRTL,
                      ]}
                    >
                      <View style={styles.bullet} />
                      <Text
                        style={[
                          styles.includedText,
                          isRTL && styles.includedTextRTL,
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Vendor Info */}
              <View style={styles.vendorCard}>
                <View style={styles.vendorHeader}>
                  <View
                    style={[styles.vendorInfo, isRTL && styles.vendorInfoRTL]}
                  >
                    <View style={styles.vendorDetails}>
                      <Text
                        style={[
                          styles.vendorName,
                          isRTL && styles.vendorNameRTL,
                        ]}
                      >
                        {vendor.companyName || "التهامى للتصوير والموسيقى"}
                      </Text>

                      <View
                        style={[
                          styles.vendorStats,
                          isRTL && styles.vendorStatsRTL,
                        ]}
                      >
                        <View style={[styles.stat, isRTL && styles.statRTL]}>
                          <Text style={styles.statValue}>
                            ({vendor.reviewCount || "127"} شخص)
                          </Text>
                          <Text style={styles.statLabel}>
                            {vendor.rating || "4.9"}
                          </Text>
                          <Ionicons name="star" size={12} color="#262626" />
                        </View>

                        <View style={[styles.stat, isRTL && styles.statRTL]}>
                          <Text style={styles.statValue}>
                            {vendor.experience || "10"} سنوات
                          </Text>
                          <Ionicons
                            name="briefcase-outline"
                            size={12}
                            color="#737373"
                          />
                        </View>
                      </View>
                    </View>

                    {vendor.logo && (
                      <Image
                        source={{ uri: vendor.logo }}
                        style={styles.vendorLogo}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </View>

                {/* Contact Information */}
                <View style={styles.contactSection}>
                  <Text
                    style={[
                      styles.contactTitle,
                      isRTL && styles.contactTitleRTL,
                    ]}
                  >
                    معلومات الاتصال
                  </Text>

                  <View style={styles.contactList}>
                    {vendor.location && (
                      <TouchableOpacity
                        style={[
                          styles.contactItem,
                          isRTL && styles.contactItemRTL,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color="#737373"
                        />
                        <Text
                          style={[
                            styles.contactText,
                            isRTL && styles.contactTextRTL,
                          ]}
                        >
                          {vendor.location}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {vendor.website && (
                      <TouchableOpacity
                        style={[
                          styles.contactItem,
                          isRTL && styles.contactItemRTL,
                        ]}
                        onPress={() => handleWebsite(vendor.website)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="globe-outline"
                          size={16}
                          color="#737373"
                        />
                        <Text
                          style={[
                            styles.contactText,
                            isRTL && styles.contactTextRTL,
                          ]}
                        >
                          {vendor.website}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {vendor.email && (
                      <TouchableOpacity
                        style={[
                          styles.contactItem,
                          isRTL && styles.contactItemRTL,
                        ]}
                        onPress={() => handleEmail(vendor.email)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="mail-outline"
                          size={16}
                          color="#737373"
                        />
                        <Text
                          style={[
                            styles.contactText,
                            isRTL && styles.contactTextRTL,
                          ]}
                        >
                          {vendor.email}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {vendor.phone && (
                      <TouchableOpacity
                        style={[
                          styles.contactItem,
                          isRTL && styles.contactItemRTL,
                        ]}
                        onPress={() => handleCall(vendor.phone)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="call-outline"
                          size={16}
                          color="#737373"
                        />
                        <Text
                          style={[
                            styles.contactText,
                            isRTL && styles.contactTextRTL,
                          ]}
                        >
                          {vendor.phone}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.9,
    overflow: "hidden",
  },
  scrollView: {
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    height: 82,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    gap: 24,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Cairo_700Bold",
    fontSize: 24,
    color: "#FFF",
    lineHeight: 32,
  },
  headerTitleRTL: {
    textAlign: "right",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    padding: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoHeaderRTL: {
    flexDirection: "row-reverse",
  },
  iconBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 5,
    padding: 5,
  },
  iconBadgeYellow: {
    backgroundColor: "#FFFBEB",
  },
  infoTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 14,
    color: "#2C2C2C",
    lineHeight: 20,
  },
  infoTitleRTL: {
    textAlign: "right",
  },
  infoValue: {
    fontFamily: "Cairo_500Medium",
    fontSize: 14,
    color: "#1C1917",
    lineHeight: 16,
  },
  infoValueRTL: {
    textAlign: "right",
  },
  includedCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    padding: 20,
    gap: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  includedTitle: {
    fontFamily: "Cairo_700Bold",
    fontSize: 14,
    color: "#2C2C2C",
    lineHeight: 20,
  },
  includedTitleRTL: {
    textAlign: "right",
  },
  includedList: {
    gap: 12,
  },
  includedItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  includedItemRTL: {
    flexDirection: "row-reverse",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D97706",
  },
  includedText: {
    flex: 1,
    fontFamily: "Cairo_400Regular",
    fontSize: 14,
    color: "#44403C",
    lineHeight: 16,
  },
  includedTextRTL: {
    textAlign: "right",
  },
  vendorCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    padding: 20,
    gap: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  vendorHeader: {
    gap: 12,
  },
  vendorInfo: {
    flexDirection: "row",
    gap: 8,
  },
  vendorInfoRTL: {
    flexDirection: "row-reverse",
  },
  vendorDetails: {
    flex: 1,
    gap: 8,
  },
  vendorName: {
    fontFamily: "Cairo_700Bold",
    fontSize: 14,
    color: "#262626",
    lineHeight: 20,
  },
  vendorNameRTL: {
    textAlign: "right",
  },
  vendorStats: {
    flexDirection: "row",
    gap: 8,
  },
  vendorStatsRTL: {
    flexDirection: "row-reverse",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statRTL: {
    flexDirection: "row-reverse",
  },
  statLabel: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
    color: "#262626",
    lineHeight: 16,
  },
  statValue: {
    fontFamily: "Cairo_400Regular",
    fontSize: 12,
    color: "#737373",
    lineHeight: 16,
  },
  vendorLogo: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  contactSection: {
    gap: 8,
  },
  contactTitle: {
    fontFamily: "Cairo_500Medium",
    fontSize: 14,
    color: "#262626",
    lineHeight: 20,
  },
  contactTitleRTL: {
    textAlign: "right",
  },
  contactList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactItemRTL: {
    flexDirection: "row-reverse",
  },
  contactText: {
    flex: 1,
    fontFamily: "Cairo_400Regular",
    fontSize: 14,
    color: "#656565",
    lineHeight: 16,
  },
  contactTextRTL: {
    textAlign: "right",
  },
});

export default MoreInfoPopup;
