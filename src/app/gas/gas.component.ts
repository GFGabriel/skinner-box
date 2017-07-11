import { Component, OnInit, Input } from '@angular/core';

import { GameService } from '../game/game.service';
import { GameState } from '../game-state/games-state';

@Component({
  selector: 'gas-chamber',
  templateUrl: './gas.component.html',
  styleUrls: ['./gas.component.css'],
  providers: [ GameService ]
})


export class GasComponent implements OnInit {
  static intervalId: Number;

  @Input() gameState: GameState;

  constructor(private gameService: GameService) {};

  ngOnInit(): void {
    // this.getGameState();
    this.startInterval();
  }

  // getGameState(): void {
  //   this.gameState = this.gameService.getGameState();
  //   console.log(this.gameState);
  // }

  changeGasPercentage(): void {
    console.log(this.gameState.gasLevel);
    this.gameState.increasedBy = ((100 - this.gameState.gasLevel) * .02);
  }

  ventGas(): void {
    console.log('venting gas');
    this.gameState.gasLevel -= this.gameState.ventLevel;
    this.gameState.resources += 1;
  }

  increaseGas(): void {
    console.log('increasing gas');
    this.gameState.gasLevel += this.gameState.increasedBy;
    this.changeGasPercentage();
  }

  decreaseGas(): void {
    this.gameState.gasLevel -= (this.gameState.ventLevel * this.gameState.autoOwned);
    this.gameState.resources += this.gameState.autoOwned;
    if (this.gameState.gasLevel < 80) {
      this.gameState.gameLevel += 1;
      console.log(this.gameState.gameLevel)
    }
  }

  tick(): void {
    console.log('game has been running for ' + this.gameState.seconds + ' seconds');
    this.gameState.seconds += 1;
    // setTimeout(this.tick(), 10000);
  }

  startInterval(): void {
    // if (GasComponent.intervalId) {
    //   window.clearInterval(this.intervalId);
    // }
    GasComponent.intervalId = window.setInterval(() => { console.log('game has been running for ' + this.gameState.seconds + ' seconds');
      this.gameState.seconds += 1; this.increaseGas(); this.decreaseGas(); }, 1000);
  }

  increaseFilter(): void {
    if (this.gameState.resources >= this.gameState.filterCost) {
      this.gameState.ventLevel += .01;
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
}
