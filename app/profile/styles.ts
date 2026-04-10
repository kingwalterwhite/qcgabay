// QCGabay/app/profile/styles.ts

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fb' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },

  content: { padding: 20 },

  profileWrapper: { alignItems: 'center', marginBottom: 15 },

  avatar: { width: 100, height: 100, borderRadius: 50 },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  changePhoto: { marginTop: 8, color: '#1d50a2', fontSize: 13, fontWeight: '500' },

  name: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 15, color: '#222' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },

  label: { fontSize: 13, color: '#888', marginTop: 12 },

  value: { fontSize: 16, marginTop: 4, color: '#444' },

  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    fontSize: 15,
    color: '#333'
  },

  primaryBtn: {
    backgroundColor: '#1d50a2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#1d50a2',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // 🔔 Modern Toast
  toast: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30, // Pill shape
    zIndex: 999,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  toastText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '500',
  },

  // 📧 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1d50a2',
    marginBottom: 8,
  },

  modalSub: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#333',
    marginBottom: 24,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  modalCancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    marginRight: 12,
  },

  modalCancelText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 15,
  },

  modalConfirmBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1d50a2',
  },

  modalConfirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});