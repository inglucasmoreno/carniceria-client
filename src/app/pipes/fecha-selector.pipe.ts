import { Pipe, PipeTransform } from '@angular/core';
import { format, add } from 'date-fns';

@Pipe({
  name: 'fechaSelector'
})
export class FechaSelectorPipe implements PipeTransform {
  transform(fecha: any): string {
    const newDate = add(new Date(fecha), {hours: 3});
    return format(newDate, 'dd/MM/yyyy');
  }
}
