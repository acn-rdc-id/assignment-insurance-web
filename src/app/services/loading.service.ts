import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private requestCounter: number = 0;
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  loading$ = this.loadingSubject.asObservable();
  
  loadingOn(): void {
    this.requestCounter++;
    this.loadingSubject.next(true);
  }

  loadingOff(): void {
    this.requestCounter--;
    this.loadingSubject.next(this.requestCounter > 0);
  }
}
