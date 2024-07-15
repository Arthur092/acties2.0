import { ActivitySpinner } from '@/components/ActivitySpinner';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Home() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <ActivitySpinner />;
  return user ? (
    <Redirect href={'tabs'} />
  ) : (
    <Redirect href={'authentication'} />
  );
}
