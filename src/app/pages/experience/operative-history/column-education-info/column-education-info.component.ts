import { Component, signal } from '@angular/core';
import { type Experience } from '../../../../shared/models/experience.model';
import { DetailBlockComponent } from '../shared/detail-block/detail-block.component';
import { InfoCardComponent } from '../shared/info-card/info-card.component';
import { TechStackComponent } from '../tech-stack/tech-stack.component';

@Component({
  selector: 'app-column-education-info',
  imports: [DetailBlockComponent, InfoCardComponent, TechStackComponent],
  templateUrl: './column-education-info.component.html',
  styleUrl: './column-education-info.component.css',
})
export class ColumnEducationInfoComponent {
  private _currentTraining = signal<Experience>({
    id: 'developer-training',
    title: 'DEVELOPER_TRAINING.EXE',
    classification: "Concepteur Développeur d'Applications (RNCP Level BAC+4)",
    objective:
      'Intensive full-stack development program focusing on modern web technologies including TypeScript, Node.js, and contemporary development frameworks. Building comprehensive skills in both frontend and backend development.',
    timeline: "École O'clock | January 2025 - October 2025",
    techStack: [
      'TYPESCRIPT',
      'NODE.JS',
      'FULL_STACK',
      'WEB_FRAMEWORKS',
    ] as const,
    status: 'current',
    statusLabel: 'ACTIVE | IN_PROGRESS',
    isCurrent: true,
  } as const);

  currentTraining = this._currentTraining.asReadonly();
}
