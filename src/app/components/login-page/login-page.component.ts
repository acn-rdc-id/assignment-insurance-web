import { AfterViewChecked, Component, ElementRef, HostListener, inject, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import { NxFormfieldComponent } from '@aposin/ng-aquila/formfield';
import { NxLayoutComponent, NxColComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import { NxInputDirective, NxPasswordToggleComponent } from '@aposin/ng-aquila/input';
import { NxLinkComponent } from '@aposin/ng-aquila/link'; 
import { NxMessageComponent } from '@aposin/ng-aquila/message';
import { UserLoginForm } from '../../models/user.model';
import { UserLogin } from '../../store/user/user.action';

@Component({
  selector: 'app-login-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NxLayoutComponent,
    NxColComponent,
    NxRowComponent,
    NxFormfieldComponent,
    NxInputDirective,
    NxButtonComponent,
    NxPasswordToggleComponent,
    NxLinkComponent,
    NxMessageComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements AfterViewChecked {
  @ViewChild('bannerCol', {read: ElementRef, static: false}) bannerCol!: ElementRef;
  viewportHeight: number = window.innerHeight;
  viewportWidth: number = window.innerWidth;
  showError: boolean = false;
  
  loginForm: FormGroup = new FormGroup({
    userId: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  
  private renderer = inject(Renderer2);
  private router = inject(Router);
  private store = inject(Store);

  ngAfterViewChecked(): void {
    this.updateBannerHeight();
  }

  @HostListener('window:resize', ['$event.target'])
  onResize(): void {
    this.updateBannerHeight();
  }

  onLoginUser() {
    if (this.loginForm.valid) {
      const userLoginPayload: UserLoginForm = {
        email: this.loginForm.value?.userId,
        password: this.loginForm.value?.password
      }
  
      this.store.dispatch(new UserLogin(userLoginPayload)).subscribe({
        next: val => {
          this.router.navigate(['policy-product']);
        },
        error: err => this.showError = true
      });
    }
  }

  goToUserRegistration() {
    this.router.navigate(['registration']);
  }

  private updateBannerHeight(): void {
    const siteFooterHeight = document.querySelector('#siteFooter')?.clientHeight;
    this.updateViewportSize();
    if (this.viewportWidth >= 992) {
      this.viewportHeight > 822
        ? this.renderer.setStyle(this.bannerCol.nativeElement, 'height', `${this.viewportHeight - (siteFooterHeight ? siteFooterHeight : 85)}px`)
        : this.renderer.setStyle(this.bannerCol.nativeElement, 'height', '738px');
    } else {
      this.renderer.setStyle(this.bannerCol.nativeElement, 'height', '400px')
    }
  }

  private updateViewportSize(): void {
    this.viewportHeight = window.innerHeight;
    this.viewportWidth = window.innerWidth;
  }
}
