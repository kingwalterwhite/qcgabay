import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const gap = 12; 
const cardWidth = (width - 52 - gap) / 2; // Calculation for 2-column grid

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 15, 
    color: '#1d50a2' 
  },
  scrollContent: { 
    padding: 20, 
    alignItems: 'center' 
  },
  
  // Logo Section
  logoSection: { 
    alignItems: 'center', 
    marginBottom: 30, 
    marginTop: 10 
  },
  logoContainer: { 
    width: 200, 
    height: 100, 
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: '100%', 
    height: '100%',
  },
  appName: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: '#1d50a2', 
    letterSpacing: 1.5,
    marginTop: 10
  },
  appTagline: { 
    fontSize: 13, 
    color: '#666', 
    marginTop: 4,
    fontStyle: 'italic'
  },

  // Cards (Mission, Vision, Team)
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1d50a2', 
    marginLeft: 8 
  },
  description: { 
    fontSize: 14, 
    color: '#444', 
    lineHeight: 22,
    textAlign: 'justify'
  },

  // Team Grid Section
  teamGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  memberCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  photoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberPhoto: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    alignItems: 'center',
    width: '100%',
  },
  memberName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    minHeight: 32,
  },
  memberRole: {
    fontSize: 10,
    color: '#1d50a2',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // Footer Section
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 40,
  },
  footerText: { 
    fontSize: 13, 
    fontWeight: '600',
    color: '#777' 
  },
  footerSubText: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  versionText: { 
    fontSize: 11, 
    color: '#bbb', 
    marginTop: 10
  },
});