import { ActivityIndicator } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export function ActivitySpinner() {
    return <ActivityIndicator
        animating={true}
        size='large'
        style={styles.spinner} />
  }

  const styles = StyleSheet.create({
    spinner: {
      justifyContent: 'center',
      flex: 1,
    }
  })