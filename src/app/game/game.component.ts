import { Component, OnInit} from '@angular/core';

import { GameService } from '../game/game.service';
import { GameState } from '../game-state/games-state';

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameService]
})

export class GameComponent implements OnInit {
  gameState: GameState;

  isCentered: boolean;

  constructor(private gameService: GameService) {};

  ngOnInit(): void {
    this.getGameState();
  }

  getGameState(): void {
    this.gameService.getGameState().then(gameState => console.log(gameState));
    console.log(this.gameState);
    if (this.gameState.gameLevel === 1) {
      this.isCentered = true;
    } else {
      this.isCentered = false;
    }
  }
}
