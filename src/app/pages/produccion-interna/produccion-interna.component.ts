import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ProduccionInternaService } from 'src/app/services/produccion-interna.service';
import { AlertService } from '../../services/alert.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-produccion-interna',
  templateUrl: './produccion-interna.component.html',
  styles: [
  ]
})
export class ProduccionInternaComponent implements OnInit {

  public cantidadTotal_entrada = 0;
  public cantidadTotal_salida = 0;

  // Produccion
  public produccion: any[] = [];
  public data = {
    producto_entrada: '',
    producto_salida: '',
    cantidad_entrada: null,
    cantidad_salida: 10
  }

  // Productos
  public productos: any[] = [];

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
              private produccionInternaService: ProduccionInternaService,
              private productosService: ProductosService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Produccion interna';
    this.listarProductos();
    this.listarProduccionInterna();
  }

  // Listar productos
  listarProductos(): void {
    this.productosService.listarProductos(
      1,
      'descripcion'
    ).subscribe(({ productos }) => {
      
      // Se guardan solo los productos activos activos
      this.productos = productos.filter(producto => {
        return producto.activo === true;
      })

    },({error})=>{
      this.alertService.errorApi(error.msg);
    });  
  }

  // Listar produccion interna
  listarProduccionInterna(): void {
    this.alertService.loading();
    this.produccionInternaService.listarProduccionInterna(
      this.ordenar.direccion,
      this.ordenar.columna,
      this.filtro.activo
    ).subscribe(({ produccion }) => {
      this.produccion = produccion;
      this.calcularTotal(produccion);
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
  
  // Completar Produccion interna
  completarProduccionInterna(): void {
    this.alertService.question({msg: "Estas por realizar el cierre", buttonText: 'Completar'})
    .then(({isConfirmed}) => {
      if (isConfirmed){
        this.produccionInternaService.completarProduccionInterna().subscribe(()=>{
          this.alertService.close();
          this.listarProduccionInterna();
        });
      }
    });    
  }
  
  // Nueva produccion interna
  nuevaProduccionInterna(): void {
        
    if(this.data.cantidad_entrada === null || this.data.cantidad_entrada <= 0 || this.data.cantidad_salida === null || this.data.cantidad_salida <= 0){
      this.alertService.info('Cantidad inválida');      
      return;
    }

    if(this.data.producto_entrada === '' || this.data.producto_entrada === null || this.data.producto_salida === '' || this.data.producto_salida === null){
      this.alertService.info('Debe seleccionar los dos productos');      
      return;
    }
  
    this.alertService.loading();
    
    this.produccionInternaService.nuevaProduccionInterna(this.data).subscribe(()=>{
      this.alertService.close();
      this.listarProduccionInterna();
      this.showModal = false;
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }
  
  // Eliminar produccion interna
  eliminarProduccionInterna(id: string): void {
    this.alertService.question({msg: "Estas por eliminar una produccion", buttonText: 'Eliminar'})
    .then(({isConfirmed}) => {
      if (isConfirmed){
        this.alertService.loading();
        this.produccionInternaService.eliminarProduccionInterna(id).subscribe(()=>{
          this.alertService.close();
          this.listarProduccionInterna();
        },({error})=>{
          this.alertService.errorApi(error);
        });  
      };
    });
  };
  
  // Calcular total
  calcularTotal(producciones: any[]): void {
    this.cantidadTotal_entrada = 0;
    this.cantidadTotal_salida = 0;
    producciones.forEach( produccion => {
      this.cantidadTotal_entrada += produccion.cantidad_entrada;
      this.cantidadTotal_salida += produccion.cantidad_salida;
    });
  }
  
  // Reiniciar formulario
  reiniciarFormulario(): void {
    this.data = {
      producto_entrada: '',
      producto_salida: '',
      cantidad_entrada: null,
      cantidad_salida: null
    }
  }
  
  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.filtro.activo = activo;
    this.paginaActual = 1;
    this.listarProduccionInterna();
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
    this.listarProduccionInterna();
  }


}
