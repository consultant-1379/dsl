import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectCommService {
  titleSource = new BehaviorSubject<any>(null);
  titleData$ = this.titleSource.asObservable();

  update(project: any) {
    console.log(`service sent: ${project}`);
    this.titleSource.next(project);
  }
  constructor() { }
}
