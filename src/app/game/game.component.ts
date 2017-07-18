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
    // console.log(this.gameState.gasLevel);
    this.gameState.increasedBy = ((100 - this.gameState.gasLevel) * .02);
  }

  ventGas(): void {
    // console.log('venting gas');
    this.gameState.gasLevel -= this.gameState.ventAmount;
    this.gameState.resources += 1;
  }

  increaseGas(): void {
    // console.log('increasing gas');
    this.gameState.gasLevel += this.gameState.increasedBy;
    this.changeGasPercentage();
  }

  decreaseGas(): void {
    this.gameState.gasLevel -= (this.gameState.ventAmount * this.gameState.autoOwned);
    this.gameState.resources += this.gameState.autoOwned;
    if (this.gameState.gasLevel < 99 && this.gameState.secondGame === false) {
      this.gameState.secondGame = true;
      this.gameState.clonesAvailable = 0;
      this.gameState.foodAvailable = 50;
      this.gameState.farmers = 0;
      this.gameState.gatherers = 0;
      this.gameState.builders = 0;
      this.gameState.scouts = 0;
      this.gameState.cloneUpgrade = 1;
      this.gameState.cloneUpgradeCost = 300;
      this.isCentered = false;
      this.startClones();
      this.increaseFood();
      this.increaseFarmers();
      this.increaseGatherers();
      this.increaseBuilders();
      console.log('Starting second game');
    }
  }

  // tick(): void {
  //   console.log('game has been running for ' + this.gameState.seconds + ' seconds');
  //   this.gameState.seconds += 1;
  // }

  startInterval(): void {
    if (this.gameState.secondGame !== false) {
      this.gameState.isCentered = true;
    }
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
      // console.log('filters owned', this.gameState.filtersOwned, 'filter cost', this.gameState.filterCost);
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

  startClones(): void {
    GameComponent.intervalId = window.setInterval(() => {
        this.gameState.clonesAvailable += this.gameState.cloneUpgrade;
      }, 1000);
  }

  createFarmer(): void {
  if (this.gameState.foodAvailable >= 10 && this.gameState.clonesAvailable >= 1) {
    this.gameState.foodAvailable -= 10;
    this.gameState.farmers += 1;
    this.gameState.clonesAvailable -= 1;
    this.gameState.gatherersOn = true;
  }
}

  createFarmerAll(): void {
    let all = Math.floor(this.gameState.foodAvailable / 10);
    if (all > this.gameState.clonesAvailable) {
      all = this.gameState.clonesAvailable
    }
    this.gameState.farmers += all;
    this.gameState.foodAvailable -= (all * 10);
    this.gameState.clonesAvailable -= all;
    this.gameState.gatherersOn = true;
  }

  createGatherer(): void {
    if (this.gameState.farmers >= 10 && this.gameState.clonesAvailable >= 1) {
      this.gameState.farmers -= 10;
      this.gameState.gatherers += 1;
      this.gameState.clonesAvailable -= 1;
      this.gameState.buildersOn = true;
    }
  }

  createGathererAll(): void {
    let all = Math.floor(this.gameState.farmers / 10);
    if (all > this.gameState.clonesAvailable) {
      all = this.gameState.clonesAvailable
    }
    this.gameState.gatherers += all;
    this.gameState.farmers -= (all * 10);
    this.gameState.clonesAvailable -= all;
    this.gameState.buildersOn = true;
  }

  createBuilder(): void {
    if (this.gameState.gatherers >= 10 && this.gameState.clonesAvailable >= 1) {
      this.gameState.gatherers -= 10;
      this.gameState.builders += 1;
      this.gameState.clonesAvailable -= 1;
      this.gameState.scoutsOn = true;
    }
  }

  createBuilderAll(): void {
    let all = Math.floor(this.gameState.gatherers / 10);
    if (all > this.gameState.clonesAvailable) {
      all = this.gameState.clonesAvailable
    }
    this.gameState.builders += all;
    this.gameState.gatherers -= (all * 10);
    this.gameState.clonesAvailable -= all;
    this.gameState.scoutsOn = true;
  }

  createScout(): void {
    if (this.gameState.builders >= 10 && this.gameState.clonesAvailable >= 1) {
      this.gameState.builders -= 10;
      this.gameState.scouts += 1;
      this.gameState.clonesAvailable -= 1;
      this.gameState.thirdGame = true;
    }
  }

  createScoutAll(): void {
    let all = Math.floor(this.gameState.builders / 10);
    if (all > this.gameState.clonesAvailable) {
      all = this.gameState.clonesAvailable
    }
    this.gameState.scouts += all;
    this.gameState.builders -= (all * 10);
    this.gameState.clonesAvailable -= all;
    this.gameState.thirdGame = true;
  }

  increaseFood(): void {
    let timer = 0;
    GameComponent.intervalId = window.setInterval(() => {
      if ( this.gameState.farmers < 10 ) {
        timer += 1;
        if (timer >= 10) {
          this.gameState.foodAvailable += this.gameState.farmers;
          timer = 0;
        }
      } else {
        this.gameState.foodAvailable += Math.floor(this.gameState.farmers / 10);
      }
    }, 100);
  }

  increaseFarmers(): void {
    let timer = 0;
    GameComponent.intervalId = window.setInterval(() => {
      if ( this.gameState.gatherers < 10 ) {
        timer += 1;
        if (timer >= 10) {
          this.gameState.farmers += this.gameState.gatherers;
          timer = 0;
        }
      } else {
        this.gameState.farmers += Math.floor(this.gameState.gatherers / 10);
      }
    }, 100);
  }

  increaseGatherers(): void {
    let timer = 0;
    GameComponent.intervalId = window.setInterval(() => {
      if ( this.gameState.builders < 10 ) {
        timer += 1;
        if (timer >= 10) {
          this.gameState.gatherers += this.gameState.builders;
          timer = 0;
        }
      } else {
        this.gameState.gatherers += Math.floor(this.gameState.builders / 10);
      }
    }, 100);
  }

  increaseBuilders(): void {
    let timer = 0;
    GameComponent.intervalId = window.setInterval(() => {
      if ( this.gameState.scouts < 10 ) {
        timer += 1;
        if (timer >= 10) {
          this.gameState.builders += this.gameState.scouts;
          timer = 0;
        }
      } else {
        this.gameState.builders += Math.floor(this.gameState.scouts / 10);
      }
    }, 100);
  }

  upgradeClones(): void {
    if (this.gameState.resources >= this.gameState.cloneUpgradeCost) {
      this.gameState.resources -= this.gameState.cloneUpgradeCost;
      this.gameState.cloneUpgrade = this.gameState.cloneUpgrade * 2;
      this.gameState.cloneUpgradeCost = Math.floor(300 * Math.pow(1.07, this.gameState.cloneUpgrade));
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
