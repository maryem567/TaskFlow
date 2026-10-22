
import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appOverdue]',
  standalone: true
})
export class Overdue implements OnInit {
  private el = inject(ElementRef);

  @Input() appOverdue: string | undefined;
  @Input() taskStatus = '';

  ngOnInit(): void {
    if (!this.appOverdue || this.taskStatus === 'Terminé') {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(this.appOverdue + 'T00:00:00');

    if (deadline < today) {
      this.el.nativeElement.style.borderColor = '#ef4444';
      this.el.nativeElement.style.backgroundColor = '#fef2f2';
    }
  }
}
