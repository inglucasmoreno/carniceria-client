import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ProductosService } from '../../services/productos.service';
import { MayoristasService } from '../../services/mayoristas.service';
import { ProveedoresService } from '../../services/proveedores.service';
import { AlertService } from '../../services/alert.service';
import { ReportesService } from '../../services/reportes.service';
import { ReportesExcelService } from 'src/app/services/reportes-excel.service';
import { saveAs } from 'file-saver-es'; 

@Component({
  selector: 'app-reportes-productos',
  templateUrl: './reportes-productos.component.html',
  styles: [
  ]
})
export class ReportesProductosComponent implements OnInit {

  // Flag de inicio
  public inicio = true;

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: '_id.producto'
  }

  // Data
  public data = {
    fechaDesde: null,
    fechaHasta: null,
    tipo_filtro: 'Ingresos',
    tipo_egreso: '',
    mayoristaSeleccionado: '',
    productoSeleccionado: '',
    proveedorSeleccionado: ''
  }

  // Totales
  public cantidadTotal = 0;

  // Mayoristas
  public mayoristas: any[] = [];

  // Proveedores
  public proveedores: any[] = [];

  // Productos
  public productos: any[] = [];

  // Busqueda
  public busqueda: any[] = [];

  // Referencia
  public referencia = {
    unidad_medida: '',
    tipo_producto: ''
  }

  // Paginacion
  public paginaActual = 1;
  public cantidadItems= 10;

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private productosService: ProductosService,
              private mayoristasService: MayoristasService,
              private proveedoresService: ProveedoresService,
              private reportesService: ReportesService,
              private reportesExcelService: ReportesExcelService) {}

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Reportes - Productos";
    this.listarProductos();
    this.listarProveedores();
    this.listarMayoristas();
  };

  // Generar reportes
  generarReporte(): void {
    this.alertService.question({msg: "Se esta por generar un reporte", buttonText: 'Generar'})
    .then(({isConfirmed}) => {
      if (isConfirmed){
        this.alertService.loading();
        this.reportesExcelService.productos({busqueda: this.busqueda, tipo_filtro: this.data.tipo_filtro, cantidad: this.cantidadTotal}).subscribe(reporte => {
          saveAs(reporte, `Productos.xlsx`);
          this.alertService.close();
        })
      }
    })
  }

  // Listar productos
  listarProductos(): void {
    this.productosService.listarProductos().subscribe(({productos}) => {
      this.productos = productos;
    },({error})=>{
      this.alertService.errorApi(error);
    });  
  };

  // Listar proveedores
  listarProveedores(): void {
    this.proveedoresService.listarProveedores().subscribe(({proveedores})=> {
      this.proveedores = proveedores;
    },({error}) => {
      this.alertService.errorApi(error);
    });
  };

  // Listar mayoristas
  listarMayoristas(): void {
    this.mayoristasService.listarMayoristas().subscribe(({mayoristas})=> {
      this.mayoristas = mayoristas;
    },({error}) => {
      this.alertService.errorApi(error);
    });
  }
  
  // Listar productos de Ingreso/Egreso
  listarBusqueda(): void{
    this.alertService.loading();
    this.reportesService.productos(this.ordenar.direccion, this.ordenar.columna, this.data).subscribe(({ productos })=>{
      this.inicio = false;
      if(productos.length > 0){
        this.referencia.unidad_medida = productos[0]._id.unidad;
        this.referencia.tipo_producto = productos[0]._id.tipo;
      }
      this.busqueda = productos;
      this.calculos();
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    })   
  }

  // Calculos
  calculos(): void {
    let cantidadTotalTemp = 0;
    this.busqueda.forEach( elemento => {
      console.log(elemento);
      cantidadTotalTemp += elemento.cantidad; 
    });
    this.cantidadTotal = cantidadTotalTemp;
  }

  // Generar reporte
  buscar(): void { 
    if(this.data.productoSeleccionado.trim() === '') return this.alertService.info('Debes de seleccionar un producto');
    this.paginaActual = 1;
    this.listarBusqueda();  
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string): void{
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarBusqueda();
  }

}
