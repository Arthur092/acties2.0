import moment, { Moment } from 'moment';
import {
  ColorSchemeName,
  ScrollView,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { IconButton, Snackbar, Text } from 'react-native-paper';
import { ActivityType, RecordType } from '@/constants/Types';
import { useRecords } from '@/hooks/useRecords';
import { Button } from 'react-native-paper';
import { RecordsTable } from '@/components/RecordsTable';
import { RecordDialog } from '@/components/RecordDialog';
import { theme as coreTheme } from '@/core/theme';
import { useLocalSearchParams } from 'expo-router';
import { getActivityTypeById } from '@/firebase';
import { ActivitySpinner } from '@/components/ActivitySpinner';
import { Colors } from '@/constants/Colors';

export default function ActivityReport() {
  const colorScheme = useColorScheme();
  const { activityId } = useLocalSearchParams();
  const [activity, setActivity] = useState<ActivityType | undefined>();
  const [monthlyViewDate, setMonthlyViewDate] = useState<Date | null>(null);
  const [isDialogVisile, setIsDialogVisile] = useState(false);
  const [snackBar, setSnackBar] = useState({
    visible: false,
    message: '',
    error: false,
  });
  const [currentRecord, setCurrentRecord] = useState<RecordType | null>(null);
  const {
    getMonthlyRecords,
    getRecordsByActivity,
    monthlyRecords,
    recordsByActivity,
  } = useRecords();

  const fetchMonthlyRecords = async (
    startDate?: Date,
    currentActivity = activity as ActivityType
  ) => {
    const currentMonthDate = startDate ?? new Date();
    if (currentActivity.monthDay) {
      const currentMonthDay = new Date(
        currentMonthDate.setDate(currentActivity.monthDay)
      ).setHours(23, 59, 59, 999);
      const nextMonthDay = new Date(
        currentMonthDate.setMonth(
          currentMonthDate.getMonth() + 1,
          currentActivity.monthDay
        )
      ).setHours(23, 59, 59, 999);
      getMonthlyRecords(
        activityId as string,
        new Date(currentMonthDay),
        new Date(nextMonthDay)
      );
    } else {
      const startOfMOnth = new Date(
        currentMonthDate.getFullYear(),
        currentMonthDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentMonthDate.getFullYear(),
        currentMonthDate.getMonth() + 1,
        0
      );
      getMonthlyRecords(activityId as string, startOfMOnth, endOfMonth);
    }
  };

  useEffect(() => {
    const getActivity = async () => {
      const fetchedActivity = await getActivityTypeById(activityId as string);
      setActivity(fetchedActivity);
      if (activity?.isFullView) {
        getRecordsByActivity(activityId as string);
        setMonthlyViewDate(null);
      } else {
        fetchMonthlyRecords(undefined, fetchedActivity);
        setMonthlyViewDate(new Date());
      }
    };
    getActivity();
  }, []);

  if (!activity || monthlyRecords.isLoading || recordsByActivity.isLoading) {
    return <ActivitySpinner />;
  }

  const showDialog = (value: boolean, recordData: RecordType | null = null) => {
    if (value) {
      setSnackBar({ ...snackBar, visible: false });
    }
    if (recordData) {
      setCurrentRecord(recordData);
    }
    setIsDialogVisile(value);
  };

  const onRegularView = () => {
    setMonthlyViewDate(null);
    getRecordsByActivity(activityId as string);
  };

  const onMontlyView = () => {
    setMonthlyViewDate(new Date());
    fetchMonthlyRecords();
  };

  const onChangeMonth = (direction: 'prev' | 'next') => {
    let newMonthDate: Moment;
    if (direction === 'next') {
      newMonthDate = moment(monthlyViewDate)!.add(1, 'months');
    } else {
      newMonthDate = moment(monthlyViewDate)!.subtract(1, 'months');
    }
    if (activity.monthDay) {
      const currentMonthDay = moment(newMonthDate)
        .endOf('day')
        .date(activity.monthDay!);
      fetchMonthlyRecords(currentMonthDay.toDate());
    } else {
      const currentMonthDay = new Date(newMonthDate.toDate());
      fetchMonthlyRecords(currentMonthDay);
    }
    setMonthlyViewDate(newMonthDate.toDate());
  };

  return (
    <>
      <ScrollView>
        {monthlyViewDate && (
          <View style={styles.monthlyContainer}>
            <IconButton
              icon='arrow-left'
              style={styles.monthlyItem}
              size={20}
              onPress={() => onChangeMonth('prev')}
            />
            {activity.monthDay ? (
              <>
                <Text style={styles.monthlyText}>
                  {activity.monthDay}th {moment(monthlyViewDate).format('MMM')}/
                  {moment(monthlyViewDate).add(1, 'months').format('MMM')} -{' '}
                  {moment(monthlyViewDate).format('YYYY')}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.monthlyText}>
                  {moment(monthlyViewDate).format('MMMM')} -{' '}
                  {moment(monthlyViewDate).format('YYYY')}
                </Text>
              </>
            )}
            <IconButton
              icon='arrow-right'
              style={styles.monthlyItem}
              size={20}
              onPress={() => onChangeMonth('next')}
            />
          </View>
        )}
        <RecordsTable
          records={
            monthlyViewDate ? monthlyRecords.data : recordsByActivity.data
          }
          showTotal={true}
          onPress={(element: RecordType) => {
            showDialog(true, element);
          }}
        />
      </ScrollView>
      <Button
        mode='outlined'
        style={styles.floatButton(colorScheme)}
        onPress={monthlyViewDate ? onRegularView : () => onMontlyView()}
      >
        {monthlyViewDate ? 'Regular View' : 'Mothly View'}
      </Button>
      <RecordDialog
        visible={isDialogVisile}
        showDialog={showDialog}
        currentActivity={activity}
        setSnackBar={setSnackBar}
        recordData={currentRecord}
        onSuccessCallback={() =>
          monthlyViewDate
            ? fetchMonthlyRecords(monthlyViewDate)
            : getRecordsByActivity(activityId as string)
        }
      />
      <Snackbar
        visible={snackBar.visible}
        onDismiss={() => setSnackBar({ ...snackBar, visible: false })}
        style={snackBar.error ? styles.snackBarError : styles.snackBarSuccess}
      >
        {snackBar.message}
      </Snackbar>
    </>
  );
}

const styles = {
  monthlyContainer: {
    flexDirection: 'row',
    paddingTop: 27,
    paddingBottom: 12,
  },
  monthlyItem: {
    flex: 1,
  },
  monthlyText: {
    flex: 2,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    paddingTop: 9,
  },
  snackBarError: {
    backgroundColor: coreTheme.colors.error,
  },
  snackBarSuccess: {
    backgroundColor: coreTheme.colors.success,
  },
  floatButton: (colorScheme: ColorSchemeName): ViewStyle => {
    return {
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      position: 'absolute',
      right: 10,
      bottom: 10,
    };
  },
};
