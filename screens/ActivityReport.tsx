import moment, { Moment } from 'moment';
import { ScrollView, View, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IconButton, Snackbar, Text } from 'react-native-paper';
import { ActivityType, RecordType } from "../constants/Types";
import { useRecords } from '../hooks/useRecords';
import { Timestamp } from '@firebase/firestore-types'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import { RecordsTable } from '../components/RecordsTable'
import { RecordDialog } from '../components/RecordDialog';
import { theme as coreTheme} from '../core/theme'
import { RootStackParamList } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityReport'> & { activity: ActivityType };

const ActivityReport = ({ route } : Props) => {
  const [records, setRecords] = useState<Array<RecordType>>([]);
  const [monthlyViewDate, setMonthlyViewDate] = useState<Date | null>(null);
  const { records: fetchedRecords } = useRecords();
  const [monthlyRecords, setMonthlyRecords] = useState<Array<RecordType>>([]);
  const { activity } = route.params;
  const [isDialogVisile, setIsDialogVisile] = useState(false);
  const [snackBar, setSnackBar] = useState({visible: false, message: '', error: false});
  const [currentRecord, setCurrentRecord] = useState<RecordType | null>(null);

  const showDialog = (value: boolean, recordData: RecordType | null = null) => {
    if(value){
      setSnackBar({...snackBar, visible: false});
    }
    if(recordData){
      setCurrentRecord(recordData);
    }
    setIsDialogVisile(value);
  };

  useEffect(() => {
    const initialRecords: Array<RecordType> = fetchedRecords.data.reduce((acc: Array<RecordType>, element: RecordType) => {
      if(element.activity.id === activity.id ){
       acc.push(element)
      }
      return acc;
    }, []);
    initialRecords.sort((a,b) => {
      return (b.date as Timestamp).toMillis() - (a.date as Timestamp).toMillis();
    });
    setRecords(initialRecords);
    if(initialRecords.length > 10){
      onMontlyView(initialRecords);
    }
  }, [fetchedRecords]);

  const onMontlyView = (recordsParam: RecordType[] | undefined =  undefined) => {
    const currentRecords = recordsParam ?? records;
    const currentDate = moment().toDate();
    setMonthlyViewDate(currentDate);
    let currentMonthRecords = [];
    if(activity.monthDay){
      const currentMonthDay = moment(currentDate).endOf('day').date(activity.monthDay!);
      const nextMonthDay = moment(currentDate).endOf('day').add(1, 'months').date(activity.monthDay!)
      currentMonthRecords = currentRecords.filter(record => {
        const recordDate = moment((record.date as Timestamp).toDate());
        return recordDate > currentMonthDay && recordDate <= nextMonthDay
      })
    } else {
      currentMonthRecords = currentRecords.filter(record => moment((record.date as Timestamp).toDate()).month() === moment(currentDate).month())
    }
    setMonthlyRecords(currentMonthRecords);
  }

  const onRegularView = () => {
    setMonthlyViewDate(null);
    setMonthlyRecords([]);
    setRecords(records);
  }

  const onChangeMonth = (right: boolean) => {
    let currentMonthRecords = [];
    let newMonthDate: Moment;
    if(right){
      newMonthDate = moment(monthlyViewDate)!.add(1, 'months');
    }else {
      newMonthDate = moment(monthlyViewDate)!.subtract(1, 'months');;
    }
    if(activity.monthDay){
      const currentMonthDay = moment(newMonthDate).endOf('day').date(activity.monthDay!);
      const nextMonthDay = moment(newMonthDate).endOf('day').add(1, 'months').date(activity.monthDay!)
      currentMonthRecords = records.filter(record => {
        const recordDate = moment((record.date as Timestamp).toDate());
        return recordDate > currentMonthDay && recordDate <= nextMonthDay
      })
    } else {
      currentMonthRecords = records.filter(record => moment((record.date as Timestamp).toDate()).month() === newMonthDate.month())
    }
    setMonthlyViewDate(newMonthDate.toDate());
    setMonthlyRecords(currentMonthRecords);
  };

  return (
    <>
      <ScrollView>
      { monthlyViewDate && (
        <View style={styles.monthlyContainer}>
          <IconButton
            icon="arrow-left"
            style={styles.monthlyItem}
            size={20}
            onPress={() => onChangeMonth(false)}
          />
          { activity.monthDay ? (
            <>
              <Text style={styles.monthlyText}>{activity.monthDay}th {moment(monthlyViewDate).format('MMM')}/{moment(monthlyViewDate).add(1, 'months').format('MMM')} - {moment(monthlyViewDate).format('YYYY')}</Text>
            </>) : (
            <>
              <Text style={styles.monthlyText}>{moment(monthlyViewDate).format('MMMM')} - {moment(monthlyViewDate).format('YYYY')}</Text>
            </>)
          }
          <IconButton
            icon="arrow-right"
            style={styles.monthlyItem}
            size={20}
            onPress={() => onChangeMonth(true)}
          />
        </View>
      )}
      <RecordsTable
        records={monthlyViewDate ? monthlyRecords : records}
        showTotal={true}
        onPress={(element: RecordType) => {
          showDialog(true, element)
        }
      }
      />
    </ScrollView>
    <Button mode='outlined' style={styles.floatButton(useThemeColor)} onPress={monthlyViewDate ? onRegularView : () => onMontlyView()}>
      {monthlyViewDate ? "Regular View" : "Mothly View"}
    </Button>
    <RecordDialog
      visible={isDialogVisile}
      showDialog={showDialog}
      currentActivity={activity}
      setSnackBar={setSnackBar}
      recordData={currentRecord}
    />
    <Snackbar
      visible={snackBar.visible}
      onDismiss={() => setSnackBar({...snackBar, visible: false})}
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
    paddingTop: 9
  },
  snackBarError: {
    backgroundColor: coreTheme.colors.error
  },
  snackBarSuccess: {
    backgroundColor: coreTheme.colors.success
  },
  floatButton: (theme: any): ViewStyle => {
    return {
      backgroundColor: theme({}, 'background'),
      position: 'absolute',
      right: 10,
      bottom: 10,
    }
  },
};

export default ActivityReport;