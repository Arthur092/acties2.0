import { Timestamp } from '@firebase/firestore-types';

export type ActivityType = {
  id?: string;
  name: string;
  isQuantity: boolean;
  iconName: string;
  iconColor: string;
  userId?: string | null;
  monthDay?: number;
  isNote?: boolean;
  currency?: string;
  addedAt?: Date | Timestamp;
};

export type RecordType = {
  id?: string;
  activity: ActivityType;
  date: Date | Timestamp;
  quantity: number | null;
  note?: string;
  userId: string | null;
  activityId: string;
};
