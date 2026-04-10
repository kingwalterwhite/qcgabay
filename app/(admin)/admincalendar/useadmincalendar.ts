// qcgabay/app/(admin)/admincalendar/useadmincalendar.ts

import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { db } from '../../firebaseConfig';

const initialForm = { title: '', description: '', barangay: 'All Barangay' };

export const useAdminCalendar = () => {
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [activePicker, setActivePicker] = useState<'day' | 'month' | 'year' | null>(null);
  
  const [filterDay, setFilterDay] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [notification, setNotification] = useState('');
  const [notifAnim] = useState(new Animated.Value(0));

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});

  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatForDB = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const selectedDateString = formatForDB(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

  useEffect(() => {
    // CHANGE: 'events' to 'calendar'
    const unsub = onSnapshot(collection(db, 'calendar'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCalendarEvents(data);
      const ids = new Set(data.map((e) => e.id));
      setSelectedIds((prev) => prev.filter((id) => ids.has(id)));
    });
    return () => unsub();
  }, []);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // CHANGE: 'events' to 'calendar'
      const snapshot = await getDocs(collection(db, 'calendar'));
      setCalendarEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDayPress = (dayNum: number) => {
    setSelectedDate(new Date(viewYear, viewMonth, dayNum));
    setFilterDay(dayNum);
    setFilterMonth(viewMonth);
    setFilterYear(viewYear);
  };

  const handleDateDropdownChange = (type: 'day' | 'month' | 'year', value: number) => {
    let y = filterYear || selectedDate.getFullYear();
    let m = filterMonth !== null ? filterMonth : selectedDate.getMonth();
    let d = filterDay || selectedDate.getDate();

    if (type === 'year') { y = value; setFilterYear(value); }
    if (type === 'month') { m = value; setFilterMonth(value); }
    if (type === 'day') { d = value; setFilterDay(value); }

    const maxDays = new Date(y, m + 1, 0).getDate();
    if (d > maxDays) d = maxDays;

    const newDate = new Date(y, m, d);
    setSelectedDate(newDate); 
    setViewYear(y);           
    setViewMonth(m);          
    setActivePicker(null);    
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

 const handleSave = async () => {
    if (!form.title.trim()) return;
    try {
      const isEditing = !!editingId;
      const id = editingId || Date.now().toString();
      const payload = {
        ...form,
        eventDate: selectedDateString,
        ...(isEditing ? { updatedAt: new Date() } : { createdAt: new Date() })
      };
      
      // CHANGE: 'events' to 'calendar'
      await setDoc(doc(db, 'calendar', id), payload, { merge: true });
      
      setModalVisible(false);
      setShowDropdown(false);
      setEditingId(null);
      setForm(initialForm);
      showNotification(isEditing ? `Updated ${form.title}` : `Created ${form.title}`);
    } catch (error: any) {
      console.error('Could not save calendar item:', error);
      showNotification(`Error saving: ${error.message || 'Permission denied'}`);
    }
  };

  const handleDelete = (id: string) => {
    const eventToDelete = calendarEvents.find((e) => e.id === id);
    const title = eventToDelete ? eventToDelete.title : 'Event';
    showConfirm(`Are you sure you want to delete "${title}"?`, async () => {
      try {
        // CHANGE: 'events' to 'calendar'
        await deleteDoc(doc(db, 'calendar', id));
        showNotification(`Deleted "${title}"`);
        setSelectedIds((prev) => prev.filter((x) => x !== id));
      } catch (error: any) {
        console.error('Could not delete calendar item:', error);
        showNotification(`Error deleting: ${error.message || 'Permission denied'}`);
      }
    });
  };

  const handleDuplicate = async (item: any) => {
    try {
      const { id, ...rest } = item;
      const newId = Date.now().toString();
      // CHANGE: 'events' to 'calendar'
      await setDoc(doc(db, 'calendar', newId), {
        ...rest,
        title: `${item.title} (Copy)`,
        createdAt: new Date(),
      });
      showNotification(`Duplicated ${item.title}`);
    } catch (error: any) {
      console.error('Could not duplicate calendar item:', error);
      showNotification(`Error duplicating: ${error.message || 'Permission denied'}`);
    }
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    showConfirm(`Delete ${selectedIds.length} selected items?`, async () => {
      // CHANGE: 'events' to 'calendar'
      await Promise.all(selectedIds.map((id) => deleteDoc(doc(db, 'calendar', id))));
      showNotification(`Deleted ${selectedIds.length} items`);
      setSelectedIds([]);
    });
  };



  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

 
  const filtered = calendarEvents.filter(e => e.eventDate === selectedDateString);
  const allSelected = filtered.length > 0 && filtered.every((i) => selectedIds.includes(i.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filtered.find((f) => f.id === id)));
    } else {
      const newIds = [...selectedIds];
      filtered.forEach(item => {
        if (!newIds.includes(item.id)) newIds.push(item.id);
      });
      setSelectedIds(newIds);
    }
  };

  const clearFilters = () => {
    setFilterDay(null);
    setFilterMonth(null);
    setFilterYear(null);
    const today = new Date();
    setSelectedDate(today);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  return {
    calendarEvents, activePicker, setActivePicker, filterDay, filterMonth, filterYear,
    modalVisible, setModalVisible, editingId, setEditingId, form, setForm,
    isRefreshing, selectedIds, setSelectedIds, showDropdown, setShowDropdown,
    notification, notifAnim, confirmVisible, setConfirmVisible, confirmMessage,
    onConfirmAction, viewYear, setViewYear, viewMonth, setViewMonth, selectedDate,
    selectedDateString, filtered, allSelected, initialForm,
    handleRefresh, handleDayPress, handleDateDropdownChange, updateField,
    handleBarangaySelect, handleSave, handleDelete, handleDuplicate, toggleSelect,
    handleBulkDelete, toggleSelectAll, clearFilters, formatForDB
  };
};