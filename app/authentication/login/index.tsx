import React, { useState } from 'react';
import { TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';

import { Snackbar, Text } from 'react-native-paper';
import Background from '@/components/Authentication/Background';
import Logo from '@/components/Authentication/Logo';
import Header from '@/components/Authentication/Header';
import TextInput from '@/components/Authentication/TextInput';
import { theme } from '@/core/theme';
import { useAuth } from '@/hooks/useAuth';
import { emailValidator, passwordValidator } from '@/helpers/validators';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StaticButton } from '@/components/Authentication/StaticButton';

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const { signin } = useAuth();
  const [isSnackBar, setIsSnackBar] = useState(false);

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      await signin(email.value, password.value);
      router.navigate('/');
    } catch (error) {
      setIsSnackBar(true);
      console.log('error', error);
    }
  };

  return (
    <Background>
      <Logo />
      <Header>Welcome back</Header>
      <TextInput
        label='Email'
        returnKeyType='next'
        value={email.value}
        onChangeText={(text: any) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize='none'
        autoCompleteType='email'
        textContentType='emailAddress'
        keyboardType='email-address'
        description={undefined}
      />
      <TextInput
        label='Password'
        returnKeyType='done'
        value={password.value}
        onChangeText={(text: any) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        description={undefined}
      />
      <StaticButton onPress={onLoginPressed} style={undefined}>
        Login
      </StaticButton>
      <View style={styles.row}>
        <Text> Don’t have an account? </Text>
        <TouchableOpacity
          onPress={() => router.replace('/authentication/signup')}
        >
          <Text style={{ ...styles.link, color: colors.primary }}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <Snackbar
        visible={isSnackBar}
        onDismiss={() => setIsSnackBar(false)}
        style={styles.snackBar}
      >
        An error has occured
      </Snackbar>
    </Background>
  );
}

const styles: Record<string, ViewStyle | TextStyle> = {
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
  },
  snackBar: {
    backgroundColor: theme.colors.error,
  },
};
