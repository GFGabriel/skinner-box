import { Component, OnInit } from '@angular/core';
import { GameStateService } from '../game-state.service';

import { GameState } from '../game-state';

@Component({
  selector: 'app-gamearea',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
static intervalId: Number;

  gameStates // : GameState[];
  gameState  // : GameState;
  selectedGameState  // : GameState;
  isCentered: boolean;

  constructor(private gameService: GameStateService) {}

  getGameStates(): void {
    // this.gameService.getGameStates().then(gameStates => this.gameStates = gameStates);
  }

  // getGameState(id: number): void {
  //   this.gameService.getGameState(id).subscribe(gameState => this.gameState = gameState)
  // }

  onSelect(gameState: GameState) {
    this.selectedGameState = gameState;
  }

  save(gameState: GameState): void {
    this.gameService.update(gameState)
      .then();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.gameService.create(name)
      .then(gameState => {
        this.gameStates.push(gameState);
        this.selectedGameState = null;
      });
  }

  delete(gameState: GameState): void {
    this.gameService
      .delete(gameState.id)
      .then(() => {
      this.gameStates = this.gameStates.filter(g => g !== gameState);
      if (this.selectedGameState === gameState) {this.selectedGameState = null; }
      });
  }

  changeGasPercentage(): void {
    console.log(this.gameState.gasLevel);
    this.gameState.increasedBy = ((100 - this.gameState.gasLevel) * .02);
  }

  ventGas(): void {
    console.log('venting gas');
    this.gameState.gasLevel -= this.gameState.ventAmount;
    this.gameState.resources += 1;
  }

  increaseGas(): void {
    console.log('increasing gas');
    this.gameState.gasLevel += this.gameState.increasedBy;
    this.changeGasPercentage();
  }

  decreaseGas(): void {
    this.gameState.gasLevel -= (this.gameState.ventAmount * this.gameState.autoOwned);
    this.gameState.resources += this.gameState.autoOwned;
    if (this.gameState.gasLevel < 80) {
      this.gameState.secondGame = true;
      this.isCentered = false;
      console.log('Starting second game');
    }
  }

  // tick(): void {
  //   console.log('game has been running for ' + this.gameState.seconds + ' seconds');
  //   this.gameState.seconds += 1;
  // }

  startInterval(): void {
    // if (GasComponent.intervalId) {
    //   window.clearInterval(this.intervalId);
    // }
    GameComponent.intervalId = window.setInterval(() => {
      // console.log('game has been running for ' + this.gameState.seconds + ' seconds');
      // this.gameState.seconds += 1;
      this.increaseGas(); this.decreaseGas(); }, 1000);
  }

  increaseFilter(): void {
    if (this.gameState.resources >= this.gameState.filterCost) {
      this.gameState.ventAmount += .01;
      this.gameState.filtersOwned += 1;
      this.gameState.resources -= this.gameState.filterCost;
      this.gameState.filterCost = Math.round(10 * Math.pow(1.07, this.gameState.filtersOwned));
      console.log('filters owned', this.gameState.filtersOwned, 'filter cost', this.gameState.filterCost);
    } else {
      alert('Not enough resources');
    }
  }

  increaseAuto(): void {
    if (this.gameState.resources >= this.gameState.autoCost) {
      this.gameState.resources -= this.gameState.autoCost;
      this.gameState.autoOwned += 1;
      this.gameState.autoCost = Math.round(50 * Math.pow(1.07, this.gameState.autoOwned));
    } else {
      alert('Not enough resources');
    }
  }
  ngOnInit(): void {
      // this.gameService.getGameState().then(result => {
      //   console.log('the result is', result);
      //   this.gameState = result;
      //   console.log('the gameState is', this.gameState);
      //   if (this.gameState.secondGame === false) {
      //     this.isCentered = true;
      //   }
      // });

      this.gameService.getGameState().then(data => {
        this.gameState = data
      this.startInterval();

      });
  }
}
