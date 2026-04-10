
// QCGabay/app/(auth)/login/index.tsx

import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../../firebaseConfig';
import { styles } from './styles';

const { width } = Dimensions.get('window');

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('error');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const notifAnim = useRef(new Animated.Value(-120)).current;
  const notifOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const showNotification = (
    message: string,
    type: 'success' | 'error' = 'error'
  ) => {
    setNotification(message);
    setNotificationType(type);

    Animated.parallel([
      Animated.timing(notifAnim, {
        toValue: 55,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(notifOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(notifAnim, {
          toValue: -120,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(notifOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2500);
  };

  const handleLogin = async () => {
    if (!email.trim() && !password.trim()) {
      showNotification('Please enter your email and password.', 'error');
      return;
    }

    if (!email.trim()) {
      showNotification('Please enter your email.', 'error');
      return;
    }

    if (!password.trim()) {
      showNotification('Please enter your password.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      showNotification('Successfully logged in! 🎉', 'success');

      setTimeout(() => {
        if (userCredential.user.email === 'admin@gmail.com') {
          router.replace('../../(admin)/dashboard');
        } else {
          router.replace('/home');
        }
      }, 1200);
    } catch (error: any) {
      let message = 'Incorrect email or password.';

      if (error.code === 'auth/user-not-found') {
        message = 'Email is not registered.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email format.';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Incorrect email or password.';
      }

      showNotification(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (platform: string) => {
    const url =
      platform === 'Google'
        ? 'https://accounts.google.com/'
        : 'https://www.facebook.com/login/';

    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Notification */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          alignSelf: 'center',
          zIndex: 999,
          transform: [{ translateY: notifAnim }],
          opacity: notifOpacity,
          backgroundColor:
            notificationType === 'success' ? '#16a34a' : '#dc2626',
          paddingVertical: 14,
          paddingHorizontal: 22,
          borderRadius: 14,
          width: width * 0.85,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 15,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {notification}
        </Text>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.subtitle}>Please login to your account.</Text>
          </Animated.View>

          {/* Login Card */}
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.inputWrapper}>
              <AntDesign
                name="mail"
                size={20}
                color="#2D5A27"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrapper}>
              <AntDesign
                name="lock"
                size={20}
                color="#2D5A27"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={secureText}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() =>
                Linking.openURL('https://accounts.google.com/signin/recovery')
              }
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledBtn]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR CONNECT WITH</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialLogin('Google')}
              >
                <AntDesign name="google" size={20} color="#ea4335" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <FontAwesome name="facebook" size={20} color="#1877F2" />
                <Text style={styles.socialBtnText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.replace('/home')}
            >
              <Text style={styles.guestButtonText}>
                Continue without an account
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('../signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

