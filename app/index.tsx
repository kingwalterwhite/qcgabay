// qcgabay/app/index.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StatusBar, StyleSheet, View } from 'react-native';
import { auth } from './firebaseConfig'; // Ensure your config exports 'auth'

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [authInitialized, setAuthInitialized] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Start the logo animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 2. Listen for Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // 3. Only run navigation logic once Auth is confirmed
    if (authInitialized) {
      const determineNavigation = async () => {
        try {
          const hasLaunched = await AsyncStorage.getItem('@has_launched');

          // Artificial delay so the splash screen isn't too fast (optional)
          setTimeout(() => {
            if (user) {
              // CASE 1: User is already logged in -> Go to Main App/Dashboard
              // Adjust this path to your actual main tab or home route
              router.replace('/(tabs)/home'); 
            } else if (hasLaunched === 'true') {
              // CASE 2: Not logged in, but has seen Intro -> Go to Signup
              router.replace('/signup');
            } else {
              // CASE 3: New install -> Go to Get Started
              router.replace('/get-started');
            }
          }, 2500);
        } catch (e) {
          router.replace('/get-started');
        }
      };

      determineNavigation();
    }
  }, [authInitialized, user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#88a9d6" />
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#88a9d6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '80%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});