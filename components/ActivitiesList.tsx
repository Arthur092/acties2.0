import React from 'react';
import { View } from 'react-native';
import { Divider, List, Snackbar } from 'react-native-paper';
import { ActivityType } from '../constants/Types';
import { theme as coreTheme } from '../core/theme';
import { Timestamp } from '@firebase/firestore-types';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = {
  activityTypes: ActivityType[];
  snackBar: {
    visible: boolean;
    message: string;
    error: boolean;
  };
  setSnackBar: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      message: string;
      error: boolean;
    }>
  >;
  showDialog: (value: boolean, activity: ActivityType) => void;
  icon: string;
};

export const ActivitiesList = ({
  activityTypes,
  snackBar,
  setSnackBar,
  showDialog,
  icon,
}: Props) => {
  const backgroundItem = useThemeColor({}, 'backgroundItem');
  const divider = useThemeColor({}, 'divider');
  const activityTypesWithDates = activityTypes.filter(at => at.addedAt);
  const activityTypesWithoutDates = activityTypes.filter(at => !at.addedAt);

  activityTypesWithDates.sort((a, b) => {
    return (
      (a.addedAt as Timestamp).toMillis() - (b.addedAt as Timestamp).toMillis()
    );
  });
  return (
    <>
      <List.Section>
        {activityTypesWithoutDates
          .concat(activityTypesWithDates)
          .map((activity, index) => (
            <View key={index}>
              <Divider style={{ backgroundColor: divider }} />
              <List.Item
                testID={`list-${index}`}
                title={activity.name}
                left={() => (
                  <List.Icon
                    icon={activity.iconName}
                    color={activity.iconColor}
                  />
                )}
                right={() => <List.Icon icon={icon} />}
                onPress={() => showDialog(true, activity)}
                style={{ backgroundColor: backgroundItem }}
              />
            </View>
          ))}
        <Divider />
      </List.Section>
      <Snackbar
        visible={snackBar.visible}
        onDismiss={() => setSnackBar({ ...snackBar, visible: false })}
        style={
          snackBar.error
            ? { backgroundColor: coreTheme.colors.error }
            : { backgroundColor: coreTheme.colors.success }
        }
      >
        {snackBar.message}
      </Snackbar>
    </>
  );
};
