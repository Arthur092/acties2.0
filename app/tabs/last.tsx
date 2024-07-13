import { RecordType } from '@/constants/Types';
import { useRecords } from '@/hooks/useRecords';
import { RecordsTable } from '@/components/RecordsTable';
import { ActivitySpinner } from '@/components/ActivitySpinner';
import { useRouter } from 'expo-router';

export default function LastScreen() {
  const { lastRecords } = useRecords();
  const router = useRouter();

  if (lastRecords.isLoading) return <ActivitySpinner />;

  return (
    <RecordsTable
      records={lastRecords.data}
      onPress={(element: RecordType) => {
        router.push({
          pathname: '/activityReport',
          params: { activityId: element.activity.id },
        });
      }}
    />
  );
}
