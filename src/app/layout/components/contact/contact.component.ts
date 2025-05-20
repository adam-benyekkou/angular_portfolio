import { Component } from '@angular/core';
import {ContactDisplayComponent} from '../../../features/contact-display/contact-display.component';

@Component({
  selector: 'app-contact',
  imports: [ContactDisplayComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {}
