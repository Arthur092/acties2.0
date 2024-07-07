import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';

interface Props {
  children: Array<JSX.Element>
}

export default function Background({ children }: Props) {
  const { colors } = useTheme();
  return (
    <ImageBackground
      style={{...styles.background, backgroundColor: colors.surface}}
    >
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles: Record<string, ViewStyle> = {
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
