import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
  List,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { emptyValidator, monthDayValidator } from '../helpers/validators';
import { theme } from '../core/theme';
import { Text } from 'react-native-paper';
import {
  createActivityType,
  deleteActivity,
  updateActivityType,
} from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { ActivityType } from '../constants/Types';
import IconPicker from 'react-native-icon-picker';
import DropDown from 'react-native-paper-dropdown';
import { Switch } from 'react-native-paper';

interface Props {
  activity: ActivityType | null;
  visible: boolean;
  showDialog: (value: boolean, activity?: ActivityType) => void;
  onSuccessCallback: () => void;
  setSnackBar: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      message: string;
      error: boolean;
    }>
  >;
}

export const ActivityDialog = ({
  visible,
  showDialog,
  setSnackBar,
  activity,
  onSuccessCallback,
}: Props) => {
  const { user } = useAuth();
  const theme = useTheme();
  const { colors } = theme;

  // Month day
  const [monthDay, setMonthDay] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  //Icon Picker
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconName, setIconName] = useState('');

  //Color Picker
  const [showDropDown, setShowDropDown] = useState(false);
  const [iconColor, setIconColor] = useState('');

  //isNotes
  const [isNote, setIsNote] = useState(false);

  //is fullView
  const [isFullView, setIsFullView] = useState(false);

  //isNumber
  const [isQuantity, setIsQuantity] = useState(false);

  //isNumber
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    fillModal();
  }, [activity]);

  useEffect(() => {
    if (visible) {
      fillModal();
    }
  }, [visible]);

  const colorList = [
    {
      label: 'Red',
      value: 'red',
    },
    {
      label: 'Purple',
      value: 'mediumpurple',
    },
    {
      label: 'Cyan',
      value: '#00BCD4',
    },
    {
      label: 'Lime',
      value: 'lime',
    },
    {
      label: 'Orange',
      value: 'orange',
    },
    {
      label: 'Brown',
      value: '#A1887F',
    },
    {
      label: 'Yellow',
      value: '#FFEE58',
    },
  ];

  useEffect(() => {
    if (isQuantity || isNote) {
      setErrors({ ...errors, ['boolean']: '' });
    } else if (!isQuantity && !isNote) {
      setErrors({ ...errors, ['boolean']: 'Number or note should be enabled' });
    }
    if (!visible) {
      setErrors({});
    }
  }, [isNote, isQuantity]);

  const dismissDialog = () => {
    setName('');
    setMonthDay('');
    setIconName('');
    setIconColor('');
    setCurrency('');
    setIsQuantity(false);
    setIsNote(false);
    setIsFullView(false);
    showDialog(false);
    setErrors({});
  };

  const fillModal = () => {
    if (activity) {
      setName(activity.name);
      setMonthDay(activity.monthDay ? String(activity.monthDay) : '');
      setIconName(activity.iconName);
      setIconColor(activity.iconColor);
      setIsQuantity(activity.isQuantity);
      setIsNote(activity.isNote ?? false);
      setIsFullView(activity.isFullView ?? false);
      setCurrency(activity.currency ?? '');
    }
  };

  const onChangeName = (name: string) => {
    const nameError = emptyValidator(name);
    setErrors({ ...errors, ['name']: nameError });
    setName(name);
  };

  const onChangedMonthDay = (number: string) => {
    const numberError = monthDayValidator(number);
    setErrors({ ...errors, ['monthDay']: numberError });
    const newNumber = number.replace(/[^0-9.]/g, '');
    setMonthDay(newNumber);
  };

  const onSubmit = async () => {
    // add validation for all the fields
    const currentErrors: Record<string, string> = {};
    if (!name) {
      currentErrors['name'] = 'You must select a name';
    }
    if (!iconName) {
      currentErrors['icon'] = 'You must select an icon';
    }
    if (!iconColor) {
      currentErrors['color'] = 'You must select a color';
    }
    if (!(isNote || isQuantity)) {
      currentErrors['boolean'] = 'Number or note should be enabled';
    }
    const numberError = monthDayValidator(monthDay);
    if (numberError) {
      currentErrors['monthDay'] = numberError;
    }
    if (Object.entries(currentErrors).some(([key, value]) => value)) {
      setErrors(currentErrors);
      return;
    }
    try {
      const newActivitytype: ActivityType = {
        name,
        iconName,
        iconColor,
        isQuantity,
        isNote,
        isFullView,
        userId: user!.uid,
        currency,
      };
      if (monthDay) {
        newActivitytype['monthDay'] = parseInt(monthDay);
      }

      if (activity) {
        await updateActivityType({
          ...newActivitytype,
          addedAt: activity.addedAt ?? new Date(),
          id: activity.id,
        });
        setSnackBar({
          visible: true,
          message: 'Activity updated successfuly!',
          error: false,
        });
      } else {
        await createActivityType({ ...newActivitytype, addedAt: new Date() });
        setSnackBar({
          visible: true,
          message: 'New activity added successfuly!',
          error: false,
        });
      }
      onSuccessCallback();
    } catch (error) {
      console.log('error', error);
      setSnackBar({
        visible: true,
        message: 'Oppp!, an error ocurred',
        error: true,
      });
    }
    dismissDialog();
  };

  const onDelete = async () => {
    if (activity) {
      await deleteActivity(activity);
      setSnackBar({
        visible: true,
        message: 'Record deleted succesfully!',
        error: false,
      });
    }
    dismissDialog();
  };

  return (
    <>
      <View>
        <Portal>
          <Dialog visible={visible} onDismiss={dismissDialog}>
            <Dialog.Content testID='new-activity-dialog'>
              <View style={styles.input}>
                <TextInput
                  label='Name'
                  value={name}
                  onChangeText={onChangeName}
                  placeholder='eg. Supermarket'
                  mode='outlined'                  
                  error={errors['name'] ? true : false}
                />
                {errors['name'] ? (
                  <Text testID='input-qty-error' style={styles.error}>
                    {errors['name']}
                  </Text>
                ) : null}
                <IconPicker
                  showIconPicker={showIconPicker}
                  toggleIconPicker={() => setShowIconPicker(!showIconPicker)}
                  iconDetails={[
                    {
                      family: 'MaterialCommunityIcons',
                      icons: [
                        'shopping',
                        'gas-station',
                        'medical-bag',
                        'account',
                        'account-group',
                        'account-heart-outline',
                        'bell',
                        'book',
                        'face-woman',
                        'arm-flex',
                        'calendar-month',
                        'near-me',
                        'airplane',
                        'ambulance',
                        'apple',
                        'cards-heart',
                        'apple-icloud',
                        'bottle-wine',
                        'campfire',
                        'walk',
                        'run',
                        'music',
                      ],
                    },
                  ]}
                  onSelect={(icon: any) => {
                    setIconName(icon.icon);
                    setShowIconPicker(false);
                    setErrors({ ...errors, ['icon']: '' });
                  }}
                  content={
                    iconName ? (
                      <List.Icon icon={iconName} color={iconColor ?? 'red'} />
                    ) : (
                      <View style={styles.icon}>
                        <Text
                          style={{
                            color: colors.primary,
                            fontWeight: 'bold',
                            fontSize: 15,
                          }}
                        >
                          Select an icon
                        </Text>
                      </View>
                    )
                  }
                />
                <View style={styles.input}>
                  <DropDown
                    label={'Color'}
                    mode={'outlined'}
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => setShowDropDown(false)}
                    value={iconColor}
                    setValue={color => {
                      setIconColor(color);
                      setErrors({ ...errors, ['color']: '' });
                    }}
                    list={colorList}
                    dropDownItemTextStyle={{ color: colors.onSurface }}
                  />
                </View>
                <View style={styles.input}>
                  <Text
                    style={{
                      paddingBottom: 5,
                      color: colors.onSurface,
                      fontSize: 15,
                    }}
                  >
                    Include Number
                  </Text>
                  <Switch
                    value={isQuantity}
                    onValueChange={() => setIsQuantity(!isQuantity)}
                  />
                </View>
                <View style={styles.input}>
                  <Text
                    style={{
                      paddingBottom: 5,
                      color: colors.onSurface,
                      fontSize: 15,
                    }}
                  >
                    Include Note
                  </Text>
                  <Switch
                    value={isNote}
                    onValueChange={() => setIsNote(!isNote)}
                  />
                </View>
                <View style={styles.input}>
                  <Text
                    style={{
                      paddingBottom: 5,
                      color: colors.onSurface,
                      fontSize: 15,
                    }}
                  >
                    Enable Default Regular View
                  </Text>
                  <Switch
                    value={isFullView}
                    onValueChange={() => setIsFullView(!isFullView)}
                  />
                </View>
                <TextInput
                  testID='input-day'
                  label='Day of month'
                  value={monthDay}
                  onChangeText={onChangedMonthDay}
                  placeholder='eg. 1'
                  mode='outlined'                  
                  error={errors['monthDay'] ? true : false}
                />
                <TextInput
                  testID='input-currency'
                  label='Currency'
                  value={currency}
                  onChangeText={setCurrency}
                  placeholder='eg. L.'
                  mode='outlined'
                />
                {errors['monthDay'] ? (
                  <Text testID='input-qty-error' style={styles.error}>
                    {errors['monthDay']}
                  </Text>
                ) : null}
              </View>
              {Object.entries(errors)
                .filter(([key, value]) => key !== 'name' && key !== 'monthDay')
                .map(([key, value]) => (
                  <Text
                    key={key}
                    testID='input-global-error'
                    style={styles.error}
                  >
                    {value}
                  </Text>
                ))}
            </Dialog.Content>
            <Dialog.Actions>
              <Button testID='dialog-cancel-button' onPress={dismissDialog}>
                Cancel
              </Button>
              <Button testID='dialog-done-button' onPress={onSubmit}>
                Done
              </Button>
              {activity && (
                <Button
                  testID='dialog-delete-activity-button'
                  onPress={onDelete}
                >
                  Delete
                </Button>
              )}
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 15,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingLeft: 10,
    paddingTop: 5,
  },
  icon: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
