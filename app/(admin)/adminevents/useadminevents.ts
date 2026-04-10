// qcgabay/app/(admin)/adminevents/useadminevents.ts

import { getAuth } from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { db } from '../../firebaseConfig';

const auth = getAuth();

export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const initialForm = {
  title: '',
  what: '',
  when: '',
  where: '',
  why: '',
  requirements: '',
  startDate: '',
  endDate: '',
  description: '',
  barangay: 'All Barangay', 
  eventDate: '', 
};

export const formatDate = (timestamp: any): string => {
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

export const formatForDB = (y: number, m: number, d: number) => {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};

export const getTimestampTime = (timestamp: any): number => {
  if (!timestamp) return 0;
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate().getTime();
  }
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  return new Date(timestamp).getTime() || 0;
};

export function useAdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...initialForm });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());

  const pickerDaysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const pickerFirstDayOfMonth = new Date(pickerYear, pickerMonth, 1).getDay(); 
  const pickerBlanks = Array.from({ length: pickerFirstDayOfMonth }, (_, i) => i);
  const pickerDays = Array.from({ length: pickerDaysInMonth }, (_, i) => i + 1);

  // --- SYNC TO CALENDAR STATES ---
  const [syncModalVisible, setSyncModalVisible] = useState(false);
  const [eventToSync, setEventToSync] = useState<any>(null);
  const [syncDate, setSyncDate] = useState(new Date());
  const [syncViewYear, setSyncViewYear] = useState(new Date().getFullYear());
  const [syncViewMonth, setSyncViewMonth] = useState(new Date().getMonth());

  const syncDaysInMonth = new Date(syncViewYear, syncViewMonth + 1, 0).getDate();
  const syncFirstDayOfMonth = new Date(syncViewYear, syncViewMonth, 1).getDay();
  const syncBlanks = Array.from({ length: syncFirstDayOfMonth }, (_, i) => i);
  const syncDays = Array.from({ length: syncDaysInMonth }, (_, i) => i + 1);

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
  
  const checkAdmin = () => {
    const user = auth.currentUser;
    return user && user.email === 'admin@gmail.com';
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
      setLoading(false);
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

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBarangaySelect = (brgy: string) => {
    const currentStr = form.barangay || 'All Barangay';
    let currentSelected = currentStr.split(', ');

    if (brgy === 'All Barangay') {
      updateField('barangay', 'All Barangay');
    } else {
      let nextSelected = currentSelected.filter((b) => b !== 'All Barangay');
      if (nextSelected.includes(brgy)) {
        nextSelected = nextSelected.filter((b) => b !== brgy);
      } else {
        nextSelected.push(brgy);
      }
      if (nextSelected.length === 0) {
        updateField('barangay', 'All Barangay');
      } else {
        updateField('barangay', nextSelected.join(', '));
      }
    }
  };

  // --- UPDATED HANDLESAVE WITH AUTO-SYNC LOGIC ---
  const handleSave = async () => {
    if (!checkAdmin()) return;
    if (!form.title.trim()) return;

    let currentEventId = editingId;

    if (editingId) {
      await updateDoc(doc(db, 'events', editingId), {
        ...form,
        updatedAt: new Date(),
      });
      showNotification(`Updated ${form.title}`);
    } else {
      // It's a new event, create it and grab the new ID
      const docRef = await addDoc(collection(db, 'events'), {
        ...form,
        createdAt: new Date(),
      });
      currentEventId = docRef.id;
      showNotification(`Created ${form.title}`);
    }

    // Auto-sync logic if a date was picked but not officially synced yet
    if (form.eventDate && !(form as any).isSynced) {
      try {
        const calendarPayload = {
          title: form.title,
          description: form.description || form.what || '',
          barangay: form.barangay || 'All Barangay',
          eventDate: form.eventDate,
          linkedEventId: currentEventId, 
          createdAt: new Date(),
        };
        const calDocRef = await addDoc(collection(db, 'calendar'), calendarPayload);
        
        await updateDoc(doc(db, 'events', currentEventId!), {
          isSynced: true,
          syncedCalendarId: calDocRef.id
        });
      } catch (e) {
        console.error("Auto-sync failed:", e);
      }
    }

    setModalVisible(false);
    setShowDropdown(false);
    setEditingId(null);
    setForm({ ...initialForm });
  };

  const handleDelete = (id: string) => {
    if (!checkAdmin()) return;
    const eventToDelete = events.find((e) => e.id === id);
    const title = eventToDelete ? eventToDelete.title : 'Event';

    showConfirm(`Are you sure you want to delete event "${title}"?`, async () => {
      await deleteDoc(doc(db, 'events', id));
      showNotification(`Deleted event "${title}"`);
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    });
  };

  const handleDuplicate = async (item: any) => {
    if (!checkAdmin()) return;
    const { id, ...rest } = item;
    await addDoc(collection(db, 'events'), {
      ...rest,
      title: `${item.title} (Copy)`,
      createdAt: new Date(),
    });
    showNotification(`Duplicated ${item.title}`);
  };

  const handleBulkDelete = () => {
    if (!checkAdmin() || !selectedIds.length) return;

    showConfirm(`Delete ${selectedIds.length} selected events?`, async () => {
      await Promise.all(selectedIds.map((id) => deleteDoc(doc(db, 'events', id))));
      showNotification(`Deleted ${selectedIds.length} events`);
      setSelectedIds([]);
    });
  };

  // --- CALENDAR SYNC LOGIC ---

  const openSyncModal = (item: any) => {
    setEventToSync(item);
    setSyncDate(new Date()); 
    setSyncViewYear(new Date().getFullYear());
    setSyncViewMonth(new Date().getMonth());
    setSyncModalVisible(true);
  };

  const handleSyncDayPress = (dayNum: number) => {
    setSyncDate(new Date(syncViewYear, syncViewMonth, dayNum));
  };

  const confirmSync = async () => {
    if (!checkAdmin() || !eventToSync) return;

    try {
      const formattedSyncDate = formatForDB(syncDate.getFullYear(), syncDate.getMonth(), syncDate.getDate());

      // 1. Create a lightweight version for the calendar collection
      const calendarPayload = {
        title: eventToSync.title,
        description: eventToSync.description || eventToSync.what || '', // Fallback to 'what' if description empty
        barangay: eventToSync.barangay || 'All Barangay',
        eventDate: formattedSyncDate,
        linkedEventId: eventToSync.id, // Keeps them "connected"
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'calendar'), calendarPayload);

      // 2. Mark original event as synced and attach the target date 
      await updateDoc(doc(db, 'events', eventToSync.id), {
        isSynced: true,
        syncedCalendarId: docRef.id,
        eventDate: formattedSyncDate 
      });

      showNotification(`Synced "${eventToSync.title}" to calendar!`);
      setSyncModalVisible(false);
      setEventToSync(null);
    } catch (error: any) {
      console.error('Could not sync to calendar:', error);
      showNotification(`Error syncing: ${error.message}`);
    }
  };

  // --- NEW: FORM DATE PICKER SYNC LOGIC ---
  const confirmFormDateAndSync = async () => {
    if (!form.eventDate) {
      setDatePickerVisible(false);
      return;
    }

    // If we are editing an EXISTING event, sync it right now.
    if (editingId) {
      try {
        const calendarPayload = {
          title: form.title || 'Untitled Event',
          description: form.description || form.what || '',
          barangay: form.barangay || 'All Barangay',
          eventDate: form.eventDate,
          linkedEventId: editingId,
          createdAt: new Date(),
        };

        const docRef = await addDoc(collection(db, 'calendar'), calendarPayload);

        await updateDoc(doc(db, 'events', editingId), {
          isSynced: true,
          syncedCalendarId: docRef.id,
          eventDate: form.eventDate 
        });

        // Update local form state so the UI knows it's synced
        setForm(prev => ({ ...prev, isSynced: true }));
        showNotification(`Date confirmed and synced to calendar!`);
      } catch (error: any) {
        showNotification(`Error syncing: ${error.message}`);
      }
    } else {
      // If it's a NEW event, we can't sync it until they press "Save" and it gets an ID.
      showNotification("Date confirmed! It will automatically sync when you click Save.");
    }
    
    setDatePickerVisible(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = events.filter((e) =>
    (e.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const allSelected =
    filtered.length > 0 && filtered.every((i) => selectedIds.includes(i.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((i) => i.id));
    }
  };

  const currentSelectedBarangays = (form.barangay || 'All Barangay').split(', ');
  const availableBarangays = ['Bungad', 'Veterans'];

  return {
    selectedIds, search, setSearch, modalVisible, setModalVisible,
    setEditingId, form, setForm, isRefreshing, showDropdown, setShowDropdown,
    datePickerVisible, setDatePickerVisible, pickerYear, setPickerYear,
    pickerMonth, setPickerMonth, pickerDaysInMonth, pickerFirstDayOfMonth,
    pickerBlanks, pickerDays, notification, notifAnim, confirmVisible,
    setConfirmVisible, confirmMessage, onConfirmAction, currentSelectedBarangays,
    availableBarangays, filtered, allSelected,
    
    syncModalVisible, setSyncModalVisible, eventToSync, syncDate, setSyncDate,
    syncViewYear, setSyncViewYear, syncViewMonth, setSyncViewMonth,
    syncDaysInMonth, syncFirstDayOfMonth, syncBlanks, syncDays,
    
    handleRefresh, updateField, handleBarangaySelect, handleSave, handleDelete,
    handleDuplicate, toggleSelect, toggleSelectAll, handleBulkDelete,
    openSyncModal, handleSyncDayPress, confirmSync, confirmFormDateAndSync
  };
}