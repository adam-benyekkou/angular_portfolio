import { Component, signal } from '@angular/core';
import { Experience } from '../../../../shared/models/experience.model';
import { DetailBlockComponent } from '../shared/detail-block/detail-block.component';
import { TechStackComponent } from '../tech-stack/tech-stack.component';

@Component({
  selector: 'app-column-professional-info',
  imports: [DetailBlockComponent, TechStackComponent],
  templateUrl: './column-professional-info.component.html',
  styleUrl: './column-professional-info.component.css',
})
export class ColumnProfessionalInfoComponent {
  private _experiences = signal<Experience[]>([
    {
      id: 'senior-specialist',
      title: 'PYTHON_API_SPECIALIST.EXE',
      classification: 'Python & Django API/RPA Specialist',
      objective:
        'Specialized in Python/Django development for API automation and RPA processes. Led technical interventions for complex enterprise HR system integrations, developing robust solutions that bridge business requirements with technical implementation.',
      timeline: 'UKG | January 2024 - January 2025',
      techStack: ['PYTHON', 'DJANGO', 'API', 'RPA'],
      status: 'completed',
      statusLabel: 'ARCHIVED | SME_SPECIALIST',
    },
    {
      id: 'specialist-ii',
      title: 'SYSTEMS_INTEGRATION_SME.EXE',
      classification: 'Enterprise Systems Integration',
      objective:
        'Subject Matter Expert (SME) for enterprise HRSD connectors and system integrations. Specialized in complex technical challenges involving API development, RPA automation, and SFTP protocols. Provided BI support and data visualization solutions.',
      timeline: 'UKG | January 2023 - January 2024',
      techStack: ['PYTHON', 'DJANGO', 'API', 'RPA'],
      status: 'completed',
      statusLabel: 'ARCHIVED | SME_SPECIALIST',
    },
    {
      id: 'specialist',
      title: 'SOLUTION_SUPPORT.EXE',
      classification: 'B2B Solution Support',
      objective:
        'Delivered high-level technical support for VIP business clients using HRSD solutions. Developed expertise in SaaS platforms and enterprise decision-making processes while managing critical client relationships.',
      timeline: 'UKG | October 2021 - January 2023',
      techStack: ['SAAS', 'HRSD', 'CLIENT_MGMT'],
      status: 'completed',
      statusLabel: 'ARCHIVED | VIP_TIER',
    },
    {
      id: 'technician',
      title: 'IT_TECHNICIAN.EXE',
      classification: 'Information Technology Technician',
      objective:
        'Provided VIP end-user support, managed hardware/software deployments, and implemented networking and information security practices in a mission-critical environment.',
      timeline: 'Armée de Terre | July 2018 - December 2018',
      techStack: ['NETWORKING', 'SECURITY', 'DEPLOYMENT'],
      status: 'completed',
      statusLabel: 'ARCHIVED | MILITARY',
    },
  ]);

  experiences = this._experiences;
}
