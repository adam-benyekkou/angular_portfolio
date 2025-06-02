// projects.component.ts
import { Component, signal, OnInit } from '@angular/core';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { type Project } from '../../shared/models/project.model';
import { ProjectTreeComponent } from './project-tree/project-tree.component';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { ProjectFooterComponent } from './project-footer/project-footer.component';
import { ProjectLoaderDecoratorComponent } from './project-loader-decorator/project-loader-decorator.component';
import { ProjectListComponent } from './projects-list/projects-list.component';

@Component({
  selector: 'app-projects',
  imports: [
    SectionTitleComponent,
    ProjectTreeComponent,
    ProjectModalComponent,
    ProjectFooterComponent,
    ProjectLoaderDecoratorComponent,
    ProjectListComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  // Signals
  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadProjects();
    this.startLoadingAnimation();
  }

  private startLoadingAnimation(): void {
    this.isLoading.set(true);
    // Stop animation after 3 seconds
    setTimeout(() => {
      this.isLoading.set(false);
    }, 3000);
  }

  private loadProjects(): void {
    const projectsData: Project[] = [
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
        caseStudy: {
          title: 'PORTFOLIO_SYSTEM.EXE',
          sections: [
            {
              title: 'PROJECT_OVERVIEW',
              content: `A NieR: Automata inspired personal portfolio showcasing development projects and skills.
                       The design captures the game's distinctive UI aesthetic while maintaining modern web standards
                       and accessibility. Built to stand out from typical developer portfolios while remaining
                       professional and functional.`,
            },
            {
              title: 'DESIGN_PHILOSOPHY',
              content: `Recreated the authentic NieR: Automata interface with parchment backgrounds,
                       geometric layouts, and terminal-style typography. The design system uses CSS custom properties
                       for theme consistency and implements dark/light mode switching that maintains
                       the aesthetic in both contexts. Every element is carefully crafted to feel like
                       it belongs in the game's world while serving a practical purpose.`,
            },
            {
              title: 'TECHNICAL_IMPLEMENTATION',
              content: `Built with Angular 19 and Tailwind CSS using a custom design system.
                       The architecture follows Angular best practices with standalone components,
                       lazy loading, and optimized build processes. Implemented responsive grid layouts,
                       smooth animations, and interactive elements that respond to user interactions
                       while maintaining the game's UI feel. Special attention was paid to performance
                       optimization and accessibility standards.`,
            },
            {
              title: 'CHALLENGES_SOLVED',
              content: `<strong>Challenge 1:</strong> Balancing aesthetic authenticity with web accessibility<br>
                       <strong>Solution:</strong> Created high-contrast color schemes that pass WCAG guidelines<br><br>

                       <strong>Challenge 2:</strong> Making retro aesthetics work on modern devices<br>
                       <strong>Solution:</strong> Responsive design system with flexible typography and layouts<br><br>

                       <strong>Challenge 3:</strong> Performance with complex visual effects<br>
                       <strong>Solution:</strong> CSS-only animations and optimized asset loading`,
            },
            {
              title: 'PERFORMANCE_METRICS',
              content: `• Lighthouse score: <strong>95+</strong><br>
                       • First contentful paint: <strong>< 1.2s</strong><br>
                       • Accessibility score: <strong>98%</strong><br>
                       • Mobile optimization: <strong>Perfect responsive design</strong><br>
                       • Bundle size: <strong>< 500KB gzipped</strong><br>
                       • SEO optimization: <strong>100%</strong>`,
            },
          ],
        },
      },
      // Redacted projects
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
      {
        id: 'redacted-2',
        title: 'REDACTED_PROJECT_2',
        status: '[REDACTED]',
        classification: '',
        objective: '',
        statusDescription: '',
        techStack: [],
        isRedacted: true,
      },
      {
        id: 'redacted-3',
        title: 'REDACTED_PROJECT_3',
        status: '[REDACTED]',
        classification: '',
        objective: '',
        statusDescription: '',
        techStack: [],
        isRedacted: true,
      },
    ];

    this.projects.set(projectsData);
  }

  openCaseStudy(project: Project): void {
    this.selectedProject.set(project);
  }

  closeCaseStudy(): void {
    this.selectedProject.set(null);
  }
}
