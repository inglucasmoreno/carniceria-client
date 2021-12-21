import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from '../../services/data.service';
import { CuentaCorrienteService } from '../../services/cuenta-corriente.service';
import { AlertService } from '../../services/alert.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html',
  styles: [
  ]
})
export class CuentaCorrienteComponent implements OnInit {

  constructor(private dataService: DataService,
              public authService: AuthService,
              private usuariosService: UsuariosService,
              private activatedRoute: ActivatedRoute, 
              private alertService: AlertService,
              private cuentaCorrienteService: CuentaCorrienteService) { }

  // Modal
  public showDetalles = false;

  // Usuario
  public usuario: any = {};
  public idUsuario = '';            

  // Elementos
  public elementos: any = [];
  public elementoSeleccionado: any = {};
  public total = 0;

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  // Filtrado
  public filtro = {
    activo: 'true',
  }

  // Inicio del componente
  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Cuenta corriente';
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.idUsuario = id;
      this.usuariosService.getUsuario(id).subscribe( usuario => {
        console.log(usuario);
        this.usuario = usuario;
        this.listarElementos();
      },({error})=>{
        this.alertService.errorApi(error);
      });
    });
  }

  // Listar elementos
  listarElementos(): void {
    this.alertService.loading();
    this.cuentaCorrienteService.listarCuentasCorrientes(
      this.idUsuario,
      this.ordenar.direccion,
      this.ordenar.columna,
      this.filtro.activo
    ).subscribe( ({ cuentas_corrientes }) => {
      console.log(cuentas_corrientes);
      this.elementos = cuentas_corrientes;
      this.calcularTotal();
      this.alertService.close();
    },({ error }) => { 
      this.alertService.errorApi(error);  
      console.log(error);
    }); 
  }

  // Calculo de total
  calcularTotal(): void {
    let totalTemp = 0;
    this.elementos.forEach( elemento => {
      totalTemp += elemento.total;
    });
    this.total = totalTemp;
  }

  // Completar todos los elementos
  completarListado(): void {
    this.alertService.question({msg:'¿Quieres completar todos los elementos?', buttonText: 'Eliminar'})
      .then(({ isConfirmed })=>{
        if(isConfirmed){
          this.alertService.loading();
          this.cuentaCorrienteService.completarCuentasCorrientes(this.idUsuario).subscribe(()=>{
            this.dataService.calcularTotalCuentaCorriente();
            this.listarElementos();
          },({error})=>{
            this.alertService.errorApi(error);
          });
        }     
      });      
  }

  // Actualizar elemento
  completarIngreso(id: string): void {
    this.alertService.question({msg:'¿Quieres completar este elemento?', buttonText: 'Eliminar'})
      .then(({ isConfirmed })=>{
        if(isConfirmed){
          this.alertService.loading();
          this.cuentaCorrienteService.actualizarCuentaCorriente(id, { activo: false }).subscribe(()=>{
            this.dataService.calcularTotalCuentaCorriente();
            this.listarElementos();
          },({error})=>{
            this.alertService.errorApi(error);
          });
        }     
      });     
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.paginaActual = 1;
    this.filtro.activo = activo;
    this.listarElementos();
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.alertService.loading();
    this.listarElementos();
  }

  // Modal: Detalles de elemento
  detallesElemento(elemento: any): void {
    this.elementoSeleccionado = elemento;
    this.showDetalles = true;
  }

}
