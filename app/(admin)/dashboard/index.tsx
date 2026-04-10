// QCGabay/app/(admin)/dashboard/index.tsx

import { Tabs, useRouter } from 'expo-router'; // Added Tabs
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'; // Added Image
import { db } from '../../firebaseConfig';
import { styles } from './styles';

export default function AdminDashboard() {
  const router = useRouter();

  // State for counts
  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [calendarCount, setCalendarCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        setUserCount(usersSnap.size);

        const eventsSnap = await getDocs(collection(db, 'events'));
        setEventCount(eventsSnap.size);

        const calendarSnap = await getDocs(collection(db, 'calendar'));
        setCalendarCount(calendarSnap.size);

        const announcementsSnap = await getDocs(collection(db, 'announcements'));
        setAnnouncementCount(announcementsSnap.size);

        const inquiriesSnap = await getDocs(collection(db, 'inquiries'));
        setInquiryCount(inquiriesSnap.size);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    fetchCounts();
  }, []);

  const cards = [
    { title: 'Users', count: userCount, onPress: () => router.push('./users') },
    { title: 'Events', count: eventCount, onPress: () => router.push('./adminevents') },
    { title: 'Calendar', count: calendarCount, onPress: () => router.push('./admincalendar') },
    { title: 'Announce', count: announcementCount, onPress: () => router.push('./adminannouncements') },
    { title: 'Inquiries', count: inquiryCount, onPress: () => router.push('./admininquiries') },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER LOGO CONFIGURATION */}
      <Tabs.Screen
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require("../../../assets/images/logo.png")}
                style={{ width: 70, height: 70, marginRight: 10, resizeMode: 'contain' }}
              />
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Dashboard</Text>
            </View>
          ),
          headerStyle: { backgroundColor: '#5687d6' },
          headerTintColor: '#fff',
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome to Admin Dashboard</Text>
        <View style={styles.rowContainer}>
          {cards.map((card, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={card.onPress}>
              <Text style={styles.cardTextTitle} numberOfLines={1} adjustsFontSizeToFit>
                {card.title}
              </Text>
              <Text style={styles.cardTextCount}>{card.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}