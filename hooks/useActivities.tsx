import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useState, useContext, createContext, useEffect } from "react";
import { ActivityType } from "../constants/Types";
import { db, getActivityTypesByUser } from "../firebase";
import { useAuth } from "./useAuth";

interface ContextValue {
    activityTypes: ActivityTypesState;
    getActivityTypes: () => void;
}

type ActivityTypesState = {
    data: Array<ActivityType>;
    isLoading: boolean;
}

export const ActivitiesContext = createContext<ContextValue>({
    activityTypes: {
        data: [],
        isLoading: true
    },
    getActivityTypes: () => null,
});

interface Props {
    children: JSX.Element
}

export function ProvideActivities({ children }: Props) {
    const activities: ContextValue = useProvideActivities();

    return (
        <ActivitiesContext.Provider value={activities}>
            { children }
        </ActivitiesContext.Provider>
    )
}

export const useActivities = () => useContext(ActivitiesContext);

function useProvideActivities(): ContextValue {
    const { user } = useAuth();
    const [newActivityTypes, setNewActivityTypes] = useState<ActivityType[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityTypesState>({
        data: [],
        isLoading: true
    });

    useEffect(() => {
        if (user) {
            setActivityTypes({
                data: newActivityTypes.filter((activityType => activityType.userId === user.uid)),
                isLoading: newActivityTypes.length > 0 ? false : true,
            })
        }
    }, [newActivityTypes])

    useEffect(() => {
        const activityTypesCollection = collection(db, 'ActivityType');
        const q = query(activityTypesCollection);

        const unsubscribe = onSnapshot(q, querySnapshot => {
            setNewActivityTypes(querySnapshot.docs.map(doc => {
                const {  userId, name, isQuantity, iconName, iconColor, monthDay, isNote, currency,addedAt } = doc.data();
                return {
                    id: doc.id,
                    name,
                    isQuantity,
                    iconName,
                    iconColor,
                    userId,
                    monthDay,
                    isNote,
                    currency,
                    addedAt
                }
            }))
        });

        return () => unsubscribe();
    }, []);

    const getActivityTypes = () => {
        if (user) {
            const { uid } = user;
            return getActivityTypesByUser(uid).then(newActivityTypes => {
                setActivityTypes({
                    data: newActivityTypes,
                    isLoading: false
                })
            });
        }
    }

    return {
        activityTypes,
        getActivityTypes,
    }
}


