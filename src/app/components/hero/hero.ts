import { Component, signal, effect, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { translateSentence } from '../../utils/typing-engine';
import { FUNPUT_CONSTANTS } from '../../constants';

interface TypingSample {
  label: string;
  raw: string;
  expected: string;
}

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
})
export class HeroComponent {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly constants = FUNPUT_CONSTANTS;

  // State signals
  protected readonly activeTab = signal<'telex' | 'vni'>('telex');
  protected readonly rawInput = signal<string>('');
  protected readonly translatedOutput = signal<string>('');
  protected readonly isAutoTyping = signal<boolean>(false);

  // Typing samples for Telex and VNI
  protected readonly telexSamples: TypingSample[] = [
    { label: 'Tiếng Việt', raw: 'tieesng vieejt muowjt maaf', expected: 'tiếng việt mượt mà' },
    { label: 'Bộ gõ Rust', raw: 'booj gowx sieu nheje vieetst bawfng rust', expected: 'bộ gõ siêu nhẹ viết bằng rust' },
    { label: 'Chào thế giới', raw: 'xin chaof thees giois, funput ddaay neef', expected: 'xin chào thế giới, funput đây nè' }
  ];

  protected readonly vniSamples: TypingSample[] = [
    { label: 'Tiếng Việt', raw: 'tie6ng1 vie6t5 muo7t5 ma2', expected: 'tiếng việt mượt mà' },
    { label: 'Bộ gõ Rust', raw: 'bo65 go4 sieu1 nhe1 vie6t1 baw8ng2 rust', expected: 'bộ gõ siêu nhẹ viết bằng rust' },
    { label: 'Chào thế giới', raw: 'xin chao2 the61 gio7i1, funput d9a6y1 ne2', expected: 'xin chào thế giới, funput đây nè' }
  ];

  constructor() {
    // Automatically translate raw input when it changes
    effect(() => {
      const text = this.rawInput();
      const mode = this.activeTab();
      this.translatedOutput.set(translateSentence(text, mode));
    });

    // Reset input when switching tabs
    effect(() => {
      this.activeTab();
      this.rawInput.set('');
    });

    // Run auto-typing demo on browser load
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.runAutoTypingDemo();
      }
    });
  }

  // Handle user typing in the interactive demo
  protected onInputChange(event: Event): void {
    if (this.isAutoTyping()) {
      this.isAutoTyping.set(false); // Interrupt auto-typing if user types
    }
    const input = event.target as HTMLInputElement;
    this.rawInput.set(input.value);
  }

  // Select a sample to auto-type
  protected selectSample(sample: TypingSample): void {
    this.isAutoTyping.set(false);
    this.rawInput.set('');
    this.animateTyping(sample.raw);
  }

  // Clear the typing demo
  protected clearDemo(): void {
    this.isAutoTyping.set(false);
    this.rawInput.set('');
  }

  // Run the initial auto-typing demo
  private runAutoTypingDemo(): void {
    const textToType = this.activeTab() === 'telex' 
      ? 'chaof muwngf banj ddeens vowis funput' 
      : 'chao2 mu7ng1 ban5 d9e6n1 vo7i1 funput';

    this.animateTyping(textToType);
  }

  // Animate character-by-character typing
  private animateTyping(text: string): void {
    this.isAutoTyping.set(true);
    let index = 0;
    
    const typeNextChar = () => {
      if (!this.isAutoTyping()) return; // Stop if interrupted

      if (index < text.length) {
        this.rawInput.set(text.substring(0, index + 1));
        index++;
        const delay = Math.random() * 80 + 60; 
        setTimeout(typeNextChar, delay);
      } else {
        this.isAutoTyping.set(false);
      }
    };

    setTimeout(typeNextChar, 500);
  }
}
