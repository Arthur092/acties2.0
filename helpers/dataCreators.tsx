import { User } from "firebase/auth"
import { Activities } from "../constants/SampleData"
import { createActivityType } from "../firebase"

export const createInitialActivities = (user: User) => {
    return Promise.all(Activities.map(activity => createActivityType({ ...activity, userId: user.uid, addedAt: new Date()})))
}