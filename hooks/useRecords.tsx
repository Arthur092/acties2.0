import { collection, getDoc, onSnapshot, query } from "firebase/firestore";
import React, { useState, useContext, createContext, useEffect } from "react";
import { ActivityType, RecordType } from "../constants/Types";
import { db, getLastRecordsByUser, getRecordsByUser } from "../firebase";
import { getActivityWithId } from "../helpers/utils";
import { useAuth } from "./useAuth";

interface ContextValue {
    records: RecordsState;
    lastRecords: RecordsState;
    getRecords: () => void;
    getLastRecords: () => void;
}

export type RecordsState = {
    data: Array<RecordType>;
    isLoading: boolean;
}

export const RecordsContext = createContext<ContextValue>({
    records: {
        data: [],
        isLoading: true
    },
    lastRecords: {
        data: [],
        isLoading: true
    },
    getRecords: () => null,
    getLastRecords: () => null,
});

interface Props {
    children: JSX.Element
}

export function ProvideRecords({ children }: Props) {
    const records: ContextValue = useProvideRecords();

    return (
        <RecordsContext.Provider value={records}>
            { children }
        </RecordsContext.Provider>
    )
}

export const useRecords = () => useContext(RecordsContext);

function useProvideRecords(): ContextValue {
    const { user } = useAuth();
    const [newRecord, setNewRecord] = useState<RecordType | null>(null);
    const [modifiedRecord, setModifiedRecord] = useState<RecordType | null>(null);
    const [removedRecord, setRemovedRecord] = useState<Record<string, string> | null>(null);
    useEffect(() => {
        const queryListener = query(collection(db, "Record"));
        const unsubscribe = onSnapshot(queryListener, (querySnapshot) => {
            querySnapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    const { activityType, date, quantity, userId, activityId, note } = change.doc.data();
                    const newRecord = {
                        id: change.doc.id,
                        activity: activityType,
                        date,
                        quantity,
                        userId,
                        note,
                        activityId
                    }
                    getDoc(newRecord.activity).then(activity => {
                        setNewRecord({
                            ...newRecord,
                            activity: getActivityWithId(activity) as ActivityType
                        });
                    }).catch(err => {
                        console.log("err", err);
                    });
                } else if (change.type === "modified") {
                    const { activityType, date, quantity, userId, activityId, note } = change.doc.data();
                    const editedRecord = {
                        id: change.doc.id,
                        activity: activityType,
                        date,
                        quantity,
                        userId,
                        note,
                        activityId
                    }
                    getDoc(editedRecord.activity).then(activity => {
                        setModifiedRecord({
                            ...editedRecord,
                            activity: getActivityWithId(activity) as ActivityType
                        });
                    }).catch(err => {
                        console.log("err", err);
                    });
                } else if (change.type === "removed") {
                    const { userId} = change.doc.data();
                    const removedRecord = {
                        id: change.doc.id,
                        userId
                    }
                    setRemovedRecord(removedRecord);
                }
            })
        });

        return () => unsubscribe();
    },[]);

    useEffect(() => {
        if(newRecord && newRecord.userId === user?.uid){
            setRecords({
                isLoading: false,
                data: [
                    ...records.data,
                    newRecord
                ],
            })
        }
    },[newRecord])

    useEffect(() => {
        if(modifiedRecord && modifiedRecord.userId === user?.uid){
            setRecords({
                ...records,
                data: records.data.map(record => record.id === modifiedRecord.id ? modifiedRecord : record),
            })
        }
    },[modifiedRecord])

    useEffect(() => {
        if(removedRecord && removedRecord.userId === user?.uid){
            setRecords({
                ...records,
                data: records.data.filter(record => record.id !== removedRecord.id),
            })
        }
    },[removedRecord])

    const [records, setRecords] = useState<RecordsState>({
        data: [],
        isLoading: true
    });

    const [lastRecords, setLastRecords] = useState<RecordsState>({
        data: [],
        isLoading: true
    });

    const getRecords = () => {
        if (user) {
            const { uid } = user;
            return getRecordsByUser(uid).then(newRecords => {
                setRecords({
                    ...records,
                    data: newRecords,
                    isLoading: false
                })
            });
        }
    }

    const getLastRecords = () => {
        if (user) {
            const { uid } = user;
            return getLastRecordsByUser(uid).then(lastRecords => {
                setLastRecords({
                    data: lastRecords,
                    isLoading: false
                })
            });
        }
    }

    return {
        records,
        getRecords,
        lastRecords,
        getLastRecords,
    }
}


