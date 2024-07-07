import { Stack } from 'expo-router';


export default function AuthenticationLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='login/index' options={{ headerTitle: "Login" }} />
      <Stack.Screen name='signup/index' options={{ headerTitle: "Sign up" }} />
    </Stack>
  );
}
