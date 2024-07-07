import React, { useState } from 'react'
import { TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native'

import { Snackbar, Text } from 'react-native-paper'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import Background from '../../components/Authentication/Background'
import Logo from '../../components/Authentication/Logo'
import Header from '../../components/Authentication/Header'
import TextInput from '../../components/Authentication/TextInput'
import Button from '../../components/Authentication/Button'
import { theme } from '../../core/theme'
import { useAuth } from '../../hooks/useAuth'
import { emailValidator, passwordValidator } from '../../helpers/validators'
import { useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'StartScreen'>;

export default function LoginScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const { signin } = useAuth();
  const [isSnackBar, setIsSnackBar] = useState(false);

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    try {
      await signin(email.value, password.value);
    } catch (error) {
      setIsSnackBar(true)
      console.log("error", error);
    }
  }

  return (
    <Background>
      <Logo />
      <Header>Welcome back</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text: any) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address" description={undefined}      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text: any) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry description={undefined}      />
      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
      <Button mode="contained" onPress={onLoginPressed} style={undefined}>
        Login
      </Button>
      <View style={styles.row}>
        <Text> Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={{...styles.link, color: colors.primary}}>Sign up</Text>
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
  )
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
    backgroundColor: theme.colors.error
  }
}
