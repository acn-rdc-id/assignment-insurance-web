import { User } from "../../models/user.model";

export interface UserStateModel {
  userDetails: User,
  jwtToken: string
}

export const USER_STATE_DEFAULT: UserStateModel = {
  userDetails: {
    email: '',
    name: '',
    userId: ''
  },
  jwtToken: ''
}