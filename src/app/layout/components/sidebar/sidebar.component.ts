import { Component } from '@angular/core';
import {SidebarDisplayComponent} from '../../../features/sidebar-display/sidebar-display.component';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarDisplayComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {}
