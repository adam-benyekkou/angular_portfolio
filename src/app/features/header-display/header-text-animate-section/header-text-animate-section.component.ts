// header-text-animate-section.component.ts
import {
  Component,
  effect,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

interface TextItem {
  id: number;
  text: string;
  displayed: string;
  isTyping: boolean;
  isComplete: boolean;
}

@Component({
  selector: 'app-header-text-animate-section',
  standalone: true,
  imports: [],
  templateUrl: './header-text-animate-section.component.html',
  styleUrl: './header-text-animate-section.component.css',
  animations: [
    trigger('textChange', [
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        }),
      ),
      transition('visible => hidden', [animate('0.5s ease-out')]),
      transition('hidden => visible', [animate('0.5s ease-in')]),
    ]),
  ],
})
export class HeaderTextAnimateSectionComponent implements OnInit, OnDestroy {
  phrases = input<string[]>([
    'Uploading guinea pig consciousness to the cloud...',
    'Error: Sarcasm module overloaded. Rebooting...',
    'Downloading personalities... 404: Personality not found.',
    'Coffee.exe has stopped working. Attempting to reboot human...',
    'Converting existential dread to binary...',
    'Hacking the mainframe with a rubber duck...',
    "Neural implant reports: You're still not cool enough...",
    'Cybernetic guinea pigs have seized control of Sector 7...',
    'ERROR: Reality.dll has crashed. Would you like to submit a bug report?',
    'Synthetic sushi generation complete. Tastes like chicken.exe...',
  ]);

  interval = input<number>(3000); // Default interval of 3 seconds
  typingSpeed = input<number>(30); // Time in ms between each character (faster than before)
  maxDisplayedTexts = input<number>(4); // Maximum number of texts to display

  // Signals for internal state
  displayedTexts = signal<TextItem[]>([]);
  nextId = signal<number>(0);
  phraseIndex = signal<number>(0);
  isTypingInProgress = signal<boolean>(false);

  private typewriterTimeouts: number[] = [];
  private nextTextTimeout: any;

  constructor() {
    // Use effect to react to changes in phrases
    effect(() => {
      const phrasesList = this.phrases();
      if (phrasesList.length > 0 && this.displayedTexts().length === 0) {
        this.startNextText();
      }
    });
  }

  ngOnInit(): void {
    if (this.phrases().length) {
      this.startTextRotation();
    }
  }

  ngOnDestroy(): void {
    this.stopTextRotation();
    this.clearTypewriterTimeouts();
  }

  private startTextRotation(): void {
    // Start with the first text
    this.startNextText();
  }

  private stopTextRotation(): void {
    if (this.nextTextTimeout) {
      clearTimeout(this.nextTextTimeout);
    }
  }

  private clearTypewriterTimeouts(): void {
    this.typewriterTimeouts.forEach((id) => window.clearTimeout(id));
    this.typewriterTimeouts = [];
  }

  private startNextText(): void {
    // If we're already typing, don't start a new one
    if (this.isTypingInProgress()) return;

    const phrasesList = this.phrases();
    if (phrasesList.length === 0) return;

    // Get the next phrase to display
    const index = this.phraseIndex();
    const nextText = phrasesList[index];

    // Update the index for the next time
    this.phraseIndex.update((idx) => (idx + 1) % phrasesList.length);

    // Create a new text item
    const newItem: TextItem = {
      id: this.nextId(),
      text: nextText,
      displayed: '',
      isTyping: true,
      isComplete: false,
    };

    // Update the nextId for the next time
    this.nextId.update((id) => id + 1);

    // Add the new text to the displayed texts list
    this.displayedTexts.update((texts) => {
      // If we already have the maximum number of texts, remove the oldest one
      if (texts.length >= this.maxDisplayedTexts()) {
        return [...texts.slice(1), newItem];
      }

      // Otherwise, just add the new text
      return [...texts, newItem];
    });

    // Set typing in progress
    this.isTypingInProgress.set(true);

    // Start the typewriter effect
    this.typeText(newItem.id);
  }

  private typeText(textId: number): void {
    const texts = this.displayedTexts();
    const textIndex = texts.findIndex((t) => t.id === textId);

    if (textIndex === -1) return;

    const textItem = texts[textIndex];
    const fullText = textItem.text;
    const currentLength = textItem.displayed.length;

    if (currentLength < fullText.length) {
      // Add one character
      const newDisplayed = fullText.substring(0, currentLength + 1);

      // Update the text
      this.displayedTexts.update((texts) => {
        const updatedTexts = [...texts];
        updatedTexts[textIndex] = {
          ...textItem,
          displayed: newDisplayed,
        };
        return updatedTexts;
      });

      // Hectic typing effect with much more randomization
      // Occasionally pause, sometimes type very fast, sometimes slower
      let nextDelay: number;

      // Random chance for different typing behaviors
      const randomFactor = Math.random();

      if (randomFactor < 0.05) {
        // Longer pause (glitch effect) - reduced probability and duration
        nextDelay = 200 + Math.random() * 150;
      } else if (randomFactor < 0.5) {
        // Rapid typing burst - increased probability
        nextDelay = 5 + Math.random() * 15;
      } else if (randomFactor < 0.65) {
        // Slow typing - reduced probability and duration
        nextDelay = 70 + Math.random() * 50;
      } else {
        // Normal typing speed with some variation - faster base speed
        nextDelay = this.typingSpeed() + Math.random() * 40 - 20;
      }

      // Occasionally "glitch" and add brief pause before continuing - reduced probability
      if (Math.random() < 0.03) {
        // Add a brief stutter (simulate buffering) - shorter pause
        nextDelay += 250;
      }

      const timeoutId = window.setTimeout(() => {
        this.typeText(textId);
      }, nextDelay);

      this.typewriterTimeouts.push(timeoutId);
    } else {
      // Text is complete
      this.displayedTexts.update((texts) => {
        const updatedTexts = [...texts];
        updatedTexts[textIndex] = {
          ...textItem,
          isTyping: false,
          isComplete: true,
        };
        return updatedTexts;
      });

      // Typing is no longer in progress
      this.isTypingInProgress.set(false);

      // Schedule the next text after the interval
      this.nextTextTimeout = setTimeout(() => {
        this.clearTypewriterTimeouts(); // Clear any remaining timeouts
        this.startNextText();
      }, this.interval());
    }
  }

  // Helper method to track items
  trackByTextId(index: number, item: TextItem): number {
    return item.id;
  }
}
