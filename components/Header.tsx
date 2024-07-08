import React from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { Pressable, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { TabBarIcon } from './navigation/TabBarIcon';

export const Header = () => {
  const { signout, user } = useAuth();
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const signOut = async () => {
    try {
      await signout();
      router.navigate('/');
    } catch (error) {
      console.log('error', error);
    }
  };

  const goToActivities = () => {
    // router.navigate('ActivitiesScreen');
    closeMenu();
  };

  return (
    <Appbar.Header>
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
      <Appbar.Content title="Test" />
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
