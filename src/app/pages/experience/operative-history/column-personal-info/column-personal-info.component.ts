import { Component, signal } from '@angular/core';
import { InfoCardComponent } from '../shared/info-card/info-card.component';

@Component({
  selector: 'app-column-personal-info',
  imports: [InfoCardComponent],
  templateUrl: './column-personal-info.component.html',
  styleUrl: './column-personal-info.component.css',
})
export class ColumnPersonalInfoComponent {
  private readonly _personalNote = signal<string>(
    'In the spaces between keystrokes and compiler runs, I contemplate the philosophical implications of our digital convergence. When not debugging the matrix, I tend to six small organic beings who remind me that even in our increasingly automated world, care and attention to living creatures remains profoundly important.',
  );

  private readonly _philosophyText = signal<readonly string[]>([
    'Four years navigating the intersection between human needs and machine logic has taught me that the most elegant code emerges from understanding both the technical substrate and the consciousness it serves. My journey through enterprise system matrices—from military-grade security protocols to corporate data synthesis—has prepared me for a world where the line between human intention and digital execution grows ever thinner.',
    'I approach development like a philosopher examining the nature of existence: with persistent curiosity and the understanding that every system, no matter how complex, serves a fundamentally human purpose. In a cyberpunk reality where APIs are neural pathways and databases are digital memories, I believe in crafting code that honors both computational efficiency and human dignity.',
    'The future belongs to those who can bridge the organic and the synthetic, who understand that behind every elegant algorithm lies a human story waiting to be told.',
  ] as const);

  readonly personalNote = this._personalNote.asReadonly();
  readonly philosophyText = this._philosophyText.asReadonly();
}
