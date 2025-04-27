import { User } from "../../models/user.model";

export interface UserStateModel {
  userDetails: User,
  jwtToken: string
}