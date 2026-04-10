// qcgabay/app/get-started.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GetStarted() {
  const router = useRouter();

  const handleGetStarted = async () => {
    try {
      // Mark as launched so they never see this screen again
      await AsyncStorage.setItem('@has_launched', 'true');
      router.push('/signup');
    } catch (e) {
      console.error("Error saving launch status", e);
      router.push('/signup');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to QC Gabay</Text>
          <Text style={styles.subtitle}>
            Your official guide to barangay events, announcements, and services in Quezon City.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#88a9d6' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  logo: { width: 220, height: 220, marginBottom: 20 },
  textContainer: { alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#eef2ff', textAlign: 'center', lineHeight: 24 },
  footer: { padding: 40, paddingBottom: 60 },
  button: { 
    backgroundColor: 'white', 
    paddingVertical: 18, 
    borderRadius: 30, 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  buttonText: { color: '#1d50a2', fontSize: 18, fontWeight: 'bold' }
});