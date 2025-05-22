import { Routes } from '@angular/router';
import { AboutComponent } from './layout/components/about/about.component';
import { ContactComponent } from './layout/components/contact/contact.component';
import { HeroComponent } from './layout/components/hero/hero.component';
import { ProjectsListComponent } from './features/project-display/components/projects-list/projects-list.component';
import { ExperienceComponent } from './layout/components/experience/experience.component';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'projects', component: ProjectsListComponent },
  { path: 'experience', component: ExperienceComponent },
];
