// QCGabay/app/(tabs)/events/styles.ts
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#88a9d6' 
  },
  header: { 
    padding: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1d50a2', 
    textAlign: 'center',
    marginBottom: 15, // Space between title and search bar
  },
  // --- ADDED SEARCH BAR STYLES ---
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#334155',
  },
  // --- LIST & CARDS ---
  listContent: { 
    padding: 20 
  },
  eventCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  eventInfo: { 
    marginLeft: 15, 
    flex: 1 
  },
  eventTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  // Added cardDate and kept eventDetails for compatibility
  cardDate: { 
    fontSize: 13, 
    color: '#666', 
    marginTop: 4 
  },
  eventDetails: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4 
  },
  // --- EMPTY STATE ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 12,
    color: '#fff', // White looks better against the blue background
    fontSize: 16,
    textAlign: 'center',
  },
});