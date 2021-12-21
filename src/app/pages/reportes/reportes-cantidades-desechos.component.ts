import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { DataService } from 'src/app/services/data.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-reportes-cantidades-desechos',
  templateUrl: './reportes-cantidades-desechos.component.html',
  styles: [
  ]
})
export class ReportesCantidadesDesechosComponent implements OnInit {

  // Modal
  public showModal = false;

  public fechaDesde = '';
  public fechaHasta = '';

  public totales = {
    desechos: 0,
    cantidad: 0
  };

  constructor(private dataService: DataService,
              private reportesService: ReportesService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Reportes - Cantidades vs Desechos";
  }
  
  // Buscar
  buscar(): void {
    // if(this.fechaDesde == '' || this.fechaHasta == '') return this.alertService.info('Fecha inválida');
    this.alertService.loading();
    this.reportesService.getCantidadesDesechos({fechaDesde: this.fechaDesde, fechaHasta: this.fechaHasta}).subscribe(({desechosTotal, cantidadTotal}) => {
      this.totales.cantidad = cantidadTotal;
      this.totales.desechos = desechosTotal;
      this.alertService.close();
      this.showModal = true;
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

}
