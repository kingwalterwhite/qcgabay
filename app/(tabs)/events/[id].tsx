// qcgabay/app/(tabs)/events/[id].tsx

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the specific event document
  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'events', id as string), (docSnap) => {
      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() });
      } else {
        setEvent(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#1d50a2" />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found', headerShown: true }} />
        <View style={styles.centered}><Text>Event not found!</Text></View>
      </SafeAreaView>
    );
  }

  const InfoRow = ({ label, value, icon, iconColor = "#1d50a2" }: any) => (
    <View style={styles.infoRow}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value || 'TBA'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: event.title || 'Event Details', 
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/events')} style={{ marginLeft: 10, padding: 5 }}>
              <Ionicons name="chevron-back" size={28} color="#1d50a2" />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: 'white' },
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.mainHeader}>{event.title}</Text>
          <View style={styles.headerDivider} />

          {/* New Barangay Display inside Event Details */}
          <InfoRow label="Target Barangay" value={event.barangay || 'All Barangay'} icon="map-marker-radius-outline" iconColor="#1d50a2" />
          <InfoRow label="What" value={event.what} icon="information-outline" />
          <InfoRow label="When" value={event.when} icon="clock-outline" />
          <InfoRow label="Where" value={event.where} icon="map-marker-outline" iconColor="#d9534f" />
          <InfoRow label="Why" value={event.why} icon="help-circle-outline" />
          <InfoRow label="Requirements" value={event.requirements} icon="clipboard-text-outline" />
          
          <View style={styles.dateSection}>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>{event.startDate || 'TBA'}</Text>
            </View>
            <View style={[styles.dateBox, { borderLeftWidth: 1, borderLeftColor: '#eee' }]}>
              <Text style={styles.dateLabel}>End of Event</Text>
              <Text style={styles.dateValue}>{event.endDate || 'TBA'}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Full Description</Text>
            <Text style={styles.descriptionText}>{event.description || 'No description provided.'}</Text>
          </View>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep your existing StyleSheet exactly as it was!
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 24, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  mainHeader: { fontSize: 24, fontWeight: 'bold', color: '#1d50a2', textAlign: 'center', marginBottom: 15 },
  headerDivider: { height: 2, backgroundColor: '#f0f4f8', width: '40%', alignSelf: 'center', marginBottom: 25 },
  infoRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start' },
  iconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  textContainer: { flex: 1 },
  label: { fontSize: 12, fontWeight: '800', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  value: { fontSize: 16, color: '#2d3748', lineHeight: 22, fontWeight: '500' },
  dateSection: { flexDirection: 'row', marginTop: 15, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f0f4f8' },
  dateBox: { flex: 1, alignItems: 'center' },
  dateLabel: { fontSize: 11, color: '#718096', textTransform: 'uppercase', marginBottom: 4 },
  dateValue: { fontSize: 14, fontWeight: '700', color: '#1d50a2' },
  descriptionContainer: { marginTop: 25, padding: 15, backgroundColor: '#f8fafc', borderRadius: 12 },
  descriptionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1d50a2', marginBottom: 8 },
  descriptionText: { fontSize: 15, color: '#4a5568', lineHeight: 24 },
  primaryButton: { backgroundColor: '#1d50a2', padding: 20, borderRadius: 16, marginTop: 25, alignItems: 'center', marginBottom: 30, shadowColor: '#1d50a2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  primaryButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1.2 }
});