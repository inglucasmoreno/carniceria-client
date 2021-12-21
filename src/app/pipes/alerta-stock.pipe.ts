import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alertaStock'
})
export class AlertaStockPipe implements PipeTransform {

  transform(flag_stock_minimo: boolean, cantidad: number, cantidad_minima: number): boolean {
    if(flag_stock_minimo){
      if(cantidad <= cantidad_minima){
        return true;
      }else{
        return false;
      } 
    }else{
      return false;
    }
  }

}
