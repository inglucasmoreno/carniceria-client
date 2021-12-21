import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { AlertService } from 'src/app/services/alert.service';
import { ProductosService } from 'src/app/services/productos.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styles: [
  ]
})
export class DetalleProductoComponent implements OnInit {

  public producto;
  public showModal = false;
  public precioPromocion: number = null;

  constructor(
      private activatedRoute: ActivatedRoute,
      private productosService: ProductosService,
      private dataService: DataService,
      private alertService: AlertService      
    ) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Productos - Detalles';
    this.activatedRoute.params.subscribe(({id}) => {
      this.getProducto(id);
    })
  }
  
  // Traer datos del producto
  getProducto(id: string): void {
    this.productosService.getProducto(id).subscribe( ({ producto }) => {
      this.producto = producto;
      this.alertService.close();
    });   
  }

  // Activar promocion de producto
  activarPromocion(): void {
    
    if(this.precioPromocion === null || this.precioPromocion <= 0){
      this.alertService.info('Precio de promoción inválido');
      return;
    }

    const data = {
      promocion: true,
      precio_promocion: this.precioPromocion
    }
    this.productosService.actualizarProducto(this.producto._id, data).subscribe(()=>{
      this.showModal = false;
      this.precioPromocion = null;
      this.dataService.detectarPromociones();
      this.getProducto(this.producto._id);
      this.alertService.success('Promoción activada correctamente');
    },({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Eliminar promocion de producto
  eliminarPromocion(): void {
    this.alertService.loading();
    const data = { promocion: false, precio_promocion: 0}
    this.productosService.actualizarProducto(this.producto._id, data).subscribe(()=>{
      this.showModal = false;
      this.precioPromocion = null;
      this.dataService.detectarPromociones();
      this.getProducto(this.producto._id);
    },({ error }) => {
      this.alertService.errorApi(error);
    });   
  }


}
