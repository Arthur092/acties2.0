import { useEffect, useState } from 'react';
import { RecordType } from "../constants/Types";
import { useRecords } from '../hooks/useRecords';
import { Timestamp } from '@firebase/firestore-types'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecordsTable } from '../components/RecordsTable';
import { RootStackParamList } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LastScreen'>;

const LastScreen = ({ navigation }: Props) => {
  const [records, setRecords] = useState<Record<string, RecordType>>({});
  const { records: fetchRecords } = useRecords();

  useEffect(() => {
    const initialRecords: Record<string, RecordType> = fetchRecords.data.reduce((acc: Record<string, RecordType>, element: RecordType) => {
      const existingElement = Object.keys(acc).find(el => el === element.activity.name)
      if(existingElement){
        if((element.date as Timestamp).toMillis() > (acc[existingElement].date as Timestamp).toMillis()){
          acc = Object.assign(acc, {[existingElement]: element})
        }
      }else {
        acc = Object.assign(acc, {[element.activity.name]: element})
      }

      return acc;
    }, {});
    setRecords(initialRecords);
  }, [fetchRecords]);

  return (
    <RecordsTable
      records={Object.entries(records).map(([name, element]) => element)}
      onPress={(element: RecordType) => {
        navigation.navigate('ActivityReport', {
          activity: element.activity
        })}
      }
    />
  );
}

export default LastScreen;