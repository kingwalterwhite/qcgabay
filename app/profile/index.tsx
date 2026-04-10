// QCGabay/app/profile/index.tsx

import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Firebase
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Expo Image Picker
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { styles } from './styles';

export default function ProfilePage() {
  const router = useRouter();
  const storage = getStorage();

  // Profile & UI state
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Editable fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [barangay, setBarangay] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // Password for general update
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Email Change Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔔 Toast
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // 📥 Load user dynamically in real-time
  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    // First listen for the user session to resolve
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Then attach a real-time listener to their specific document
        unsubscribeSnapshot = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);

            // Populate states. Will automatically refresh if admin updates DB!
            setUsername(data.username || '');
            setFullName(data.fullName || '');
            setEmail(data.email || '');
            setPhone(data.phone || '');
            setBarangay(data.barangay || '');
            setPhotoURL(data.photoURL || '');
          }
          setIsLoading(false);
        }, (error) => {
          showToast('Failed to sync data: ' + error.message);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // 📸 Pick & upload profile picture
  const pickImage = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });
      setPhotoURL(downloadURL);
      showToast('Profile picture updated');
    }
  };

  // 💾 Standard Profile Save
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // 🛑 VALIDATIONS
    if (!username || username.trim().length > 20) {
      return showToast('Username must be 1-20 characters long');
    }

    if (!fullName || fullName.trim().length > 20 || !/^[a-zA-Z\s]+$/.test(fullName)) {
      return showToast('Full Name must be letters only and max 20 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showToast('Please enter a valid email address');
    }

    const phoneRegex = /^\d{11}$/;
    if (phone && !phoneRegex.test(phone)) {
      return showToast('Phone number must be exactly 11 digits');
    }

    // 🛑 Intercept if email was changed
    if (email !== user.email) {
      setShowEmailModal(true);
      return; 
    }

    try {
      // 🔄 Firestore (Without email change)
      await updateDoc(doc(db, 'users', user.uid), {
        username: username.trim(),
        fullName: fullName.trim(),
        phone,
        barangay,
      });

      setIsEditing(false);
      showToast('Profile updated successfully');
    } catch (error: any) {
      showToast(error.message);
    }
  };

  // 🔐 Confirm Email Change & Save
  const confirmEmailChangeAndSave = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    try {
      if (!confirmPassword) {
        return showToast('Please enter your password');
      }

      // Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, confirmPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update Firebase Auth Email
      await updateEmail(user, email);

      // Save all changes to Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        username: username.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone,
        barangay,
      });

      // Reset modal and editing states
      setShowEmailModal(false);
      setConfirmPassword('');
      setShowConfirmPassword(false);
      setIsEditing(false); 
      
      showToast('Profile and email updated successfully');
    } catch (error: any) {
      showToast(error.message);
    }
  };

  // 🔐 Change password
  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    try {
      if (!currentPassword || !newPassword) {
        return showToast('Fill current and new password');
      }

      // 🛑 Password Length Validation
      if (newPassword.length < 6) {
        return showToast('New password must be at least 6 characters');
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword('');
      setNewPassword('');
      showToast('Password updated securely');
    } catch (error: any) {
      showToast(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔔 Modern Toast */}
      {toast && (
        <View style={styles.toast}>
          <Ionicons name="information-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      {/* 📧 Email Change Confirmation Modal */}
      <Modal visible={showEmailModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Email Change</Text>
            <Text style={styles.modalSub}>
              For your security, please enter your current password to update your email address.
            </Text>
            
            <View style={[styles.modalInput, { flexDirection: 'row', alignItems: 'center', padding: 0 }]}>
              <TextInput
                style={{ flex: 1, padding: 14, fontSize: 15, color: '#333' }}
                placeholder="Current Password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity 
                style={{ padding: 14 }} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#64748b" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelBtn} 
                onPress={() => {
                  setShowEmailModal(false);
                  setConfirmPassword('');
                  setShowConfirmPassword(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmEmailChangeAndSave}>
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('../more')}>
          <Ionicons name="arrow-back" size={24} color="#1d50a2" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Ionicons name={isEditing ? 'close' : 'create-outline'} size={22} color="#1d50a2" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* PROFILE IMAGE */}
        <TouchableOpacity style={styles.profileWrapper} onPress={pickImage} disabled={!isEditing}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome5 name="user" size={40} color="#88a9d6" />
            </View>
          )}
          {isEditing && <Text style={styles.changePhoto}>Change Photo</Text>}
        </TouchableOpacity>

        {/* FULL NAME (Display mostly, but editable if requested) */}
        {isEditing ? (
          <TextInput 
            style={[styles.input, { textAlign: 'center', fontSize: 20, fontWeight: '700' }]} 
            value={fullName} 
            onChangeText={(text) => setFullName(text.replace(/[^a-zA-Z\s]/g, ''))} 
            placeholder="Full Name" 
            maxLength={20}
          />
        ) : (
          <Text style={styles.name}>{fullName || 'Resident User'}</Text>
        )}

        {/* PERSONAL INFO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Info</Text>

          <Text style={styles.label}>Username</Text>
          {isEditing ? (
            <TextInput 
              style={styles.input} 
              value={username} 
              onChangeText={setUsername} 
              placeholder="Username" 
              maxLength={20}
            />
          ) : (
            <Text style={styles.value}>@{username || '—'}</Text>
          )}

          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              placeholder="Email" 
              keyboardType="email-address" 
              autoCapitalize="none" 
            />
          ) : (
            <Text style={styles.value}>{email}</Text>
          )}

          <Text style={styles.label}>Phone</Text>
          {isEditing ? (
            <TextInput 
              style={styles.input} 
              value={phone} 
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))} 
              placeholder="Phone (e.g. 09123456789)" 
              keyboardType="number-pad"
              maxLength={11}
            />
          ) : (
            <Text style={styles.value}>{phone || '—'}</Text>
          )}

          <Text style={styles.label}>Barangay</Text>
          {isEditing ? (
            <TextInput style={styles.input} value={barangay} onChangeText={setBarangay} placeholder="Barangay" />
          ) : (
            <Text style={styles.value}>{barangay || '—'}</Text>
          )}
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
            <Text style={styles.primaryText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* SECURITY */}
        {!isEditing && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Security</Text>

            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="New Password (min 6 chars)"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleChangePassword}>
              <Text style={styles.primaryText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}