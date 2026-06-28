// QCGabay/app/(tabs)/_layout.tsx

import { Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../(auth)/AuthContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const [authKey, setAuthKey] = useState(0);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!loading) {
      setAuthKey(prev => prev + 1);
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;

    const segmentArray = segments as string[];
    const inAuthRoute = segmentArray.includes('login') || segmentArray.includes('signup');

    if (user && inAuthRoute) {
      router.replace('/home');
    }

    if (!user && !inAuthRoute) {
      // optional: restrict pages if needed
    }
  }, [user, loading, segments]);

  if (loading) return null;

  return (
    <Tabs
      key={authKey}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#ff6b6b',
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen name="home/index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Entypo name="home" size={28} color={color} /> }} />
      <Tabs.Screen name="events/index" options={{ title: 'Events', tabBarIcon: ({ color }) => <MaterialIcons name="celebration" size={28} color={color} /> }} />
      <Tabs.Screen name="calendar/index" options={{ title: 'Calendar', tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} /> }} />
      <Tabs.Screen name="announcements/index" options={{ title: 'Announcements', tabBarIcon: ({ color }) => <Ionicons name="notifications" size={28} color={color} /> }} />
      <Tabs.Screen name="more/index" options={{ title: 'More', tabBarIcon: ({ color }) => <Entypo name="list" size={28} color={color} /> }} />

      <Tabs.Screen name="events/[id]" options={{ href: null , 
      tabBarStyle: { display: 'none' }}} />
      <Tabs.Screen name="about/index" options={{ href: null , 
      tabBarStyle: { display: 'none' }}} />
      <Tabs.Screen name="location/index" options={{ href: null , 
      tabBarStyle: { display: 'none' }}} />
      <Tabs.Screen name="contacts/index" options={{ href: null , 
      tabBarStyle: { display: 'none' }}} />
            <Tabs.Screen name="home/[id]" options={{ href: null , 
      tabBarStyle: { display: 'none' }}} />


    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}