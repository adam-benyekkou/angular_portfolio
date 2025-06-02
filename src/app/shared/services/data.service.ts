import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Project } from '../models/project.model';
import { firstValueFrom } from 'rxjs';
import { type NeuralProfileNode } from '../models/about.model';
import { type Education } from '../models/education.model';
import { type Experience } from '../models/experience.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);

  // Private signals for state management
  private _projects = signal<Project[]>([]);
  private _skills = signal<NeuralProfileNode[]>([]);
  private _educations = signal<Experience[]>([]);
  private _experiences = signal<Experience[]>([]);
  private _traits = signal<string[]>([]);

  // Public readonly signals
  readonly projects = this._projects.asReadonly();
  readonly skills = this._skills.asReadonly();
  readonly educations = this._educations.asReadonly();
  readonly experiences = this._experiences.asReadonly();
  readonly traits = this._traits.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      const [projects, skills, educations, experiences, traits] =
        await Promise.all([
          this.fetchProjects(),
          this.fetchSkills(),
          this.fetchEducations(),
          this.fetchExperiences(),
          this.fetchTraits(),
        ]);

      console.log('All data loaded:', {
        projects,
        skills,
        educations,
        experiences,
        traits,
      });

      this._projects.set(projects);
      this._skills.set(skills);
      this._educations.set(educations);
      this._experiences.set(experiences);
      this._traits.set(traits);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private async fetchProjects(): Promise<Project[]> {
    try {
      return await firstValueFrom(
        this.http.get<Project[]>('data/projects.json'),
      );
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  private async fetchSkills(): Promise<NeuralProfileNode[]> {
    try {
      const result = await firstValueFrom(
        this.http.get<NeuralProfileNode>('data/skilltree.json'),
      );
      console.log('Fetched skills:', result);
      return [result];
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  }

  private async fetchEducations(): Promise<Experience[]> {
    try {
      const result = await firstValueFrom(
        this.http.get<Experience>('data/education.json'),
      );
      console.log('Fetched education:', result);
      return [result];
    } catch (error) {
      console.error('Error fetching education:', error);
      return [];
    }
  }

  private async fetchExperiences(): Promise<Experience[]> {
    try {
      const result = await firstValueFrom(
        this.http.get<Experience[]>('data/experiences.json'),
      );
      console.log('Fetched experiences:', result);
      return result;
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return [];
    }
  }

  private async fetchTraits(): Promise<string[]> {
    try {
      const result = await firstValueFrom(
        this.http.get<string[]>('data/traits.json'),
      );
      console.log('Fetched traits:', result);
      return result;
    } catch (error) {
      console.error('Error fetching traits:', error);
      return [];
    }
  }
}
