import { Component } from '@angular/core';
import {
  ProjectsListComponent
} from '../../../features/project-display/components/projects-list/projects-list.component';

@Component({
  selector: 'app-projects',
  imports: [ProjectsListComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {}
