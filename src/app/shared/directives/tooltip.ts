
import { Directive, ElementRef, HostListener, Input, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class Tooltip {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input() appTooltip = '';

  private tooltipElement?: HTMLElement;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.appTooltip || this.tooltipElement) {
      return;
    }

    this.tooltipElement = this.renderer.createElement('span');

    this.renderer.setProperty(
      this.tooltipElement,
      'textContent',
      this.appTooltip
    );

    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', '#1f2937');
    this.renderer.setStyle(this.tooltipElement, 'color', '#ffffff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '6px 10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '6px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'margin-top', '6px');

    this.renderer.appendChild(
      this.el.nativeElement,
      this.tooltipElement
    );
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(
        this.el.nativeElement,
        this.tooltipElement
      );

      this.tooltipElement = undefined;
    }
  }
}
