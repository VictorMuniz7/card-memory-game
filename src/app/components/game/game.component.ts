import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{

  numberOfCards: number = 0
  difficulty: any;

  columnsMobile: string = '1fr 1fr'
  rowsMobile: string = 'repeat(4, 1fr)'

  columnsDesktop: string = 'repeat(4, 1fr)'
  rowsDesktop: string = '1fr 1fr'

  isRunning: boolean = false
  isGameRunning: boolean = false

  selectedImage1: string = ''
  selectedImage2: string = ''

  totalHits: number = 0

  showWinnerScreen: boolean = false
  showLoserScreen: boolean = false

  cardImages: string[] =[
    './assets/card-images/0.png',
    './assets/card-images/1.png',
    './assets/card-images/2.png',
    './assets/card-images/3.png',
    './assets/card-images/4.png',
    './assets/card-images/5.png',
    './assets/card-images/6.png',
    './assets/card-images/7.png',
    './assets/card-images/8.png',
    './assets/card-images/9.png',
    './assets/card-images/10.png',
    './assets/card-images/11.png',
    './assets/card-images/12.png',
    './assets/card-images/13.png',
    './assets/card-images/14.png',
    './assets/card-images/15.png',
    './assets/card-images/16.png',
    './assets/card-images/17.png',
  ]

  currentImages: string[] = []

  difficultyMap: { [key: string]: number } = {
    'easy': 8,
    'normal': 12,
    'hard': 16,
    'hell': 24
  };

  gridColumnsMobileMap: { [key: string]: string } = {
    'easy': 'repeat(2, 1fr)',
    'normal': 'repeat(3, 1fr)',
    'hard': 'repeat(4, 1fr)',
    'hell': 'repeat(4, 1fr)'
  };

  gridRowsMobileMap: { [key: string]: string } = {
    'easy': 'repeat(4, 1fr)',
    'normal': 'repeat(4, 1fr)',
    'hard': 'repeat(4, 1fr)',
    'hell': 'repeat(6, 1fr)'
  };

  gridColumnsDesktopMap: { [key: string]: string } = {
    'easy': 'repeat(4, 1fr)',
    'normal': 'repeat(4, 1fr)',
    'hard': 'repeat(4, 1fr)',
    'hell': 'repeat(6, 1fr)'
  };

  gridRowsDesktopMap: { [key: string]: string } = {
    'easy': 'repeat(2, 1fr)',
    'normal': 'repeat(3, 1fr)',
    'hard': 'repeat(4, 1fr)',
    'hell': 'repeat(4, 1fr)'
  };

  memorizeTimeMap: { [key: string]: number } = {
    'easy': 3000,
    'normal': 5000,
    'hard': 7000,
    'hell': 9000
  };

  constructor(
    private gameService: GameService,
    @Inject(DOCUMENT) private _document: Document
  ){}

  ngOnInit(): void {
    this.getDifficulty()
  }

  getCardArray(num: number) {
    return new Array(num);
  }

  getDifficulty(){

    this.gameService.data$
    .pipe(
      takeWhile(() => !this.isRunning)
    )
    .subscribe((data) => {
      this.difficulty = data
      this.numberOfCards = this.difficultyMap[data]
      this.columnsMobile = this.gridColumnsMobileMap[data]
      this.rowsMobile = this.gridRowsMobileMap[data]
      this.columnsDesktop = this.gridColumnsDesktopMap[data]
      this.rowsDesktop = this.gridRowsDesktopMap[data]

      this._document.documentElement.style.setProperty(
        '--columns-mobile', this.columnsMobile
      )
      this._document.documentElement.style.setProperty(
        '--rows-mobile', this.rowsMobile
      )

      this._document.documentElement.style.setProperty(
        '--columns-desktop', this.columnsDesktop
      )
      this._document.documentElement.style.setProperty(
        '--rows-desktop', this.columnsMobile
      )
    })
  }


  startGame(){
    this.gameService.setIsRunning(true)

    this.gameService.isRunning$.subscribe((data) => {
      this.isRunning = data
    })

    this.setImagesToUse()
    let allCards = document.querySelectorAll<HTMLElement>('.card-inner')
    allCards.forEach((card) => {
      card.style.transform = 'rotateY(180deg)'
    })

    setTimeout(() => {
      allCards.forEach((card) => {
        card.style.transform = 'rotateY(0deg)'
        this.isGameRunning = true
      })
    }, this.memorizeTimeMap[this.difficulty])

  }

  setImagesToUse(){
    //Adicionar as imagens que serão usadas em um array
    for(let i = 0; i < this.difficultyMap[this.difficulty] / 2; i++){
      let imageToAdd;
      do {
        imageToAdd = this.cardImages[Math.floor(Math.random() * this.cardImages.length)];
      } while (this.currentImages.includes(imageToAdd));
      this.currentImages.push(imageToAdd)
    }
    //Copiar as imagens para termos pares
    this.currentImages.forEach((img) => {
      this.currentImages.push(img)
    })
    //Embaralhar o array
    this.shuffleArray(this.currentImages)
  }

  playAgain(){
    let allCards = document.querySelectorAll<HTMLElement>('.card-inner')
    allCards.forEach((card) => {
      card.style.transform = 'rotateY(0deg)'
    })
    this.showLoserScreen = false
    this.showWinnerScreen = false
    this.isGameRunning = false
    this.gameService.setIsRunning(false)
    this.isRunning = false
    this.totalHits = 0
    this.selectedImage1 = ''
    this.selectedImage2 = ''
    setTimeout(() => {
      this.currentImages = []
    }, 400)

  }


  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  addSecondImage(secondImage: string){
    this.selectedImage2 = secondImage

    if(this.selectedImage1 !== this.selectedImage2){
      setTimeout(() => {
        this.showLoserScreen = true
      }, 100)

    } else {
      this.totalHits++
      this.selectedImage1 = ''
      this.selectedImage2 = ''
    }
    if(this.totalHits === this.difficultyMap[this.difficulty] / 2){
      setTimeout(() => {
        this.showWinnerScreen = true
      }, 500)

    }

  }

  addFirstImage(firstImage: string, card: HTMLElement){
    if(card.style.transform === 'rotateY(180deg)'){
      return
    }
    this.selectedImage1 = firstImage
  }

  validate(card: HTMLElement, image: string){
    if(this.isGameRunning && card.style.transform === 'rotateY(0deg)'){
      if(this.selectedImage1 != ''){
        this.addSecondImage(image)
      }else{
        this.addFirstImage(image, card)
      }
    } else{
      return
    }

  }


}
