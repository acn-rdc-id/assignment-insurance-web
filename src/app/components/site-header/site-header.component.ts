import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxIconComponent } from '@aposin/ng-aquila/icon';
import { NxLinkComponent } from '@aposin/ng-aquila/link';

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
}
