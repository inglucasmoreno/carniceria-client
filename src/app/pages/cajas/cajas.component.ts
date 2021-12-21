import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { VentasService } from 'src/app/services/ventas.service';
import { AlertService } from '../../services/alert.service';
import { CajasService } from '../../services/cajas.service';
import { TmpIngresosGastosService } from '../../services/tmp-ingresos-gastos.service';


@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styles: [
  ]
})
export class CajasComponent implements OnInit {

  public showModal = false;
  public showFormaPago = false;

  // Ingresos y Gastos
  public ingresos: any[] = [];
  public gastos: any[] = [];
  public totalOtrosGastos = 0;
  public totalOtrosIngresos = 0;
  
  public elementoActual: any = {
    monto: '',
    descripcion: '',
    tipo: 'Gasto'
  }

  // Ventas
  public ventas: any[] = [];
  public personalizadas: any[] = [];

  // Control de billetes
  public billetes: any = {
    cantidad_monedas: 0,
    cantidad_5: 0,
    cantidad_10: 0,
    cantidad_20: 0,
    cantidad_50: 0,
    cantidad_100: 0,
    cantidad_200: 0,
    cantidad_500: 0,
    cantidad_1000: 0,
    total_monedas: 0,
    total_5: 0,
    total_10: 0,
    total_20: 0,
    total_50: 0,
    total_100: 0,
    total_200: 0,
    total_500: 0,
    total_1000: 0,
    total_billetes: 0,
    diferencia: 0
  }

  public data: any = {
    
    // Saldo inicial
    saldo_inicial: 0,
    
    // Total global
    total_ventas: 0,

    // Otros
    total_descuento: 0,
    total_adicional_credito: 0,
    
    // Por tipo de producto
    total_balanza: 0,
    total_mercaderia: 0,

    // Por forma de pago
    total_efectivo: 0,
    total_postnet: 0,
    total_credito: 0,
    total_debito: 0,
    total_mercadopago: 0,
    total_cuenta_corriente: 0,
    total_anulacion_balanza: 0,

    // Tesoreria
    tesoreria: null,

    // Monto total
    efectivo_en_caja: 0,
    
  }

  constructor(private dataService: DataService,
              public authService: AuthService,
              private alertService: AlertService,
              private ventasService: VentasService,
              private tmpIngresosGastosService: TmpIngresosGastosService,
              private cajasService: CajasService) { }

  ngOnInit(): void {
    this.localBilletes();
    this.listarIngresoGastos();
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Gestión de cajas';
    this.obtenerSaldoInicial();
  }
  
  // ----------------------
  // SALDO INICIAL
  // ----------------------

  // Se obtiene saldo inicial
  obtenerSaldoInicial(): void {
  this.cajasService.getSaldoInicial().subscribe( ({ monto }) => {
      monto === null ? this.data.saldo_inicial = 0 : this.data.saldo_inicial = monto;
      this.listarVentas(); 
    },({ error }) => {
      this.alertService.errorApi(error.msg);
    });
  };

  // Actualizar saldo inicial
  actualizarSaldoInicial(): void {
    
    if(this.data.saldo_inicial === null){
      this.alertService.info('Monto inicial inválido');
      return;
    }

    this.alertService.question({ msg: '¿Quieres fijar un nuevo saldo inicial?', buttonText: 'Fijar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        this.cajasService.actualizarSaldoInicial({ monto: this.data.saldo_inicial }).subscribe( () => {
          this.alertService.success('Saldo inicial actualizado correctamente');
        },({error})=>{
          this.alertService.errorApi(error.msg);
        })    
      }
    });
  }

  // ----------------------
  // ACCIONES DE CAJA
  // ----------------------

  // Listar ventas
  listarVentas(): void {
    this.ventasService.listarVentas().subscribe( ({ ventas, personalizadas }) => {
      this.ventas = ventas;
      this.personalizadas = personalizadas;
      this.calculos();
      this.alertService.close();
    }, ({ error }) => {
      this.alertService.errorApi(error.msg);
    });
  }

  // Crear nueva caja
  nuevaCaja(): void {
    
    const billetesValidos = this.billetes.cantidad_monedas !== null &&
                            this.billetes.cantidad_5 !== null &&
                            this.billetes.cantidad_10 !== null &&
                            this.billetes.cantidad_20 !== null &&
                            this.billetes.cantidad_50 !== null &&
                            this.billetes.cantidad_100 !== null &&
                            this.billetes.cantidad_200 !== null &&
                            this.billetes.cantidad_500 !== null &&
                            this.billetes.cantidad_1000 !== null

    if(!billetesValidos) {
      this.alertService.info('Debe colocar un valor para cada billete');
      return;
    }
              
    this.alertService.question({ msg: '¿Quieres realizar el cierre de caja?', buttonText: 'Aceptar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        const data = {
          billetes: this.billetes,
          ingresos: this.ingresos,
          gastos: this.gastos,
          saldo_inicial: this.data.saldo_inicial,
          total_balanza: this.data.total_balanza,
          total_anulacion_balanza: this.data.total_anulacion_balanza,
          total_mercaderia: this.data.total_mercaderia,
          total_descuentos: this.data.total_descuento,
          total_adicional_credito: this.data.total_adicional_credito,
          total_efectivo: this.data.efectivo_en_caja,
          total_efectivo_real: this.billetes.total_billetes,
          total_credito: this.data.total_credito,
          total_debito: this.data.total_debito,
          total_mercadopago: this.data.total_mercadopago,
          total_cuenta_corriente: this.data.total_cuenta_corriente,
          diferencia: this.billetes.diferencia,
          total_postnet: this.data.total_postnet,
          total_ventas: this.data.total_ventas,
          otros_gastos: this.totalOtrosGastos,
          tesoreria: this.data.tesoreria !== null ? this.data.tesoreria : 0,
          saldo_proxima_caja: Number((this.billetes.total_billetes - this.data.tesoreria).toFixed(2)),
          otros_ingresos: this.totalOtrosIngresos
        };
        this.cajasService.nuevaCaja(data).subscribe(() => {
          this.reiniciarCaja();
          this.listarVentas();
          this.limpiarIngresosGastos();
          this.obtenerSaldoInicial();
          this.alertService.success('Cierre de caja correcto');
        },({error})=>{
          this.alertService.errorApi(error);
        })      
      }
    });  
  }

  // Reiniciar cierre de caja
  reiniciarCaja(): void {
  this.data.tesoreria = null;
  this.totalOtrosGastos = 0;
  this.totalOtrosIngresos = 0;
  this.billetes = {
    cantidad_monedas: 0,
    cantidad_5: 0,
    cantidad_10: 0,
    cantidad_20: 0,
    cantidad_50: 0,
    cantidad_100: 0,
    cantidad_200: 0,
    cantidad_500: 0,
    cantidad_1000: 0,
    total_monedas: 0,
    total_5: 0,
    total_10: 0,
    total_20: 0,
    total_50: 0,
    total_100: 0,
    total_200: 0,
    total_500: 0,
    total_1000: 0,
    total_billetes: 0,
    diferencia: 0
  }
  
  localStorage.setItem('billetes', this.billetes);
  
  this.ingresos = [];
  this.gastos = [];
  }

  // Modal: Ingresos y Gastos
  modalNuevoElemento(): void {
    this.elementoActual = {
      descripcion: '',
      monto: '',
      tipo: this.elementoActual.tipo
    } 
    this.showModal = true;
  }

  // Calculo del total de "Otros gastos" y "Otros ingresos"
  calculoGastosIngresos(): void {

    let totalGastosTmp = 0;
    let totalIngresosTmp = 0;
    
    this.ingresos.forEach( ({ monto }) => {
      totalIngresosTmp += monto; 
    });

    this.gastos.forEach( ({ monto }) => {
      totalGastosTmp += monto;
    });

    this.totalOtrosGastos = totalGastosTmp;
    this.totalOtrosIngresos = totalIngresosTmp;
  
    this.calculo_monto_total()

  }

  // Limpiar Ingresos y Gastos
  limpiarIngresosGastos(): void {
    this.alertService.loading();
    this.tmpIngresosGastosService.limpiarElemento().subscribe(()=>{
      this.listarIngresoGastos();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Eliminar Ingreso/Gasto
  eliminarIngresoGasto(elemento: any): void {
    this.alertService.question({ msg: '¿Quieres eliminar este elemento?', buttonText: 'Eliminar' })
          .then(({isConfirmed}) => {
            if (isConfirmed) {
              this.alertService.loading();
              this.tmpIngresosGastosService.eliminarElemento(elemento._id).subscribe( () => {
                this.listarIngresoGastos();
              },({error})=>{
                this.alertService.errorApi(error);
              });  
            }
          });
  }

  // Listar gastos e ingresos
  listarIngresoGastos(): void {
    this.tmpIngresosGastosService.listarElementos().subscribe( ({ingresos, gastos}) => {
      this.ingresos = ingresos;
      this.gastos = gastos;
      this.calculoGastosIngresos();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Nuevo Ingreso/Gasto
  nuevoIngresoGasto(): void {
    
    if(this.elementoActual.descripcion.trim() === '' || this.elementoActual.monto === null || this.elementoActual.monto === '' || this.elementoActual.monto === 0){
      this.alertService.info('Formulario inválido');
      return;
    }

    const data = {
      descripcion: this.elementoActual.descripcion.trim(),
      tipo: this.elementoActual.tipo,
      monto: this.elementoActual.monto
    }
    
    this.alertService.loading();
    this.tmpIngresosGastosService.nuevoElemento(data).subscribe( () => {
      this.listarIngresoGastos();
    },({error})=>{
      this.alertService.errorApi(error);
    });

    this.calculoGastosIngresos();
    
    this.showModal = false;

    this.elementoActual = {
      descripcion: '',
      monto: '',
      tipo: this.elementoActual.tipo
    }
    
  }

  // Calculo de montos
  calculos(): void {
    
    this.billetes;

    // Montos temporales
    let total_ventas_tmp = 0;
    let total_mercaderia_tmp = 0;
    let total_balanza_tmp = 0;
    let total_efectivo_tmp = 0;
    let total_postnet_tmp = 0;
    let total_descuentos_tmp = 0;
    let total_adicional_credito_tmp = 0;

    let total_credito_tmp = 0;
    let total_debito_tmp = 0;
    let total_mercadopago_tmp = 0;
    let total_cuenta_corriente_tmp = 0;
    let total_anulacion_balanza_tmp = 0;

    let personalizadas: any[] = [];

    // Ventas comunes
    this.ventas.forEach( venta => {
      
      total_mercaderia_tmp += venta.total_mercaderia;
      
      if(venta.forma_pago !== 'Anulacion balanza'){
        total_ventas_tmp += venta.precio_total;
        total_balanza_tmp += venta.total_balanza;
      }else{
        total_anulacion_balanza_tmp += venta.total_balanza;
      }
      
      // Efectivo o Postnet
      if(venta.forma_pago === 'Efectivo'){
        total_efectivo_tmp += venta.precio_total;
      }else if(venta.forma_pago === 'Debito' || venta.forma_pago === 'Credito' || venta.forma_pago === 'MercadoPago' || venta.forma_pago === 'Cuenta corriente'){
        total_postnet_tmp += venta.precio_total - venta.total_descuento;
        if(venta.forma_pago === 'Debito') total_debito_tmp += venta.precio_total;
        else if(venta.forma_pago === 'Credito') total_credito_tmp += venta.precio_total;
        else if(venta.forma_pago === 'MercadoPago') total_mercadopago_tmp += venta.precio_total;
        else if(venta.forma_pago === 'Cuenta corriente') total_cuenta_corriente_tmp += venta.precio_total;
      };

      // Personalizado
      if(venta.forma_pago === 'Personalizada'){
        personalizadas.push(...venta.forma_pago_personalizada);
      }

      total_descuentos_tmp += venta.total_descuento;
      total_adicional_credito_tmp += venta.total_adicional_credito;
      
    });
    
    // Impacto de las ventas con forma de pago personalizadas
    personalizadas.forEach(elemento => {
      if(elemento.tipo === 'Efectivo') {
        total_efectivo_tmp += elemento.monto;
      }else{
        total_postnet_tmp += elemento.monto;
        if(elemento.tipo === 'Debito') total_debito_tmp += elemento.monto;
        else if(elemento.tipo === 'Credito') total_credito_tmp += elemento.monto;
        else if(elemento.tipo === 'MercadoPago') total_mercadopago_tmp += elemento.monto;    
      } 
    });
  
    // Montos finales
    this.data.total_ventas = total_ventas_tmp;
    this.data.total_mercaderia = total_mercaderia_tmp;
    this.data.total_balanza = total_balanza_tmp;
    this.data.total_efectivo = total_efectivo_tmp;
    this.data.total_postnet = total_postnet_tmp + total_adicional_credito_tmp;
    this.data.total_adicional_credito = total_adicional_credito_tmp;
    this.data.total_descuento = total_descuentos_tmp;
    this.data.total_credito = total_credito_tmp + total_adicional_credito_tmp;
    this.data.total_debito = total_debito_tmp;
    this.data.total_mercadopago = total_mercadopago_tmp;
    this.data.total_cuenta_corriente = total_cuenta_corriente_tmp;
    this.data.total_anulacion_balanza = total_anulacion_balanza_tmp;

    this.calculo_monto_total();
    
  }

  // Ingresos - Gastos
  calculo_monto_total() {
    this.data.efectivo_en_caja = (this.data.total_ventas - this.data.total_descuento) +
                                 this.data.total_adicional_credito +
                                 this.data.saldo_inicial - 
                                 this.totalOtrosGastos +
                                 this.totalOtrosIngresos - 
                                 this.data.total_postnet;
    this.calculo_billetes();
  }

  // LocalStorage: Billetes
  localBilletes(): void {
    const tempBilletes = localStorage.getItem('billetes');
    if(tempBilletes) this.billetes = JSON.parse(localStorage.getItem('billetes'));
  }

  // Calculo de billetes
  calculo_billetes() {
    this.billetes.total_monedas = this.billetes.cantidad_monedas;
    this.billetes.total_5 = this.billetes.cantidad_5 * 5;
    this.billetes.total_10 = this.billetes.cantidad_10 * 10;
    this.billetes.total_20 = this.billetes.cantidad_20 * 20;
    this.billetes.total_50 = this.billetes.cantidad_50 * 50;
    this.billetes.total_100 = this.billetes.cantidad_100 * 100;
    this.billetes.total_200 = this.billetes.cantidad_200 * 200;
    this.billetes.total_500 = this.billetes.cantidad_500 * 500;
    this.billetes.total_1000 = this.billetes.cantidad_1000 * 1000;
    this.billetes.total_billetes = this.billetes.total_monedas +
                                   this.billetes.total_5 + 
                                   this.billetes.total_10 + 
                                   this.billetes.total_20 + 
                                   this.billetes.total_50 + 
                                   this.billetes.total_100 + 
                                   this.billetes.total_200 + 
                                   this.billetes.total_500 + 
                                   this.billetes.total_1000;
    this.billetes.diferencia = this.billetes.total_billetes - this.data.efectivo_en_caja;
    localStorage.setItem('billetes', JSON.stringify(this.billetes)); // Se guarda en el LocalStorage
    this.alertService.close();
  }
  
}
