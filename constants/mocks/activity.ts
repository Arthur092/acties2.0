import { Timestamp } from "firebase/firestore";

export const testActivityContextData = {
    activityTypes: {
      data: [
        {
          id: 'testid',
          name: 'testType',
          isQuantity: 1,
          iconName: 'gas-station',
          iconColor: 'red',
          userId: 'testUserId',
        },
      ],
      isLoading: false,
    },
    records: {
      data: [
        {
            id: 'testId1',
            activity: {
                id: 'testid',
                name: 'testType',
                isQuantity: 1,
                iconName: 'gas-station',
                iconColor: 'red',
                userId: 'testUserId',
                },
            date: new Timestamp(99999, 99999),
            quantity: 1,
            userId: 'testUserId',
        },
        {
            id: 'testId2',
            activity: {
                id: 'testid',
                name: 'testType',
                isQuantity: 1,
                iconName: 'gas-station',
                iconColor: 'red',
                userId: 'testUserId',
                },
            date: new Timestamp(999999, 999999),
            quantity: 3,
            userId: 'testUserId',
        },
        {
            id: 'testId3',
            activity: {
                id: 'testid',
                name: 'testType',
                isQuantity: 4,
                iconName: 'gas-station',
                iconColor: 'red',
                userId: 'testUserId',
                },
            date: new Timestamp(99999, 99999),
            quantity: 3,
            userId: 'testUserId',
        },
      ],
      isLoading: false,
    },
  }