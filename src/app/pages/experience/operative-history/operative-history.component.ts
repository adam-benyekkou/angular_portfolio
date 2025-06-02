// operative-history.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnPersonalInfoComponent } from './column-personal-info/column-personal-info.component';
import { ColumnEducationInfoComponent } from './column-education-info/column-education-info.component';
import { ColumnProfessionalInfoComponent } from './column-professional-info/column-professional-info.component';

interface Experience {
  readonly id: string;
  readonly title: string;
  readonly classification: string;
  readonly objective: string;
  readonly timeline: string;
  readonly techStack: readonly string[];
  readonly status: 'current' | 'completed';
  readonly statusLabel: string;
  readonly isCurrent?: boolean;
}

@Component({
  selector: 'app-operative-history',
  standalone: true,
  imports: [
    CommonModule,
    ColumnPersonalInfoComponent,
    ColumnEducationInfoComponent,
    ColumnProfessionalInfoComponent,
  ],
  templateUrl: './operative-history.component.html',
  styleUrl: './operative-history.component.css',
})
export class OperativeHistoryComponent {}
