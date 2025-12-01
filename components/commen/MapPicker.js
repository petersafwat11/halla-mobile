import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  TextInput as RNTextInput,
  ActivityIndicator,
  FlatList,
  Alert,
  Keyboard,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";

const MapPicker = ({
  name,
  label,
  placeholder = "اختر موقع المناسبة",
  disabled = false,
  rules,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState([]);
        const [isSearching, setIsSearching] = useState(false);
        const [selectedLocation, setSelectedLocation] = useState(
          value || {
            address: "",
            latitude: 24.7136, // Riyadh default
            longitude: 46.6753,
            city: "",
            country: "",
          }
        );
        const [region, setRegion] = useState({
          latitude: value?.latitude || 24.7136,
          longitude: value?.longitude || 46.6753,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        const [isLoadingLocation, setIsLoadingLocation] = useState(false);
        const mapRef = useRef(null);
        const searchTimeoutRef = useRef(null);

        // Search for locations using Nominatim (OpenStreetMap - free, no API key)
        const searchLocation = async (query) => {
          if (!query || query.trim().length < 3) {
            setSearchResults([]);
            return;
          }

          setIsSearching(true);
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query
              )}&limit=5&addressdetails=1`,
              {
                headers: {
                  "User-Agent": "HallaMobileApp/1.0",
                  Accept: "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
          } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
          } finally {
            setIsSearching(false);
          }
        };

        // Debounced search
        const handleSearchChange = (text) => {
          setSearchQuery(text);
          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
          }
          searchTimeoutRef.current = setTimeout(() => {
            searchLocation(text);
          }, 500);
        };

        // Get current location
        const getCurrentLocation = async () => {
          setIsLoadingLocation(true);
          try {
            const { status } =
              await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "الأذونات",
                "يرجى السماح بالوصول إلى الموقع لاستخدام هذه الميزة"
              );
              return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Reverse geocode to get address
            const addresses = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });

            if (addresses && addresses.length > 0) {
              const addr = addresses[0];
              const newLocation = {
                address: `${addr.street || ""} ${addr.city || ""} ${
                  addr.country || ""
                }`.trim(),
                latitude,
                longitude,
                city: addr.city || "",
                country: addr.country || "",
              };
              setSelectedLocation(newLocation);
              setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
              mapRef.current?.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
            }
          } catch (error) {
            console.error("Location error:", error);
            Alert.alert("خطأ", "فشل في الحصول على الموقع الحالي");
          } finally {
            setIsLoadingLocation(false);
          }
        };

        // Handle search result selection
        const handleSelectSearchResult = (result) => {
          const newLocation = {
            address: result.display_name,
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            city: result.address?.city || result.address?.town || "",
            country: result.address?.country || "",
          };
          setSelectedLocation(newLocation);
          setRegion({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          mapRef.current?.animateToRegion({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setSearchQuery("");
          setSearchResults([]);
          Keyboard.dismiss();
        };

        // Handle map press
        const handleMapPress = async (event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;

          try {
            // Reverse geocode
            const addresses = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });

            if (addresses && addresses.length > 0) {
              const addr = addresses[0];
              const newLocation = {
                address: `${addr.street || ""} ${addr.city || ""} ${
                  addr.country || ""
                }`.trim(),
                latitude,
                longitude,
                city: addr.city || "",
                country: addr.country || "",
              };
              setSelectedLocation(newLocation);
            } else {
              setSelectedLocation({
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                latitude,
                longitude,
                city: "",
                country: "",
              });
            }
          } catch (error) {
            console.error("Reverse geocode error:", error);
            setSelectedLocation({
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              latitude,
              longitude,
              city: "",
              country: "",
            });
          }
        };

        const handleConfirm = () => {
          onChange(selectedLocation);
          setIsOpen(false);
        };

        const handleCancel = () => {
          setSelectedLocation(
            value || {
              address: "",
              latitude: 24.7136,
              longitude: 46.6753,
              city: "",
              country: "",
            }
          );
          setSearchQuery("");
          setSearchResults([]);
          setIsOpen(false);
        };

        const displayValue = value?.address || "";

        return (
          <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            {/* Input Button */}
            <TouchableOpacity
              style={[
                styles.inputContainer,
                error && styles.inputContainerError,
                disabled && styles.inputContainerDisabled,
              ]}
              onPress={() => !disabled && setIsOpen(true)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <View style={styles.inputContent}>
                <Ionicons name="location-outline" size={24} color="#C28E5C" />
                <Text
                  style={[
                    styles.inputText,
                    !displayValue && styles.placeholderText,
                  ]}
                  numberOfLines={1}
                >
                  {displayValue || placeholder}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error.message}</Text>}

            {/* Map Modal */}
            <Modal
              visible={isOpen}
              transparent
              animationType="slide"
              onRequestClose={handleCancel}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  {/* Header */}
                  <View style={styles.modalHeader}>
                    <TouchableOpacity
                      onPress={handleCancel}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={28} color="#2C2C2C" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>اختر موقع المناسبة</Text>
                  </View>

                  {/* Search Bar */}
                  <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                      {isSearching ? (
                        <ActivityIndicator size="small" color="#C28E5C" />
                      ) : (
                        <Ionicons
                          name="search-outline"
                          size={20}
                          color="#767676"
                        />
                      )}
                      <RNTextInput
                        style={styles.searchInput}
                        placeholder="ابحث عن موقع (مدينة، شارع، معلم...)"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        returnKeyType="search"
                      />
                      {searchQuery.length > 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#999"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <View style={styles.searchResultsContainer}>
                      <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.place_id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.searchResultItem}
                            onPress={() => handleSelectSearchResult(item)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="location"
                              size={20}
                              color="#C28E5C"
                            />
                            <Text
                              style={styles.searchResultText}
                              numberOfLines={2}
                            >
                              {item.display_name}
                            </Text>
                            <Ionicons
                              name="chevron-back"
                              size={18}
                              color="#999"
                            />
                          </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => (
                          <View style={styles.separator} />
                        )}
                      />
                    </View>
                  )}

                  {/* Map */}
                  <View style={styles.mapContainer}>
                    <MapView
                      ref={mapRef}
                      style={styles.map}
                      provider={PROVIDER_DEFAULT}
                      initialRegion={region}
                      onPress={handleMapPress}
                      showsUserLocation
                      showsMyLocationButton={false}
                      showsCompass={false}
                    >
                      <Marker
                        coordinate={{
                          latitude: selectedLocation.latitude,
                          longitude: selectedLocation.longitude,
                        }}
                        title="الموقع المختار"
                        description={selectedLocation.address}
                        pinColor="#C28E5C"
                      />
                    </MapView>

                    {/* Current Location Button */}
                    <TouchableOpacity
                      style={styles.currentLocationButton}
                      onPress={getCurrentLocation}
                      disabled={isLoadingLocation}
                      activeOpacity={0.8}
                    >
                      {isLoadingLocation ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Ionicons name="locate" size={24} color="#FFF" />
                      )}
                    </TouchableOpacity>

                    {/* Selected Address Card */}
                    {selectedLocation.address && (
                      <View style={styles.selectedAddressCard}>
                        <View style={styles.addressIconContainer}>
                          <Ionicons name="location" size={20} color="#C28E5C" />
                        </View>
                        <View style={styles.addressTextContainer}>
                          <Text style={styles.addressLabel}>
                            الموقع المختار
                          </Text>
                          <Text style={styles.addressText} numberOfLines={2}>
                            {selectedLocation.address}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancel}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelButtonText}>إلغاء</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        !selectedLocation.address &&
                          styles.confirmButtonDisabled,
                      ]}
                      onPress={handleConfirm}
                      disabled={!selectedLocation.address}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark" size={20} color="#FFF" />
                      <Text style={styles.confirmButtonText}>تأكيد الموقع</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#2C2C2C",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  inputContainerError: {
    borderColor: "#E74C3C",
    borderWidth: 1.5,
  },
  inputContainerDisabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.6,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
  },
  placeholderText: {
    color: "#999",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Cairo_400Regular",
    color: "#E74C3C",
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFF",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    color: "#2C2C2C",
    flex: 1,
    textAlign: "center",
    marginRight: 36,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#FFF",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    textAlign: "right",
  },
  searchResultsContainer: {
    maxHeight: 250,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  searchResultText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 20,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  currentLocationButton: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#C28E5C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedAddressCard: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9F4EF",
    justifyContent: "center",
    alignItems: "center",
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    fontFamily: "Cairo_600SemiBold",
    color: "#999",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    fontFamily: "Cairo_400Regular",
    color: "#2C2C2C",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#666",
  },
  confirmButton: {
    flex: 2,
    flexDirection: "row",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#C28E5C",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#CCC",
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: "Cairo_600SemiBold",
    color: "#FFF",
  },
});

export default MapPicker;
