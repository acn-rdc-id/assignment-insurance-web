import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { NxButtonComponent, NxIconButtonComponent } from '@aposin/ng-aquila/button';
import { NxDropdownComponent, NxDropdownItemComponent } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldAppendixDirective, NxFormfieldComponent } from '@aposin/ng-aquila/formfield';
import { NxColComponent, NxLayoutComponent, NxRowComponent } from '@aposin/ng-aquila/grid';
import { NxIconComponent } from '@aposin/ng-aquila/icon';
import { NxInputDirective, NxPasswordToggleComponent } from '@aposin/ng-aquila/input';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { NxPopoverComponent, NxPopoverTriggerDirective } from '@aposin/ng-aquila/popover';
import { nricValidator } from '../../validators/nric.validator';
import { NricPipe } from '../../pipes/nric.pipe';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { UserRegistration } from '../../store/user/user.action';
import { getIdTypeString, IdType } from '../../enums/id-type.enum';
import { UserRole } from '../../enums/user-role.enum';
import { MobilePrefix } from '../../enums/mobile-prefix.enum';
import { UserRegistrationForm } from '../../models/user.model';
import { HttpErrorBody } from '../../models/http-body.model';
import { MessageModalData } from '../../models/message-modal-data.model';

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
    NxButtonComponent,
    NxDropdownComponent,
    NxDropdownItemComponent,
    NxFormfieldAppendixDirective,
    NxPopoverTriggerDirective,
    NxIconComponent,
    NxPopoverComponent,
    NxIconButtonComponent,
    NxPasswordToggleComponent
  ],
  providers: [NricPipe],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('idNoInput', {read: ElementRef, static: false}) idNoInput!: ElementRef;

  idType: typeof IdType = IdType;
  mobilePrefix: typeof MobilePrefix = MobilePrefix;
  idTypeList: Array<IdType> = Object.values(IdType);
  idTypeStringList: Array<string> = [];
  mobilePrefixList: Array<MobilePrefix> = Object.values(MobilePrefix);
  dialogRef?: NxModalRef<any>;
  idNoInputRef!: HTMLInputElement;
  
  private nricPipe = inject(NricPipe);
  private store = inject(Store);
  private dialogService = inject(NxDialogService);
  private unsubscribe$ = new Subject();
  private prevIdNoValue: string = '';
  
  registrationForm: FormGroup = new FormGroup({
    idType: new FormControl(IdType.Nric, Validators.required),
    idNo: new FormControl('', {
      validators: [Validators.required, nricValidator()]
    }),
    fullName: new FormControl('', Validators.required),
    mobilePrefix: new FormControl(MobilePrefix.Msia, Validators.required),
    mobileNo: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.minLength(8)]
    })
  });

  constructor() {
    this.idTypeList.forEach((idType) => {
      this.idTypeStringList.push(getIdTypeString(idType));
    });
  }
  
  ngOnInit(): void {
    this.onFormChange();
  }

  ngAfterViewInit(): void {
    this.idNoInputRef = this.idNoInput.nativeElement;
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
        if (this.registrationForm.get('idType')?.value === IdType.Nric) {
          if (typeof value === 'string') {
            this.updateIdNoVal(value);
          }
        }
      });

    this.registrationForm.get('confirmPassword')?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        const password = this.registrationForm.get('password')?.value;
        password && password === value
          ? this.registrationForm.get('confirmPassword')?.setErrors(null)
          : this.registrationForm.get('confirmPassword')?.setErrors({notMatching: true})
      });
  }

  onRegister() {
    if (this.registrationForm.valid) {
      const userRegistrationPayload: UserRegistrationForm = {
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password,
        username: this.registrationForm.value.fullName,
        idType: this.registrationForm.value.idType,
        idNo: this.registrationForm.value.idNo,
        mobileNoPrefix: this.registrationForm.value.mobilePrefix,
        mobileNo: this.registrationForm.value.mobileNo,
        role: UserRole.User
      }

      this.store.dispatch(new UserRegistration(userRegistrationPayload)).subscribe({
        error: (err: HttpErrorBody) => {
          const messageData: MessageModalData = {
            header: 'Error',
            message: err.message ? err.message : 'Unexpected error occured.'
          }
          this.openErrorModal(messageData);
        }
      })
    }
  }

  get currentIdType(): IdType {
    return this.registrationForm.get('idType')?.value as IdType;
  }

  private updateIdNoVal(value: string): void {
    const posStart: number = this.idNoInputRef.selectionStart
      ? this.idNoInputRef.selectionStart : 0;
    new Promise<number>((resolve) => {
      const prevDashes = this.idNoInputRef.value.toString().split('-').length - 1;
      const formattedString = this.nricPipe.transform(value);
      this.registrationForm.patchValue({idNo: formattedString}, {emitEvent: false, onlySelf: false});
      resolve(prevDashes);
    }).then((val) => {
      const curDashes = this.idNoInputRef.value.toString().split('-').length - 1;
      const delta = this.registrationForm.value?.idNo.toString().length - this.prevIdNoValue.length;
      if (delta < 0) {
        const offset = curDashes - val;
        this.idNoInputRef.selectionStart = this.idNoInputRef.selectionEnd
          = posStart > 6 ? +posStart + (posStart + offset < 0 ? 0 : offset)
            : posStart;
      } else {
        if (posStart === 7 || posStart === 10) {
          this.idNoInputRef.selectionStart = this.idNoInputRef.selectionEnd = +posStart + 1;
        } else {
          this.idNoInputRef.selectionStart = this.idNoInputRef.selectionEnd = +posStart;
        }
      }
      this.prevIdNoValue = this.registrationForm.value?.idNo;
    });
  }

  private openErrorModal(messageData?: MessageModalData): void {
    this.dialogRef = this.dialogService.open(MessageModalComponent, {
      data: messageData,
      disableClose: true,
      ariaLabel: 'Error dialog'
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }
}
