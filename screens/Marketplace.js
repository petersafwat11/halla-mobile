import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/plans/TopBar";
import {
  SearchAndFilter,
  VendorCards,
  MoreInfoPopup,
} from "../components/marketplace";
import FilterPopup from "../components/marketplace/FilterPopup";

// Mock data - replace with actual API call
const MOCK_VENDORS = [
  {
    id: 1,
    name: "تصوير اللحظات الذهبية",
    location: "دبي، الإمارات العربية المتحدة",
    rating: "4.9",
    reviewCount: "127",
    price: "250",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/543836aed36dc03d2fc3fd75e3abf6d31dca012e",
    tags: ["فعاليات الشركات", "تصوير حفلات الزفاف", "جلسات بورتريه"],
    duration: "8-12 ساعة",
    priceRange: "2,500 دولار - 8,000 دولار",
    included: [
      "جلسة تصوير الخطوبة",
      "حقوق الطباعة متضمنة",
      "خيارات التصوير الفوتوغرافي بالطائرات بدون طيار",
      "ألبوم صور رقمي",
      "تغطية ليوم كامل",
    ],
    companyName: "التهامى للتصوير والموسيقى",
    experience: "10",
    website: "www.smitchellphoto.com",
    email: "sarah@smitchellphoto.com",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    name: "تصوير اللحظات الذهبية",
    location: "دبي، الإمارات العربية المتحدة",
    rating: "4.9",
    reviewCount: "127",
    price: "250",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/543836aed36dc03d2fc3fd75e3abf6d31dca012e",
    tags: ["فعاليات الشركات", "تصوير حفلات الزفاف", "جلسات بورتريه"],
    duration: "8-12 ساعة",
    priceRange: "2,500 دولار - 8,000 دولار",
    included: [
      "جلسة تصوير الخطوبة",
      "حقوق الطباعة متضمنة",
      "خيارات التصوير الفوتوغرافي بالطائرات بدون طيار",
      "ألب��م صور رقمي",
      "تغطية ليوم كامل",
    ],
    companyName: "التهامى للتصوير والموسيقى",
    experience: "10",
    website: "www.smitchellphoto.com",
    email: "sarah@smitchellphoto.com",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 3,
    name: "تصوير اللحظات الذهبية",
    location: "دبي، الإمارات العربية المتحدة",
    rating: "4.9",
    reviewCount: "127",
    price: "250",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/543836aed36dc03d2fc3fd75e3abf6d31dca012e",
    tags: ["فعاليات الشركات", "تصوير حفلات الزفاف", "جلسات بورتريه"],
    duration: "8-12 ساعة",
    priceRange: "2,500 دولار - 8,000 دولار",
    included: [
      "جلسة تصوير الخطوبة",
      "حقوق الطباعة متضمنة",
      "خيارات التصوير الفوتوغرافي بالطائرات بدون طيار",
      "ألبوم صور رقمي",
      "تغطية ليوم كامل",
    ],
    companyName: "التهامى للتصوير والموسيقى",
    experience: "10",
    website: "www.smitchellphoto.com",
    email: "sarah@smitchellphoto.com",
    phone: "+1 (555) 123-4567",
  },
];

const Marketplace = ({ navigation }) => {
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [filteredVendors, setFilteredVendors] = useState(MOCK_VENDORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  // Filter vendors based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVendors(vendors);
    } else {
      const filtered = vendors.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredVendors(filtered);
    }
  }, [searchQuery, vendors]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterPress = () => {
    setShowFilterPopup(true);
  };

  const handleVendorCallPress = (vendor) => {
    console.log("Vendor pressed:", vendor);
    setSelectedVendor(vendor);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setTimeout(() => setSelectedVendor(null), 300);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#C28E5C" />

      <TopBar title="المتجر" onBack={handleBack} showBack={!!navigation} />

      <View style={styles.content}>
        <SearchAndFilter
          onSearch={handleSearch}
          onFilterPress={handleFilterPress}
          searchQuery={searchQuery}
        />

        <VendorCards
          vendors={filteredVendors}
          onVendorCallPress={handleVendorCallPress}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>

      <MoreInfoPopup
        visible={showPopup}
        vendor={selectedVendor}
        onClose={handleClosePopup}
      />

      <FilterPopup
        visible={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C28E5C",
  },
  content: {
    flex: 1,
    backgroundColor: "#F9F4EF",
  },
});

export default Marketplace;
