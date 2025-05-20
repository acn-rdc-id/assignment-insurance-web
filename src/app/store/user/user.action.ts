import { UserLoginForm, UserRegistrationForm } from "../../models/user.model";

export class UserLogin {
  static readonly type = 'USER LOGIN';
  constructor(public payload: UserLoginForm) {};
}

export class UserRegistration {
  static readonly type = 'USER REGISTRATION';
  constructor(public payload: UserRegistrationForm) {};
}

export class UserLogout {
  static readonly type = 'USER LOGOUT';
  constructor() {};
}