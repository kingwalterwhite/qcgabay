// QCGabay/app/(auth)/signup/index.tsx

import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Firebase Imports
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

import { styles } from './styles';

const { width } = Dimensions.get('window');

export default function SignupPage() {
  const router = useRouter();

  const [showEmailFields, setShowEmailFields] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBarangaySuggestions, setShowBarangaySuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔔 Notification State
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('error');

  const notifAnim = useRef(new Animated.Value(-120)).current;
  const notifOpacity = useRef(new Animated.Value(0)).current;

  // Form State
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [barangay, setBarangay] = useState('');
  const [password, setPassword] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, [showEmailFields]);

  // 🔔 Notification Function
  const showNotification = (message: string, type: 'success' | 'error' = 'error') => {
    setNotification(message);
    setNotificationType(type);

    Animated.parallel([
      Animated.timing(notifAnim, {
        toValue: 55,
        duration: 350,
        useNativeDriver: true
      }),
      Animated.timing(notifOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true
      })
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(notifAnim, {
          toValue: -120,
          duration: 350,
          useNativeDriver: true
        }),
        Animated.timing(notifOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true
        })
      ]).start();
    }, 2500);
  };

  const handleRegister = async () => {
    if (!username || !fullName || !email || !phone || !barangay || !password) {
      return showNotification('Please complete all fields.', 'error');
    }
    if (username.trim().length > 20) {
      return showNotification('Username must be max 20 characters.', 'error');
    }
    if (fullName.trim().length > 20 || !/^[a-zA-Z\s]+$/.test(fullName)) {
      return showNotification('Full Name must be letters only (max 20).', 'error');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showNotification('Invalid email address.', 'error');
    }
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      return showNotification('Phone number must be 11 digits.', 'error');
    }
    if (password.length < 6) {
      return showNotification('Password must be at least 6 characters.', 'error');
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        username: username.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone,
        barangay,
        createdAt: new Date(),
      });

      showNotification('Account created successfully! 🎉', 'success');

      setTimeout(() => {
        setShowSuccessModal(true);
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true
        }).start();
      }, 1000);

    } catch (error: any) {
      let errorMessage = 'Registration failed.';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Email already in use.';
      if (error.code === 'auth/weak-password') errorMessage = 'Weak password.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeSignup = () => {
    setShowSuccessModal(false);
    router.replace('../login');
  };

  const handleSocialSignup = async (platform: string) => {
    let url =
      platform === 'Google'
        ? 'https://accounts.google.com/signup'
        : 'https://www.facebook.com/r.php';

    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 🔔 TOP NOTIFICATION */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          alignSelf: 'center',
          zIndex: 999,
          transform: [{ translateY: notifAnim }],
          opacity: notifOpacity,
          backgroundColor: notificationType === 'success' ? '#16a34a' : '#dc2626',
          paddingVertical: 14,
          paddingHorizontal: 22,
          borderRadius: 14,
          width: width * 0.85,
          alignItems: 'center',
          elevation: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>
          {notification}
        </Text>
      </Animated.View>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.successCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark-sharp" size={50} color="#ffffff" />
            </View>

            <Text style={styles.successTitle}>Welcome Aboard!</Text>

            <Text style={styles.successSubtitle}>
              Your account for <Text style={styles.boldText}>{fullName}</Text> has been successfully created.
            </Text>

            <TouchableOpacity style={styles.modalBtn} onPress={finalizeSignup}>
              <Text style={styles.modalBtnText}>Let's Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.topSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us to access QC barangay related information.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            {!showEmailFields ? (
              <View style={styles.initialState}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => setShowEmailFields(true)}
                >
                  <MaterialCommunityIcons name="email-outline" size={20} color="white" />
                  <Text style={styles.primaryBtnText}>Continue with Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.guestOptionBtn}
                  onPress={() => router.replace('/home')}
                >
                  <Text style={styles.guestOptionText}>
                    Continue without an account
                  </Text>
                </TouchableOpacity>

                <View style={styles.loginSwitch}>
                  <Text style={styles.switchText}>
                    Already have an account?
                  </Text>

                  <TouchableOpacity onPress={() => router.push('../login')}>
                    <Text style={styles.switchLink}> Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.form}>
                <Text style={styles.formHeader}>Registration Details</Text>

                {[
                  { icon: 'user', placeholder: 'Username', val: username, set: (text: string) => setUsername(text), max: 20 },
                  { icon: 'idcard', placeholder: 'Full Name', val: fullName, set: (text: string) => setFullName(text.replace(/[^a-zA-Z\s]/g, '')), max: 20 },
                  { icon: 'mail', placeholder: 'Email', val: email, set: setEmail, type: 'email-address' },
                  { icon: 'phone', placeholder: 'Mobile Number', val: phone, set: (text: string) => setPhone(text.replace(/[^0-9]/g, '')), type: 'phone-pad', max: 11 },
                  { icon: 'home', placeholder: 'Barangay', val: barangay, set: setBarangay, isAutocomplete: true, options: ['Bungad', 'Veterans Village'] },
                  { icon: 'lock', placeholder: 'Password', val: password, set: setPassword, secure: true }
                ].map((item, index) => (
                  <View key={index} style={{ zIndex: item.isAutocomplete ? 10 : 1 }}>
                    {item.isAutocomplete ? (
                      <>
                        <View style={styles.inputWrapper}>
                          <AntDesign name={item.icon as any} size={18} color="#2D5A27" style={styles.inputIcon} />
                          <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder={item.placeholder}
                            value={item.val}
                            onChangeText={(text) => {
                              item.set(text);
                              setShowBarangaySuggestions(true);
                            }}
                            onFocus={() => setShowBarangaySuggestions(true)}
                            placeholderTextColor="#94a3b8"
                          />
                          <TouchableOpacity
                            style={{ padding: 10, paddingRight: 15 }}
                            onPress={() => setShowBarangaySuggestions(!showBarangaySuggestions)}
                          >
                            <AntDesign name={showBarangaySuggestions ? "up" : "down"} size={14} color="#94a3b8" />
                          </TouchableOpacity>
                        </View>

                        {showBarangaySuggestions && item.options && (
                          <View style={{ backgroundColor: '#f8fafc', borderRadius: 8, marginBottom: 12 }}>
                            {item.options
                              .filter((opt) => opt.toLowerCase().includes(item.val.toLowerCase()))
                              .map((opt, idx) => (
                                <TouchableOpacity
                                  key={idx}
                                  style={{ padding: 14 }}
                                  onPress={() => {
                                    item.set(opt);
                                    setShowBarangaySuggestions(false);
                                  }}
                                >
                                  <Text>{opt}</Text>
                                </TouchableOpacity>
                              ))}
                          </View>
                        )}
                      </>
                    ) : (
                      <View style={styles.inputWrapper}>
                        <AntDesign name={item.icon as any} size={18} color="#2D5A27" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder={item.placeholder}
                          value={item.val}
                          onChangeText={item.set}
                          keyboardType={(item.type as any) || 'default'}
                          secureTextEntry={item.secure}
                          placeholderTextColor="#94a3b8"
                          maxLength={item.max}
                        />
                      </View>
                    )}
                  </View>
                ))}

                <TouchableOpacity
                  style={[styles.registerBtn, isLoading && { opacity: 0.7 }]}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.registerBtnText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowEmailFields(false)}>
                  <Text style={styles.backLink}>Back to options</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR JOIN VIA</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialBox}
                onPress={() => handleSocialSignup('Google')}
              >
                <AntDesign name="google" size={20} color="#ea4335" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBox}
                onPress={() => handleSocialSignup('Facebook')}
              >
                <FontAwesome name="facebook" size={20} color="#1877F2" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}