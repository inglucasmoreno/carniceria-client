import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ProductosService } from 'src/app/services/productos.service';
import { AlertService } from '../../services/alert.service';

import { Producto } from '../../models/producto.model';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styles: [
  ]
})
export class ProductosComponent implements OnInit {

  public usuarioLogin;

  public total = 0;
  public productos = [];

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
    columna: 'descripcion'
  }

  constructor(private productosService: ProductosService,
              private alertService: AlertService,
              public dataService: DataService,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Productos';
    this.alertService.loading();
    this.dataService.detectarPromociones();  // Se detectan promociones activas
    this.dataService.detectarStockMinimo();  // Se detectan si hay stock minimo
    this.usuarioLogin = this.authService.usuario;
    this.listarProductos();
  }

  // Generar reporte de usuarios
  generarReporte(): void {}
  
  // Listar productos
  listarProductos() {
    this.productosService.listarProductos(
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe( ({productos, total}) => {
      this.productos = productos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(producto: Producto): void {
    const { _id, activo } = producto;

    this.alertService.question({msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar'})
                     .then((result)=>{
                        if (result.isConfirmed) {
                          this.alertService.loading();
                          this.productosService.actualizarProducto(_id, {activo: !activo}).subscribe(() => {
                            this.listarProductos();
                          }, ({error}) => {
                            this.alertService.errorApi(error.msg);
                          });
                        };                   
                     });  
  }

  detalleProducto(id): void {
    if(this.usuarioLogin.role !== 'ADMIN_ROLE'){
      this.alertService.info('No tienes permiso para ingresar');
      return;
    }
    this.router.navigateByUrl(`/dashboard/productos/detalle/${id}`);
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.paginaActual = 1;
    this.filtro.activo = activo;
  }

  // Filtrar por parametro
  filtrarDescripcion(parametro: string): void{
    this.paginaActual = 1;
    this.filtro.parametro = parametro;
  }
 
  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarProductos();
  }

}
