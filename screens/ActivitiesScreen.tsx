import * as React from 'react';
import { useState } from 'react';
import { FAB } from 'react-native-paper';
import { useActivities } from '../hooks/useActivities';
import { ActivityDialog } from '../components/ActivityDialog';
import { ActivitiesList } from '../components/ActivitiesList';
import { ActivityType } from '../constants/Types';

export function ActivitiesScreen(){
  const { activityTypes } = useActivities();
  const [isActivityDialogVisible, setIsActivityDialogVisile] = useState(false);
  const [snackBar, setSnackBar] = useState({visible: false, message: '', error: false});
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);
  const showDialog = (value: boolean, activity: ActivityType | null = null) => {
    if(value){
        setSnackBar({...snackBar, visible: false});
    }
    if(activity){
        setCurrentActivity(activity);
    }
    setIsActivityDialogVisile(value);
  };

  return (
    <>
      <ActivitiesList
        activityTypes={activityTypes.data}
        snackBar={snackBar}
        setSnackBar={setSnackBar}
        showDialog={showDialog}
        icon={"format-list-bulleted"}
      />
      <ActivityDialog
        activity={currentActivity}
        visible={isActivityDialogVisible}
        showDialog={setIsActivityDialogVisile}
        setSnackBar={setSnackBar}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {setIsActivityDialogVisile(true); setCurrentActivity(null)}}
      />
    </>
  );
}

const styles = {
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
};
