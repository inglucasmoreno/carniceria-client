import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/services/data.service';
import { AlertService } from '../../services/alert.service';
import { VentasService } from '../../services/ventas.service';

@Component({
  selector: 'app-ventas-historial',
  templateUrl: './ventas-historial.component.html',
  styles: [
  ]
})
export class VentasHistorialComponent implements OnInit {
  
  public fecha = "2021-02-12";

  // Paginacion
  public paginaActual = 1;
  public cantidadItems = 10;

  // Filtrado
  public filtro = {
    parametro: '',
    activo: 'true'
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  public ventas: any[] = [];
  public montoTotal : number = 0;

  constructor(private alertService: AlertService,
              private dataService: DataService,
              private ventasService: VentasService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Ventas - Historial";
    this.alertService.loading();
    this.listarVentas();
  }

  // Calculo de monto total
  calculoMontoTotal(): void {
    this.montoTotal = 0;
    this.ventas.forEach( ({ precio_total, total_descuento, total_adicional_credito }) => {
      this.montoTotal += ((precio_total - total_descuento) + total_adicional_credito);  
    });
  }
  
  // Listado de ventas activas
  listarVentas(): void {
    this.ventasService.listarVentas(
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({ ventas }) => {
      this.alertService.close();
      this.ventas = ventas;
      this.calculoMontoTotal();
    });
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string): void{
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarVentas();
  }

}
