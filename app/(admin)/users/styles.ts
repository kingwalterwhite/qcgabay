// QCGabay/app/(admin)/users/styles.ts

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa', padding: 15 },
  searchBar: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  searchInput: { flex: 1, marginLeft: 10 },
  addButton: { backgroundColor: '#1d50a2', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { color: '#666', marginTop: 2, fontSize: 13 },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 6, marginLeft: 5 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#fafafa' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: { padding: 10, marginRight: 10, justifyContent: 'center' },
  saveBtn: { backgroundColor: '#1d50a2', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center' },
  btnText: { color: '#333' },
  btnTextWhite: { color: '#fff', fontWeight: 'bold' },

  // Added Bulk Actions Styles
  bulkActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, alignItems: 'center' },
  selectAllButton: { flexDirection: 'row', alignItems: 'center' },
  selectAllText: { marginLeft: 5, color: '#333', fontWeight: '500' },
  checkboxWrap: { marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  
  bulkButtonsRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  secondaryButton: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#1d50a2", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, backgroundColor: "#fff" },
  secondaryButtonText: { color: "#1d50a2", marginLeft: 4, fontSize: 13, fontWeight: '500' },
  
  dangerButton: { flexDirection: 'row', backgroundColor: '#d9534f', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  dangerButtonText: { color: '#fff', marginLeft: 4, fontSize: 13, fontWeight: '500' },
  disabledButton: { opacity: 0.5 },

  // Timestamps
  createdText: { fontSize: 11, color: '#888', marginTop: 6 },
  updatedText: { fontSize: 11, color: '#888', marginTop: 2 },

  // Notification Styles
  notification: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    zIndex: 1000,
  },
  notificationContent: { flexDirection: 'row', alignItems: 'center' },
  notificationText: { marginLeft: 10, color: '#333', fontSize: 14, flex: 1, fontWeight: '500' },

  // Confirmation Modal Styles
  confirmOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  confirmContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 10 },
  confirmMessage: { fontSize: 16, color: '#333', marginBottom: 20, textAlign: 'center', lineHeight: 22 },
  confirmButtons: { flexDirection: 'row', justifyContent: 'space-between' }
});