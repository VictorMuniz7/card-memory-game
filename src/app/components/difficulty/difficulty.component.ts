import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-difficulty',
  templateUrl: './difficulty.component.html',
  styleUrls: ['./difficulty.component.scss']
})
export class DifficultyComponent {

  form = this.formBuilder.group({
    difficulty: 'easy'
  })

  constructor(
    private formBuilder: FormBuilder,
    private gameService: GameService
  ){}

  setDifficulty(){
    if(this.form.value.difficulty)
    this.gameService.setDifficulty(this.form.value.difficulty)
  }


}
