import { UserLoginForm } from "../../models/user.model";

export class UserLogin {
  static readonly type = 'USER LOGIN';
  constructor(public payload: UserLoginForm) {};
}