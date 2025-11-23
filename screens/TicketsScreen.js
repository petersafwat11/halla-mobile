import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLanguage, useTranslation } from "../localization";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "../contexts/ToastContext";
import { TicketCard, TicketModal } from "../components/tickets";
import {
  getTicketsAPI,
  createTicketAPI,
  updateTicketAPI,
  deleteTicketAPI
} from "../services/ticketsService";
import { TopBar } from "../components/plans";

export default function TicketsScreen() {
  const { t } = useTranslation("tickets");
  const toast = useToast();
  const { token } = useAuthStore();
  const navigation = useNavigation();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fabScale = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadTickets();

    // Animate FAB button
    Animated.spring(fabScale, {
      toValue: 1,
      delay: 300,
      tension: 50,
      friction: 7,
      useNativeDriver: true
    }).start();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await getTicketsAPI(token);
      const ticketList = response?.data?.data || response?.data || [];
      setTickets(ticketList);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      toast.error(error.message || t("messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  }, []);

  const handleCreateTicket = async (data) => {
    try {
      setSubmitting(true);
      const response = await createTicketAPI(data, token);
      const createdTicket =
        response?.data?.data || response?.data || response?.ticket;
      setTickets((prev) => (createdTicket ? [createdTicket, ...prev] : prev));
      toast.success(t("messages.createSuccess"));
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to create ticket:", error);
      toast.error(error.message || t("messages.createError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTicket = async (data) => {
    try {
      setSubmitting(true);
      const response = await updateTicketAPI(editingTicket._id, data, token);
      const updatedTicket =
        response?.data?.data || response?.data || response?.ticket;
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === editingTicket._id && updatedTicket
            ? updatedTicket
            : ticket
        )
      );
      toast.success(t("messages.updateSuccess"));
      setModalVisible(false);
      setEditingTicket(null);
    } catch (error) {
      console.error("Failed to update ticket:", error);
      toast.error(error.message || t("messages.updateError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTicket = (ticketId) => {
    Alert.alert(
      t("messages.confirmDelete"),
      "",
      [
        {
          text: t("form.cancel"),
          style: "cancel"
        },
        {
          text: t("card.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTicketAPI(ticketId, token);
              setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
              toast.success(t("messages.deleteSuccess"));
            } catch (error) {
              console.error("Failed to delete ticket:", error);
              toast.error(error.message || t("messages.deleteError"));
            }
          }
        }],
      { cancelable: true }
    );
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingTicket(null);
  };

  const handleBack = () => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleSubmit = (data) => {
    if (editingTicket) {
      handleUpdateTicket(data);
    } else {
      handleCreateTicket(data);
    }
  };

  const renderTicket = ({ item, index }) => (
    <TicketCard
      ticket={item}
      onDelete={handleDeleteTicket}
      onEdit={handleEditTicket}
      index={index}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="ticket-outline" size={80} color="#e0e0e0" />
      <Text style={styles.emptyTitle}>
        {t("emptyState")}
      </Text>
      <Text
        style={styles.emptyDescription}
      >
        {t("emptyStateDescription")}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <TopBar
            title={t("title")}
            showBack={navigation?.canGoBack?.()}
            onBack={handleBack}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c28e5c" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <TopBar
          title={t("title")}
          showBack={navigation?.canGoBack?.()}
          onBack={handleBack}
        />

        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[
            styles.listContent,
            tickets.length === 0 && styles.listContentEmpty]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#c28e5c"
              colors={["#c28e5c"]}
            />
          }
        />

        <Animated.View
          style={[
            styles.fabContainer,
            { transform: [{ scale: fabScale }] }]}
        >
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <TicketModal
          visible={modalVisible}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={
            editingTicket
              ? { type: editingTicket.type, message: editingTicket.message }
              : null
          }
          loading={submitting}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#C28E5C"
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8"
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },headerTitle: {
    fontSize: 24,
    fontFamily: "Cairo_700Bold",
    color: "#2c2c2c"
  },  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  listContent: {
    padding: 16,
    paddingBottom: 100
  },
  listContentEmpty: {
    flexGrow: 1
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Cairo_700Bold",
    color: "#2c2c2c",
    marginTop: 16,
    marginBottom: 8
  },  emptyDescription: {
    fontSize: 15,
    fontFamily: "Cairo_400Regular",
    color: "#666",
    textAlign: "center",
    lineHeight: 22
  },  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 24
  },  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#c28e5c",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  }
});
