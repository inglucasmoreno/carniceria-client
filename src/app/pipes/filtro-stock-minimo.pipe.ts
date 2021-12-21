import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroStockMinimo'
})
export class FiltroStockMinimoPipe implements PipeTransform {

  transform(valores: any[], parametro: string, activo: string): any {
    
    // Trabajando con activo boolean
    let boolActivo: boolean;
    let filtrados: any[];
  
    // Creando variable booleana
    if(activo === 'true') boolActivo = true;
    else if(activo === 'false') boolActivo = false; 
    else boolActivo = null;
    
    // Filtrado Activo - Inactivo - Todos
    if(boolActivo !== null){
      filtrados = valores.filter( valor => {
        return (valor.activo == boolActivo && valor.stock_minimo && (valor.cantidad <= valor.cantidad_minima));
      });
    }else if(boolActivo === null){
      filtrados = valores; 
    }
    
    // Filtrado por parametro (Codigo - Descripcion)
    parametro = parametro.toLocaleLowerCase();
    const codigoBalanza = parametro.slice(0,7);
    
    if(parametro.length !== 0){
      return filtrados.filter( valor => { 
        return  valor.codigo.toLocaleLowerCase().includes(parametro) ||
                valor.codigo.toLocaleLowerCase().includes(codigoBalanza) ||
                valor.descripcion.toLocaleLowerCase().includes(parametro)
        });
    }else{
      return filtrados;
    }

  }
}
