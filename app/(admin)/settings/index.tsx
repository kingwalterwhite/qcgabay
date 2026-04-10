import { Tabs, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';
import { styles } from './styles';

export default function AdminSettings() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header configuration to center text and add logo */}
      <Tabs.Screen
        options={{
          headerTitleAlign: 'center', // Centers the header text
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Settings</Text>
            </View>
          ),
          headerStyle: { backgroundColor: '#1d50a2' },
          headerTintColor: '#fff',
        }}
      />

      {/* Main Content */}
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />
      

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out Admin</Text>
      </TouchableOpacity>
    </View>
  );
}