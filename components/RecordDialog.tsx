
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { emptyValidator, numberValidator } from '../helpers/validators';
import { theme } from '../core/theme';
import { Text } from 'react-native'
import { createRecord, deleteRecord, updateRecord } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { ActivityType, RecordType } from "../constants/Types";
import DatePicker from 'react-native-date-picker'
import { Timestamp } from 'firebase/firestore';

interface Props {
  visible: boolean;
  showDialog: (value: boolean) => void;
  currentActivity?: ActivityType | null;
  setSnackBar: React.Dispatch<React.SetStateAction<{
    visible: boolean;
    message: string;
    error: boolean;
  }>>,
  recordData?: RecordType | null
}

export const RecordDialog = ({ visible, showDialog, currentActivity, setSnackBar, recordData }: Props) => {
  const { user } = useAuth();

  const [number, setNumber] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date);
  const [openDate, setOpenDate] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    fillModal();
  }, [recordData])

  useEffect(() => {
    fillModal();
  }, [visible])

  const dismissDialog = () => {
    setNumber("");
    setNote("");
    setErrors({});
    setDate(new Date);
    setOpenDate(false);
    showDialog(false);
  }

  const onChangedNumber = (number: string)=>  {
    const numberError = numberValidator(number);
    setErrors({...errors, ['number']: numberError});
    const newNumber = number.replace(/[^0-9.]/g, '')
    setNumber(newNumber);
  }

  const onChangedNote = (note: string)=>  {
    setErrors({...errors, ['note']: ''});
    setNote(note);
  }

  const onDismissSingle = useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpenDate(false);
      setDate(params);
    },
    [setOpenDate, setDate]
  );

  const fillModal = () => {
    if (recordData){
      setNote(recordData?.note ?? "");
      setNumber(recordData?.quantity?.toString()  ?? "");
      const currentDate = recordData?.date ? recordData.date as Timestamp : null;
      setDate(currentDate ? new Date(currentDate.seconds * 1000) : new Date);
    }
  }

  const onSubmit = async () => {
    if(currentActivity?.isQuantity && currentActivity?.isNote){
      const numberError = numberValidator(number);
      if(numberError){
        setErrors({...errors, ['number']: numberError});
        return
      }
      const emptyNumber = emptyValidator(number);
      const emptyNote = emptyValidator(note);
      if(emptyNumber && emptyNote){
        setErrors({...errors, ['number']: emptyNumber, ['note']: emptyNote});
        return
      }
    } else if(currentActivity?.isQuantity && !currentActivity?.isNote){
      const numberError = numberValidator(number);
      if(numberError){
        setErrors({...errors, ['number']: numberError});
        return
      }
      const emptyNumber = emptyValidator(number);
      if(emptyNumber){
        setErrors({...errors, ['number']: emptyNumber});
        return
      }
    } else if(currentActivity?.isNote && !currentActivity?.isQuantity){
      const emptyNote = emptyValidator(note);
      if(emptyNote){
        setErrors({...errors, ['note']: emptyNote});
        return
      }
    }
    try {
      if(currentActivity){
        if(recordData){
          await updateRecord({
            id: recordData.id,
            activity: currentActivity,
            date,
            quantity: number ? parseFloat(number) : null,
            userId: user!.uid,
            note,
            activityId: currentActivity.id!
          })
          setSnackBar({visible: true, message: 'Record edited successfuly!', error: false})
        } else {
          await createRecord({
            activity: currentActivity,
            date,
            quantity: number ? parseFloat(number) : null,
            userId: user!.uid,
            note,
            activityId: currentActivity.id!
          })
          setSnackBar({visible: true, message: 'New record added successfuly!', error: false})
        }
      }
    } catch (error) {
      setSnackBar({visible: true, message:'Oppp!, an error ocurred', error: true});
      console.log("error", error);
    }
    dismissDialog()
  }

  const onDelete = async () => {
    if(recordData){
      await deleteRecord(recordData);
      setSnackBar({visible: true, message:'Record deleted succesfully!', error: false});
    }
    dismissDialog()
  };

  return (
    <>
      <View>
        <Portal>
        <Dialog visible={visible} onDismiss={dismissDialog}>
          <Dialog.Content testID='new-record-dialog'>
            <View
              style={styles.input}
            >
            {
              currentActivity?.isQuantity && (
                <TextInput
                  testID='input-qty'
                  label={currentActivity.currency ?? "L."}
                  value={number}
                  onChangeText={onChangedNumber}
                  placeholder='eg. 500'
                  mode='outlined'
                  autoComplete={false}
                  error={errors['number'] ? true : false}
                />
              )
            }
            {
              currentActivity?.isNote && (
                <TextInput
                  testID='input-note'
                  label="Note"
                  value={note}
                  onChangeText={onChangedNote}
                  placeholder='eg. details'
                  mode='outlined'
                  numberOfLines={4}
                  keyboardType="default"
                  style={{minHeight: 100}}
                  autoComplete={false}
                  error={errors['note'] ? true : false}
                />
              )
            }
            {Object.entries(errors).filter(([key, value]) => key !== 'name' && key !== 'monthDay').map(([key, value])=> <Text key={key} testID='input-global-records-error' style={styles.error}>{value}</Text>)}
            </View>
            <TextInput
              label="Date"
              value={date?.toDateString()}
              mode='outlined'
              disabled={true}
              style={styles.input}
              autoComplete={false}
            />
            <Button onPress={() => setOpenDate(true)} uppercase={false} mode="outlined">
               Change Date
            </Button>
            {openDate &&
              <DatePicker
                modal
                open={openDate}
                date={date}
                onConfirm={onConfirmSingle}
                onCancel={onDismissSingle}
                mode={"date"}
              />
            }
          </Dialog.Content>
          <Dialog.Actions>
            <Button testID='dialog-cancel-button' onPress={dismissDialog}>Cancel</Button>
            <Button testID='dialog-done-button' onPress={onSubmit}>{recordData ? 'Save' : 'Done'}</Button>
            {recordData &&
              <Button testID='dialog-delete-button' onPress={onDelete}>Delete</Button>
            }
          </Dialog.Actions>
        </Dialog>
        </Portal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingLeft: 10,
    paddingTop: 5
  },
})