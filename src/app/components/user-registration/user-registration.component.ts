import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NxErrorComponent } from '@aposin/ng-aquila/base';
import { NxButtonComponent, NxIconButtonComponent } from '@aposin/ng-aquila/button';
import { NxFormfieldAppendixDirective, NxFormfieldComponent } from '@aposin/ng-aquila/formfield';
import { NxColComponent, NxLayoutComponent, NxRowComponent } from '@aposin/ng-aquila/grid';
import { NxIconComponent } from '@aposin/ng-aquila/icon';
import { NxInputDirective } from '@aposin/ng-aquila/input';
import { NxDropdownComponent, NxDropdownItemComponent } from '@aposin/ng-aquila/dropdown';
import { NxPopoverComponent, NxPopoverTriggerDirective } from '@aposin/ng-aquila/popover';
import { getIdTypeString, IdType } from '../../enums/id-type.enum';
import { MobilePrefix } from '../../enums/mobile-prefix.enum';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { nricValidator } from '../../services/nric.validator';
import { NricPipe } from '../../pipes/nric.pipe';
import { Subject, takeUntil } from 'rxjs';
import { Regex } from '../../enums/regex.enum';

@Component({
  selector: 'app-user-registration',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NxIconComponent,
    NxLayoutComponent,
    NxColComponent,
    NxRowComponent,
    NxFormfieldComponent,
    NxInputDirective,
    NxErrorComponent,
    NxButtonComponent,
    NxDropdownComponent,
    NxDropdownItemComponent,
    NxFormfieldAppendixDirective,
    NxPopoverTriggerDirective,
    NxIconComponent,
    NxPopoverComponent,
    NxIconButtonComponent,
    NricPipe
  ],
  providers: [NricPipe],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent implements OnInit, OnDestroy{

  idType: typeof IdType = IdType;
  mobilePrefix: typeof MobilePrefix = MobilePrefix;
  idTypeList: Array<IdType> = Object.values(IdType);
  idTypeStringList: Array<string> = [];
  mobilePrefixList: Array<MobilePrefix> = Object.values(MobilePrefix);

  private nricPipe = inject(NricPipe);
  private unsubscribe$ = new Subject<null>();
  
  registrationForm: FormGroup = new FormGroup({
    idType: new FormControl(IdType.Nric, Validators.required),
    idNo: new FormControl('', {
      validators: [Validators.required, nricValidator()]
    }),
    fullName: new FormControl('', Validators.required),
    mobilePrefix: new FormControl(MobilePrefix.Msia, Validators.required),
    mobileNo: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor() {
    this.idTypeList.forEach((idType) => {
      this.idTypeStringList.push(getIdTypeString(idType));
    });
  }
  
  ngOnInit(): void {
    this.onFormChange();
  }

  onFormChange() {
    this.registrationForm.get('idType')?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        switch (value) {
          case IdType.Nric: {
            this.registrationForm.get('idNo')?.setValidators([Validators.required, nricValidator()]);
            break;
          }
          case IdType.Passport: {
            this.registrationForm.get('idNo')?.setValidators([Validators.required]);
            break;
          }
          default: {
            this.registrationForm.get('idNo')?.setValidators([Validators.required]);
            break;
          }
        }
      });

    this.registrationForm.get('idNo')?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        const initialValue = typeof value === 'string' ? value.replace(/[^0-9, -]/g, '') : '';
        
        if (this.registrationForm.get('idType')?.value === IdType.Nric) {
          if (typeof value === 'string') {
            if (value !== initialValue) {
              this.registrationForm.patchValue({idNo: initialValue}, {emitEvent: false});
            } else {
              const formattedString = this.nricPipe.transform(value);
              this.registrationForm.patchValue({idNo: formattedString}, {emitEvent: false});
            }
          }
        }
      });
  }

  onRegister() {
    if (!this.registrationForm.valid) {
      console.log('FORM NOT VALID')
      return;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
