import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { map } from "rxjs";
import { NxDialogService, NxModalRef } from "@aposin/ng-aquila/modal";
import { UserLogin, UserLogout, UserRegistration } from "./user.action";
import { UserService } from "../../services/user.service";
import { MessageModalComponent } from "../../components/message-modal/message-modal.component";
import { UserStateModel } from "./user.state.model";
import { MessageModalData } from "../../models/message-modal-data.model";
import { User } from "../../models/user.model";

@State<UserStateModel>({
  name: 'userstate',
  defaults: {
    userDetails: {
      name: '',
      email: '',
      userId: ''
    },
    jwtToken: ''
  }
})

@Injectable()
export class UserState {
  private userService = inject(UserService);
  private dialogService = inject(NxDialogService);
  private router = inject(Router);
  private dialogRef?: NxModalRef<any>;

  @Selector()
  static getJwtToken(state: UserStateModel): string {
    return structuredClone(state.jwtToken);
  }

  @Selector()
  static getUser(state: UserStateModel): User {
    return structuredClone(state.userDetails);
  }

  @Selector()
  static isLoggedIn(state: UserStateModel): boolean {
    return (state.jwtToken !== '' && state.userDetails.userId !== '');
  }
  
  @Action(UserLogin)
  userLogin({setState}: StateContext<UserStateModel>,
    {payload}: UserLogin
  ) {
    return this.userService.userLogin(payload).pipe(
      map(res => {
        setState({
          jwtToken: res.data.token,
          userDetails: {
            name: res.data.username,
            email: res.data.email,
            userId: res.data.userId
          }
        });
      })
    );
  }

  @Action(UserRegistration)
  userRegistration({}: StateContext<UserStateModel>, 
    {payload}: UserRegistration
  ) {
    return this.userService.userRegistration(payload).pipe(
      map(res => res.message)
    ).subscribe(res => {
      const messageData: MessageModalData = {
        header: 'Success',
        message: res
      }
      this.dialogRef = this.dialogService.open(MessageModalComponent, {
        data: messageData,
        disableClose: true,
        ariaLabel: 'Success Message'
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['login']);
      })
    });
  }

  @Action(UserLogout)
  userLogout({setState}: StateContext<UserStateModel>): void {
    setState({
      userDetails: {
        name: '',
        email: '',
        userId: ''
      },
      jwtToken: ''
    })

    this.router.navigate(['login']);
  }
}