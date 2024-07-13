import React, { useState, useContext, createContext, useEffect } from 'react';
import { RecordType } from '../constants/Types';
import {
  getLastRecordsByUser,
  getMonthlyRecordsByUser,
  getRecordsByUserAndActivity,
} from '../firebase';
import { useAuth } from './useAuth';

interface ContextValue {
  recordsByActivity: RecordsState;
  lastRecords: RecordsState;
  monthlyRecords: RecordsState;
  getRecordsByActivity: (activityId: string) => void;
  getLastRecords: () => void;
  getMonthlyRecords: (
    activityId: string,
    startDate: Date,
    endDate: Date
  ) => void;
}

export type RecordsState = {
  data: Array<RecordType>;
  isLoading: boolean;
};

export const RecordsContext = createContext<ContextValue>({
  recordsByActivity: {
    data: [],
    isLoading: false,
  },
  lastRecords: {
    data: [],
    isLoading: false,
  },
  monthlyRecords: {
    data: [],
    isLoading: false,
  },
  getRecordsByActivity: () => null,
  getLastRecords: () => null,
  getMonthlyRecords: () => null,
});

interface Props {
  children: JSX.Element;
}

export function ProvideRecords({ children }: Props) {
  const records: ContextValue = useProvideRecords();

  return (
    <RecordsContext.Provider value={records}>
      {children}
    </RecordsContext.Provider>
  );
}

export const useRecords = () => useContext(RecordsContext);

function useProvideRecords(): ContextValue {
  const { user } = useAuth();
  // const [newRecord, setNewRecord] = useState<RecordType | null>(null);
  // const [modifiedRecord, setModifiedRecord] = useState<RecordType | null>(null);
  // const [removedRecord, setRemovedRecord] = useState<Record<string, string> | null>(null);
  // useEffect(() => {
  //     const queryListener = query(collection(db, "Record"));
  //     const unsubscribe = onSnapshot(queryListener, (querySnapshot) => {
  //         querySnapshot.docChanges().forEach(change => {
  //             if (change.type === "added") {
  //                 const { activityType, date, quantity, userId, activityId, note } = change.doc.data();
  //                 const newRecord = {
  //                     id: change.doc.id,
  //                     activity: activityType,
  //                     date,
  //                     quantity,
  //                     userId,
  //                     note,
  //                     activityId
  //                 }
  //                 getDoc(newRecord.activity).then(activity => {
  //                     setNewRecord({
  //                         ...newRecord,
  //                         activity: getActivityWithId(activity) as ActivityType
  //                     });
  //                 }).catch(err => {
  //                     console.log("err", err);
  //                 });
  //             } else if (change.type === "modified") {
  //                 const { activityType, date, quantity, userId, activityId, note } = change.doc.data();
  //                 const editedRecord = {
  //                     id: change.doc.id,
  //                     activity: activityType,
  //                     date,
  //                     quantity,
  //                     userId,
  //                     note,
  //                     activityId
  //                 }
  //                 getDoc(editedRecord.activity).then(activity => {
  //                     setModifiedRecord({
  //                         ...editedRecord,
  //                         activity: getActivityWithId(activity) as ActivityType
  //                     });
  //                 }).catch(err => {
  //                     console.log("err", err);
  //                 });
  //             } else if (change.type === "removed") {
  //                 const { userId} = change.doc.data();
  //                 const removedRecord = {
  //                     id: change.doc.id,
  //                     userId
  //                 }
  //                 setRemovedRecord(removedRecord);
  //             }
  //         })
  //     });

  //     return () => unsubscribe();
  // },[]);

  // useEffect(() => {
  //     if(newRecord && newRecord.userId === user?.uid){
  //         setRecords({
  //             isLoading: false,
  //             data: [
  //                 ...records.data,
  //                 newRecord
  //             ],
  //         })
  //     }
  // },[newRecord])

  // useEffect(() => {
  //     if(modifiedRecord && modifiedRecord.userId === user?.uid){
  //         setRecords({
  //             ...records,
  //             data: records.data.map(record => record.id === modifiedRecord.id ? modifiedRecord : record),
  //         })
  //     }
  // },[modifiedRecord])

  // useEffect(() => {
  //     if(removedRecord && removedRecord.userId === user?.uid){
  //         setRecords({
  //             ...records,
  //             data: records.data.filter(record => record.id !== removedRecord.id),
  //         })
  //     }
  // },[removedRecord])

  const [recordsByActivity, setRecordsByActivity] = useState<RecordsState>({
    data: [],
    isLoading: false,
  });

  const [lastRecords, setLastRecords] = useState<RecordsState>({
    data: [],
    isLoading: false,
  });

  const [monthlyRecords, setMonthlyRecords] = useState<RecordsState>({
    data: [],
    isLoading: false,
  });

  const getRecordsByActivity = (activityId: string) => {
    setRecordsByActivity({
      data: [],
      isLoading: true,
    });
    if (user) {
      const { uid } = user;
      return getRecordsByUserAndActivity(uid, activityId).then(recordsByActivity => {
        setRecordsByActivity({
          data: recordsByActivity,
          isLoading: false,
        });
      });
    }
  };

  const getLastRecords = () => {
    setLastRecords({
      data: [],
      isLoading: true,
    });
    if (user) {
      const { uid } = user;
      return getLastRecordsByUser(uid).then(lastRecords => {
        setLastRecords({
          data: lastRecords,
          isLoading: false,
        });
      });
    }
  };

  const getMonthlyRecords = (
    activityId: string,
    startDate: Date,
    endDate: Date
  ) => {
    setMonthlyRecords({
      data: [],
      isLoading: true,
    });
    if (user) {
      const { uid } = user;
      return getMonthlyRecordsByUser(uid, activityId, startDate, endDate).then(
        monthlyRecords => {
          setMonthlyRecords({
            data: monthlyRecords,
            isLoading: false,
          });
        }
      );
    }
  };

  return {
    recordsByActivity,
    lastRecords,
    monthlyRecords,
    getRecordsByActivity,
    getLastRecords,
    getMonthlyRecords,
  };
}
