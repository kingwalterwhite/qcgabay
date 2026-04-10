// qcgabay/app/(admin)/adminevents/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styles';
import {
  DAY_NAMES,
  MONTH_NAMES,
  formatDate,
  formatForDB,
  initialForm,
  useAdminEvents
} from './useadminevents';

export default function AdminEvents() {
  const {
    selectedIds,
    search,
    setSearch,
    modalVisible,
    setModalVisible,
    setEditingId,
    form,
    setForm,
    isRefreshing,
    showDropdown,
    setShowDropdown,
    datePickerVisible,
    setDatePickerVisible,
    pickerYear,
    setPickerYear,
    pickerMonth,
    setPickerMonth,
    pickerBlanks,
    pickerDays,
    notification,
    notifAnim,
    confirmVisible,
    setConfirmVisible,
    confirmMessage,
    onConfirmAction,
    handleRefresh,
    updateField,
    handleBarangaySelect,
    handleSave,
    handleDelete,
    handleDuplicate,
    toggleSelect,
    filtered,
    allSelected,
    toggleSelectAll,
    handleBulkDelete,
    currentSelectedBarangays,
    availableBarangays,
    // --- NEW SYNC DESTRUCTURING ---
    syncModalVisible,
    setSyncModalVisible,
    eventToSync,
    syncDate,
    syncViewYear,
    setSyncViewYear,
    syncViewMonth,
    setSyncViewMonth,
    syncBlanks,
    syncDays,
    openSyncModal,
    handleSyncDayPress,
    confirmSync
  } = useAdminEvents();

  return (
    <View style={styles.container}>
      {/* Notification */}
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
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Events</Text>
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
          placeholder="Search Events..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Event</Text>
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
            style={[
              styles.dangerButton,
              !selectedIds.length && styles.disabledButton,
            ]}
            onPress={handleBulkDelete}
            disabled={!selectedIds.length}
          >
            <Ionicons name="trash" size={16} color="#fff" />
            <Text style={styles.dangerButtonText}>
              Delete ({selectedIds.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.checkboxWrap}>
              <Ionicons
                name={selectedIds.includes(item.id) ? 'checkbox' : 'square-outline'}
                size={20}
              />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              
              <Text style={{ fontSize: 12, color: '#1d50a2', fontWeight: 'bold', marginBottom: 4 }}>
                📍 {item.barangay || 'All Barangay'}
              </Text>
              {item.isSynced && item.eventDate ? (
                <Text style={{ fontSize: 12, color: '#f6c23e', fontWeight: 'bold', marginBottom: 4 }}>
                  📅 Synced to Calendar: {item.eventDate}
                </Text>
              ) : null}

              <Text style={styles.createdText}>
                📅 Created: {formatDate(item.createdAt)}
              </Text>

              {item.updatedAt && (
                <Text style={styles.updatedText}>
                  ✏️ Updated: {formatDate(item.updatedAt)}
                </Text>
              )}
            </View>
              
            <View style={styles.actionButtons}>
              {/* NEW SYNC BUTTON */}
              <TouchableOpacity onPress={() => openSyncModal(item)} style={styles.iconBtn}>
                <Ionicons name="calendar-outline" size={20} color="#7359a6" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => handleDuplicate(item)} style={styles.iconBtn}>
                <Ionicons name="copy" size={20} color="#5bc0de" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  setEditingId(item.id);
                  setForm(item);
                  setModalVisible(true);
                }}
                style={styles.iconBtn}
              >
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
                style={[styles.cancelBtn, { flex: 1, marginRight: 5 }]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dangerButton, { flex: 1, marginLeft: 5 }]}
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

      {/* Event Form Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>Target Barangay</Text>
              
              <View style={styles.chipContainer}>
                {currentSelectedBarangays.map((brgy) => (
                  <View key={brgy} style={styles.chip}>
                    <Text style={styles.chipText}>{brgy}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={[styles.dropdownToggle, { marginBottom: showDropdown ? 5 : 15 }]}
              >
                <Text style={{ color: '#333' }}>Select Target Barangay...</Text>
                <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
              </TouchableOpacity>

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

             {/* Automatically render regular text inputs with labels except for barangay and eventDate */}
              {Object.keys(initialForm).map((key) => {
                if (key === 'barangay' || key === 'eventDate') return null; 
                
                const labelText = key.charAt(0).toUpperCase() + key.slice(1);
                const isDescription = key === 'description';
                
                return (
                  <View key={key}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 5 }}>
                      {labelText}
                    </Text>
                    <TextInput
                      style={[styles.input, isDescription && styles.textArea]}
                      placeholder={`Enter ${labelText}...`}
                      value={(form as any)[key]}
                      onChangeText={(t) => updateField(key, t)}
                      multiline={isDescription}
                      numberOfLines={isDescription ? 5 : 1}
                    />
                  </View>
                );
              })}
              
              {/* Optional: Regular Date Picker inside the form for standalone eventDate */}
              <Text style={[styles.inputLabel, { marginTop: 10, color: '#7359a6' }]}>Event Date (Optional)</Text>
              <View style={styles.datePickerRow}>
                <TouchableOpacity style={styles.calendarIconButton} onPress={() => setDatePickerVisible(true)}>
                  <Ionicons name="calendar" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.dateDisplayBox}>
                  <Text style={{ color: form.eventDate ? '#333' : '#888', fontSize: 16 }}>
                    {form.eventDate ? form.eventDate : "YYYY-MM-DD"}
                  </Text>
                </View>
                {form.eventDate !== '' && (
                  <TouchableOpacity onPress={() => updateField('eventDate', '')} style={{ marginLeft: 10 }}>
                    <Ionicons name="close-circle" size={24} color="#d9534f" />
                  </TouchableOpacity>
                )}
              </View>
                
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => { setModalVisible(false); setShowDropdown(false); }} style={styles.cancelBtn}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: '#7359a6' }]}>
                  <Text style={styles.btnTextWhite}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* REGULAR DATE PICKER MODAL (For the form) */}
      <Modal visible={datePickerVisible} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmContainer, { padding: 0, overflow: 'hidden' }]}>
            
            {/* Header - Now Blue to match Sync Modal */}
            <View style={{ backgroundColor: '#7c9feb', padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
                Select Event Date
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setPickerYear(y => y - 1)}><Ionicons name="chevron-back" size={20} color="#fff" /></TouchableOpacity>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{pickerYear}</Text>
                <TouchableOpacity onPress={() => setPickerYear(y => y + 1)}><Ionicons name="chevron-forward" size={20} color="#fff" /></TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={() => setPickerMonth(m => m === 0 ? 11 : m - 1)}><Ionicons name="caret-back" size={20} color="#fff" /></TouchableOpacity>
                <Text style={{ color: '#fff', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }}>{MONTH_NAMES[pickerMonth]}</Text>
                <TouchableOpacity onPress={() => setPickerMonth(m => m === 11 ? 0 : m + 1)}><Ionicons name="caret-forward" size={20} color="#fff" /></TouchableOpacity>
              </View>
            </View>

            {/* Body */}
            <View style={{ padding: 15, backgroundColor: '#fcfcfc' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                {DAY_NAMES.map(day => (
                  <Text key={`picker-${day}`} style={{ fontSize: 12, color: '#888', width: '14.28%', textAlign: 'center' }}>{day}</Text>
                ))}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {pickerBlanks.map((_, i) => <View key={`pblank-${i}`} style={{ width: '14.28%', height: 40 }} />)}
                {pickerDays.map(dayNum => {
                  const thisDateString = formatForDB(pickerYear, pickerMonth, dayNum);
                  const isSelected = form.eventDate === thisDateString;

                  return (
                    <TouchableOpacity 
                      key={`pday-${dayNum}`}
                      onPress={() => updateField('eventDate', thisDateString)} // Selects the day without instantly closing
                      style={[{ width: '14.28%', height: 40, alignItems: 'center', justifyContent: 'center' }]}
                    >
                      {/* Highlight color changed to red (#a70c0a) to match Sync Modal */}
                      <View style={[{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, isSelected && { backgroundColor: '#a70c0a' }]}>
                        <Text style={[{ fontSize: 14, color: '#444' }, isSelected && { color: '#fff', fontWeight: 'bold' }]}>
                          {dayNum}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ACTION BUTTONS (Close | Confirm Date) */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                <TouchableOpacity onPress={() => setDatePickerVisible(false)} style={[styles.cancelBtn, { flex: 1, marginRight: 5 }]}>
                  <Text style={styles.btnText}>Close</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => setDatePickerVisible(false)} style={[styles.saveBtn, { backgroundColor: '#7c9feb', flex: 1, marginLeft: 5 }]}>
                  <Text style={styles.btnTextWhite}>Confirm Date</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
      </Modal>

      {/* --- NEW: CALENDAR SYNC MODAL --- */}
      <Modal visible={syncModalVisible} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmContainer, { padding: 0, overflow: 'hidden' }]}>
            
            {/* Sync Calendar Header */}
            <View style={{ backgroundColor: '#7c9feb', padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
                Syncing: {eventToSync?.title}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setSyncViewYear(y => y - 1)}><Ionicons name="chevron-back" size={20} color="#fff" /></TouchableOpacity>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{syncViewYear}</Text>
                <TouchableOpacity onPress={() => setSyncViewYear(y => y + 1)}><Ionicons name="chevron-forward" size={20} color="#fff" /></TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={() => setSyncViewMonth(m => m === 0 ? 11 : m - 1)}><Ionicons name="caret-back" size={20} color="#fff" /></TouchableOpacity>
                <Text style={{ color: '#fff', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }}>{MONTH_NAMES[syncViewMonth]}</Text>
                <TouchableOpacity onPress={() => setSyncViewMonth(m => m === 11 ? 0 : m + 1)}><Ionicons name="caret-forward" size={20} color="#fff" /></TouchableOpacity>
              </View>
            </View>

            {/* Sync Calendar Body */}
            <View style={{ padding: 15, backgroundColor: '#fcfcfc' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                {DAY_NAMES.map(day => (
                  <Text key={`sync-${day}`} style={{ fontSize: 12, color: '#888', width: '14.28%', textAlign: 'center' }}>{day}</Text>
                ))}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {syncBlanks.map((_, i) => <View key={`sblank-${i}`} style={{ width: '14.28%', height: 40 }} />)}
                {syncDays.map(dayNum => {
                  const isSelected = syncDate.getDate() === dayNum && syncDate.getMonth() === syncViewMonth && syncDate.getFullYear() === syncViewYear;

                  return (
                    <TouchableOpacity 
                      key={`sday-${dayNum}`}
                      onPress={() => handleSyncDayPress(dayNum)}
                      style={[{ width: '14.28%', height: 40, alignItems: 'center', justifyContent: 'center' }]}
                    >
                      <View style={[{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, isSelected && { backgroundColor: '#a70c0a' }]}>
                        <Text style={[{ fontSize: 14, color: '#444' }, isSelected && { color: '#fff', fontWeight: 'bold' }]}>
                          {dayNum}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ACTION BUTTONS (Close | Confirm & Sync) */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                <TouchableOpacity onPress={() => setSyncModalVisible(false)} style={[styles.cancelBtn, { flex: 1, marginRight: 5 }]}>
                  <Text style={styles.btnText}>Close</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={confirmSync} style={[styles.saveBtn, { backgroundColor: '#7c9feb', flex: 1, marginLeft: 5 }]}>
                  <Text style={styles.btnTextWhite}>Confirm Date & Sync</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}