// qcgabay/app/(tabs)/calendar/.ts


import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EVENT_COLORS = ['#ff7474', '#f6c23e', '#4e73df'];
const DAYS_ARRAY = Array.from({ length: 31 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const YEARS_ARRAY = Array.from({ length: 10 }, (_, i) => currentYear - i);

export const useCalendar = () => {
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- EVO CALENDAR STATE ---
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- LOCATION FILTER STATE ---
  const [selectedLocation, setSelectedLocation] = useState("All Barangay");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const barangayOptions = ["All Barangay", "Bungad", "Veterans"];

  // --- FILTER DROPDOWN STATE (Date) ---
  const [activePicker, setActivePicker] = useState<'day' | 'month' | 'year' | null>(null);
  const [filterDay, setFilterDay] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  // --- EVENT MODAL STATE ---
  const [selectedEventDetails, setSelectedEventDetails] = useState<any | null>(null);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); 
  
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formatForDB = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const selectedDateString = formatForDB(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'calendar'), (snapshot) => {
      setCalendarEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

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

  const handleOpenEventModal = (item: any) => {
    setSelectedEventDetails(item);
    setIsEventModalVisible(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalVisible(false);
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

  const filteredEvents = calendarEvents.filter(e => {
    const isDateMatch = e.eventDate === selectedDateString;
    
    const target = e.barangay || "All Barangay";
    const isLocationMatch = 
      selectedLocation === "All Barangay" || 
      target === "All Barangay" ||           
      target.includes(selectedLocation);     

    return isDateMatch && isLocationMatch;
  });

  return {
    calendarEvents, loading, viewYear, setViewYear, viewMonth, setViewMonth,
    selectedDate, selectedLocation, setSelectedLocation, isLocationDropdownOpen,
    setIsLocationDropdownOpen, barangayOptions, activePicker, setActivePicker,
    filterDay, filterMonth, filterYear, selectedEventDetails, isEventModalVisible,
    daysInMonth, firstDayOfMonth, blanks, days, selectedDateString,
    MONTH_NAMES, DAY_NAMES, EVENT_COLORS, DAYS_ARRAY, YEARS_ARRAY,
    handleDayPress, handleDateDropdownChange, handleOpenEventModal, 
    handleCloseEventModal, clearFilters, filteredEvents, formatForDB
  };
};