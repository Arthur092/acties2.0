import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { TextStyle, ViewStyle } from 'react-native';

export default function Header(props: any) {
  const { colors } = useTheme();
  return (
    <Text style={{ ...styles.header, color: colors.primary }} {...props} />
  );
}

const styles: Record<string, ViewStyle | TextStyle> = {
  header: {
    fontSize: 21,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
};
