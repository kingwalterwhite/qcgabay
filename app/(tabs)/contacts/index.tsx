import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles'; // Importing your local styles

export default function ContactPage() {
  const router = useRouter();

  const handleCall = () => Linking.openURL('tel:122'); 
  const handleEmail = () => Linking.openURL('mailto:contact@quezoncity.gov.ph');
  const handleFB = () => Linking.openURL('https://www.facebook.com/QuezonCityGov');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('./more')} activeOpacity={0.7} >
          <Ionicons name="arrow-back" size={24} color="#1d50a2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.description}>
            For inquiries, concerns, or emergencies, please use the official channels below:
          </Text>

          {/* Emergency Hotline */}
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="call" size={24} color="#dc2626" />
            </View>
            <View>
              <Text style={styles.contactLabel}>Emergency Hotline</Text>
              <Text style={styles.contactValue}>122</Text>
            </View>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
              <MaterialIcons name="email" size={24} color="#0284c7" />
            </View>
            <View>
              <Text style={styles.contactLabel}>Official Email</Text>
              <Text style={styles.contactValue}>contact@quezoncity.gov.ph</Text>
            </View>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity style={styles.contactItem} onPress={handleFB}>
            <View style={[styles.iconBox, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="logo-facebook" size={24} color="#4338ca" />
            </View>
            <View>
              <Text style={styles.contactLabel}>Facebook Page</Text>
              <Text style={styles.contactValue}>@QuezonCityGov</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}