import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private difficultySubject = new BehaviorSubject<string>('easy');
  data$ = this.difficultySubject.asObservable();

  setDifficulty(difficulty: string){
    this.difficultySubject.next(difficulty)
  }
}
