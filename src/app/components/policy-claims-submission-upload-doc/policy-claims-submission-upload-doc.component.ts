import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { PolicyClaimState } from '../../store/policy-claim/policy-claim.state';
import { Store } from '@ngxs/store';
import { ClaimPolicyDocument } from '../../models/policy-claim.model';
import {
  FileItem,
  FileUploadError,
  NxFileUploadConfig,
  NxFileUploader,
  NxFileUploaderButtonDirective,
  NxFileUploaderComponent,
  NxFileUploaderHintDirective,
  NxFileUploadResult,
} from '@aposin/ng-aquila/file-uploader';
import { NxErrorComponent, NxLabelComponent } from '@aposin/ng-aquila/base';
import { CommonModule } from '@angular/common';
import {
  NxButtonComponent,
  NxPlainButtonComponent,
} from '@aposin/ng-aquila/button';
import { NxIconComponent } from '@aposin/ng-aquila/icon';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  NxMessageToastConfig,
  NxMessageToastService,
} from '@aposin/ng-aquila/message';
import { first, Subject, zip } from 'rxjs';
import {PostSubmitClaim} from '../../store/policy-claim/policy-claim.action';
import {HttpErrorBody} from '../../models/http-body.model';
import {MessageModalData} from '../../models/message-modal-data.model';
import {Router} from '@angular/router';
import {MessageModalComponent} from '../message-modal/message-modal.component';
import {NxDialogService, NxModalRef} from '@aposin/ng-aquila/modal';

const successToastConfig: NxMessageToastConfig = {
  duration: 3000,
  context: 'success',
  announcementMessage: 'File was uploaded successfully!',
};

const noFilesToastConfig: NxMessageToastConfig = {
  duration: 9000,
  context: 'info',
  announcementMessage: 'Information: Files not uploaded.',
};

@Component({
  selector: 'app-policy-claims-submission-upload-doc',
  imports: [
    NxFileUploaderComponent,
    NxLabelComponent,
    NxFileUploaderHintDirective,
    NxButtonComponent,
    NxFileUploaderButtonDirective,
    NxIconComponent,
    NxPlainButtonComponent,
    CommonModule,
    NxFileUploaderComponent,
    NxLabelComponent,
    NxFileUploaderHintDirective,
    NxButtonComponent,
    NxFileUploaderButtonDirective,
    NxIconComponent,
    NxPlainButtonComponent,
    CommonModule,
    NxErrorComponent,
  ],
  templateUrl: './policy-claims-submission-upload-doc.component.html',
  styleUrl: './policy-claims-submission-upload-doc.component.scss',
})
export class PolicyClaimsSubmissionUploadDocComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  constructor(private readonly messageToastService: NxMessageToastService) {}
  @Input() nextStep!: () => void;
  @Input() prevStep!: () => void;

  store: Store = inject(Store);
  router: Router = inject(Router);
  private dialogService = inject(NxDialogService);
  private dialogRef?: NxModalRef<any>;
  selectedPolicyId = 0;
  tableElements = '';
  requiredDoc?: string[];
  uploaders: { [documentType: string]: NxFileUploader } = {};
  private http = inject(HttpClient);

  @ViewChildren(NxFileUploaderComponent)
  uploaderComponents!: QueryList<NxFileUploaderComponent>;

  selectedTypeOfClaim?: ClaimPolicyDocument;

  ngOnInit(): void {
    this.selectedPolicyId = this.store.selectSnapshot(PolicyClaimState.getSelectedPolicyId);
    this.selectedTypeOfClaim = this.store.selectSnapshot(PolicyClaimState.getSelectedTypeOfClaim);

    this.requiredDoc = this.selectedTypeOfClaim.requiredDocuments;

    console.log('requiredDoc', this.requiredDoc);

    // Create an uploader for each required document
    this.requiredDoc.forEach((doc) => {
      this.uploaders[doc] = new NxFileUploader(this.uploadConfig, this.http);
    });
  }

  ngAfterViewInit(): void {
    // uploaderComponents is now ready here
    console.log('Uploaders initialized:', this.uploaderComponents.toArray());
  }

  private readonly _destroyed = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  triggerUpload() {
    const uploadersWithFilesToUpload = this.uploaderComponents
      .toArray()
      .filter((uploader) => {
        const files = uploader.value || [];
        return files.length > 0;
      });

    // show toast if no files to upload
    if (uploadersWithFilesToUpload.length === 0) {
      this.messageToastService.open(
        'No document to upload!',
        noFilesToastConfig
      );
    } else if (uploadersWithFilesToUpload.length !== this.requiredDoc?.length) {
      this.messageToastService.open(
        'Must upload all required documents!',
        noFilesToastConfig
      );
    } else if (this.validateFileNames().length !== 0) {
      const errors = this.validateFileNames();
      if (errors.length > 0) {
        this.messageToastService.open(errors.join('\n'), noFilesToastConfig);
        return;
      }
    } else if (uploadersWithFilesToUpload.length === this.requiredDoc?.length) {
      this.uploadFilesForUploaders(uploadersWithFilesToUpload);
    }
  }

  validateFileNames(): string[] {
    const errors: string[] = [];

    if (this.requiredDoc) {
      this.requiredDoc.forEach((doc, index) => {
        const uploader = this.uploaderComponents.toArray()[index];
        const files = uploader?.value ?? [];

        if (files.length === 0) {
          errors.push(`Please upload a file for "${doc}".`);
        } else {
          const expectedName = doc.toLowerCase().replace(/\s+/g, '');
          const fileName = files[0].name.toLowerCase().replace(/\s+/g, '');

          if (!fileName.includes(expectedName)) {
            errors.push(
              `Filename for "${files[0].name}" must be the same as "${doc}".`
            );
          }
        }
      });
    }

    return errors;
  }

  getFileErrors(): FileUploadError[] {
    if (!this.uploaderComponents || this.uploaderComponents.length === 0) {
      return [];
    }

    return this.uploaderComponents
      .toArray()
      .flatMap((uploader) => uploader.errors || []);
  }

  uploadFilesForUploaders(uploadersWithFilesToUpload: NxFileUploaderComponent[]) {
    // wait for all uploaders with files to upload to finish uploading
    zip(
      uploadersWithFilesToUpload.map(
        (uploaderComponent) => uploaderComponent.uploader.response
      )
    )
      .pipe(first())
      .subscribe((results: NxFileUploadResult[]) => {
        console.log(`results`, results);

        const allSucessful = results.every((result) => result.allSucessful);

        if (allSucessful) {
          this.messageToastService.open(
            'All files were uploaded successfully!',
            successToastConfig
          );
        } else {
          results.forEach((result) => console.log(result.error));
        }
      });

    // start uploading files
    uploadersWithFilesToUpload.forEach((uploader) => {
      uploader.uploadFiles();
    });

    const payload: FormData = this.buildFormData();
    this.store.dispatch(new PostSubmitClaim(payload)).subscribe({
      complete: () => {
        this.messageToastService.open('Claim submitted successfully!', {
          duration: 3000,
          context: 'success',
          announcementMessage: 'Claim submitted.'
        });
        this.router.navigate(['claim-list']);
      },
      error: (err: HttpErrorBody) => {
        const messageData: MessageModalData = {
          header: 'Error',
          message: err.message ?? 'Unexpected error occurred.'
        };
        this.openErrorModal(messageData);
      }
    });
  }

  readonly uploadConfig: NxFileUploadConfig = {
    requestUrl: 'file-upload',
    options: {
      params: new HttpParams(),
      reportProgress: true,
    },
  };

  onBack(): void {
    this.prevStep();
  }

  private openErrorModal(messageData?: MessageModalData): void {
    this.dialogRef = this.dialogService.open(MessageModalComponent, {
      data: messageData,
      disableClose: true,
      ariaLabel: 'Error dialog'
    })
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('policyID', String(this.selectedPolicyId));
    formData.append('claimTypeID', String(this.selectedTypeOfClaim?.claimTypeId));

    this.uploaderComponents.forEach((uploaderComponent) => {
      const files: FileItem[] = uploaderComponent.value || [];

      files.forEach(fileItem => {
        if (fileItem.file instanceof File) {
          formData.append('files', fileItem.file, fileItem.file.name);
        }
      });
    });

    return formData;
  }
}
