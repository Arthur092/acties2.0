import { RecordType } from '@/constants/Types';
import { useRecords } from '@/hooks/useRecords';
import { RecordsTable } from '@/components/RecordsTable';
import { ActivitySpinner } from '@/components/ActivitySpinner';

export default function LastScreen() {
  const { lastRecords } = useRecords();

  if (lastRecords.isLoading) return <ActivitySpinner />;

  return (
    <RecordsTable
      records={lastRecords.data}
      onPress={(element: RecordType) => {
        // navigation.navigate('ActivityReport', {
        //   activity: element.activity,
        // });
      }}
    />
  );
}
