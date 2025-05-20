import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  label = input<string>('label');
  selected = input<boolean>(false);
  isNav = input<boolean>(false);
  onClick = output<void>();

  getButtonClass() {
    const baseClass =
      'font-terminal-retro uppercase transition-all duration-300';

    if (this.isNav()) {
      return `${baseClass} bg-transparent text-nier-text-dark border-0 hover:underline`;
    }

    return this.selected()
      ? `${baseClass} bg-nier-dark text-nier-text-light border border-nier-border rounded-none`
      : `${baseClass} bg-nier-mid text-nier-text-dark border border-nier-border rounded-none hover:bg-nier-dark hover:text-nier-text-light`;
  }

  handleClick() {
    this.onClick.emit();
  }
}
