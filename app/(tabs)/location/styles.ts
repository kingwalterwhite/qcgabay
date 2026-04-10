// qcgabay/app/(tabs)/location/styles.tsx

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    paddingBottom: 15, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, color: '#1d50a2' },
  mapContainer: { flex: 1, backgroundColor: '#f0f0f0' },
  bottomSheet: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#999', marginBottom: 15, textTransform: 'uppercase' },
  
  // Dropdown Toggle Styles
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dropdownToggleText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },

  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#ffebe9',
    borderWidth: 1,
    borderColor: '#ffdce0',
  },
  clearBtnText: {
    color: '#d9534f',
    fontWeight: '600',
    marginLeft: 6,
  },
  gpsButton: {
    flexDirection: 'row',
    backgroundColor: '#1d50a2',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },

  // Delete Confirmation Modal Style applied to Dropdown Dialog
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
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: '#333',
  },
  
  // Modal Dropdown Items
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemSelected: {
    backgroundColor: '#f5f8fc',
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#1d50a2',
    fontWeight: 'bold',
  },
});