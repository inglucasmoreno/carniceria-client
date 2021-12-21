import { Component, OnInit } from '@angular/core';
import { Desechos } from '../../models/desechos.model';
import { DataService } from 'src/app/services/data.service';
import { DesechosService } from 'src/app/services/desechos.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-desechos',
  templateUrl: './desechos.component.html',
  styles: [
  ]
})
export class DesechosComponent implements OnInit {

  public cantidadTotal = 0;

  // Desecho
  public desechos: Desechos[] = [];
  public descripcion: string = null;
  public cantidad: number = null;

  // Modal
  public showModal = false;

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

  constructor(private alertService: AlertService,
              private desechosService: DesechosService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Desechos';
    this.listarDesechos();
  }

  // Listar Desechos
  listarDesechos(): void {
    this.alertService.loading();
    this.desechosService.listarDesechos(
      this.ordenar.direccion,
      this.ordenar.columna,
      this.filtro.activo
    ).subscribe(({ desechos }) => {
      this.desechos = desechos;
      this.calcularTotal(desechos);
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Abrir modal
  abrirModal(): void {
    this.reiniciarFormulario();
    this.showModal = true;
  }

  // Completar desechos
  completarDesechos(): void {
    this.alertService.question({msg: "Estas por realizar el cierre", buttonText: 'Completar'})
    .then(({isConfirmed}) => {
      if (isConfirmed){
        this.desechosService.completarDesechos().subscribe(()=>{
          this.alertService.close();
          this.listarDesechos();
        });
      }
    });    
  }

  // Nuevo desecho
  nuevoDesecho(): void {
        
    if(this.cantidad === null || this.cantidad <= 0){
      this.alertService.info('Cantidad inválida');      
      return;
    }
  
    this.alertService.loading();

    const data = {
      descripcion: this.descripcion !== null ? this.descripcion : 'SIN DESCRIPCION',
      cantidad: this.cantidad 
    };

    this.desechosService.nuevoDesecho(data).subscribe(()=>{
      this.alertService.close();
      this.listarDesechos();
      this.showModal = false;
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Eliminar desecho
  eliminarDesecho(id: string): void {
    this.alertService.question({msg: "Estas por eliminar un desecho", buttonText: 'Eliminar'})
    .then(({isConfirmed}) => {
      if (isConfirmed){
        this.alertService.loading();
        this.desechosService.eliminarDesecho(id).subscribe(()=>{
          this.alertService.close();
          this.listarDesechos();
        },({error})=>{
          this.alertService.errorApi(error);
        });  
      };
    });
  };
  
  // Calcular total
  calcularTotal(desechos: any[]): void {
    this.cantidadTotal = 0;
    desechos.forEach( desecho => {
      this.cantidadTotal += desecho.cantidad;
    });
  }

  // Reiniciar formulario
  reiniciarFormulario(): void {
    this.descripcion = null;
    this.cantidad = null;
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.paginaActual = 1;
    this.filtro.activo = activo;
    this.listarDesechos();
  }

  // Filtrar por parametro
  filtrarDescripcion(parametro: string): void{
    this.filtro.parametro= parametro;
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarDesechos();
  }

}
