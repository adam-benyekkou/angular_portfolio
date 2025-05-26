// header-text-animate-section.component.ts
import {
  Component,
  effect,
  input,
  OnDestroy,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { type TextItem } from '../../../shared/models/header.model';

// Constants for better maintainability
const TYPING_DELAYS = {
  GLITCH: { min: 150, max: 200, probability: 0.03 },
  RAPID: { min: 5, max: 15, probability: 0.5 },
  SLOW: { min: 50, max: 80, probability: 0.15 },
  STUTTER: { delay: 200, probability: 0.02 },
} as const;

@Component({
  selector: 'app-header-text-animate-section',
  standalone: true,
  imports: [],
  templateUrl: './header-text-animate-section.component.html',
  styleUrl: './header-text-animate-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      transition('visible => hidden', animate('300ms ease-out')),
      transition('hidden => visible', animate('300ms ease-in')),
    ]),
    // Add fade-in animation for new text items
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
    ]),
  ],
})
export class HeaderTextAnimateSectionComponent implements OnInit, OnDestroy {
  // Input signals with better defaults
  phrases = input<readonly string[]>([
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
  ] as const);

  interval = input<number>(2500);
  typingSpeed = input<number>(25);
  maxDisplayedTexts = input<number>(4);

  // State signals
  private readonly displayedTexts = signal<readonly TextItem[]>([]);
  private readonly nextId = signal<number>(0);
  private readonly phraseIndex = signal<number>(0);
  private readonly isTypingInProgress = signal<boolean>(false);

  // Computed signals for better performance
  readonly currentTexts = computed(() => this.displayedTexts());
  readonly hasTexts = computed(() => this.displayedTexts().length > 0);

  // Timeout management
  private readonly activeTimeouts = new Set<number>();
  private nextTextTimeout?: number;

  constructor() {
    // Initialize first text when phrases are available
    effect(() => {
      const phrasesList = this.phrases();
      if (phrasesList.length > 0 && this.displayedTexts().length === 0) {
        this.scheduleNextText(0); // Start immediately
      }
    });
  }

  ngOnInit(): void {
    // Component initialization handled in constructor effect
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    // Clear all timeouts
    this.activeTimeouts.forEach((id) => window.clearTimeout(id));
    this.activeTimeouts.clear();

    if (this.nextTextTimeout) {
      window.clearTimeout(this.nextTextTimeout);
      this.nextTextTimeout = undefined;
    }
  }

  private scheduleNextText(delay: number = this.interval()): void {
    if (this.nextTextTimeout) {
      window.clearTimeout(this.nextTextTimeout);
    }

    this.nextTextTimeout = window.setTimeout(() => {
      this.startNextText();
    }, delay);
  }

  private startNextText(): void {
    if (this.isTypingInProgress()) return;

    const phrasesList = this.phrases();
    if (phrasesList.length === 0) return;

    const currentIndex = this.phraseIndex();
    const nextText = phrasesList[currentIndex];

    // Create immutable text item
    const newItem: TextItem = {
      id: this.nextId(),
      text: nextText,
      displayed: '',
      isTyping: true,
      isComplete: false,
    };

    // Update state atomically
    this.phraseIndex.update((idx) => (idx + 1) % phrasesList.length);
    this.nextId.update((id) => id + 1);
    this.isTypingInProgress.set(true);

    // Update displayed texts with proper cleanup
    this.displayedTexts.update((texts) => {
      const maxTexts = this.maxDisplayedTexts();
      if (texts.length >= maxTexts) {
        return [...texts.slice(texts.length - maxTexts + 1), newItem];
      }
      return [...texts, newItem];
    });

    // Start typing animation
    this.animateText(newItem.id);
  }

  private animateText(textId: number): void {
    const texts = this.displayedTexts();
    const textIndex = texts.findIndex((t) => t.id === textId);

    if (textIndex === -1) return;

    const textItem = texts[textIndex];
    const { text, displayed } = textItem;
    const nextCharIndex = displayed.length;

    if (nextCharIndex < text.length) {
      // Update displayed text
      const newDisplayed = text.substring(0, nextCharIndex + 1);

      this.displayedTexts.update((currentTexts) => {
        const updatedTexts = [...currentTexts];
        updatedTexts[textIndex] = {
          ...textItem,
          displayed: newDisplayed,
        };
        return updatedTexts;
      });

      // Schedule next character with dynamic timing
      const delay = this.calculateTypingDelay();
      const timeoutId = window.setTimeout(() => {
        this.animateText(textId);
      }, delay);

      this.activeTimeouts.add(timeoutId);
    } else {
      // Text complete
      this.completeText(textIndex, textItem);
    }
  }

  private calculateTypingDelay(): number {
    const random = Math.random();
    const baseSpeed = this.typingSpeed();

    // Apply different typing patterns based on probability
    if (random < TYPING_DELAYS.GLITCH.probability) {
      return (
        TYPING_DELAYS.GLITCH.min +
        Math.random() * (TYPING_DELAYS.GLITCH.max - TYPING_DELAYS.GLITCH.min)
      );
    }

    if (random < TYPING_DELAYS.RAPID.probability) {
      return (
        TYPING_DELAYS.RAPID.min +
        Math.random() * (TYPING_DELAYS.RAPID.max - TYPING_DELAYS.RAPID.min)
      );
    }

    if (
      random <
      TYPING_DELAYS.RAPID.probability + TYPING_DELAYS.SLOW.probability
    ) {
      return (
        TYPING_DELAYS.SLOW.min +
        Math.random() * (TYPING_DELAYS.SLOW.max - TYPING_DELAYS.SLOW.min)
      );
    }

    // Normal typing with variation
    let delay = baseSpeed + (Math.random() * 30 - 15);

    // Add occasional stutter effect
    if (Math.random() < TYPING_DELAYS.STUTTER.probability) {
      delay += TYPING_DELAYS.STUTTER.delay;
    }

    return Math.max(delay, 1); // Ensure positive delay
  }

  private completeText(textIndex: number, textItem: TextItem): void {
    // Mark text as complete
    this.displayedTexts.update((texts) => {
      const updatedTexts = [...texts];
      updatedTexts[textIndex] = {
        ...textItem,
        isTyping: false,
        isComplete: true,
      };
      return updatedTexts;
    });

    // Reset typing state and schedule next text
    this.isTypingInProgress.set(false);
    this.scheduleNextText();
  }

  // Optimized tracking function
  trackByTextId = (index: number, item: TextItem): number => item.id;
}
