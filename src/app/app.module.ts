import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { GameComponent } from './game/game.component';
import { GasComponent } from './gas/gas.component';

@NgModule({
  imports:      [ BrowserModule,
                  AppRoutingModule ],
  declarations: [ AppComponent,
                  GameComponent,
                  GasComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
