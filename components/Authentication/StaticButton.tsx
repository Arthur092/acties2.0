import { StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native';
import Button from './Button';

interface StaticButtonProps {
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const StaticButton: React.FC<StaticButtonProps> = ({
  onPress,
  style,
  children,
}) => (
  <Button mode='contained' onPress={onPress} style={style}>
    <Text style={{ color: '#fff' }}>{children}</Text>
  </Button>
);
