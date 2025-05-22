import { Component, OnInit, OnDestroy } from '@angular/core';
import { HoloVideoContainerComponent } from '../../shared/ui/holo-video-container/holo-video-container.component';

@Component({
  selector: 'app-hero-display',
  imports: [HoloVideoContainerComponent],
  templateUrl: './hero-display.component.html',
  styleUrl: './hero-display.component.css',
})
export class HeroDisplayComponent implements OnInit, OnDestroy {
  displayText: string = '';

  private messageQueue: string[] = [
    'Web Developer',
    'Coding Enjoyer',
    'Software Artisan',
  ];

  private currentMessage: string = '';
  private isGlitching: boolean = false;
  private frameRequest: number | null = null;
  private processTimeout: any = null;
  private isInitialMount: boolean = true;

  ngOnInit(): void {
    this.initialMountAnimation();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }
    if (this.processTimeout) {
      clearTimeout(this.processTimeout);
    }
  }

  private initialMountAnimation(): void {
    const firstMessage = this.messageQueue[0];
    let currentIndex = 0;

    const animateNextLetter = (): void => {
      if (currentIndex <= firstMessage.length) {
        let output = '';

        // Build the confirmed part
        for (let i = 0; i < currentIndex; i++) {
          output += firstMessage[i];
        }

        // Add intense scrambling for upcoming letters (very fast scramble)
        const scrambleLength = Math.min(6, firstMessage.length - currentIndex);
        for (let i = 0; i < scrambleLength; i++) {
          output += Math.random() > 0.5 ? '0' : '1';
        }

        this.displayText = output;

        if (currentIndex < firstMessage.length) {
          currentIndex++;
          setTimeout(animateNextLetter, 35 + Math.random() * 25); // Much faster: 35-60ms
        } else {
          // Mount animation complete, start normal cycle
          this.displayText = firstMessage;
          this.currentMessage = firstMessage;
          this.messageQueue.shift(); // Remove the first message since we used it
          this.isInitialMount = false;

          // Start the regular cycle after a short pause
          setTimeout(() => {
            this.processQueue();
          }, 2000);
        }
      }
    };

    animateNextLetter();
  }

  private processQueue(): void {
    if (this.messageQueue.length === 0) {
      this.messageQueue = [
        'Web Developer',
        'Coding Enjoyer',
        'Software Artisan',
      ];
    }

    const nextMessage = this.messageQueue.shift()!;
    this.startScrambleAnimation(nextMessage);

    this.processTimeout = setTimeout(() => {
      this.processQueue();
    }, 6000); // Reduced from 10000 to 6000 (faster rotation)
  }

  private startScrambleAnimation(nextMessage: string): void {
    const length = Math.max(this.displayText.length, nextMessage.length);
    let complete = 0;

    const update = (): void => {
      let output = '';
      const scrambleChars = 3 + Math.random() * 5;

      for (let i = 0; i < length; i++) {
        const scramble = i < scrambleChars + complete && Math.random() > 0.8;

        if (i < nextMessage.length) {
          if (scramble) {
            output += Math.random() > 0.5 ? '0' : '1';
          } else if (i < complete) {
            output += nextMessage[i];
          } else {
            output += this.displayText[i] || (Math.random() > 0.5 ? '0' : '1');
          }
        }
      }

      this.displayText = output;

      if (complete < nextMessage.length) {
        complete += 0.5 + Math.floor(Math.random() * 2);
        setTimeout(update, 40 + Math.random() * 60);
      } else {
        this.displayText = nextMessage;
        this.currentMessage = nextMessage;
        this.isGlitching = true;
        this.glitchText();
      }
    };

    this.isGlitching = false;
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }
    update();
  }

  private glitchText(): void {
    if (!this.isGlitching) return;

    const probability = Math.random();

    if (probability < 0.05) {
      // Reduced from 0.2 to 0.05
      const scrambledText = this.currentMessage
        .split('')
        .map(() => (Math.random() > 0.5 ? '0' : '1'))
        .join('');
      this.displayText = scrambledText;

      setTimeout(() => {
        this.displayText = this.currentMessage;
      }, 25);
    } else if (probability < 0.15) {
      // Reduced from 0.5 to 0.15
      const textArray = this.currentMessage.split('');
      for (let i = 0; i < Math.floor(textArray.length * 0.2); i++) {
        // Reduced from 0.4 to 0.2
        const idx = Math.floor(Math.random() * textArray.length);
        textArray[idx] = Math.random() > 0.5 ? '0' : '1';
      }
      this.displayText = textArray.join('');

      setTimeout(() => {
        this.displayText = this.currentMessage;
      }, 20);
    }

    const jitterProbability = Math.random();
    if (jitterProbability < 0.1) {
      // Reduced from 0.5 to 0.1
      setTimeout(() => {
        const textArray = this.displayText.split('');
        for (let i = 0; i < 2; i++) {
          // Reduced from 4 to 2 characters
          const idx = Math.floor(Math.random() * textArray.length);
          if (textArray[idx] === '0' || textArray[idx] === '1') {
            textArray[idx] = textArray[idx] === '0' ? '1' : '0';
          }
        }
        this.displayText = textArray.join('');

        setTimeout(() => {
          this.displayText = this.currentMessage;
        }, 15);
      }, 15);
    }

    this.frameRequest = requestAnimationFrame(() => {
      setTimeout(() => this.glitchText(), Math.random() * 500); // Increased from 150 to 500
    });
  }
}
