import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { VentasService } from '../../services/ventas.service';
import { AlertService } from '../../services/alert.service';
import { VentasProductosService } from '../../services/ventas-productos.service';

@Component({
  selector: 'app-ventas-detalles',
  templateUrl: './ventas-detalles.component.html',
  styles: [
  ]
})
export class VentasDetallesComponent implements OnInit {

  public idVenta;
  public paginaActual = 1;
  public cantidadItems = 5;
  public venta:any;
  public productos:any[] = [];

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private activatedRoute: ActivatedRoute,
              private ventasService: VentasService,
              private ventasProductosService: VentasProductosService) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = "Dashboard - Ventas - Detalle"
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.idVenta = id;
      this.getVenta();
    });
  }

  getVenta(): void {
    this.ventasService.getVenta(this.idVenta).subscribe( ({ venta }) => {
      this.venta = venta;
      this.listarProductos();
    }, ({error})=> {
      this.alertService.errorApi(error.msg);
    });
  }

  listarProductos(): void {
    this.ventasProductosService.productosPorVenta(this.idVenta).subscribe( ({productos}) => {
      this.productos = productos;
      this.alertService.close();
    }, ({error}) => {
      this.alertService.errorApi(error.msg);
    });
  }
  

}
