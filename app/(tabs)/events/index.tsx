// qcgabay/app/(tabs)/events/index.tsx

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebaseConfig';
import { styles } from './styles';

export default function EventsPage() {
  const router = useRouter();
  const auth = getAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userBarangay, setUserBarangay] = useState<string | null>(null);

  // Fetch logged in user's assigned barangay
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    
    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().barangay) {
        setUserBarangay(docSnap.data().barangay);
      } else {
        setUserBarangay(null);
      }
    });

    return () => unsubscribeUser();
  }, []);

  // Fetch live events from Firebase
  useEffect(() => {
    const unsubscribeEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    });

    return () => unsubscribeEvents();
  }, []);

  // Filter logic: Search Query + Barangay Match
  const filteredEvents = events.filter((event) => {
    const searchLower = searchQuery.toLowerCase();
    const title = event.title?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || ''; 
    const matchesSearch = title.includes(searchLower) || description.includes(searchLower);
    
    // Check for matching barangay logic
    const eventBrgy = event.barangay || 'All Barangay';
    // If no specific barangay selected by user, they see all events. 
    // Otherwise, they only see 'All Barangay' events and their specific barangay events.
    const matchesBrgy = !userBarangay || eventBrgy === 'All Barangay' || eventBrgy === userBarangay;

    return matchesSearch && matchesBrgy;
  });

  const handlePress = (id: string) => {
    router.push(`./events/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search Bar - Applied from Home Screen */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Current & Upcoming Events</Text>
        
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for events..." 
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)} 
            clearButtonMode="while-editing" 
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
               <Ionicons name="close-circle" size={18} color="#cbd5e1" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* List Content */}
      {filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer || { padding: 40, alignItems: 'center' }}>
            <Ionicons name="search-outline" size={50} color="#cbd5e1" />
            <Text style={{ color: '#666', marginTop: 10, textAlign: 'center' }}>
              {searchQuery ? `No events matching "${searchQuery}"` : "No events found."}
            </Text>
          </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable 
              style={({ pressed }) => [
                styles.eventCard,
                { 
                  opacity: pressed ? 0.8 : 1, 
                  transform: [{ scale: pressed ? 0.98 : 1 }] 
                }
              ]}
              onPress={() => handlePress(item.id)}
            >
              <MaterialCommunityIcons 
                name={item.image || "calendar-star"} 
                size={30} 
                color="#1d50a2" 
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                {/* Visual indicator for Barangay on Client Card */}
                <Text style={{ fontSize: 12, color: '#1d50a2', marginTop: 2, fontWeight: 'bold' }}>
                  📍 {item.barangay || 'All Barangay'}
                </Text>
                {/* Optional: Add date if it exists in your Firestore docs */}
                {item.date && <Text style={styles.cardDate}>{item.date}</Text>}
              </View>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color="#ccc" 
                style={{ marginLeft: 'auto' }} 
              />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}