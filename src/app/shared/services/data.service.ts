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
    console.log('DataService initialized');
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      console.log('Starting to load data...');
      const [projects, skills] = await Promise.all([
        this.fetchProjects(),
        this.fetchSkills(),
      ]);

      console.log('Projects loaded successfully:', projects);
      console.log('Skills loaded successfully:', skills);
      console.log('Number of projects:', projects.length);
      console.log('Number of skills:', skills.length);

      this._projects.set(projects);
      this._skills.set(skills);
      console.log('All data signals updated');
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private async fetchProjects(): Promise<Project[]> {
    console.log('Fetching projects from data/projects.json');
    const result = await firstValueFrom(
      this.http.get<Project[]>('data/projects.json'),
    );
    console.log('Projects HTTP request completed:', result);
    return result;
  }

  private async fetchSkills(): Promise<NeuralProfileNode[]> {
    console.log('Fetching skills from data/skilltree.json');
    const result = await firstValueFrom(
      this.http.get<NeuralProfileNode[] | NeuralProfileNode>(
        'data/skilltree.json',
      ),
    );
    console.log('Skills HTTP request completed:', result);

    // If the JSON contains a single object instead of an array, wrap it in an array
    if (result && !Array.isArray(result)) {
      console.log('Converting single skill object to array');
      return [result as NeuralProfileNode];
    }

    return Array.isArray(result) ? result : [];
  }
}
