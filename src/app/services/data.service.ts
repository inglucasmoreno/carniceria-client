import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CuentaCorrienteService } from './cuenta-corriente.service';
import { ProductosService } from './productos.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  ubicacionActual: string = 'Dashboard';
  promocionesAlert = false;
  stockAlert = false;
  totalCuentaCorriente = 0;
  
  constructor(private productosService: ProductosService,
              private authService: AuthService,
              private cuentaCorrienteService: CuentaCorrienteService) { }
  
  // Calculo de monto en cuenta corriente - Usuario online
  calcularTotalCuentaCorriente(): void {
    this.cuentaCorrienteService.listarCuentasCorrientes(this.authService.usuario.uid, -1, 'createdAt', true).subscribe(({cuentas_corrientes}) => {
      let totalTmp = 0;
      cuentas_corrientes.forEach( elemento => {
        totalTmp += elemento.total;
      });
      this.totalCuentaCorriente = totalTmp;  
    });
  }

  // Redonde de numeros
  redondear(numero:number, decimales:number):number {
  
    if (typeof numero != 'number' || typeof decimales != 'number') return null;

    let signo = numero >= 0 ? 1 : -1;

    return Number((Math.round((numero * Math.pow(10, decimales)) + (signo * 0.0001)) / Math.pow(10, decimales)).toFixed(decimales));
  
  }

  // Detector de promociones
  detectarPromociones(): void {
    this.promocionesAlert= false;
    this.productosService.listarProductos().subscribe(({productos}) => {
      productos.forEach(producto => {
        if(producto.promocion){
          this.promocionesAlert = true;
          return;
        }
      });
    }); 
  }

  // Detector de stock minimo
  detectarStockMinimo(): void {
    this.stockAlert= false;
    this.productosService.listarProductos().subscribe(({productos}) => {
      productos.forEach(producto => {
        if(producto.stock_minimo && (producto.cantidad <= producto.cantidad_minima)){
          this.stockAlert = true;
          return;
        }
      });
    }); 
  }

}
