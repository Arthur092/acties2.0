import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Home() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? (
    <Redirect href={'tabs'} />
  ) : (
    <Redirect href={'authentication'} />
  );
}
