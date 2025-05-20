import { Component, inject, Input, OnInit, signal, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { NxIconComponent } from '@aposin/ng-aquila/icon';
import { NxLinkComponent } from '@aposin/ng-aquila/link';
import { UserLogout } from '../../store/user/user.action';
import { UserState } from '../../store/user/user.state';

@Component({
  selector: 'app-site-header',
  imports: [
    RouterModule,
    NxLinkComponent,
    NxIconComponent
  ],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss'
})
export class SiteHeaderComponent implements OnInit{
  @Input()isLoggedIn: boolean = false;

  username: Signal<string> = signal('')

  private store = inject(Store);

  ngOnInit(): void {
    this.username = this.store.selectSignal(UserState.getUsername);
  }

  logout() {
    this.store.dispatch(new UserLogout);
  }
}
