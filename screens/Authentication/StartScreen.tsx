import React from 'react'

import Paragraph from '../../components/Authentication/Paragraph'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Background from '../../components/Authentication/Background';
import Header from '../../components/Authentication/Header';
import Logo from '../../components/Authentication/Logo';
import Button from '../../components/Authentication/Button';
import { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'StartScreen'>;

export default function StartScreen({ navigation }: Props) {
  return (
    <Background>
      <Logo />
      <Header>Welcome to Acties!</Header>
      <Paragraph>
        Please select an option to authenticate
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')} style={undefined}>
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')} style={undefined}>
        Sign Up
      </Button>
    </Background>
  )
}
