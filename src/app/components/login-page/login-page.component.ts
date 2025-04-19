import { Component } from '@angular/core';
import { NxLayoutComponent, NxColComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import { NxFormfieldComponent, NxFormfieldSuffixDirective } from '@aposin/ng-aquila/formfield';
import { NxInputDirective, NxPasswordToggleComponent } from '@aposin/ng-aquila/input';
import { NxErrorComponent } from '@aposin/ng-aquila/base';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import { NxLinkComponent } from '@aposin/ng-aquila/link'; 

@Component({
  selector: 'app-login-page',
  imports: [
    NxLayoutComponent,
    NxColComponent,
    NxRowComponent,
    NxFormfieldComponent,
    NxInputDirective,
    NxErrorComponent,
    NxButtonComponent,
    NxFormfieldSuffixDirective,
    NxPasswordToggleComponent,
    NxLinkComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
