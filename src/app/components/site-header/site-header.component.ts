import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { NxIconComponent } from '@aposin/ng-aquila/icon';
import { NxLinkComponent } from '@aposin/ng-aquila/link';
import { UserLogout } from '../../store/user/user.action';

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
export class SiteHeaderComponent {
  @Input()isLoggedIn: boolean = false;

  private store = inject(Store);

  logout() {
    this.store.dispatch(new UserLogout);
  }
}
