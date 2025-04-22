import { Component } from '@angular/core';
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
  ],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent {

  idType: typeof IdType = IdType;
  mobilePrefix: typeof MobilePrefix = MobilePrefix;
  idTypeList: Array<IdType> = Object.values(IdType);
  idTypeStringList: Array<string> = [];
  mobilePrefixList: Array<MobilePrefix> = Object.values(MobilePrefix);
  
  registrationForm: FormGroup = new FormGroup({
    idType: new FormControl(IdType.Nric, Validators.required),
    idNo: new FormControl('', Validators.required),
    fullName: new FormControl('', Validators.required),
    mobilePrefix: new FormControl(MobilePrefix.Msia, Validators.required),
    mobileNo: new FormControl('', Validators.required)
  });

  constructor() {
    this.idTypeList.forEach((idType) => {
      this.idTypeStringList.push(getIdTypeString(idType));
    });
  }
}
