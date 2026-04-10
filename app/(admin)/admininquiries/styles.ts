// QCGabay/app/(admin)/admininquiries/style.ts

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f7fa' },
  searchBar: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  searchInput: { flex: 1, marginLeft: 10 },
  addButton: { backgroundColor: '#1d50a2', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 2 },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardSubtitle: { color: '#666', fontSize: 13, marginTop: 4, marginBottom: 4 },
  
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 10, padding: 4 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1d50a2' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15 },
  textArea: { height: 100 },
  
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { padding: 15, borderRadius: 8, backgroundColor: '#ddd', flex: 1, marginRight: 5, alignItems: 'center', justifyContent: 'center' },
  saveBtn: { padding: 15, borderRadius: 8, backgroundColor: '#1d50a2', flex: 1, marginLeft: 5, alignItems: 'center', justifyContent: 'center' },
  
  btnText: { fontWeight: 'bold', color: '#333' },
  btnTextWhite: { fontWeight: 'bold', color: '#fff' },

  // --- NEW STYLES FROM EVENTS PORT ---

  bulkActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginBottom: 15,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    marginLeft: 5,
    color: '#333',
    fontWeight: '500',
  },
  bulkButtonsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1d50a2",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  secondaryButtonText: {
    color: "#1d50a2",
    marginLeft: 4,
    fontSize: 13,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9534f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  checkboxWrap: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createdText: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  updatedText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },

  // Notification Animation Styles
  notification: {
    position: 'absolute',
    top: 20, 
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
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
    flex: 1,
  },

  // Confirmation Modal Styles
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  confirmContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  confirmMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});