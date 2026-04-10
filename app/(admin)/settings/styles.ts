import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f4f7fa', 
    padding: 20, 
    alignItems: 'center', // Centers children horizontally
    paddingTop: 60,       // Adjust this value to push the logo higher or lower from the top
  },
  logo: { 
    width: 250,           // Reduced slightly for better proportions
    height: 250, 
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1d50a2', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  logoutBtn: { 
    backgroundColor: '#d9534f', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center',
    width: '100%',        // Makes the button span the width of the padding
    maxWidth: 300,        // Keeps the button from getting too wide on tablets
  },
  logoutText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});