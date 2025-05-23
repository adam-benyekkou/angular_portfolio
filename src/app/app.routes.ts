import { Routes } from '@angular/router';
import { HeroComponent } from './layout/components/hero/hero.component';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  {
    path: 'about',
    loadComponent: () =>
      import('./layout/components/about/about.component').then(
        (c) => c.AboutComponent,
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./layout/components/contact/contact.component').then(
        (c) => c.ContactComponent,
      ),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import(
        './features/project-display/components/projects-list/projects-list.component'
      ).then((c) => c.ProjectsListComponent),
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./layout/components/experience/experience.component').then(
        (c) => c.ExperienceComponent,
      ),
  },
  { path: '**', redirectTo: '' }, // Wildcard route for 404 handling
];
