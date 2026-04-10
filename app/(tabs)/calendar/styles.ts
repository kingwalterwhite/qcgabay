// qcgabay/app/(tabs)/calendar/style.ts

import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#88a9d6' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    margin: 15, 
    borderRadius: 10, 
    padding: 10,
    elevation: 3 
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },


  
  content: { padding: 15, alignItems: 'center' },




  calendarCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 30,
    padding: 20,
    minHeight: 350,
    elevation: 5,
  },
  calendarTopRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginBottom: 10 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  dayText: { fontSize: 12, fontWeight: 'bold', color: '#1d50a2' },
  datesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  dateCell: { width: '14%', height: 40, alignItems: 'center', justifyContent: 'center', borderTopWidth: 0.5, borderColor: '#eee' },
  dateText: { fontSize: 13, color: '#333' },
  bottomCaret: { alignSelf: 'center', marginTop: 10 }
});