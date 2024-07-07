import * as React from 'react';
import { useState } from 'react';
import { ActivitiesList } from '@/components/ActivitiesList';
import { RecordDialog } from '@/components/RecordDialog';
import { ActivityType } from "@/constants/Types";
import { useActivities } from '@/hooks/useActivities';
import { ActivityIndicator } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function NewActivityScreen(){
  const { activityTypes } = useActivities();  
  const [isDialogVisile, setIsDialogVisile] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);
  const [snackBar, setSnackBar] = useState({visible: false, message: '', error: false});

  if (activityTypes.isLoading) <ActivitySpinner />

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

function ActivitySpinner() {
  return <ActivityIndicator
      animating={true}
      size='large'
      style={styles.spinner} />
}

const styles = StyleSheet.create({
  spinner: {
    justifyContent: 'center',
    flex: 1,
  }
})