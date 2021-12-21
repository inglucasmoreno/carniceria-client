import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';
import { AlertService } from '../../services/alert.service';
import { VentasService } from '../../services/ventas.service';
import { AuthService } from '../../services/auth.service';
import { MayoristasService } from '../../services/mayoristas.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CuentaCorrienteService } from '../../services/cuenta-corriente.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styles: [
  ]
})
export class VentasComponent implements OnInit {

  constructor( public dataService: DataService,
               public authService: AuthService,
               private cuentaCorrienteService: CuentaCorrienteService,
               private usuariosService: UsuariosService,
               private mayoristasService: MayoristasService,
               private productosService: ProductosService,
               private alertService: AlertService,
               private ventasService: VentasService) { }

  // Modal
  public showModal = false;

  // Usuarios
  public usuarios: any = [];
  public usuarioSeleccionado: any = '';
  public usuarioDescripcion: string = '';

  // Forma de pago
  public idFormaPago = 0;
  public nuevaForma: any = { tipo: 'Efectivo', monto: null };
  public multiplesFormasPago: any[] = [];

  public totalPersonalizado = 0;

  // Venta
  public codigo: string = '';
  public vuelto = 0;
  public pago = null;
  public precioTotal = 0;
  public totalBalanza = 0;
  public totalMercaderia = 0;
  public totalDescuentos = 0;
  public totalAdicionalPorCredito = 0;
  
  // Productos
  public productos: any[] = [];
  public productoActual: Producto;
  public productoVenta = { 
    descripcion: '',
    producto: '', 
    precio_unitario: 0, 
    precio_total: 0, 
    unidad_medida: '',
    promocion: false,
    cantidad: 0,
    tipo: '',
    carne: false
  };

  // Mayoristas
  public ventaMayorista = "false";
  public mayoristaSeleccionado = "";
  public mayoristas: any[] = [];

  // Descuentos y Beneficios + Forma de pago 
  public descuento_porcentual = 1;
  public forma_pago = 'Efectivo';
  
  ngOnInit(): void {
    document.getElementById('codigo').focus();
    this.recuperarData();
    this.dataService.ubicacionActual = 'Dashboard - Ventas';
    this.listarMayoristas();
  }

  // Listando usuarios
  listarUsuarios(): void {
    this.alertService.loading();
    this.usuariosService.listarUsuarios().subscribe( ({ usuarios }) => {
      this.alertService.close();
      this.usuarios = usuarios.filter( usuario => usuario.activo );
    }, ({ error }) => {
      this.alertService.errorApi( error );
    });
  }

  // Seleccionando usuario
  seleccionandoUsuario(idUsuario: string): void{

    if(idUsuario === ''){
      this.usuarioDescripcion = '';
      return;
    }
    
    this.alertService.loading();
    this.usuariosService.getUsuario(idUsuario).subscribe( usuario => {
      this.usuarioDescripcion = usuario.apellido + ' ' + usuario.nombre;
      this.alertService.close();
    },({error}) => {
      this.alertService.errorApi(error);
    });
  
  }
  
  // Abrir modal
  abrirModal(): void {
    this.pago = null;
    this.vuelto = 0;
    this.showModal = true;
    this.mayoristaSeleccionado = "";
    this.ventaMayorista = 'false';  
  }

  // Se busca el producto a partir del codigo
  buscarProducto(): void {

    if(this.codigo.trim() === '') {
      document.getElementById('codigo').focus();
      return this.alertService.info('Formulario inválido')
    };

    this.productosService.productoPorCodigo(this.codigo).subscribe( ({ producto }) => {

      // Producto activo?
      if(!producto.activo){
        this.codigo = '';
        return this.alertService.info('El producto esta desactivado');
      } 
      
      this.productoActual = producto;
      this.productoVenta.descripcion = producto.descripcion;
      this.productoVenta.unidad_medida = producto.unidad_medida.descripcion;
      this.productoVenta.producto = producto._id;
      this.productoVenta.carne = producto.carne;
      this.productoVenta.promocion = producto.promocion;
      producto.promocion === true ? this.productoVenta.precio_unitario = producto.precio_promocion : this.productoVenta.precio_unitario = producto.precio;
      this.productoVenta.tipo = producto.tipo;
      if(producto.tipo === 'Balanza') {
        this.productoVenta.cantidad = Number(this.codigo.slice(7,this.codigo.length - 1)) / 1000;
        producto.promocion === true ? this.productoVenta.precio_total = (producto.precio_promocion * this.productoVenta.cantidad) : this.productoVenta.precio_total = (producto.precio * this.productoVenta.cantidad);
        // this.productoVenta.precio_total = this.productoVenta.cantidad * producto.precio;
      }
      else {
        this.productoVenta.cantidad = 1;
        producto.promocion === true ? this.productoVenta.precio_total = producto.precio_promocion : this.productoVenta.precio_total = producto.precio;
        // this.productoVenta.precio_total = producto.precio;
      }
      this.agregarProducto();
      this.codigo = '';
      document.getElementById('codigo').focus();
    },({error})=>{
      this.alertService.errorApi(error.msg);
      this.codigo = '';
      document.getElementById('codigo').focus();
    })
  }

  // Almacenar informacion - LocalStorage
  almacenarData(): void {
    // Almacenamiento en LocalStorage
    localStorage.setItem('productoActual', JSON.stringify(this.productoActual));
    localStorage.setItem('productoVenta', JSON.stringify(this.productoVenta));
    localStorage.setItem('productos', JSON.stringify(this.productos));
    localStorage.setItem('precioTotal', JSON.stringify(this.precioTotal));
    localStorage.setItem('totalBalanza', JSON.stringify(this.totalBalanza));
    localStorage.setItem('totalMercaderia', JSON.stringify(this.totalMercaderia));
  }

  // Recuperacion de informacion - LocalStorage
  recuperarData(): void {
    this.productoActual = localStorage.getItem('productoActual') ? JSON.parse(localStorage.getItem('productoActual')) : {};
    this.productoVenta = localStorage.getItem('productoVenta') ? JSON.parse(localStorage.getItem('productoVenta')) : {};
    this.productos = localStorage.getItem('productos') ? JSON.parse(localStorage.getItem('productos')) : [];
    this.precioTotal = localStorage.getItem('precioTotal') ? JSON.parse(localStorage.getItem('precioTotal')) : 0;
    this.totalBalanza = localStorage.getItem('totalBalanza') ? JSON.parse(localStorage.getItem('totalBalanza')) : 0;
    this.totalMercaderia = localStorage.getItem('totalMercaderia') ? JSON.parse(localStorage.getItem('totalMercaderia')) : 0;
  }

  // Agregar producto
  agregarProducto(): void {

    let repetido = false;

    // Se verifica si el producto esta agregado
    this.productos.find(elemento => {
      if(elemento.producto === this.productoVenta.producto){
        elemento.cantidad += this.productoVenta.cantidad;
        elemento.precio_total = elemento.cantidad * elemento.precio_unitario;
        repetido = true;
        return;
      }
    });
    
    // Si el producto no esta repetido se agrega
    if(!repetido){
      this.productos.push({
        descripcion: this.productoVenta.descripcion,
        unidad_medida: this.productoVenta.unidad_medida,
        producto: this.productoVenta.producto, 
        precio_unitario: this.productoVenta.precio_unitario, 
        precio_total: this.productoVenta.precio_total, 
        promocion: this.productoVenta.promocion, 
        cantidad: this.productoVenta.cantidad,
        tipo: this.productoVenta.tipo,
        carne: this.productoVenta.carne
      });
    }
  
    this.calculoPrecioTotal();

  }

  // Eliminar producto
  eliminarProducto(producto: any): void {
    this.alertService.question({msg:'¿Quieres eliminar el producto?', buttonText: 'Eliminar'})
                     .then((result)=>{
                        if(result.isConfirmed){
                          this.productos = this.productos.filter(elemento => elemento.producto !== producto.producto);  
                          this.calculoPrecioTotal();
                        }
                        document.getElementById('codigo').focus();
                     });  
  }
  
  // Calcular precio total
  calculoPrecioTotal(): void {

    let precioTempTotal = 0;
    let balanzaTempTotal = 0;
    let mercaderiaTempTotal = 0;
    this.totalAdicionalPorCredito = 0;
    this.totalDescuentos = 0;

    // Se listan los usuarios si se selecciona cuenta corriente
    if(this.forma_pago === 'Cuenta corriente'){
      this.listarUsuarios();
    }     
    
    // Precio total sin descuentos ni beneficios
    this.productos.forEach(elemento => {
      precioTempTotal += elemento.precio_total;
      elemento.tipo === 'Normal' ? mercaderiaTempTotal += elemento.precio_total : balanzaTempTotal += elemento.precio_total;
    });
    
    // Se aplica beneficio del 10% por Tarjeta de credito
    if(this.forma_pago === 'Credito'){
      // precioTempTotal = precioTempTotal * 1.10;
      this.totalAdicionalPorCredito = precioTempTotal * 0.10;
    }
    
    // Se aplica descuento porcentual
    if(this.descuento_porcentual != 1 && this.forma_pago !== 'Cuenta corriente' && this.forma_pago !== 'Anulacion balanza'){
      // const descuento = 1 - this.descuento_porcentual
      // precioTempTotal = precioTempTotal * descuento;
      this.totalDescuentos = (precioTempTotal + this.totalAdicionalPorCredito) * this.descuento_porcentual; 
    }

    this.precioTotal = precioTempTotal;
    this.totalBalanza = balanzaTempTotal;
    this.totalMercaderia = mercaderiaTempTotal;

    // Almacenamiento en LocalStorage
    this.almacenarData();
    this.calcularVuelto();

  }

  // Litar mayoristas
  listarMayoristas(): void {
    this.mayoristasService.listarMayoristas().subscribe( ({ mayoristas }) => {
      this.mayoristas = mayoristas.filter(mayorista => mayorista.activo == true);
    });  
  }

  // Completar venta
  completarVenta(): void {

    // Verificaciones de forma de pago personalizada
    if(this.forma_pago === 'Personalizada'){
      const totalPagar = this.precioTotal + this.totalAdicionalPorCredito - this.totalDescuentos;
      const verificacion = this.dataService.redondear(totalPagar, 2) - this.dataService.redondear(this.totalPersonalizado, 2);
      if(verificacion !== 0) return this.alertService.info('Error en la forma de pago personalizada');
    }

    // Verificacion de pago por cuenta corriente
    if(this.forma_pago === 'Cuenta corriente' && this.usuarioSeleccionado === ''){
      this.alertService.info('Debe seleccionar un usuario');
      return;
    }

    // Verificacion - Anulacion balanza
    if(this.forma_pago === 'Anulacion balanza'){
      let productoIncorrecto = this.productos.find( producto => (producto.tipo === 'Normal'));
      if(productoIncorrecto) return this.alertService.info('Todos los productos deben ser de balanza');
    }

    // Completando - Venta
    this.alertService.question({msg:'¿Quieres completar la venta?', buttonText: 'Completar'})
                      .then((result)=>{
                        if(result.isConfirmed){
                        
                        // Verificacion - Venta mayorista
                        const verificacionMayorista = this.ventaMayorista == 'true' && 
                                                      this.mayoristaSeleccionado == "" &&
                                                      this.forma_pago !== 'Cuenta corriente'
                        
                        if(verificacionMayorista) return this.alertService.info('Debe seleccionar un mayorista');
                        
                        this.alertService.loading();
                        
                        const data = { 
                          forma_pago: this.forma_pago,
                          usuario_cuenta_corriente: this.forma_pago === 'Cuenta corriente' ? this.usuarioDescripcion : '',
                          forma_pago_personalizada: this.forma_pago === 'Personalizada' ? this.multiplesFormasPago : [],
                          total_balanza: this.dataService.redondear(this.totalBalanza, 2),
                          total_mercaderia: this.dataService.redondear(this.totalMercaderia, 2),
                          total_adicional_credito: this.dataService.redondear(this.totalAdicionalPorCredito, 2),
                          total_descuento: this.dataService.redondear(this.totalDescuentos, 2),
                          descuento_porcentual: this.descuento_porcentual,
                          venta_mayorista: this.ventaMayorista === 'true' ? true : false,
                          mayorista: this.ventaMayorista !== '' ? this.mayoristaSeleccionado : null,
                          precio_total: this.dataService.redondear(this.precioTotal, 2),
                          productos: this.productos 
                        };
                        
                        // Completando - Venta
                        this.ventasService.nuevaVenta(data).subscribe( (resp) => {   
                          this.dataService.detectarStockMinimo();
                          if(this.forma_pago === 'Cuenta corriente'){ // Se ingresa a cuenta corriente si es necesario
                            this.ingresoCuentaCorriente();
                          }else{
                            this.reiniciarVenta();
                            this.alertService.success('Venta completada');
                            this.showModal = false;
                            this.pago = null;
                            document.getElementById('codigo').focus();      
                          }                 
                        },({error}) => {
                          this.alertService.errorApi(error.msg);
                          this.showModal = false;
                          this.pago = null;
                          document.getElementById('codigo').focus();      
                        });
                      }
                      document.getElementById('codigo').focus();
                    });  
  }
  
  // Ingresar a cuenta corriente
  ingresoCuentaCorriente(): void {
    const dataCuentaCorriente = { 
      usuario: this.usuarioSeleccionado, 
      total: this.precioTotal,
      productos: this.productos
    }
    this.cuentaCorrienteService.nuevaCuentaCorriente(dataCuentaCorriente).subscribe( () => {
      this.dataService.calcularTotalCuentaCorriente();
      this.reiniciarVenta();
      this.alertService.success('Ingreso a cuenta corriente completado');
      this.showModal = false;
      this.pago = null;
      document.getElementById('codigo').focus(); 
    },({error}) => {
      this.alertService.errorApi(error);
    })
  }

  // Agregar forma de pago - Forma de pago personalizada
  agregarFormaPago(): void {
    
    const totalPagar = this.precioTotal + this.totalAdicionalPorCredito - this.totalDescuentos;

    // Verificaciones
    
    // 1) - Cantidad invalida
    if(this.nuevaForma.monto <= 0) return this.alertService.info('Cantidad inválida');
    
    // 2) - Se supera el total a pagar
    if(this.nuevaForma.monto + this.totalPersonalizado > this.dataService.redondear(totalPagar, 2)) return this.alertService.info('No puedes superar el total a pagar');

    // 3) - Tipo de pago repetido
    const metodoRepetido = this.multiplesFormasPago.find( elemento => (elemento.tipo === this.nuevaForma.tipo));
    if(metodoRepetido) return this.alertService.info('Este metodo de pago ya esta agregado');

    this.idFormaPago += 1;
    this.multiplesFormasPago.push({ id: this.idFormaPago, tipo: this.nuevaForma.tipo, monto: this.nuevaForma.monto });
    this.nuevaForma.monto = this.dataService.redondear(this.dataService.redondear(totalPagar, 2) -  (this.nuevaForma.monto + this.totalPersonalizado), 2);
    this.nuevaForma.tipo = 'Efectivo';
    this.calcularTotalPersonalizado();
    
  }

  // Eliminar forma de pago - Forma de pago personalizada
  eliminarFormaPago(id: number): void {
    this.alertService.question({msg:'¿Quieres eliminar la forma de pago?', buttonText: 'Eliminar'})
    .then((result)=>{
      if(result.isConfirmed){
        this.multiplesFormasPago = this.multiplesFormasPago.filter(elemento => (elemento.id !== id));
        this.calcularTotalPersonalizado();       
     }
   });  
  }  

  // Calcular total - Forma de pago personalizada
  calcularTotalPersonalizado(): void {
    let tmpTotal = 0;
    this.multiplesFormasPago.forEach( elemento => { tmpTotal += elemento.monto; });
    this.totalPersonalizado = tmpTotal;
    this.calcularVuelto();
  }

  // Reiniciar venta
  reiniciarVentaModal(): void {
    this.alertService.question({msg:'Estas por reiniciar la venta', buttonText: 'Reiniciar'})
                     .then((result)=>{
                       if(result.isConfirmed) this.reiniciarVenta();
                     });
  };

  // Reiniciar venta
  reiniciarVenta(): void {
    this.productoVenta = { 
      descripcion: '',
      producto: '', 
      precio_unitario: 0, 
      precio_total: 0, 
      unidad_medida: '',
      promocion: false,
      cantidad: 0,
      tipo: '',
      carne: false
    };

    this.usuarioSeleccionado = '';
    this.usuarioDescripcion = '';
    this.idFormaPago = 0;
    this.nuevaForma = { tipo: 'Efectivo', monto: null };
    this.totalPersonalizado = 0;
    this.multiplesFormasPago = [];
    this.productos = [];  
    this.precioTotal = 0;
    this.totalBalanza = 0;
    this.totalMercaderia = 0;
    this.totalAdicionalPorCredito = 0;
    this.totalDescuentos = 0;
    this.productoActual = null;
    this.pago = null;
    this.vuelto = 0;
    this.forma_pago = 'Efectivo';
    this.descuento_porcentual = 1;
    this.almacenarData();
    document.getElementById('codigo').focus();
  }

  // Calcular vuelto
  calcularVuelto(): void{
    if(this.forma_pago === 'Personalizada'){
      const montoEfectivo = this.multiplesFormasPago.find(elemento => (elemento.tipo === 'Efectivo'));
      if(montoEfectivo) this.vuelto = this.pago - montoEfectivo.monto;
      else this.vuelto = null;
    }else{
      this.vuelto = this.pago - (this.precioTotal + this.totalAdicionalPorCredito - this.totalDescuentos);
    }
  }

}
