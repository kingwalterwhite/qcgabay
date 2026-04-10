// QCGabay/app/(admin)/admininquiries/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebaseConfig';
import { styles } from './styles';

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

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Inquiry');
  const [date, setDate] = useState('');
  const [color, setColor] = useState('#2D5A27');
  const [requirements, setRequirements] = useState('');
  const [process, setProcess] = useState('');

  // Notification & Confirm Modal State
  const [notification, setNotification] = useState('');
  const [notifAnim] = useState(new Animated.Value(0));
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

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(data);
      setLoading(false);

      // keep selection valid
      const ids = new Set(data.map((e) => e.id));
      setSelectedIds((prev) => prev.filter((id) => ids.has(id)));
    });
    return () => unsub();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleSave = async () => {
    if (!title.trim() || !requirements.trim()) {
      Alert.alert('Error', 'Title and Requirements are required.');
      return;
    }

    try {
      const id = editingId || Date.now().toString();
      const payload: any = { title, category, date, color, requirements, process };

      if (editingId) {
        payload.updatedAt = new Date();
        await updateDoc(doc(db, 'inquiries', id), payload);
        showNotification(`Updated ${title}`);
      } else {
        payload.createdAt = new Date();
        await setDoc(doc(db, 'inquiries', id), payload);
        showNotification(`Created ${title}`);
      }
      
      setModalVisible(false);
      resetForm();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = (id: string) => {
    const inquiryToDelete = inquiries.find((i) => i.id === id);
    const delTitle = inquiryToDelete ? inquiryToDelete.title : 'Information';

    showConfirm(`Are you sure you want to delete "${delTitle}"?`, async () => {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
        showNotification(`Deleted "${delTitle}"`);
        setSelectedIds((prev) => prev.filter((x) => x !== id));
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    });
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;

    showConfirm(`Delete ${selectedIds.length} selected items?`, async () => {
      await Promise.all(selectedIds.map((id) => deleteDoc(doc(db, 'inquiries', id))));
      showNotification(`Deleted ${selectedIds.length} items`);
      setSelectedIds([]);
    });
  };

  const handleDuplicate = async (item: any) => {
    const id = Date.now().toString();
    const { id: _, ...rest } = item;
    await setDoc(doc(db, 'inquiries', id), {
      ...rest,
      title: `${item.title} (Copy)`,
      createdAt: new Date(),
    });
    showNotification(`Duplicated ${item.title}`);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || '');
    setCategory(item.category || 'Inquiry');
    setDate(item.date || '');
    setColor(item.color || '#2D5A27');
    setRequirements(item.requirements || '');
    setProcess(item.process || '');
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Inquiry');
    setDate('');
    setColor('#2D5A27');
    setRequirements('');
    setProcess('');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = inquiries.filter(i => (i.title?.toLowerCase() || '').includes(search.toLowerCase()));

  const allSelected = filtered.length > 0 && filtered.every((i) => selectedIds.includes(i.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((i) => i.id));
    }
  };

  return (
    <View style={styles.container}>
      {/* Notification */}
      {notification ? (
        <Animated.View
          style={[
            styles.notification,
            {
              opacity: notifAnim,
              transform: [{ translateY: notifAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
            },
          ]}
        >
          <View style={styles.notificationContent}>
            <Ionicons name="checkmark-circle" size={20} color="#4BB543" />
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
                   <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Inquiries</Text>
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
        <TextInput style={styles.searchInput} placeholder="Search Inquiries..." value={search} onChangeText={setSearch} />
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={() => { resetForm(); setModalVisible(true); }}>
        <Text style={styles.addButtonText}>+ Add New Information</Text>
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
        data={filtered}
        keyExtractor={item => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.checkboxWrap}>
              <Ionicons name={selectedIds.includes(item.id) ? 'checkbox' : 'square-outline'} size={20} color="#1d50a2" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.category} • {item.date}</Text>
              
              <Text style={styles.createdText}>📅 Created: {formatDate(item.createdAt)}</Text>
              {item.updatedAt && (
                <Text style={styles.updatedText}>✏️ Updated: {formatDate(item.updatedAt)}</Text>
              )}
            </View>
            
            <View style={styles.actions}>
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
              <TouchableOpacity style={[styles.cancelBtn, { flex: 1, marginRight: 5 }]} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dangerButton, { flex: 1, marginLeft: 5, paddingVertical: 15, alignItems: 'center' }]}
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
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Information' : 'Add Information'}</Text>

              <Text style={styles.label}>Title</Text>
              <TextInput style={styles.input} placeholder="e.g. Getting a First Time Job Seeker Cert" value={title} onChangeText={setTitle} />
              
              <Text style={styles.label}>Category</Text>
              <TextInput style={styles.input} placeholder="e.g. Inquiry" value={category} onChangeText={setCategory} />
              
              <Text style={styles.label}>Schedule / Date </Text>
              <TextInput style={styles.input} placeholder="e.g. 9:00AM - 5:00PM" value={date} onChangeText={setDate} />

              <Text style={styles.label}>Requirements</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="List the requirements here..." value={requirements} onChangeText={setRequirements} multiline textAlignVertical="top" />

              <Text style={styles.label}>Step-by-Step Process</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="List the steps here..." value={process} onChangeText={setProcess} multiline textAlignVertical="top" />

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