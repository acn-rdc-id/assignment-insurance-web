import { UserRole } from "../enums/user-role.enum";

export interface User {
  email: string,
  name: string,
  role: UserRole | null
}

export interface UserLoginForm {
  email: string,
  password: string
}