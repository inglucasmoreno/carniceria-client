import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ReportesService } from '../../services/reportes.service';
import { AlertService } from '../../services/alert.service';
import { VentasService } from '../../services/ventas.service';
import { MayoristasService } from 'src/app/services/mayoristas.service';
import { ReportesExcelService } from 'src/app/services/reportes-excel.service';
import { saveAs } from 'file-saver-es'; 


@Component({
  selector: 'app-reportes-ventas',
  templateUrl: './reportes-ventas.component.html',
  styles: [
  ]
})
export class ReportesVentasComponent implements OnInit {

  // Flag inicio
  public inicio = true;

  // Mayoristas
  public mayorista = 'false';

  // Modal
  public showModalVenta = false;
  public showModalGastos = false;
  public showModalIngresos = false;

  // ventas
  public ventas: any[] = [];
  public ventaSeleccionada: any = null;

  // Mayorista
  public mayoristaSeleccionado: any = '';
  public mayoristas: any[] = [];

  // Gastos e Ingresos
  public otrosGastos: any[] = [];
  public otrosIngresos: any[] = [];

  // Paginacion
  public paginaActualVentas = 1;
  public paginaActualGastos = 1;
  public paginaActualIngresos = 1;
  public cantidadItems= 10;

  // Data
  public data = {
    fechaDesde: null,
    fechaHasta: null,
    tipo_venta: 'todas',
    mayoristaSeleccionado: ''
  }

  // Filtrado
  public filtro = {
    parametro: '',
    activo: 'true'
  }

  // Calculos
  public montoTotal = 0;
  public montoTotalBalanza = 0;
  public montoTotalAnulacionBalanza = 0;
  public montoTotalMercaderia = 0;
  public totalDescuentos = 0;
  public totalAdicionalCredito = 0;
  public totalOtrosGastos = 0;
  public totalOtrosIngresos = 0;

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  constructor(private dataService: DataService,
              private reportesService: ReportesService,
              private ventasService: VentasService,
              private mayoristasService: MayoristasService,
              private reportesExcelService: ReportesExcelService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Reportes - Ventas";
    this.listarMayoristas();
  }

  // Generar reporte
  generarReporte(): void {
    this.alertService.question({msg: "Se esta por generar un reporte", buttonText: 'Generar'})
    .then(({isConfirmed}) => {
      if (isConfirmed){
        this.alertService.loading();
        const data = {
          ventas: this.ventas,
          montoTotal: this.montoTotal,
          montoTotalBalanza: this.montoTotalBalanza,
          montoTotalAnulacionBalanza: this.montoTotalAnulacionBalanza,
          montoTotalMercaderia: this.montoTotalMercaderia,
          totalAdicionalCredito: this.totalAdicionalCredito,
          totalDescuentos: this.totalDescuentos,
          totalVentas: this.montoTotal - this.totalDescuentos + this.totalAdicionalCredito,
          totalOtrosIngresos: this.totalOtrosIngresos,
          totalOtrosGastos: this.totalOtrosGastos
        };
        this.reportesExcelService.ventas(data).subscribe(reporte => {
          saveAs(reporte, `Ventas.xlsx`);
          this.alertService.close();
        },({error})=>{
          this.alertService.errorApi(error);
        })
      }
    })
  }

  // Listar mayoristas
  listarMayoristas(): void {
    this.alertService.loading();
    this.mayoristasService.listarMayoristas().subscribe( ({ mayoristas }) => {
      this.mayoristas = mayoristas;
      this.alertService.close();
    });  
  };

  // Listar ventas
  listarVentas(): void {    
    this.alertService.loading();
    this.reportesService.ventas(
      this.ordenar.direccion,
      this.ordenar.columna,
      this.data
    ).subscribe(({ventas, otrosIngresos, otrosGastos}) => {
      this.inicio = false;
      this.ventas = ventas;
      this.otrosGastos = otrosGastos;
      this.otrosIngresos = otrosIngresos;
      this.calculos();
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);  
    });
  };

  // Calculos
  calculos(): void {
    
    // Valores temporales iniciales
    let montoTotalTemp = 0;
    let montoTotalBalanzaTemp = 0;
    let montoTotalAnulacionBalanzaTemp = 0;
    let montoTotalMercaderiaTemp = 0;
    let totalDescuentosTemp = 0;
    let totalAdicionalCreditoTemp = 0;
    let totalOtrosGastosTemp = 0;
    let totalOtrosIngresosTemp = 0;

    // Calculo de ventas
    this.ventas.forEach( venta => {
      if(venta.forma_pago === 'Anulacion balanza'){ // Anulacion de balanza no es una venta
        montoTotalAnulacionBalanzaTemp += venta.precio_total;
      }else{
        montoTotalTemp += venta.precio_total;
        montoTotalBalanzaTemp += venta.total_balanza;
        montoTotalMercaderiaTemp += venta.total_mercaderia;
        totalDescuentosTemp += venta.total_descuento;
        totalAdicionalCreditoTemp += venta.total_adicional_credito;
      }
    });  
    
    // Total - Gastos
    this.otrosGastos.forEach( gasto => {
      totalOtrosGastosTemp += gasto.monto;
    })

    // Total - Ingresos
    this.otrosIngresos.forEach( ingreso => {
      totalOtrosIngresosTemp += ingreso.monto;
    })

    this.montoTotal = montoTotalTemp;
    this.montoTotalBalanza = montoTotalBalanzaTemp;
    this.montoTotalAnulacionBalanza = montoTotalAnulacionBalanzaTemp;
    this.montoTotalMercaderia = montoTotalMercaderiaTemp;
    this.totalDescuentos = totalDescuentosTemp;
    this.totalAdicionalCredito = totalAdicionalCreditoTemp;
    this.totalOtrosGastos = totalOtrosGastosTemp;
    this.totalOtrosIngresos = totalOtrosIngresosTemp;
  }
  
  // Abrir modal venta
  abrirModalVenta(id: string): void {
    this.alertService.loading();
    this.ventasService.getVenta(id).subscribe(({ venta }) => {
      this.ventaSeleccionada = venta;
      this.showModalVenta = true;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    })
  }

  // Abrir modal gastos
  abrirModalGastos(): void {
    this.showModalGastos = true;
    this.showModalIngresos = false;
    this.paginaActualGastos = 1;
  }

  // Abrir modal ingresos
  abrirModalIngresos(): void {
    this.showModalIngresos = true;
    this.showModalGastos = false;
    this.paginaActualIngresos = 1;
  }

  // Buscar
  buscar(): void {
    this.paginaActualVentas = 1;
    this.paginaActualIngresos = 1;
    this.paginaActualGastos = 1;
    this.listarVentas();
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string): void{
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarVentas();
  }

}
