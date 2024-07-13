import { ProvideActivities } from '@/hooks/useActivities';
import { ProvideAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ProvideRecords } from '@/hooks/useRecords';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import {
  PaperProvider,
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#018786',
  },
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#00B1B7',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ProvideAuth>
      <ProvideActivities>
        <ProvideRecords>
          <SafeAreaProvider>
            <PaperProvider theme={theme}>
              <Stack>
                <Stack.Screen
                  name='tabs'
                  options={{ headerShown: false, headerTitle: 'Historical' }}
                />
                <Stack.Screen
                  name='authentication'
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='activityReport/index'
                  options={{
                    headerTitle: 'Activity Report',
                    headerStyle: {
                      backgroundColor:
                        Colors[colorScheme ?? 'light'].backgroundItem,
                    },
                    headerTitleStyle: {
                      color: Colors[colorScheme ?? 'light'].text,
                    },
                    contentStyle: {
                      backgroundColor:
                        Colors[colorScheme ?? 'light'].background,
                    },
                  }}
                />
              </Stack>
            </PaperProvider>
          </SafeAreaProvider>
        </ProvideRecords>
      </ProvideActivities>
    </ProvideAuth>
  );
}
