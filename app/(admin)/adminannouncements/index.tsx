// QCGabay/app/(admin)/adminannouncements/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList, Image, Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { styles } from "./styles";

const formatTimestamp = (timestamp: any): string => {
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

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  
  // Target location state
  const [targetBarangay, setTargetBarangay] = useState("All Barangay");
  const [showDropdown, setShowDropdown] = useState(false);

  const [notification, setNotification] = useState('');
  const [notifAnim] = useState(new Animated.Value(0));
  
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});

  const showNotification = (message: string) => {
    setNotification(message);
    notifAnim.setValue(0);

    Animated.sequence([
      Animated.timing(notifAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(notifAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setNotification(''));
  };

  const ensureAdminSession = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Login Required", "Please log in before posting announcements.");
      return false;
    }
    try {
      const tokenResult = await user.getIdTokenResult(true);
      const tokenEmail = (tokenResult.claims.email as string | undefined)?.toLowerCase();
      if (tokenEmail !== "admin@gmail.com") {
        Alert.alert(
          "Admin Only",
          "Only admin@gmail.com can create, duplicate, edit, or delete announcements."
        );
        return false;
      }
      return true;
    } catch (error: any) {
      Alert.alert(
        "Auth Error",
        `${error?.code || "unknown"}: ${error?.message || "Could not validate your login session."}`
      );
      return false;
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "announcements"),
      (snapshot) => {
        const nextAnnouncements = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(nextAnnouncements);

        const existingIds = new Set(nextAnnouncements.map((item) => item.id));
        setSelectedIds((prev) => prev.filter((id) => existingIds.has(id)));
      },
      (error) => {
        Alert.alert("Firestore Read Error", `${error.code || "unknown"}: ${error.message}`);
      }
    );
    return () => unsub();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const snapshot = await getDocs(collection(db, "announcements"));
      setAnnouncements(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      Alert.alert("Error", "Failed to refresh announcements.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Multi-select logic for barangay
  const handleBarangaySelect = (brgy: string) => {
    const currentStr = targetBarangay || 'All Barangay';
    let currentSelected = currentStr.split(', ');

    if (brgy === 'All Barangay') {
      setTargetBarangay('All Barangay');
    } else {
      // Remove 'All Barangay' if selecting a specific one
      let nextSelected = currentSelected.filter((b) => b !== 'All Barangay');
      
      if (nextSelected.includes(brgy)) {
        // Deselect
        nextSelected = nextSelected.filter((b) => b !== brgy);
      } else {
        // Select
        nextSelected.push(brgy);
      }

      // If nothing is selected, revert back to All Barangay
      if (nextSelected.length === 0) {
        setTargetBarangay('All Barangay');
      } else {
        setTargetBarangay(nextSelected.join(', '));
      }
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      return Alert.alert("Validation Error", "Title and Body are required.");
    }
    const canWrite = await ensureAdminSession();
    if (!canWrite || !auth.currentUser) return;

    setIsSaving(true);
    try {
      const id = editingId || Date.now().toString();
      const payload: any = {
        title: title.trim(),
        body: body.trim(),
        targetBarangay: targetBarangay, // Append location setting
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid,
      };
      if (!editingId) {
        payload.createdAt = serverTimestamp();
        payload.createdBy = auth.currentUser.uid;
      }

      await setDoc(doc(db, "announcements", id), payload, { merge: true });

      const successMessage = editingId
        ? `Updated announcement "${title}"`
        : `Created announcement "${title}"`;

      showNotification(successMessage);

      setModalVisible(false);
      setShowDropdown(false);
      resetForm();
    } catch (error: any) {
      Alert.alert(
        "Firestore Write Error",
        `${error.code || "unknown"}: ${error.message || "Could not save announcement"}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    const runDelete = async () => {
      const canWrite = await ensureAdminSession();
      if (!canWrite) return;

      try {
        const deletedItem = announcements.find((a) => a.id === id);
        const itemTitle = deletedItem ? deletedItem.title : "Announcement";

        await deleteDoc(doc(db, "announcements", id));
        setSelectedIds((prev) => prev.filter((x) => x !== id));
        showNotification(`Deleted announcement "${itemTitle}"`);
      } catch (error: any) {
        Alert.alert(
          "Firestore Delete Error",
          `${error.code || "unknown"}: ${error.message || "Could not delete announcement."}`
        );
      }
    };

    setConfirmMessage("Are you sure you want to delete this announcement?");
    setOnConfirmAction(() => runDelete);
    setConfirmVisible(true);
  };

  const handleDuplicate = async (item: any) => {
    const canWrite = await ensureAdminSession();
    if (!canWrite || !auth.currentUser) return;

    try {
      const newId = Date.now().toString();
      const newAnnouncement = {
        title: `${item.title || "Untitled"} (Copy)`,
        body: item.body || "",
        targetBarangay: item.targetBarangay || "All Barangay", // Ensure copies keep settings
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        updatedBy: auth.currentUser.uid,
      };

      await setDoc(doc(db, "announcements", newId), newAnnouncement);
      showNotification(`Duplicated announcement "${item.title || "Untitled"}"`);
    } catch (error: any) {
      Alert.alert(
        "Firestore Write Error",
        `${error.code || "unknown"}: ${error.message || "Could not duplicate announcement"}`
      );
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setBody(item.body || "");
    setTargetBarangay(item.targetBarangay || "All Barangay"); // Populate previous setting
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setBody("");
    setTargetBarangay("All Barangay");
    setShowDropdown(false);
  };

  const filtered = announcements.filter((a) =>
    (a.title?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((item) => selectedIds.includes(item.id));

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filtered.map((item) => item.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
      return;
    }
    setSelectedIds((prev) => {
      const merged = new Set(prev);
      filtered.forEach((item) => merged.add(item.id));
      return Array.from(merged);
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    const runBulkDelete = async () => {
      const canWrite = await ensureAdminSession();
      if (!canWrite) return;

      const idsToDelete = [...selectedIds];
      setIsDeletingSelected(true);
      try {
        await Promise.all(idsToDelete.map((id) => deleteDoc(doc(db, "announcements", id))));
        setSelectedIds([]);
        showNotification(`Deleted ${idsToDelete.length} announcement(s)`);
      } catch (error: any) {
        Alert.alert(
          "Firestore Delete Error",
          `${error.code || "unknown"}: ${error.message || "Could not delete selected announcements"}`
        );
      } finally {
        setIsDeletingSelected(false);
      }
    };

    setConfirmMessage(`Delete ${selectedIds.length} selected announcement(s)?`);
    setOnConfirmAction(() => runBulkDelete);
    setConfirmVisible(true);
  };

  const currentSelectedBarangays = (targetBarangay || 'All Barangay').split(', ');
  const availableBarangays = ['Bungad', 'Veterans'];

  return (
    <View style={styles.container}>
      {notification ? (
        <Animated.View
          style={[
            styles.notification,
            {
              opacity: notifAnim,
              transform: [
                {
                  translateY: notifAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }),
                },
              ],
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
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Announcements</Text>
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
          placeholder="Search Announcements..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => { resetForm(); setModalVisible(true); }}
      >
        <Text style={styles.addButtonText}>+ Add New Announcement</Text>
      </TouchableOpacity>

      <View style={styles.bulkActionsRow}>
        <TouchableOpacity style={styles.selectAllButton} onPress={toggleSelectAllFiltered}>
          <Ionicons name={allFilteredSelected ? "checkbox" : "square-outline"} size={18} color="#1d50a2" />
          <Text style={styles.selectAllText}>Select All</Text>
        </TouchableOpacity>

        <View style={styles.bulkButtonsRight}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleRefresh}>
            {isRefreshing ? <ActivityIndicator size="small" color="#1d50a2" /> : <>
              <Ionicons name="refresh" size={16} color="#1d50a2" />
              <Text style={styles.secondaryButtonText}>Refresh</Text>
            </>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, (selectedIds.length === 0 || isDeletingSelected) && styles.disabledButton]}
            onPress={handleDeleteSelected}
            disabled={selectedIds.length === 0 || isDeletingSelected}
          >
            {isDeletingSelected ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="trash" size={16} color="#fff" />}
            <Text style={styles.dangerButtonText}>
              {isDeletingSelected ? "Deleting..." : `Delete (${selectedIds.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.checkboxWrap} onPress={() => toggleSelect(item.id)}>
              <Ionicons
                name={selectedIds.includes(item.id) ? "checkbox" : "square-outline"}
                size={22}
                color={selectedIds.includes(item.id) ? "#1d50a2" : "#999"}
              />
            </TouchableOpacity>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              
              {/* Display Target Tag */}
              <Text style={{fontSize: 12, color: '#1d50a2', fontWeight: 'bold', marginVertical: 2}}>
                📍 Target: {item.targetBarangay || 'All Barangay'}
              </Text>
              
              <Text style={styles.cardSubtitle} numberOfLines={1}>{item.body}</Text>
              <View style={styles.timestampContainer}>
                <Text style={styles.createdText}>📅 Created: {formatTimestamp(item.createdAt)}</Text>
                {item.updatedAt && item.updatedAt !== item.createdAt && (
                  <Text style={styles.updatedText}>✏️ Updated: {formatTimestamp(item.updatedAt)}</Text>
                )}
              </View>
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

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmContainer}>
            <Text style={styles.confirmMessage}>{confirmMessage}</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.cancelBtn, { flex: 1, marginRight: 5 }]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={[styles.btnText, styles.confirmButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dangerButton, { flex: 1, marginLeft: 5 }]}
                onPress={() => {
                  setConfirmVisible(false);
                  onConfirmAction();
                }}
              >
                <Text style={[styles.btnTextWhite, styles.confirmButtonText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>
              <Text style={styles.modalTitle}>{editingId ? "Edit Announcement" : "Add Announcement"}</Text>

<View>
  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>
    Title
  </Text>
  <TextInput 
    style={styles.input} 
    placeholder="Enter Title..." 
    value={title} 
    onChangeText={setTitle} 
  />
</View>

              <Text style={{fontWeight: 'bold', marginBottom: 5, color: '#333'}}>Target Location:</Text>
              
              {/* Display Selected Barangays Above */}
              <View style={styles.chipContainer}>
                {currentSelectedBarangays.map((brgy) => (
                  <View key={brgy} style={styles.chip}>
                    <Text style={styles.chipText}>{brgy}</Text>
                  </View>
                ))}
              </View>

              {/* Dropdown Toggle Button */}
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={[styles.dropdownToggle, { marginBottom: showDropdown ? 5 : 15 }]}
              >
                <Text style={{ color: '#333' }}>Select Target Barangay...</Text>
                <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
              </TouchableOpacity>

              {/* Dropdown Multi-Select List */}
              {showDropdown && (
                <View style={styles.dropdownList}>
                  <TouchableOpacity
                    onPress={() => handleBarangaySelect('All Barangay')}
                    style={styles.dropdownItem}
                  >
                    <Ionicons 
                      name={currentSelectedBarangays.includes('All Barangay') ? 'checkbox' : 'square-outline'} 
                      size={20} 
                      color="#1d50a2" 
                    />
                    <Text style={{ marginLeft: 10, color: '#333' }}>All Barangay</Text>
                  </TouchableOpacity>

                  {availableBarangays.map((brgy) => (
                    <TouchableOpacity
                      key={brgy}
                      onPress={() => handleBarangaySelect(brgy)}
                      style={styles.dropdownItem}
                    >
                      <Ionicons 
                        name={currentSelectedBarangays.includes(brgy) ? 'checkbox' : 'square-outline'} 
                        size={20} 
                        color="#1d50a2" 
                      />
                      <Text style={{ marginLeft: 10, color: '#333' }}>{brgy}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

<View>
  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>
    Description
  </Text>
  <TextInput 
    style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
    placeholder="Enter Body..." 
    value={body} 
    onChangeText={setBody} 
    multiline 
  />
</View>              
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, isSaving && { opacity: 0.6 }]} disabled={isSaving}>
                  <Text style={styles.btnTextWhite}>{isSaving ? "Saving..." : "Save"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}