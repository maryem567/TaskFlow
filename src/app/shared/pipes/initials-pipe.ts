
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {

  transform(value: string | null | undefined): string {

    if (!value || !value.trim()) {
      return '?';
    }

    const words = value.trim().split(/\s+/);

    return words
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

}
