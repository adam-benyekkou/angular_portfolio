import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Project } from '../models/project.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);

  // Private signals for state management
  private _projects = signal<Project[]>([]);

  // Public readonly signals
  readonly projects = this._projects.asReadonly();

  constructor() {
    console.log('DataService initialized');
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      console.log('Starting to load projects...');
      const projects = await this.fetchProjects();
      console.log('Projects loaded successfully:', projects);
      console.log('Number of projects:', projects.length);
      this._projects.set(projects);
      console.log('Projects signal updated');
    } catch (error) {
      console.error('Error loading data:', error);

      // Fallback to hardcoded data for debugging
      console.log('Loading fallback data...');
      const fallbackProjects: Project[] = [
        {
          id: 'portfolio',
          title: 'PORTFOLIO_SYSTEM.EXE',
          status: '[MISSION_ACTIVE]',
          classification: 'Personal Showcase Platform',
          objective: 'Professional presentation interface with NieR aesthetic',
          statusDescription: 'LIVE | CONTINUOUS_UPDATE',
          techStack: ['ANGULAR', 'TYPESCRIPT', 'TAILWIND', 'VERCEL'],
          demoUrl: 'https://adambenyekkoudev.vercel.app/',
          codeUrl: 'https://github.com/adam-benyekkou/angular_portfolio',
          isRedacted: false,
        },
        {
          id: 'redacted-1',
          title: 'REDACTED_PROJECT_1',
          status: '[REDACTED]',
          classification: '',
          objective: '',
          statusDescription: '',
          techStack: [],
          isRedacted: true,
        },
      ];
      this._projects.set(fallbackProjects);
      console.log('Fallback data loaded');
    }
  }

  private async fetchProjects(): Promise<Project[]> {
    console.log('Fetching projects from assets/data/projects.json');
    const result = await firstValueFrom(
      this.http.get<Project[]>('data/projects.json'),
    );
    console.log('HTTP request completed:', result);
    return result;
  }
}
