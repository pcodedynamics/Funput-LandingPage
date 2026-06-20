import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import { HeroComponent } from './components/hero/hero';
import { PlatformsComponent } from './components/platforms/platforms';
import { FeaturesComponent } from './components/features/features';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    HeroComponent,
    PlatformsComponent,
    FeaturesComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
})
export class App {}
