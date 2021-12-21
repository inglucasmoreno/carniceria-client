import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from '../../services/alert.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styles: [
  ]
})
export class PromocionesComponent implements OnInit {


  public productos: any[] = [];
  public total = 0;
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
              private alertService: AlertService,
              private productosService: ProductosService) { }

  ngOnInit(): void {
    this.dataService.detectarPromociones();
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Productos - Promociones';
    this.listarProductos();
  }
    
  // Eliminar promocion
  eliminarPromocion(id: string) {
    this.alertService.loading();
    const data = { promocion: false, precio_promocion: 0 }
    this.productosService.actualizarProducto(id, data).subscribe(()=>{
      this.dataService.detectarPromociones();
      this.listarProductos();
    });
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
