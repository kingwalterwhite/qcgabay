// QCGabay/app/(tabs)/more/index.tsx

import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../(auth)/AuthContext";
import { auth } from "../../firebaseConfig";
import { styles } from "./styles";

export default function MorePage() {
  const router = useRouter();
  const { user } = useAuth(); // Watch global auth state
  const [isLoggingOut, setIsLoggingOut] = useState(false);
const [showLogoutModal, setShowLogoutModal] = useState(false); // ADD THIS LINE
  // Trigger the custom modal instead of standard alerts
  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  // Logout logic
  const handleLogout = async () => {
    setShowLogoutModal(false); // Close modal right away
    setIsLoggingOut(true);
    console.log("Attempting to log out..."); 

    try {
      await signOut(auth);
      console.log("✅ Firebase Logout Success");
    } catch (error: any) {
      console.error("❌ LOGOUT ERROR:", error.message);
      Alert.alert("Error", "Failed to log out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLocation = () => {
    // Navigate to location screen or trigger action
    router.push("./location");
  };

  const handleHelpSupport = () => {
    Linking.openURL("https://quezoncity.gov.ph/contact-us/");
  };

  const handlePrivacy = () => {
    Linking.openURL("https://quezoncity.gov.ph/privacy-policy/");
  };

  const handleContact = () => {
  // Use the relative path to your new folder
  router.push("./contacts"); 
};

  const handleAboutUs = () => {
    // Navigate to about us screen
    router.push("./about");
  };

  const OptionItem = ({ icon, name, label, color = "#555", onPress, disabled = false }: any) => (
    <TouchableOpacity
      style={[styles.optionRow, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        {icon === "Ionicons" ? (
          <Ionicons name={name} size={24} color={color} />
        ) : icon === "MaterialIcons" ? (
          <MaterialIcons name={name} size={24} color={color} />
        ) : (
          <FontAwesome5 name={name} size={20} color={color} />
        )}
      </View>

      <Text
        style={[
          styles.optionLabel,
          { color: label === "Logout" || label === "Login" ? "#d9534f" : "#333" },
        ]}
      >
        {label}
      </Text>

      <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("../home")}>
          <Ionicons name="arrow-back" size={24} color="#1d50a2" />
        </TouchableOpacity>

{/* 🛑 Modern Custom Logout Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <MaterialIcons name="logout" size={32} color="#d9534f" />
            </View>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalSub}>Are you sure you want to log out of your account?</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                <Text style={styles.modalConfirmText}>
                  {isLoggingOut ? "Logging out..." : "Yes, Logout"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

        <Text style={styles.headerTitle}>More Options</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.menuCard}>
          
          {/* USER MODE ONLY: Profile and Location */}
          {user && (
            <>
              <Text style={styles.menuTitle}>Account & Services</Text>
              <OptionItem
                icon="Ionicons"
                name="person-circle-sharp"
                label="Profile"
                onPress={() => router.push("../profile")}
                disabled={isLoggingOut}
              />
              <OptionItem
                icon="Ionicons"
                name="location-sharp"
                label="Location"
                onPress={handleLocation}
                disabled={isLoggingOut}
              />
              <View style={styles.divider} />
            </>
          )}

          {/* COMMON BUTTONS: Guest & User Mode */}
          <Text style={styles.menuTitle}>Information</Text>
          <OptionItem
            icon="MaterialIcons"
            name="lock"
            label="Privacy Policy"
            onPress={handlePrivacy}
            disabled={isLoggingOut}
          />
          <OptionItem
            icon="Ionicons"
            name="mail"
            label="Contact"
            onPress={handleContact}
            disabled={isLoggingOut}
          />
          <OptionItem
            icon="Ionicons"
            name="information-circle"
            label="About Us"
            onPress={handleAboutUs}
            disabled={isLoggingOut}
          />

          <View style={styles.divider} />
          
          {/* SESSION: Logout (User) or Login (Guest) */}
          <Text style={styles.menuTitle}>Session</Text>
          {user ? (
            <OptionItem
              icon="MaterialIcons"
              name="logout"
              label={isLoggingOut ? "Logging out..." : "Logout"}
              color="#d9534f"
              onPress={confirmLogout}
              disabled={isLoggingOut}
            />
          ) : (
            <OptionItem
              icon="MaterialIcons"
              name="login"
              label="Login"
              color="#1d50a2" // Changed to Blue to distinguish from Logout
              onPress={handleLogin}
            />
          )}
        </View>

        <Text style={styles.versionText}>QC Gabay v1.0.0</Text>
      </ScrollView>
    </View>
  );
}