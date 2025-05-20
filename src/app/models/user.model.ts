import { IdType } from "../enums/id-type.enum";
import { MobilePrefix } from "../enums/mobile-prefix.enum";
import { UserRole } from "../enums/user-role.enum";

export interface User {
  email: string,
  name: string,
  userId: string
}

export interface UserLoginForm {
  email: string,
  password: string
}

export interface UserRegistrationForm {
  email: string,
  password: string,
  username: string,
  idType: IdType,
  idNo: string,
  mobileNoPrefix: MobilePrefix,
  mobileNo: string,
  role: string
}
