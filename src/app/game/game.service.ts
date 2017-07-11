import { Injectable } from '@angular/core';

import { GameState } from '../game-state/games-state';
import { GAMESTATE } from '../game-state/game-state-data';

@Injectable()

export class GameService {
  getGameState(): Promise<GameState> {
    return Promise.resolve(GAMESTATE);
  };
}
