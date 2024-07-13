import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        header: (props) => <Header {...props} />,       
      }}
      sceneContainerStyle = {{
        backgroundColor: Colors[colorScheme ?? 'light'].background,        
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'New Activity',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name={'plus'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='last'
        options={{
          title: 'Historical',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name={'chart-line'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
