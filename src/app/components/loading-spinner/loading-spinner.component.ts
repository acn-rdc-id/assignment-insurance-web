import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NxSpinnerComponent } from '@aposin/ng-aquila/spinner';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  imports: [
    AsyncPipe,
    NxSpinnerComponent
  ],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  loading$!: Observable<boolean>;

  private loadingService = inject(LoadingService);

  constructor() {
    this.loading$ = this.loadingService.loading$;
  }
}
