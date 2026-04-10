// QCGabay/app/(tabs)/announcements/index.tsx

import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";
import { styles } from "./styles";

type Announcement = {
  id: string;
  title?: string;
  body?: string;
  content?: string;
  description?: string;
  createdAt?: any;
  targetBarangay?: string; // Added targetBarangay
};

const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return "N/A";
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp.toDate());
  }
  if (timestamp instanceof Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  }
  return "N/A";
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Dropdown Filter State
  const [selectedFilter, setSelectedFilter] = useState("All Barangay");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const barangayOptions = ["All Barangay", "Bungad", "Veterans"];

  // Facebook-style in-app notifications
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);
  const notifAnim = useRef(new Animated.Value(0)).current;
  const MAX_VISIBLE = 5;
  const NOTIF_HEIGHT = 60;
  const SCREEN_WIDTH = Dimensions.get("window").width;

  const showNotification = (message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [{ id, message }, ...prev.slice(0, MAX_VISIBLE - 1)]);

    Animated.timing(notifAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() =>
      setTimeout(() => {
        Animated.timing(notifAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setNotifications((prev) => prev.filter((n) => n.id !== id)));
      }, 3000)
    );
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notif) => {
      const msg = notif.request.content.body || "New Announcement";
      showNotification(msg);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "announcements"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Announcement[];
      setAnnouncements(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleOpenModal = (item: Announcement) => {
    setSelectedAnnouncement(item);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Filter Logic
  const displayedAnnouncements = announcements.filter((item) => {
    const target = item.targetBarangay || "All Barangay";
    if (selectedFilter === "All Barangay") return true; // Show all to user if filter is 'All'
    // Show items specifically targeted to selected barangay AND general 'All Barangay' items
    return target === selectedFilter || target === "All Barangay";
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* In-App Notifications */}
      <View
        style={{
          position: "absolute",
          top: 50,
          width: SCREEN_WIDTH,
          zIndex: 9999,
          alignItems: "center",
        }}
      >
        {notifications.map((n) => (
          <Animated.View
            key={n.id}
            style={{
              width: SCREEN_WIDTH * 0.95,
              height: NOTIF_HEIGHT,
              backgroundColor: "#fff",
              borderRadius: 10,
              marginBottom: 6,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
              transform: [
                {
                  translateY: notifAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, 0],
                  }),
                },
              ],
            }}
          >
            <Ionicons name="notifications" size={22} color="#1d50a2" />
            <Text
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 14,
                color: "#333",
                fontWeight: "500",
              }}
              numberOfLines={2}
            >
              {n.message}
            </Text>
          </Animated.View>
        ))}
      </View>

     {/* --- Unified Header Section --- */}
      <View style={styles.topHeaderSection}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Barangay Announcements</Text>
        </View>

        {/* Dropdown Filter */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            style={styles.dropdownButton}
          >
            <Text style={styles.dropdownButtonText}>
              Location: <Text style={{ fontWeight: "700", color: "#2e7d32" }}>{selectedFilter}</Text>
            </Text>
            <Ionicons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#666"
            />
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              {barangayOptions.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setSelectedFilter(option);
                    setIsDropdownOpen(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    index === barangayOptions.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedFilter === option && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {selectedFilter === option && (
                    <Ionicons name="checkmark-circle" size={18} color="#2e7d32" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      {/* --- End Unified Header Section --- */}

      <ScrollView style={[styles.container, { zIndex: 1 }]}>
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#004b23" style={{ marginTop: 20 }} />
          ) : displayedAnnouncements.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
              No announcements for {selectedFilter}.
            </Text>
          ) : (
            displayedAnnouncements.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.noticeBox}
                activeOpacity={0.8}
                onPress={() => handleOpenModal(item)}
              >
                <View style={styles.titleRow}>
                  <Ionicons name="megaphone" size={18} color="#e67e22" />
                  <Text style={styles.noticeTitle} numberOfLines={1}>
                    {item.title || "Announcement"}
                  </Text>
                </View>
                
                {/* Visual Indicator of Target Barangay */}
                {item.targetBarangay && item.targetBarangay !== "All Barangay" && (
                  <Text style={{ fontSize: 12, color: "#1d50a2", fontWeight: "bold", marginBottom: 4 }}>
                    📍 {item.targetBarangay} 
                  </Text>
                )}

                <Text style={styles.noticeBody} numberOfLines={2}>
                  {item.body || item.content || item.description || "No details available."}
                </Text>
                
                <Text style={styles.noticeDate}>
                  📅 Posted: {formatTimestamp(item.createdAt)}
                </Text>
                
                <Text style={styles.tapHint}>Tap to read &raquo;</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      > 
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedAnnouncement?.title || "Announcement"}
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#555" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDate}>
              📅 Posted on: {formatTimestamp(selectedAnnouncement?.createdAt)}
            </Text>
            {selectedAnnouncement?.targetBarangay && (
               <Text style={{fontSize: 12, color: '#666', marginBottom: 10, marginLeft: 20}}>
                 📍 Target: {selectedAnnouncement.targetBarangay}
               </Text>
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalBody}>
                {selectedAnnouncement?.body ||
                  selectedAnnouncement?.content ||
                  selectedAnnouncement?.description ||
                  "No details available."}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}