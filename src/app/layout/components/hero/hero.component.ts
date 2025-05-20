import { Component } from '@angular/core';
import {HeroDisplayComponent} from '../../../features/hero-display/hero-display.component';

@Component({
  selector: 'app-hero',
  imports: [HeroDisplayComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {}
