import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { Proveedor } from '../../models/proveedor.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styles: [
  ]
})
export class ProveedoresComponent implements OnInit {

  public total = 0;
  public proveedores: Proveedor[] = [];

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
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'razon_social'
  }

  constructor(private proveedoresService: ProveedoresService,
              private alertService: AlertService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Proveedores';
    this.listarProveedores();
  }

  // Generar reporte de usuarios
  generarReporte(): void {}

  // Listar Proveedores
  listarProveedores(): void {
    this.proveedoresService.listarProveedores(
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({proveedores, total}) => {
      this.proveedores = proveedores;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Actualizar estado
  actualizarEstado(proveedor: Proveedor): void {
    this.alertService.question({ msg: 'Se esta por actualizar un estado', buttonText: 'Actualizar' })
                     .then(({isConfirmed}) => {
                        if (isConfirmed) {
                            this.alertService.loading();
                            this.proveedoresService.actualizarProveedor(proveedor._id, { activo: !proveedor.activo }).subscribe( () => {
                              this.listarProveedores();          
                            },(({ error }) => {
                              this.alertService.errorApi(error.msg);
                            }));
                        }
                     }) 
  }

  // Filtrar Activo/Inactivo
   filtrarActivos(activo: any): void{
    this.paginaActual = 1;
    this.filtro.activo = activo;
  }

  // Filtrar por parametro
  filtrarDescripcion(parametro: string): void{
    this.paginaActual = 1;
    this.filtro.parametro= parametro;
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarProveedores();
  }

}
