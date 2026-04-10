// qcgabay/app/(tabs)/location/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { db } from '../../firebaseConfig';
import { styles } from './styles';

export default function LocationScreen() {
  const router = useRouter();
  const auth = getAuth();
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load the selected barangay continuously from user profile
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().barangay) {
        setSelectedBarangay(docSnap.data().barangay);
      } else {
        setSelectedBarangay(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveBarangayPreference = async (brgy: string | null) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in to save your barangay.");
      return;
    }

    try {
      // Merge: true ensures we don't overwrite other fields in the user's document
      await setDoc(doc(db, 'users', user.uid), { barangay: brgy }, { merge: true });
      if (brgy) {
        Alert.alert("Success", `Barangay set to ${brgy}. Your events will now be filtered.`);
      } else {
        Alert.alert("Cleared", "Specific barangay preference cleared. Showing all events.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not update your barangay preference.");
    }
  };

  const handleSelectBarangay = (brgy: string) => {
    saveBarangayPreference(brgy);
    setShowDropdown(false);
  };

  // Leaflet HTML with Specific QC Markers
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          #map { height: 100vh; width: 100vw; margin: 0; padding: 0; }
          .leaflet-control-attribution { display: none; }
          .custom-label { font-weight: bold; color: #1d50a2; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Initialize map centered around Project 7 area
          var map = L.map('map').setView([14.6530, 121.0250], 15);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          // Marker 1: Barangay Bungad
          var bungad = L.marker([14.6538, 121.0215]).addTo(map)
            .bindPopup('<b>Barangay Bungad</b><br>District 1, Quezon City');

          // Marker 2: Veterans Village
          var veterans = L.marker([14.6558, 121.0280]).addTo(map)
            .bindPopup('<b>Veterans Village</b><br>Project 7, District 1');

          // Add a circle to show the general Project 7 area
          L.circle([14.6548, 121.0250], {
            color: '#1d50a2',
            fillColor: '#3498db',
            fillOpacity: 0.2,
            radius: 500
          }).addTo(map);

          // Group markers to auto-zoom to fit both
          var group = new L.featureGroup([bungad, veterans]);
          map.fitBounds(group.getBounds().pad(0.5));
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('./more')} activeOpacity={0.7} >
          <Ionicons name="arrow-back" size={24} color="#1d50a2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QC Gabay Barangay Map</Text>
      </View>

      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe 
            srcDoc={mapHTML} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
            title="QC Map"
          />
        ) : (
          <WebView 
            originWhitelist={['*']}
            source={{ html: mapHTML }}
            style={{ flex: 1 }}
          />
        )}
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.sectionLabel}>Select your residence</Text>
        
        <TouchableOpacity
          style={styles.dropdownToggle}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={[styles.dropdownToggleText, !selectedBarangay && { color: '#999' }]}>
            {selectedBarangay ? selectedBarangay : 'Set your Barangay...'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {selectedBarangay && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => saveBarangayPreference(null)}>
            <Ionicons name="close-circle-outline" size={18} color="#d9534f" />
            <Text style={styles.clearBtnText}>Undo / Clear Specific Barangay</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.gpsButton}>
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.gpsButtonText}>Detect My Location</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal imitating Delete Confirmation Modal style */}
      <Modal visible={showDropdown} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmContainer}>
            <Text style={styles.confirmMessage}>Select Target Barangay</Text>
            
            <TouchableOpacity 
              style={[styles.dropdownItem, selectedBarangay === 'Bungad' && styles.dropdownItemSelected]} 
              onPress={() => handleSelectBarangay("Bungad")}
            >
              <Text style={[styles.dropdownItemText, selectedBarangay === 'Bungad' && styles.dropdownItemTextSelected]}>Bungad</Text>
              {selectedBarangay === 'Bungad' && <Ionicons name="checkmark" size={20} color="#1d50a2" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.dropdownItem, selectedBarangay === 'Veterans' && styles.dropdownItemSelected]} 
              onPress={() => handleSelectBarangay("Veterans")}
            >
              <Text style={[styles.dropdownItemText, selectedBarangay === 'Veterans' && styles.dropdownItemTextSelected]}>Veterans</Text>
              {selectedBarangay === 'Veterans' && <Ionicons name="checkmark" size={20} color="#1d50a2" />}
            </TouchableOpacity>

            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.cancelBtn, { flex: 1, marginTop: 15 }]}
                onPress={() => setShowDropdown(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}