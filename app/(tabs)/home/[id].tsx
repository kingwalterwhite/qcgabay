// qcgabay/app/inquiry/[id].tsx

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig';

export default function InquiryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the specific inquiry document
  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'inquiries', id as string), (docSnap) => {
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setData(null);
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

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found', headerShown: true }} />
        <View style={styles.centered}><Text>Information not found!</Text></View>
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
        <Text style={styles.value}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: data.category || 'Information Details', 
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10, padding: 5 }}>
              <Ionicons name="chevron-back" size={28} color="#1d50a2" />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: 'white' },
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.mainHeader}>{data.title}</Text>
          <View style={styles.headerDivider} />

          <InfoRow label="Category" value={data.category} icon="tag-outline" />
          <InfoRow label="Schedule" value={data.date} icon="clock-outline" />
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Requirements</Text>
            <Text style={styles.descriptionText}>{data.requirements || 'No requirements listed.'}</Text>
          </View>

          <View style={[styles.descriptionContainer, { marginTop: 15 }]}>
            <Text style={styles.descriptionTitle}>Step-by-Step Process</Text>
            <Text style={styles.descriptionText}>{data.process || 'No process listed.'}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  descriptionContainer: { marginTop: 25, padding: 15, backgroundColor: '#f8fafc', borderRadius: 12 },
  descriptionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1d50a2', marginBottom: 8 },
  descriptionText: { fontSize: 15, color: '#4a5568', lineHeight: 24 },
});