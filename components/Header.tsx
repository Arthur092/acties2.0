import React from 'react';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { Pressable, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { TabBarIcon } from './navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export const Header = ({ options }: { options: any }) => {
  const { signout, user } = useAuth();
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const colorScheme = useColorScheme();

  const signOut = async () => {
    try {
      closeMenu();
      await signout();
      router.navigate('/');
    } catch (error) {
      console.log('error', error);
    }
  };

  const goToActivities = () => {
    router.navigate('/activities');
    closeMenu();
  };

  return (
    <Appbar.Header style={{ backgroundColor: Colors[colorScheme ?? 'light'].header, }}>
      <View style={{ zIndex: 100 }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon='menu' color='white' onPress={openMenu} />
          }
        >
          <Menu.Item title='Menu' />
          <Menu.Item
            icon='check-circle'
            title='Activities'
            onPress={goToActivities}
          />
          <Menu.Item icon='account' title={user?.email} />
          <Menu.Item icon='logout' onPress={signOut} title='Sign out' />
        </Menu>
      </View>
      <Appbar.Content color='white' title={options.title} />
      <Pressable
        onPress={signOut}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <TabBarIcon name='logout' color='white' />
      </Pressable>
    </Appbar.Header>
  );
};
