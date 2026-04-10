// qcgabay/app/(tabs)/calendar/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "./styles";
import { useCalendar } from './usecalendar';

export default function CalendarPage() {
  const router = useRouter();
  const {
    loading, viewYear, setViewYear, viewMonth, setViewMonth,
    selectedDate, selectedLocation, setSelectedLocation, isLocationDropdownOpen,
    setIsLocationDropdownOpen, barangayOptions, activePicker, setActivePicker,
    filterDay, filterMonth, filterYear, selectedEventDetails, isEventModalVisible,
    blanks, days, selectedDateString, calendarEvents,
    MONTH_NAMES, DAY_NAMES, EVENT_COLORS, DAYS_ARRAY, YEARS_ARRAY,
    handleDayPress, handleDateDropdownChange, handleOpenEventModal, 
    handleCloseEventModal, clearFilters, filteredEvents, formatForDB
  } = useCalendar();

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('../home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1d50a2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar of Events</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.content, { paddingBottom: 30 }]}>
        
        {/* --- LOCATION FILTER DROPDOWN --- */}
        <View style={{ width: '100%', marginBottom: 15, zIndex: 10, elevation: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
            Filter by Location
          </Text>
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
              }}
            >
              <Text style={{ fontSize: 14, color: '#333' }}>
                Location: <Text style={{ fontWeight: '700', color: '#2e7d32' }}>{selectedLocation}</Text>
              </Text>
              <Ionicons
                name={isLocationDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#666"
              />
            </TouchableOpacity>

            {isLocationDropdownOpen && (
              <View style={{
                position: 'absolute',
                top: 50,
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                zIndex: 999 
              }}>
                {barangayOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setSelectedLocation(option);
                      setIsLocationDropdownOpen(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 15,
                      borderBottomWidth: index === barangayOptions.length - 1 ? 0 : 1,
                      borderBottomColor: '#eee',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      color: selectedLocation === option ? '#2e7d32' : '#333',
                      fontWeight: selectedLocation === option ? 'bold' : 'normal'
                    }}>
                      {option}
                    </Text>
                    {selectedLocation === option && (
                      <Ionicons name="checkmark-circle" size={18} color="#2e7d32" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* --- DATE FILTER DROPDOWNS --- */}
        <View style={{ width: '100%', marginBottom: 20, zIndex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
              Filter by Date
            </Text>
            
            {(filterDay !== null || filterMonth !== null || filterYear !== null) && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={{ fontSize: 13, color: '#d9534f', fontWeight: 'bold' }}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <TouchableOpacity 
              style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }} 
              onPress={() => setActivePicker('day')}
            >
              <Text style={{ color: filterDay ? '#333' : '#888', fontWeight: filterDay ? 'bold' : 'normal', fontSize: 13 }}>
                {filterDay ? filterDay : 'Select Day'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }} 
              onPress={() => setActivePicker('month')}
            >
              <Text style={{ color: filterMonth !== null ? '#333' : '#888', fontWeight: filterMonth !== null ? 'bold' : 'normal', fontSize: 13 }}>
                {filterMonth !== null ? MONTH_NAMES[filterMonth] : 'Select Month'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }} 
              onPress={() => setActivePicker('year')}
            >
              <Text style={{ color: filterYear ? '#333' : '#888', fontWeight: filterYear ? 'bold' : 'normal', fontSize: 13 }}>
                {filterYear ? filterYear : 'Select Year'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- EVO CALENDAR UI --- */}
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 4, height: 420, marginBottom: 20 }}>
          
          {/* Left Sidebar (Purple) */}
          <View style={{ width: 110, backgroundColor: '#7359a6', paddingTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => setViewYear(y => y - 1)}><Ionicons name="chevron-back" size={20} color="#fff" /></TouchableOpacity>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginHorizontal: 8 }}>{viewYear}</Text>
              <TouchableOpacity onPress={() => setViewYear(y => y + 1)}><Ionicons name="chevron-forward" size={20} color="#fff" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MONTH_NAMES.map((month, index) => {
                const isActive = viewMonth === index;
                return (
                  <TouchableOpacity 
                    key={month} 
                    onPress={() => setViewMonth(index)}
                    style={[{ paddingVertical: 12, paddingHorizontal: 15 }, isActive && { backgroundColor: '#5a4582' }]}
                  >
                    <Text style={[{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600' }, isActive && { color: '#fff', fontWeight: 'bold' }]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Right Calendar Area */}
          <View style={{ flex: 1, padding: 15, backgroundColor: '#fcfcfc' }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#7359a6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 }}>
              {MONTH_NAMES[viewMonth]}
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              {DAY_NAMES.map(day => (
                <Text key={day} style={{ fontSize: 12, color: '#888', width: '14.28%', textAlign: 'center' }}>{day}</Text>
              ))}
            </View>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
               {blanks.map((_, i) => <View key={`blank-${i}`} style={{ width: '14.28%', height: 45 }} />)}

              {days.map(dayNum => {
                 const thisDateString = formatForDB(viewYear, viewMonth, dayNum);
                 const isSelected = selectedDateString === thisDateString;
                 
                 // FIX: Changed e.date to e.eventDate to match your database field
                 const dayEvents = calendarEvents.filter(e => {
                   const isDateMatch = e.eventDate === thisDateString; 
                   const target = e.barangay || "All Barangay";
                   const isLocationMatch = 
                     selectedLocation === "All Barangay" || 
                     target === "All Barangay" || 
                     target.includes(selectedLocation); // Added .includes() to sync with useCalendar logic
                   return isDateMatch && isLocationMatch;
                 });

                 return (
                   <View key={dayNum} style={{ width: '14.28%', height: 45, alignItems: 'center' }}>
                     <TouchableOpacity 
                       onPress={() => handleDayPress(dayNum)}
                       style={[
                         { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, 
                         isSelected && { backgroundColor: '#7359a6' }
                       ]}
                     >
                       <Text style={[
                         { fontSize: 14, color: '#444' }, 
                         isSelected && { color: '#fff', fontWeight: 'bold' }
                       ]}>
                         {dayNum}
                       </Text>
                     </TouchableOpacity>
                     
                     {/* Round marks (dots) for events */}
                     {dayEvents.length > 0 && (
                       <View style={{ flexDirection: 'row', marginTop: 2 }}>
                         {dayEvents.slice(0, 3).map((_, idx) => (
                           <View 
                             key={idx} 
                             style={{ 
                               width: 6, 
                               height: 6, 
                               borderRadius: 3, 
                               marginHorizontal: 1.5, 
                               backgroundColor: EVENT_COLORS[idx % 3] 
                             }} 
                           />
                         ))}
                       </View>
                     )}
                   </View>
                 );
               })}
            </View>
          </View>
        </View>

        {/* --- EVENT LIST --- */}
        {loading ? (
          <ActivityIndicator size="large" color="#7359a6" style={{ marginTop: 20 }} />
        ) : (
          <View style={{ width: '100%' }}>
           <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginLeft: 5 }}>
              Events for Day {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Text>
           <FlatList
              data={filteredEvents}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", color: "#888", marginTop: 10 }}>
                  No events scheduled for Day {selectedDate.getDate()}{" "}
                  {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}{" "}
                  {selectedLocation !== "All Barangay" && `in ${selectedLocation}`}.
                </Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleOpenEventModal(item)}
                  style={{
                    backgroundColor: "#fff",
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: "#eee",
                    borderLeftWidth: 4,
                    borderLeftColor: "#7359a6",
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 4 }}>
                    {item.title}
                  </Text>

                  {item.barangay && item.barangay !== "All Barangay" && (
                    <Text style={{ fontSize: 12, color: "#1d50a2", fontWeight: "bold", marginBottom: 4 }}>
                      📍 {item.barangay}
                    </Text>
                  )}

                  {item.description ? (
                    <Text numberOfLines={2} style={{ fontSize: 14, color: "#666", lineHeight: 20 }}>
                      {item.description}
                    </Text>
                  ) : null}
                  
                  <Text style={{ fontSize: 12, color: "#7359a6", marginTop: 8, fontWeight: "600" }}>
                    Tap to view details &raquo;
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>

  {/* --- DROPDOWN PICKER MODAL (For Dates) --- */}
 {activePicker !== null && (
  <Modal
    key="picker-modal"
    visible={true}
    transparent
    animationType="fade"
    statusBarTranslucent
    onRequestClose={() => setActivePicker(null)}
  >
    <View style={{ 
      flex: 1, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>

      {/* BACKDROP */}
      <TouchableOpacity 
        activeOpacity={1}
        onPress={() => setActivePicker(null)}
        style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%' 
        }}
      />

      {/* MODAL CONTENT */}
      <View style={{ 
        width: '85%', 
        backgroundColor: '#fff', 
        borderRadius: 12, 
        padding: 20, 
        elevation: 10
      }}>
        
        {/* HEADER */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 15 
        }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: '#333',
            textTransform: 'capitalize'
          }}>
            Select {activePicker}
          </Text>

          <TouchableOpacity onPress={() => setActivePicker(null)}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {/* OPTIONS */}
        <ScrollView style={{ maxHeight: 300 }}>
          {(activePicker === 'day' ? DAYS_ARRAY :
            activePicker === 'month' ? MONTH_NAMES :
            YEARS_ARRAY
          ).map((item, index) => (
            
            <TouchableOpacity 
              key={item}
              onPress={() => {
let value: number;

if (activePicker === 'month') {
  value = index;
} else {
  value = Number(item);
}
                // 🔥 IMPORTANT: delay state update slightly
                setActivePicker(null);

                setTimeout(() => {
                  handleDateDropdownChange(activePicker, value);
                }, 50);
              }}
              style={{
                paddingVertical: 15,  
                borderBottomWidth: 1,
                borderBottomColor: '#eee'
              }}
            >
              <Text style={{ 
                textAlign: 'center', 
                fontSize: 16, 
                color: '#333' 
              }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CANCEL */}
        <TouchableOpacity
          onPress={() => setActivePicker(null)}
          style={{
            marginTop: 20,
            backgroundColor: '#7359a6',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            Cancel
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  </Modal>
)}



      {/* --- EVENT DETAILS MODAL --- */}
      <Modal
        visible={isEventModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseEventModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1 }}>
                {selectedEventDetails?.title || "Event Details"}
              </Text>
              <TouchableOpacity onPress={handleCloseEventModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            {selectedEventDetails?.barangay && (
              <Text style={{ fontSize: 14, color: '#1d50a2', fontWeight: 'bold', marginBottom: 5 }}>
                📍 Target: {selectedEventDetails.barangay}
              </Text>
            )}
            
            <Text style={{ fontSize: 13, color: '#888', marginBottom: 15 }}>
              📅 Date: {selectedEventDetails?.date}
            </Text>

            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 15, color: '#555', lineHeight: 22 }}>
                {selectedEventDetails?.description || "No description available."}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={{ marginTop: 20, backgroundColor: '#7359a6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
              onPress={handleCloseEventModal}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}