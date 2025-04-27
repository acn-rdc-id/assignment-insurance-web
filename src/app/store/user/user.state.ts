import { Action, Selector, State, StateContext } from "@ngxs/store";
import { UserStateModel } from "./user.state.model";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";
import { UserLogin } from "./user.action";
import { UserService } from "../../services/user.service";
import { UserRole } from "../../enums/user-role.enum";

@State<UserStateModel>({
  name: 'userstate',
  defaults: {
    userDetails: {
      name: '',
      email: '',
      role: null
    },
    jwtToken: ''
  }
})

@Injectable()
export class UserState {
  private userService = inject(UserService);

  @Selector()
  static getJwtToken(state: UserStateModel): string {
    return structuredClone(state.jwtToken);
  }
  
  @Action(UserLogin)
  userLogin({setState}: StateContext<UserStateModel>,
    {payload}: UserLogin
  ) {
    return this.userService.userLogin(payload).pipe(
      map(res => {
        setState({
          jwtToken: res.token,
          userDetails: {
            name: 'Test',
            email: 'test@example.com',
            role: UserRole.User
          }
        });
      })
    );
  }
}