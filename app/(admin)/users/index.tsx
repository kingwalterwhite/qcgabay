// QCGabay/app/(admin)/users/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { getAuth } from 'firebase/auth';
import {
  collection as fsCollection,
  deleteDoc as fsDeleteDoc,
  doc as fsDoc,
  getDocs as fsGetDocs,
  onSnapshot as fsOnSnapshot,
  setDoc as fsSetDoc,
  updateDoc
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform /* ...other imports */,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebaseConfig';
import { styles } from './styles';
const auth = getAuth();

const formatDate = (timestamp: any): string => {
  if (!timestamp) return "N/A";

  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  if (timestamp instanceof Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  }

  return "N/A";
};

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [username, setUsername] = useState(''); // ✅ Added username
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [barangay, setBarangay] = useState('');
  const [password, setPassword] = useState('');

  // Notification State
  const [notification, setNotification] = useState('');
  const [notifAnim] = useState(new Animated.Value(0));

  // Confirmation Modal State
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});

  const showNotification = (message: string) => {
    setNotification(message);
    notifAnim.setValue(0);
    Animated.sequence([
      Animated.timing(notifAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(notifAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setNotification(''));
  };

  const showConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => action);
    setConfirmVisible(true);
  };

  const checkAdmin = () => {
    const user = auth.currentUser;
    if (!(user && user.email === 'admin@gmail.com')) {
      showNotification('Access Denied: Admin privileges required.');
      return false;
    }
    return true;
  };

  // Auto-listen to database changes
  useEffect(() => {
    const unsub = fsOnSnapshot(fsCollection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
      setLoading(false);

      // Keep selection valid
      const ids = new Set(data.map((u) => u.id));
      setSelectedIds((prev) => prev.filter((id) => ids.has(id)));
    });
    return () => unsub();
  }, []);

  // Manual refresh logic
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const snapshot = await fsGetDocs(fsCollection(db, 'users'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      showNotification('Failed to refresh users.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSave = async () => {
    if (!checkAdmin()) return;

    // 🛑 VALIDATIONS
    if (!fullName.trim() || !email.trim()) {
      return showNotification('Full Name and Email are required.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showNotification('Please enter a valid email address.');
    }
    const phoneRegex = /^\d{11}$/;
    if (phone && !phoneRegex.test(phone)) {
      return showNotification('Phone number must be exactly 11 digits.');
    }
    if (password && password.length < 6) {
      return showNotification('Password must be at least 6 characters.');
    }

    try {
      const id = editingId || Date.now().toString();
      
      // ✅ Added username to payload
      const userData: any = { username, fullName, email, phone, barangay };
      if (password) userData.password = password;

      if (editingId) {
        userData.updatedAt = new Date();
        await updateDoc(fsDoc(db, 'users', id), userData);
        showNotification(`Updated ${fullName}`);
      } else {
        userData.createdAt = new Date();
        await fsSetDoc(fsDoc(db, 'users', id), userData);
        showNotification(`Created user ${fullName}`);
      }
      
      setModalVisible(false);
      resetForm();
    } catch (error: any) {
      showNotification(error.message || 'Could not save user');
    }
  };

  const handleDelete = (id: string) => {
    if (!checkAdmin()) return;

    const userToDelete = users.find((u) => u.id === id);
    const name = userToDelete ? userToDelete.fullName : 'User';

    showConfirm(`Are you sure you want to delete user account "${name}"?`, async () => {
      try {
        await fsDeleteDoc(fsDoc(db, 'users', id));
        showNotification(`Deleted user "${name}"`);
        setSelectedIds((prev) => prev.filter((x) => x !== id));
      } catch (error: any) {
        showNotification(error.message || 'Could not delete user.');
      }
    });
  };

  const handleBulkDelete = () => {
    if (!checkAdmin() || !selectedIds.length) return;

    showConfirm(`Delete ${selectedIds.length} selected users?`, async () => {
      try {
        await Promise.all(selectedIds.map((id) => fsDeleteDoc(fsDoc(db, 'users', id))));
        showNotification(`Deleted ${selectedIds.length} users`);
        setSelectedIds([]);
      } catch (error: any) {
        showNotification(error.message || 'Could not delete users.');
      }
    });
  };

  const handleDuplicate = async (item: any) => {
    if (!checkAdmin()) return;
    const { id, createdAt, updatedAt, ...rest } = item;
    
    try {
      const newId = Date.now().toString();
      await fsSetDoc(fsDoc(db, 'users', newId), {
        ...rest,
        fullName: `${item.fullName || 'User'} (Copy)`,
        createdAt: new Date(),
      });
      showNotification(`Duplicated ${item.fullName || 'User'}`);
    } catch (error: any) {
      showNotification(error.message || 'Could not duplicate user');
    }
  };

  const openEditModal = (user: any) => {
    setEditingId(user.id);
    setUsername(user.username || ''); // ✅ Populating username
    setFullName(user.fullName || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setBarangay(user.barangay || '');
    setPassword(user.password || ''); 
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setUsername(''); // ✅ Reset username
    setFullName('');
    setEmail('');
    setPhone('');
    setBarangay('');
    setPassword('');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredUsers = users.filter(u => 
    (u.fullName?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (u.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.username?.toLowerCase() || '').includes(search.toLowerCase()) // ✅ Added to search
  );

  const allSelected = filteredUsers.length > 0 && filteredUsers.every((i) => selectedIds.includes(i.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((i) => i.id));
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Notification */}
      {notification ? (
        <Animated.View
          style={[
            styles.notification,
            {
              opacity: notifAnim,
              transform: [
                {
                  translateY: notifAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.notificationContent}>
            <Ionicons name="information-circle" size={20} color="#1d50a2" />
            <Text style={styles.notificationText}>{notification}</Text>
          </View>
        </Animated.View>
      ) : null}

       <Tabs.Screen
              options={{
                headerTitle: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image 
                      source={require("../../../assets/images/logo.png")} 
                      style={{ width: 70, height: 70, marginRight: 10, resizeMode: 'contain' }} 
                    />
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>User Accounts</Text>
                  </View>
                ),
                headerRight: () => (
                  <TouchableOpacity onPress={handleRefresh} style={{ marginRight: 15 }}>
                    {isRefreshing ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="refresh" size={24} color="#fff" />
                    )}
                  </TouchableOpacity>
                ),
              }}
            />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search Users..." 
          value={search} 
          onChangeText={setSearch} 
        />
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={() => { resetForm(); setModalVisible(true); }}>
        <Text style={styles.addButtonText}>+ Add New User</Text>
      </TouchableOpacity>

      {/* Bulk Actions */}
      <View style={styles.bulkActionsRow}>
        <TouchableOpacity style={styles.selectAllButton} onPress={toggleSelectAll}>
          <Ionicons name={allSelected ? 'checkbox' : 'square-outline'} size={18} color="#1d50a2" />
          <Text style={styles.selectAllText}>Select All</Text>
        </TouchableOpacity>

        <View style={styles.bulkButtonsRight}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleRefresh}>
            {isRefreshing ? (
              <ActivityIndicator size="small" color="#1d50a2" />
            ) : (
              <>
                <Ionicons name="refresh" size={16} color="#1d50a2" />
                <Text style={styles.secondaryButtonText}>Refresh</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, !selectedIds.length && styles.disabledButton]}
            onPress={handleBulkDelete}
            disabled={!selectedIds.length}
          >
            <Ionicons name="trash" size={16} color="#fff" />
            <Text style={styles.dangerButtonText}>Delete ({selectedIds.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.checkboxWrap}>
              <Ionicons
                name={selectedIds.includes(item.id) ? 'checkbox' : 'square-outline'}
                size={20}
                color="#1d50a2"
              />
            </TouchableOpacity>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.fullName || 'No Name'} {item.username ? `(@${item.username})` : ''}</Text>
              <Text style={styles.cardSubtitle}>{item.email}</Text>
              <Text style={styles.cardSubtitle}>{item.phone || 'No Phone'} • {item.barangay || 'No Brgy'}</Text>
              
              <Text style={styles.createdText}>📅 Created: {formatDate(item.createdAt)}</Text>
              {item.updatedAt && (
                <Text style={styles.updatedText}>✏️ Updated: {formatDate(item.updatedAt)}</Text>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => handleDuplicate(item)} style={styles.iconBtn}>
                <Ionicons name="copy" size={20} color="#5bc0de" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
                <Ionicons name="pencil" size={20} color="#f0ad4e" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconBtn}>
                <Ionicons name="trash" size={20} color="#d9534f" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Delete Confirmation Modal */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmContainer}>
            <Text style={styles.confirmMessage}>{confirmMessage}</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.cancelBtn, { flex: 1, marginRight: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dangerButton, { flex: 1, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => {
                  setConfirmVisible(false);
                  onConfirmAction();
                }}
              >
                <Text style={styles.btnTextWhite}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

     {/* Form Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.modalContent}
          >
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            >
              <Text style={styles.modalTitle}>{editingId ? 'Edit User' : 'Add User'}</Text>

              
<View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>
                  Username
                </Text>
                <TextInput style={styles.input} placeholder="Enter Username..." value={username} onChangeText={setUsername} />
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>
                  Full Name
                </Text>
                <TextInput style={styles.input} placeholder="Enter Full Name..." value={fullName} onChangeText={setFullName} />
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>
                  Email
                </Text>
                <TextInput style={styles.input} placeholder="Enter Email..." value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>
                  Phone
                </Text>
                <TextInput style={styles.input} placeholder="Enter Phone (11 digits)..." value={phone} onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))} keyboardType="number-pad" maxLength={11} />
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>
                  Barangay
                </Text>
                <TextInput style={styles.input} placeholder="Enter Barangay..." value={barangay} onChangeText={setBarangay} />
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>
                  Password
                </Text>
                <TextInput style={styles.input} placeholder="Enter Password (min 6 chars)..." value={password} onChangeText={setPassword} secureTextEntry />
              </View>


              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                  <Text style={styles.btnTextWhite}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}