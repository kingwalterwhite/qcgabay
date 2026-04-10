// QCGabay/app/(admin)/dashboard/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1d50a2', marginBottom: 20 },

  // Card style
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',            // ✅ Allows cards to wrap to the next line safely
    justifyContent: 'space-between', 
    width: '100%',
    gap: 8,
  },
  card: {
    width: '48%',                // ✅ 2 cards per row. Keeps them looking uniform.
    marginBottom: 8,
    padding: 15,                 
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTextTitle: {
    fontSize: 12,                // ✅ Smaller font so 4 items fit nicely
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardTextCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#1d50a2',            // Adjust to your brand color
  },
});