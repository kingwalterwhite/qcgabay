// qcgabay/app/(tabs)/home/styles.ts

import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#fff', 
    paddingTop: 60, paddingBottom: 25, paddingHorizontal: 20,
    borderBottomLeftRadius: 35, borderBottomRightRadius: 35,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  logoImage: { width: 100, height: 40 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  greetingText: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 15 },
  searchWrapper: {
    flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12,
    alignItems: 'center', paddingHorizontal: 12, height: 48,
  },
  searchInput: { flex: 1, fontSize: 14, marginLeft: 8, color: '#1e293b' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 15 },
  mainCard: {
    backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row',
    alignItems: 'center', padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: '#f1f5f9', elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8,
  },
  cardAccent: { width: 5, height: '100%', borderRadius: 3, marginRight: 15 },
  cardBody: { flex: 1 },
  cardCategory: { fontSize: 10, fontWeight: '900', color: '#94a3b8', letterSpacing: 1, marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  cardDate: { fontSize: 13, color: '#64748b' },
  footerSpacing: { height: 40 },
  // Styles for empty state
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#94a3b8', marginTop: 10, fontSize: 16, textAlign: 'center' }
});