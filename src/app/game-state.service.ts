import { Injectable, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { GameState } from './game-state';

import 'rxjs/add/operator/toPromise';


@Injectable()
export class GameStateService implements OnInit {

  private gameStatesUrl = 'https://skinner-panel-api.herokuapp.com/api/v1/gameStates';
  private gameStateUrl = 'https://skinner-panel-api.herokuapp.com/api/v1/gameStates/1';
  private headers = new Headers({'Content-Type': 'application/json'});

  private gameState: GameState;

  constructor(private http: Http) { }

  public getGameState() {
    //  return this.http.get(this.gameStateUrl)
    //   .toPromise()
    //   .then(response => {
    //     this.gameState = response.json();
    //     console.log(this.gameState);
    //   })
    //   .catch(this.handleError);
     return this.http.get(this.gameStateUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }



  // getGameStates(): Promise<GameState[]> {
  //   return this.http.get(this.gameStatesUrl)
  //     .toPromise()
  //     .then(response => response.json().data as GameState[])
  //     .catch(this.handleError);
  // };

  // getGameState(): Promise<GameState> {
  //   const url = 'https://skinner-panel-api.herokuapp.com/api/v1/gameStates/1';
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(response => response.json().data as GameState)
  //     .catch(this.handleError);
  // }

  update(gameState: GameState): Promise<GameState> {
    const url = `${this.gameStatesUrl}/${gameState.id}`;
    return this.http
      .put(url, JSON.stringify(gameState), {headers: this.headers})
      .toPromise()
      .then(() => gameState)
      .catch(this.handleError);
  }

  create(name: string): Promise<GameState> {
    return this.http
      .post(this.gameStatesUrl, JSON.stringify({playerName: name}), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as GameState)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.gameStatesUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

  ngOnInit(): void {
    console.log('initializing service!');
    this.getGameState();
  }
}
