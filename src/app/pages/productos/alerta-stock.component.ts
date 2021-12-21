import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-alerta-stock',
  templateUrl: './alerta-stock.component.html',
  styles: [
  ]
})
export class AlertaStockComponent implements OnInit {

  public total = 0;

  public productos: any[] = [];
  public paginaActual = 1;
  public cantidadItems = 10;

   // Filtrado
   public filtro = {
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'codigo'
  }

  constructor(private dataService: DataService,
              private router: Router,
              private alertService: AlertService,
              private productosService: ProductosService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Productos - Alerta de Stock"
    this.listarProductos();
  }

  
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

  detalleProducto(id): void {
    this.router.navigateByUrl(`/dashboard/productos/detalle/${id}`);
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
