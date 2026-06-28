import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export default function AboutPage() {
  const router = useRouter();


  const teamMembers = [
    { 
      name: "Alex Arthur Enzon", 
      role: "Project Lead", 
      image: require('../../../assets/images/enzon.png')
    },
    { 
      name: "Bryan Gabriel Francisco", 
      role: "Lead Developer", 
      image: require('../../../assets/images/francisco.png') 
    },

    { 
      name: "Olex gammad", 
      role: "Information Security", 
      image: require('../../../assets/images/gammad.png') 
    },
   
    { 
      name: "Daniel Josh Gapasin", 
      role: "Quality Assurance", 
      image: require('../../../assets/images/gapasin.png') 
    },
    { 
      name: "Danielle Raven Garcia", 
      role: "System Analyst", 
      image: require('../../../assets/images/garcia.png') 
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('./more')} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1d50a2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About QC Gabay</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>QC GABAY</Text>
          <Text style={styles.appTagline}>Your Digital Guide to the Barangay(s) of Quezon City </Text>
        </View>

        {/* Mission Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="rocket-outline" size={20} color="#1d50a2" />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.description}>
            QC Gabay is a mobile app that informs Quezon City residents
            about barangay announcements, events, and updates, while simplifying
            government document processing, ensuring convenience and reducing multiple
            barangay visits.
          </Text>
        </View>

        {/* Vision Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="eye-outline" size={20} color="#1d50a2" />
            <Text style={styles.sectionTitle}>The Vision</Text>
          </View>
          <Text style={styles.description}>
            To build a well-informed and digitally connected "Kyusi" community where
            every citizen has easy access to city-wide barangay information.
          </Text>
        </View>

        {/* The Development Team Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={22} color="#1d50a2" />
            <Text style={styles.sectionTitle}>The Development Team</Text>
          </View>

          <View style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.memberCard}>
                <View style={styles.photoContainer}>
                  {member.image ? (
                    // This will render if you updated the require() path above
                    <Image source={member.image} style={styles.memberPhoto} />
                  ) : (
                    // This is the placeholder (renders if require fails or image is null)
                    <View style={styles.photoPlaceholder}>
                      <Ionicons name="person" size={30} color="#1d50a2" />
                    </View>
                  )}
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName} numberOfLines={2}>
                    {member.name}
                  </Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Developed by Group 2</Text>
          <Text style={styles.footerSubText}>Technological Institute of the Philippines</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}