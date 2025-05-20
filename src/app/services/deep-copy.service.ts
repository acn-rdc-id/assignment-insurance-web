import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeepCopyService {

  constructor() { }

  deepCopy(object: any){
    return structuredClone(object);
  }
}
