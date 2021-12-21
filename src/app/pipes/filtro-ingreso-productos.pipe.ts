import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroIngresoProductos'
})
export class FiltroIngresoProductosPipe implements PipeTransform {

  transform(valores: any[], parametro: string, activo = 'true'): any {
    
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
        return valor.activo == boolActivo;
      });
    }else if(boolActivo === null){
      filtrados = valores; 
    }
    
    // Filtrado por parametro
    parametro = parametro.toLocaleLowerCase();
    const codigoBalanza = parametro.slice(0,7);

    if(parametro.length !== 0){
      return filtrados.filter( valor => { 
        return valor.producto.codigo.toLocaleLowerCase().includes(parametro) ||
               valor.producto.codigo.toLocaleLowerCase().includes(codigoBalanza) ||
               valor.producto.descripcion.toLocaleLowerCase().includes(parametro)
      });
    }else{
      return filtrados;
    }
  
  }
}
