import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private difficultySubject = new BehaviorSubject<string>('easy');
  data$ = this.difficultySubject.asObservable();

  private isRunningSubject = new BehaviorSubject<boolean>(false);
  isRunning$ = this.isRunningSubject.asObservable();

  setDifficulty(difficulty: string){
    this.difficultySubject.next(difficulty)
  }

  setIsRunning(value: boolean){
    this.isRunningSubject.next(value)
  }

}
