import { Component, OnInit } from '@angular/core';
import { CajasService } from 'src/app/services/cajas.service';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-reportes-cajas',
  templateUrl: './reportes-cajas.component.html',
  styles: [
  ]
})
export class ReportesCajasComponent implements OnInit {

  public showFormaPago = false;

  // Cajas
  public cajas: any;
  public cajaSeleccionada: any;
  public otrosGastos: any[] = [];
  public otrosIngresos: any[] = [];
  public billetes: any;
  public showBilletes = true;

  // Paginacion
  public paginaActual = 1;
  public cantidadItems = 10;

  // Gastos e Ingresos
  public showGastos = false;
  public showIngresos = false;

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  constructor(private dataService: DataService,
              private cajasService: CajasService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Historial de cajas';
    this.listarCajas();
  }

  // Caja por ID
  seleccionarCaja(id: string): void {
    this.showIngresos = false;
    this.showGastos = false;
    this.showBilletes = false;
    this.alertService.loading();
    this.cajasService.getCaja(id).subscribe(({ caja, otrosIngresos, otrosGastos, billetes }) => {
      this.billetes = billetes;
      this.otrosGastos = otrosGastos;
      this.otrosIngresos = otrosIngresos;
      this.cajaSeleccionada = caja;
      this.alertService.close();
    });   
  }

  // Listado de cajas
  listarCajas(): void {
    this.cajasService.listarCajas(
      this.ordenar.direccion,
      this.ordenar.columna  
    ).subscribe( ({ cajas }) => {
      this.cajas = cajas;
      this.alertService.close();
    },({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarCajas();
  }

}
