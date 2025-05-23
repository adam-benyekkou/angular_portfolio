import { Component } from '@angular/core';
import { SectionTitleComponent } from '../../shared/ui/section-title/section-title.component';
import { HoloVideoContainerComponent } from '../../shared/ui/holo-video-container/holo-video-container.component';
import { NeuralProfileTreeComponent } from './neural-profile-tree/neural-profile-tree.component';

@Component({
  selector: 'app-about-display',
  imports: [
    SectionTitleComponent,
    HoloVideoContainerComponent,
    NeuralProfileTreeComponent,
  ],
  templateUrl: './about-display.component.html',
  styleUrl: './about-display.component.css',
})
export class AboutDisplayComponent {}
