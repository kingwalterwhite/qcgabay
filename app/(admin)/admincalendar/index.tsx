// QCGabay/app/(admin)/admincalendar/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Animated, FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { useAdminCalendar } from './useadmincalendar';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EVENT_COLORS = ['#ff7474', '#f6c23e', '#4e73df'];

const formatDate = (timestamp: any): string => {
  if (!timestamp) return "N/A";
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
  }
  if (timestamp instanceof Date) {
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(timestamp);
  }
  return "N/A";
};

export default function AdminCalendar() {
  const {
    calendarEvents, activePicker, setActivePicker, filterDay, filterMonth, filterYear,
    modalVisible, setModalVisible, editingId, setEditingId, form, setForm,
    isRefreshing, selectedIds, showDropdown, setShowDropdown,
    notification, notifAnim, confirmVisible, setConfirmVisible, confirmMessage,
    onConfirmAction, viewYear, setViewYear, viewMonth, setViewMonth, selectedDate,
    selectedDateString, filtered, allSelected, initialForm,
    handleRefresh, handleDayPress, handleDateDropdownChange, updateField,
    handleBarangaySelect, handleSave, handleDelete, handleDuplicate, toggleSelect,
    handleBulkDelete, toggleSelectAll, clearFilters, formatForDB
  } = useAdminCalendar();

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); 
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const currentYear = new Date().getFullYear();
  const YEARS_ARRAY = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i).reverse();
  const DAYS_ARRAY = Array.from({ length: 31 }, (_, i) => i + 1);

  const currentSelectedBarangays = (form.barangay || 'All Barangay').split(', ');
  const availableBarangays = ['Bungad', 'Veterans'];

  return (
    <View style={styles.container}>
      {notification ? (
        <Animated.View style={[styles.notification, { opacity: notifAnim, transform: [{ translateY: notifAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
          <View style={styles.notificationContent}>
            <Ionicons name="checkmark-circle" size={20} color="#4BB543" />
            <Text style={styles.notificationText}>{notification}</Text>
          </View>
        </Animated.View>
      ) : null}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <Tabs.Screen
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require("../../../assets/images/logo.png")} style={{ width: 70, height: 70, marginRight: 10, resizeMode: 'contain' }} />
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Calendar</Text>
              </View>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleRefresh} style={{ marginRight: 15 }}>
                {isRefreshing ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="refresh" size={24} color="#fff" />}
              </TouchableOpacity>
            ),
          }}
        />

        <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 4, marginTop: 15, height: 420 }}>
          <View style={{ width: 110, backgroundColor: '#7359a6', paddingTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => setViewYear(y => y - 1)}><Ionicons name="chevron-back" size={20} color="#fff" /></TouchableOpacity>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8 }}>{viewYear}</Text>
              <TouchableOpacity onPress={() => setViewYear(y => y + 1)}><Ionicons name="chevron-forward" size={20} color="#fff" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MONTH_NAMES.map((month, index) => (
                <TouchableOpacity key={month} onPress={() => setViewMonth(index)} style={[{ paddingVertical: 12, paddingHorizontal: 15 }, viewMonth === index && { backgroundColor: '#5a4582' }]}>
                  <Text style={[{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600' }, viewMonth === index && { color: '#fff', fontWeight: 'bold' }]}>{month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={{ flex: 1, padding: 15, backgroundColor: '#fcfcfc' }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#7359a6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 }}>{MONTH_NAMES[viewMonth]}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              {DAY_NAMES.map(day => <Text key={day} style={{ fontSize: 12, color: '#888', width: '14.28%', textAlign: 'center' }}>{day}</Text>)}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {blanks.map((_, i) => <View key={`blank-${i}`} style={{ width: '14.28%', height: 45 }} />)}
              {days.map(dayNum => {
                const thisDateString = formatForDB(viewYear, viewMonth, dayNum);
                const isSelected = selectedDateString === thisDateString;
                const dayEvents = calendarEvents.filter(e => e.eventDate === thisDateString);
                return (
                  <View key={dayNum} style={{ width: '14.28%', height: 45, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => handleDayPress(dayNum)} style={[{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, isSelected && { backgroundColor: '#7359a6' }]}>
                      <Text style={[{ fontSize: 14, color: '#444' }, isSelected && { color: '#fff', fontWeight: 'bold' }]}>{dayNum}</Text>
                    </TouchableOpacity>
                    {dayEvents.length > 0 && (
                      <View style={{ flexDirection: 'row', marginTop: 2 }}>
                        {dayEvents.slice(0, 3).map((_, idx) => <View key={idx} style={{ width: 4, height: 4, borderRadius: 2, marginHorizontal: 1, backgroundColor: EVENT_COLORS[idx % 3] }} />)}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={{ marginHorizontal: 15, marginTop: 20, marginBottom: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Filter by Date</Text>
            {(filterDay !== null || filterMonth !== null || filterYear !== null) && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={{ fontSize: 13, color: '#d9534f', fontWeight: 'bold' }}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }} onPress={() => setActivePicker('day')}>
              <Text style={{ color: filterDay ? '#333' : '#888', fontWeight: filterDay ? 'bold' : 'normal', fontSize: 13 }}>{filterDay ? filterDay : 'Select Day'}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }} onPress={() => setActivePicker('month')}>
              <Text style={{ color: filterMonth !== null ? '#333' : '#888', fontWeight: filterMonth !== null ? 'bold' : 'normal', fontSize: 13 }}>{filterMonth !== null ? MONTH_NAMES[filterMonth] : 'Select Month'}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }} onPress={() => setActivePicker('year')}>
              <Text style={{ color: filterYear ? '#333' : '#888', fontWeight: filterYear ? 'bold' : 'normal', fontSize: 13 }}>{filterYear ? filterYear : 'Select Year'}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.addButton, { backgroundColor: '#7359a6' }]} onPress={() => { setEditingId(null); setForm(initialForm); setModalVisible(true); }}>
          <Text style={styles.addButtonText}>+ Add Event to Day {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}</Text>
        </TouchableOpacity>

        <View style={styles.bulkActionsRow}>
          <TouchableOpacity style={styles.selectAllButton} onPress={toggleSelectAll}>
            <Ionicons name={allSelected ? 'checkbox' : 'square-outline'} size={18} color="#7359a6" />
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>
          <View style={styles.bulkButtonsRight}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRefresh}>
              {isRefreshing ? <ActivityIndicator size="small" color="#7359a6" /> : <><Ionicons name="refresh" size={16} color="#7359a6" /><Text style={styles.secondaryButtonText}>Refresh</Text></>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dangerButton, !selectedIds.length && styles.disabledButton]} onPress={handleBulkDelete} disabled={!selectedIds.length}>
              <Ionicons name="trash" size={16} color="#fff" />
              <Text style={styles.dangerButtonText}>Delete ({selectedIds.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No events scheduled for Day {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.checkboxWrap}>
                <Ionicons name={selectedIds.includes(item.id) ? 'checkbox' : 'square-outline'} size={20} />
              </TouchableOpacity>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: '#7359a6', fontWeight: 'bold', marginBottom: 4 }}>📍 {item.barangay || 'All Barangay'}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.createdText}>📅 Created: {formatDate(item.createdAt)}</Text>
                {item.updatedAt && <Text style={styles.updatedText}>✏️ Updated: {formatDate(item.updatedAt)}</Text>}
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleDuplicate(item)} style={styles.iconBtn}><Ionicons name="copy" size={20} color="#5bc0de" /></TouchableOpacity>
                <TouchableOpacity onPress={() => { setEditingId(item.id); setForm({ title: item.title, description: item.description, barangay: item.barangay || 'All Barangay' }); setModalVisible(true); }} style={styles.iconBtn}><Ionicons name="pencil" size={20} color="#f0ad4e" /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconBtn}><Ionicons name="trash" size={20} color="#d9534f" /></TouchableOpacity>
              </View>
            </View>
          )}
        />
        
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{editingId ? 'Edit Event' : `New Event`}</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>Target Barangay</Text>
                <View style={styles.chipContainer}>
                  {currentSelectedBarangays.map((brgy) => (
                    <View key={brgy} style={[styles.chip, { backgroundColor: '#7359a6' }]}><Text style={styles.chipText}>{brgy}</Text></View>
                  ))}
                </View>
                <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={[styles.dropdownToggle, { marginBottom: showDropdown ? 5 : 15 }]}>
                  <Text style={{ color: '#333' }}>Select Target Barangay...</Text>
                  <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
                </TouchableOpacity>
                {showDropdown && (
                  <View style={styles.dropdownList}>
                    <TouchableOpacity onPress={() => handleBarangaySelect('All Barangay')} style={styles.dropdownItem}>
                      <Ionicons name={currentSelectedBarangays.includes('All Barangay') ? 'checkbox' : 'square-outline'} size={20} color="#7359a6" />
                      <Text style={{ marginLeft: 10, color: '#333' }}>All Barangay</Text>
                    </TouchableOpacity>
                    {availableBarangays.map((brgy) => (
                      <TouchableOpacity key={brgy} onPress={() => handleBarangaySelect(brgy)} style={styles.dropdownItem}>
                        <Ionicons name={currentSelectedBarangays.includes(brgy) ? 'checkbox' : 'square-outline'} size={20} color="#7359a6" />
                        <Text style={{ marginLeft: 10, color: '#333' }}>{brgy}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <View><Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>Title</Text>
                <TextInput style={styles.input} placeholder="Enter Title..." value={form.title} onChangeText={(t) => updateField('title', t)} /></View>
                <View><Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>Description</Text>
                <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="Enter Description..." value={form.description} onChangeText={(t) => updateField('description', t)} /></View>
                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => { setModalVisible(false); setShowDropdown(false); }} style={styles.cancelBtn}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: '#7359a6' }]}><Text style={styles.btnTextWhite}>Save</Text></TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal visible={confirmVisible} transparent animationType="fade">
          <View style={styles.confirmOverlay}>
            <View style={styles.confirmContainer}>
              <Text style={styles.confirmMessage}>{confirmMessage}</Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity style={[styles.cancelBtn, { flex: 1, marginRight: 5 }]} onPress={() => setConfirmVisible(false)}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.dangerButton, { flex: 1, marginLeft: 5 }]} onPress={() => { setConfirmVisible(false); onConfirmAction(); }}><Text style={styles.btnTextWhite}>Delete</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={!!activePicker} transparent animationType="fade">
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => setActivePicker(null)}>
            <TouchableOpacity activeOpacity={1} style={{ width: '80%', maxHeight: '60%', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' }}>
              <Text style={{ padding: 15, backgroundColor: '#7359a6', color: '#fff', fontWeight: 'bold', textAlign: 'center', textTransform: 'capitalize' }}>Select {activePicker}</Text>
              <ScrollView showsVerticalScrollIndicator={true}>
                {activePicker === 'day' && DAYS_ARRAY.map(d => <TouchableOpacity key={d} onPress={() => handleDateDropdownChange('day', d)} style={{ padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}><Text style={{ textAlign: 'center', color: '#333', fontSize: 16 }}>{d}</Text></TouchableOpacity>)}
                {activePicker === 'month' && MONTH_NAMES.map((m, i) => <TouchableOpacity key={m} onPress={() => handleDateDropdownChange('month', i)} style={{ padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}><Text style={{ textAlign: 'center', color: '#333', fontSize: 16 }}>{m}</Text></TouchableOpacity>)}
                {activePicker === 'year' && YEARS_ARRAY.map(y => <TouchableOpacity key={y} onPress={() => handleDateDropdownChange('year', y)} style={{ padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}><Text style={{ textAlign: 'center', color: '#333', fontSize: 16 }}>{y}</Text></TouchableOpacity>)}
              </ScrollView>
              <TouchableOpacity onPress={() => setActivePicker(null)} style={{ padding: 15, backgroundColor: '#f8f9fa', borderTopWidth: 1, borderColor: '#ddd', alignItems: 'center' }}><Text style={{ color: '#d9534f', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text></TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </View>
  );
}