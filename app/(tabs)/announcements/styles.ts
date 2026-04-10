//qcgabay/app/(tabs)/announcements/styles.ts

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#88a9d6" },
 
 content: { 
    paddingHorizontal: 20, 
    paddingTop: 15, 
    paddingBottom: 20 
  },
  // Updated Notice Box Styles
 // Updated Notice Box Styles for strict fixed size
  noticeBox: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#1d50a2",
    height: 135, // Strict fixed size (slightly increased from 120 to fit all text elements)
    justifyContent: "space-between",
    overflow: "hidden", // GUARANTEES no text can ever bleed out of the box
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2, // Tighter margin so it doesn't push bottom items out
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
    flex: 1, 
  },
  noticeBody: { 
    fontSize: 13, 
    color: "#555", 
    lineHeight: 18,
    // Removed bottom margin to keep it compact
  },
  noticeDate: {
    fontSize: 11,
    color: "#888",
    fontStyle: "italic",
    marginTop: 2, 
  },
  tapHint: { 
    fontSize: 11, 
    color: "#1d50a2", 
    fontWeight: "600",
    textAlign: "right",
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: "700",
    color: "#1d50a2",
    paddingRight: 10,
  },
  modalDate: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 14,
  },
  modalBody: {
    fontSize: 15,
    lineHeight: 23,
    color: "#333",
  },
  closeButton: {
    marginTop: 16,
    alignSelf: "flex-end",
    backgroundColor: "#1d50a2",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  // Notification Styles
  notificationContainer: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    minHeight: 50, // uniform height
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },


  // --- New Unified Header Styles ---
  topHeaderSection: {
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10, // Ensures dropdown floats over the ScrollView
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2e7d32",
    letterSpacing: 0.5,
  },
  
  // --- Cleaner Dropdown Styles ---
  dropdownContainer: {
    paddingHorizontal: 20,
    zIndex: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f6f8", // Softer gray
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25, // Pill shape looks much cleaner than a box
    borderWidth: 1,
    borderColor: "#e0e4e8",
  },
  dropdownButtonText: {
    fontSize: 15,
    color: "#444",
  },
  dropdownList: {
    position: "absolute",
    top: 48,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 20,
    overflow: "hidden", 
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between", // Spaces text and checkmark
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#444",
  },
  dropdownItemTextSelected: {
    color: "#2e7d32",
    fontWeight: "700",
  },
});