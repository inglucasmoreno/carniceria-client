import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { IngresosService } from 'src/app/services/ingresos.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styles: [
  ]
})
export class IngresosComponent implements OnInit {

  public showModal = false;

  public total = 0;
  public ingresos: any[] = [];

  public proveedor: string = '';
  public proveedores: any = [];

  // Paginación
  public paginaActual = 1;
  public cantidadItems = 10;

  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  constructor(private ingresosService: IngresosService,
              private proveedoresService: ProveedoresService,
              private dataService: DataService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Ingresos';
    this.alertService.loading();
    this.listarIngresos();
    this.listarProveedores();
  }

  // Generar reporte de ingresos
  generarReporte(){}

  // Listar proveedores
  listarProveedores(): void {
    this.proveedoresService.listarProveedores().subscribe(({proveedores}) => {
      this.proveedores = proveedores;
      this.proveedor = proveedores[0]._id;
    });
  }

  // Listar ingresos
  listarIngresos(): void {
    this.ingresosService.listarIngresos(
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe( ({ ingresos, total }) => {
      this.ingresos = ingresos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);  
    });
  }

  // Crear nuevo ingreso
  nuevoIngreso(): void {
    this.showModal = false
    this.alertService.loading();
    const data = { proveedor: this.proveedor };
    this.ingresosService.nuevoIngreso(data).subscribe(({ ingreso }) => {
      this.alertService.close();
      this.router.navigateByUrl(`dashboard/ingresos/detalles/${ingreso._id}`);
    },(({error}) => {
      this.alertService.errorApi(error.msg);
    })); 
  }

  // Filtro por activo
   filtrarActivos(activo: string): void{
    this.paginaActual = 1;
    this.filtro.activo = activo;
  }

  // Filtrar parametro
  filtrarParametro(parametro: string): void{
    this.paginaActual = 1;
    this.filtro.parametro = parametro;
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarIngresos();
  }

}
