import moment from 'moment';
import { ViewStyle } from 'react-native';
import { DataTable, List } from 'react-native-paper';
import { RecordType } from "../constants/Types";
import { Timestamp } from '@firebase/firestore-types'
import { formatDecimal } from '../helpers/utils';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = {
    records: Array<RecordType>
    showTotal?: boolean
    onPress?: (element: RecordType) => void
}

const getDetails = (element: RecordType) => {
  if (element.note) {
    const noteArray = element.note.split(' ');
    return noteArray[0];
  }else if (element.quantity){
    const currency = element.activity.currency ? element.activity.currency + ' ' : 'L. ';
    return currency + formatDecimal(element.quantity);
  }

  return '';
}

export const RecordsTable = ({ records, showTotal, onPress }: Props) => {
  const total = records.reduce((acc, record) => {
    acc += record.quantity ?? 0
    return acc;
  }, 0).toFixed(2)
  const background = useThemeColor({}, 'background');
    return (
    <DataTable style={styles.table(useThemeColor)}>
        <DataTable.Header style={styles.header(useThemeColor)}>
            <DataTable.Title style={{flex: 0.5}}>Icon</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>Activity</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>Details</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>date</DataTable.Title>
        </DataTable.Header>
        { records.map((element, index) => {
          const rowDetails = getDetails(element);
          return (
            <DataTable.Row
              key={index}
              onPress={onPress ? () => onPress(element) : () => {}}>
              <DataTable.Cell style={styles.icon}><List.Icon icon={element.activity.iconName} color={element.activity.iconColor}/></DataTable.Cell>
              <DataTable.Cell style={{justifyContent: 'flex-start'}}>{element.activity.name}</DataTable.Cell>
              <DataTable.Cell style={{justifyContent: 'center'}}>{rowDetails}</DataTable.Cell>
              <DataTable.Cell style={{justifyContent: 'center'}}>{moment((element.date as Timestamp).toDate()).format('l')}</DataTable.Cell>
            </DataTable.Row>
        )})}
        {
          showTotal && total > 0 && (
            <DataTable.Row style={{ backgroundColor: background }} key={'total'}>
              <DataTable.Cell style={{justifyContent: 'flex-start'}}>Total:       {records[0].activity.currency && records[0].activity.currency != "" ? records[0].activity.currency : 'L.'} {formatDecimal(total)}</DataTable.Cell>
            </DataTable.Row>
          )
        }
    </DataTable>
    )
}

const styles = {
    table: (theme: any): ViewStyle => {
      return { backgroundColor: theme({}, 'backgroundTable')}
    },
    header: (theme: any): ViewStyle => {
      return { backgroundColor: theme({}, 'background')}
    },
    icon: {
      flex: 0.5,
      marginLeft: -14
    },
  };