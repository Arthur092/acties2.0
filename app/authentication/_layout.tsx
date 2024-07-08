import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function AuthenticationLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen
        name='login/index'
        options={{
          headerTitle: 'Login',
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].backgroundItem,
          },
          headerTitleStyle: {
            color: Colors[colorScheme ?? 'light'].text,
          },
        }}
      />
      <Stack.Screen
        name='signup/index'
        options={{
          headerTitle: 'Sign up',
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].backgroundItem,
          },
          headerTitleStyle: {
            color: Colors[colorScheme ?? 'light'].text,
          },
        }}
      />
    </Stack>
  );
}
