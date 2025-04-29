import { Component, Inject } from '@angular/core';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import { NxCopytextComponent } from '@aposin/ng-aquila/copytext';
import { NxHeadlineComponent } from '@aposin/ng-aquila/headline';
import { NX_MODAL_DATA, NxModalCloseDirective } from '@aposin/ng-aquila/modal';
import { MessageModalData } from '../../models/message-modal-data.model';

@Component({
  selector: 'app-message-modal',
  imports: [
    NxModalCloseDirective,
    NxButtonComponent,
    NxHeadlineComponent,
    NxCopytextComponent
  ],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.scss'
})
export class MessageModalComponent {

  constructor(@Inject(NX_MODAL_DATA) readonly data: MessageModalData) { }
}
