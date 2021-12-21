import { Component, OnInit } from '@angular/core';
import { Mayoristas } from 'src/app/models/mayoristas.models';
import { DataService } from 'src/app/services/data.service';
import { MayoristasService } from 'src/app/services/mayoristas.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-mayoristas',
  templateUrl: './mayoristas.component.html',
  styles: [
  ]
})
export class MayoristasComponent implements OnInit {

  public total = 0;
  public mayoristas: Mayoristas[] = [];

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

  constructor(private alertService: AlertService,
              private mayoristasService: MayoristasService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Mayoristas';
    this.listarMayoristas();
  }

  // Listar Mayoristas
  listarMayoristas(): void {
    this.mayoristasService.listarMayoristas(
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({mayoristas, total}) => {
      this.mayoristas = mayoristas;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

   // Actualizar estado
   actualizarEstado(mayorista: Mayoristas): void {
    this.alertService.question({ msg: 'Se esta por actualizar un estado', buttonText: 'Actualizar' })
                     .then(({isConfirmed}) => {
                        if (isConfirmed) {
                            this.alertService.loading();
                            this.mayoristasService.actualizarMayorista(mayorista._id, { activo: !mayorista.activo }).subscribe( () => {
                              this.listarMayoristas();          
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
    this.listarMayoristas();
  }

}
