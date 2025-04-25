import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, inject, Renderer2, ViewChild } from '@angular/core';
import { NxLayoutComponent, NxColComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import { NxFormfieldComponent, NxFormfieldSuffixDirective } from '@aposin/ng-aquila/formfield';
import { NxInputDirective, NxPasswordToggleComponent } from '@aposin/ng-aquila/input';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import { NxLinkComponent } from '@aposin/ng-aquila/link'; 
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
    NxLinkComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements AfterViewChecked {
  @ViewChild('bannerCol', {read: ElementRef, static: false}) bannerCol!: ElementRef;
  viewportHeight: number = window.innerHeight;
  viewportWidth: number = window.innerWidth;
  
  loginForm: FormGroup = new FormGroup({
    userId: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  
  private renderer = inject(Renderer2);
  private router = inject(Router);

  ngAfterViewChecked(): void {
    this.updateBannerHeight();
  }

  @HostListener('window:resize', ['$event.target'])
  onResize(event: Event): void {
    this.updateBannerHeight();
  }

  onLoginUser() {
    //TODO: implement login here
    console.log(this.loginForm.value);
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
