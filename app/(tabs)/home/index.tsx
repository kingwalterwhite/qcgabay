// qcgabay/app/(tabs)/home/index.tsx

import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'; // ✅ Added doc & getDoc
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../(auth)/AuthContext'; // ✅ Import Auth Context
import { db } from '../../firebaseConfig';
import { styles } from './styles';

export default function HomePage() {
  const router = useRouter();
  const { userEmail } = useLocalSearchParams();
  const { user } = useAuth(); // ✅ Get the currently logged-in user
  
  const [searchQuery, setSearchQuery] = useState('');
  const [infoItems, setInfoItems] = useState<any[]>([]);
  const [initials, setInitials] = useState(''); // ✅ State for user initials

  // ✅ Fetch user details to get the full name for initials
  useEffect(() => {
    const fetchUserInitials = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const fullName = userDoc.data().fullName || '';
            const nameParts = fullName.trim().split(/\s+/);
            
            let computedInitials = '';
            if (nameParts.length >= 2) {
              // First letter of first name + First letter of last name
              computedInitials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
            } else if (nameParts.length === 1 && nameParts[0]) {
              // Fallback to first two letters if only one name exists
              computedInitials = nameParts[0].substring(0, 2).toUpperCase();
            }
            
            setInitials(computedInitials);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserInitials();
  }, [user]);

  // ✅ Fetch data from Firestore automatically
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInfoItems(fetchedItems);
    });
    return () => unsub();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const filteredItems = infoItems.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (item.title || '').toLowerCase().includes(searchLower) ||
      (item.category || '').toLowerCase().includes(searchLower)
    );
  });

  const handlePressInfo = (item: any) => {
    router.push(`/home/${item.id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={{ width: 90, height: 90, marginRight: 10, resizeMode: 'contain' }}
          />
          <View style={styles.headerActions}>
            {/* ✅ Conditionally render Icon + Initials ONLY if user exists */}
            {user && (
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                onPress={() => router.push({ pathname: '/profile' as any, params: { email: user.email || userEmail } })}
              >
                <FontAwesome5 name="user-circle" size={28} color="#2D5A27" />
                {initials ? (
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#2D5A27' }}>
                    {initials}
                  </Text>
                ) : null}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.greetingText}>{getGreeting()}!</Text>

        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for relevant information..." 
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Results for "${searchQuery}"` : 'Guides, Req. and Due Process for Inquiring Official Certs/IDs'}
        </Text>

        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.mainCard}
              onPress={() => handlePressInfo(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardAccent, { backgroundColor: item.color }]} />
              <View style={styles.cardBody}>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={50} color="#cbd5e1" />
            <Text style={styles.emptyText}>No matching announcements found.</Text>
          </View>
        )}
        
        <View style={styles.footerSpacing} />
      </ScrollView>
    </View>
  );
}