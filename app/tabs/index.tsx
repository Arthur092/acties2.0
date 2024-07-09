import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivitiesList } from '@/components/ActivitiesList';
import { RecordDialog } from '@/components/RecordDialog';
import { ActivityType } from "@/constants/Types";
import { useActivities } from '@/hooks/useActivities';
import { useRecords } from '@/hooks/useRecords';
import { ActivitySpinner } from '@/components/ActivitySpinner';

export default function NewActivityScreen(){
  const { activityTypes, getActivityTypes } = useActivities();  
  const { getLastRecords } = useRecords();
  const [isDialogVisile, setIsDialogVisile] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);
  const [snackBar, setSnackBar] = useState({visible: false, message: '', error: false});

  useEffect(() => {
    getActivityTypes(); 
    getLastRecords();
  },[]);
  
  if (activityTypes.isLoading) return <ActivitySpinner />

  const showDialog = (value: boolean, activity: ActivityType | null = null) => {
    if(value){
      setSnackBar({...snackBar, visible: false});
    }
    if(activity){
      setCurrentActivity(activity);
    }
    setIsDialogVisile(value);
  };

  return (
    <>
      <ActivitiesList
        activityTypes={activityTypes.data}
        snackBar={snackBar}
        setSnackBar={setSnackBar}
        showDialog={showDialog}
        icon="plus"
      />
      <RecordDialog
        visible={isDialogVisile}
        showDialog={showDialog}
        currentActivity={currentActivity}
        setSnackBar={setSnackBar}
      />
    </>
  );
}