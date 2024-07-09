import React from 'react';

import Paragraph from '@/components/Authentication/Paragraph';
import Background from '@/components/Authentication/Background';
import Header from '@/components/Authentication/Header';
import Logo from '@/components/Authentication/Logo';
import Button from '@/components/Authentication/Button';
import { useRouter } from 'expo-router';
import { StaticButton } from '@/components/Authentication/StaticButton';

export default function StartScreen() {
  const router = useRouter();
  return (
    <Background>
      <Logo />
      <Header>Welcome to Acties!</Header>
      <Paragraph>Please select an option to authenticate</Paragraph>
      <StaticButton
        onPress={() => router.push('/authentication/login')}
        style={undefined}
      >
        Login
      </StaticButton>
      
      <Button
        mode='outlined'
        onPress={() => router.push('/authentication/signup')}
        style={undefined}
      >
        Sign Up
      </Button>
    </Background>
  );
}
