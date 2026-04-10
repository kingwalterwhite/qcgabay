// QCGabay/app/(admin)/_layout.tsx

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#1d50a2',
      headerShown: true,
      headerStyle: { backgroundColor: '#5687d6' },
      headerTintColor: '#fff',
    }}>
      <Tabs.Screen 
        name="dashboard/index" 
        options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} 
      />

       <Tabs.Screen 
        name="admininquiries/index" 
        options={{ title: 'Inquiries', tabBarIcon: ({ color }) => <Ionicons name="document-attach-outline" size={24} color={color} /> }} 
      />


      <Tabs.Screen 
        name="users/index" 
        options={{ title: 'Users', tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} /> }} 
      />

       <Tabs.Screen 
        name="adminevents/index" 
        options={{ title: 'Events', tabBarIcon: ({ color }) => <MaterialIcons name="celebration" size={24} color={color} /> }} 
      />

      <Tabs.Screen 
        name="admincalendar/index" 
        options={{ title: 'Calendar', tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} /> }} 
      />
      
      <Tabs.Screen 
        name="adminannouncements/index" 
        options={{ title: 'Announcements', tabBarIcon: ({ color }) => <Ionicons name="megaphone" size={24} color={color} /> }} 
      />
     
      <Tabs.Screen 
        name="settings/index" 
        options={{ title: 'Settings', tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} /> }} 
      />
    </Tabs>
  );
}