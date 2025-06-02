import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Project } from '../models/project.model';
import { firstValueFrom } from 'rxjs';
import { NeuralProfileNode } from '../models/about.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);

  // Private signals for state management
  private _projects = signal<Project[]>([]);
  private _skills = signal<NeuralProfileNode[]>([]);

  // Public readonly signals
  readonly projects = this._projects.asReadonly();
  readonly skills = this._skills.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      const [projects, skills] = await Promise.all([
        this.fetchProjects(),
        this.fetchSkills(),
      ]);

      this._projects.set(projects);
      this._skills.set(skills);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private async fetchProjects(): Promise<Project[]> {
    return firstValueFrom(this.http.get<Project[]>('data/projects.json'));
  }

  private async fetchSkills(): Promise<NeuralProfileNode[]> {
    const result = await firstValueFrom(
      this.http.get<NeuralProfileNode>('data/skilltree.json'),
    );

    return [result];
  }
}
