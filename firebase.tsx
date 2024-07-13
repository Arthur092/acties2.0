import { initializeApp } from 'firebase/app';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  initializeFirestore,
  setDoc,
  deleteDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import { ActivityType, RecordType } from './constants/Types';
import { getActivityWithId } from './helpers/utils';

const prodConfig = {
  apiKey: 'AIzaSyDlVfIs_a_XCwx3fSxYlsRyktAdqJE0sgc',
  authDomain: 'acties-f8e89.firebaseapp.com',
  databaseURL: 'https://acties-f8e89-default-rtdb.firebaseio.com',
  projectId: 'acties-f8e89',
  storageBucket: 'acties-f8e89.appspot.com',
  messagingSenderId: '606075828354',
  appId: '1:606075828354:web:2262a0bd4c88eca1f31c9b',
};

const devConfig = {
  apiKey: 'AIzaSyB9xMhcbdoYlV9MMF4RtnIdch8mYsa3MRg',
  authDomain: 'acties-dev.firebaseapp.com',
  projectId: 'acties-dev',
  storageBucket: 'acties-dev.appspot.com',
  messagingSenderId: '481435189705',
  appId: '1:481435189705:web:6e086abbf7fc59316ba818',
};

// web app's Firebase configuration
const firebaseConfig = {
  ...devConfig,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Get ActivityType by ID
export const getActivityTypeById = (id: string) => {
  return getDoc(doc(db, 'ActivityType', id));
};

// Create ActivityType
export const createActivityType = (data: ActivityType) =>
  addDoc(collection(db, 'ActivityType'), data);

// Update ActivityType
export const updateActivityType = (data: ActivityType) => {
  const { id, ...rest } = data;
  return setDoc(doc(db, 'ActivityType', id!), rest);
};

// Delete Activity
export const deleteActivity = (data: ActivityType) => {
  return deleteDoc(doc(db, 'ActivityType', data.id!));
};

// Get ActivityTypes by user
export const getActivityTypesByUser = async (userId: string) => {
  const q = query(
    collection(db, 'ActivityType'),
    where('userId', '==', userId)
  );
  const SnapshotActivityTypes = await getDocs(q);
  const newActivityTypes: Array<ActivityType> = [];
  SnapshotActivityTypes.forEach(doc => {
    const { name, isQuantity, iconName, iconColor, userId, isNote, addedAt } =
      doc.data();
    newActivityTypes.push({
      id: doc.id,
      name,
      isQuantity,
      iconName,
      iconColor,
      userId,
      isNote,
      addedAt,
    });
  });
  return newActivityTypes;
};

// Create Record
export const createRecord = (data: RecordType) => {
  const { activity, ...rest } = data;
  const activityDoc = doc(db, 'ActivityType', activity.id!);
  return addDoc(collection(db, 'Record'), {
    ...rest,
    activityType: activityDoc,
  });
};

// Update Record
export const updateRecord = (data: RecordType) => {
  const { activity, id, ...rest } = data;
  const activityDoc = doc(db, 'ActivityType', activity.id!);
  return setDoc(doc(db, 'Record', id!), {
    ...rest,
    activityType: activityDoc,
  });
};

// Delete Record
export const deleteRecord = (data: RecordType) => {
  return deleteDoc(doc(db, 'Record', data.id!));
};

// Get Records by a specific user and activity
export const getRecordsByUserAndActivity = async (userId: string, activityId: string) => {
  const activityRef = doc(db, 'ActivityType', activityId);
  const q = query(collection(db, 'Record'), where('userId', '==', userId), where('activityType', '==', activityRef));
  const snapshotRecords = await getDocs(q);
  const records = snapshotRecords.docs.map(doc => {
    const { date, quantity, note } = doc.data();
    return {
      id: doc.id,
      activity: activityRef,
      date,
      quantity,
      note,
      userId,
    };
  });

  // Since all records are for the same activity, fetch the activity details once
  const fetchActivity = await getDoc(activityRef);
  const activityDetails = getActivityWithId(fetchActivity);

  // Attach the fetched activity details to each record
  const newRecords = records.map(record => ({
    ...record,
    activity: activityDetails,
  }));

  return newRecords;
};

// Get Last Records by user
export const getLastRecordsByUser = async (userId: string) => {
  const activityTypes = await getActivityTypesByUser(userId);
  const lastRecords: Array<any> = [];
  const promises = [];
  try {
    for (const activityType of activityTypes) {
      const activityTypeRef = doc(db, 'ActivityType', activityType.id!);
      const q = query(
        collection(db, 'Record'),
        where('userId', '==', userId),
        where('activityType', '==', activityTypeRef),
        orderBy('date', 'desc'),
        limit(1)
      );

      // Store the promise for the querySnapshot
      const promise = getDocs(q).then(async querySnapshot => {
        const docPromises: any[] = [];
        querySnapshot.forEach(doc => {
          const { activityType, date, quantity, note } = doc.data();
          // Store each document's promise
          const docPromise = getDoc(activityType).then(fetchedActivity => {
            lastRecords.push({
              id: doc.id,
              activity: getActivityWithId(fetchedActivity),
              date,
              quantity,
              note,
              userId,
            });
          });
          docPromises.push(docPromise);
        });
        // Wait for all document promises to resolve
        return Promise.all(docPromises);
      });
      promises.push(promise);
    }
    // Wait for all promises to resolve
    await Promise.all(promises);

    return lastRecords;
  } catch (error) {
    console.log('\x1b[36m$$$  error:', error);
  }
};

// get Monthly Records by User and ActivityType and range of dates
export const getMonthlyRecordsByUser = async (
  userId: string,
  activityId: string,
  startDate: Date,
  endDate: Date
) => {
  const activityTypeRef = doc(db, 'ActivityType', activityId);
  const q = query(
    collection(db, 'Record'),
    where('userId', '==', userId),
    where('activityType', '==', activityTypeRef),
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );
  try {
    const SnapshotRecords = await getDocs(q);
    const newRecords: Array<any> = [];

    SnapshotRecords.forEach(doc => {
      const { activityType, date, quantity, note } = doc.data();
      newRecords.push({
        id: doc.id,
        activity: activityType,
        date,
        quantity,
        note,
        userId,
      });
    });

    const newRecordPromises = newRecords.map(async record => {
      const fetchActivity = await getDoc(record.activity);
      return {
        ...record,
        activity: getActivityWithId(fetchActivity),
      };
    });

    return Promise.all(newRecordPromises);
  } catch (error) {
    console.log('\x1b[36m$$$  error:', error);
  }
};
