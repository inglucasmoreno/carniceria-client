import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ProductosService } from 'src/app/services/productos.service';
import { UnidadMedidaService } from 'src/app/services/unidad-medida.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styles: [
  ]
})
export class NuevoProductoComponent implements OnInit {

  public stockMinimo = false;
  public unidades = [];
  public digitos = 30;
  public digitosBalanza = 7;
  public tipo = 'Normal';
  public precio_venta = 0;

  public productoForm = this.fb.group({
    codigo: ['', Validators.required],
    descripcion: ['', Validators.required],
    unidad_medida: ['', Validators.required],
    cantidad: [0, Validators.required],
    stock_minimo: [false, Validators.required],
    cantidad_minima: [0, Validators.required],
    porcentaje_ganancia : [40, Validators.required],
    precio_costo: [0, Validators.required],
    carne: ['false', Validators.required],
    activo: [true, Validators.required]
  });
  
  constructor(private fb: FormBuilder,
              private dataService: DataService,
              private alertService: AlertService,
              private unidadMedidaService: UnidadMedidaService,
              private productosService: ProductosService
    ) { }
   
  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Productos - Creando';
    this.obtenerUnidades();
  }
  
  // Actualizar precio de venta
  actualizarPrecioVenta(): void {  
    let precio_venta_tmp = 0;   
    if(this.tipo === 'Balanza'){ 
      this.productoForm.value.precio_costo === null ? precio_venta_tmp = 0 : precio_venta_tmp = this.productoForm.value.precio_costo; 
    }else{
      this.productoForm.value.precio_costo === null ? precio_venta_tmp = 0 : precio_venta_tmp = this.productoForm.value.precio_costo * (this.productoForm.value.porcentaje_ganancia/100 + 1);
    }
    this.precio_venta = Number(precio_venta_tmp.toFixed(2));
  }

  // Cambio de tipo de productos
  cambioTipo(tipo): void {
    this.digitos = tipo === 'Balanza' ? this.digitosBalanza : 30;
    this.tipo = tipo;
    this.reiniciarFormulario();
  }

  // Se crea el nuevo producto
  crearProducto(): void {
  
    const {codigo, descripcion, cantidad, stock_minimo, cantidad_minima, unidad_medida, porcentaje_ganancia, precio_costo} = this.productoForm.value;   
    
    const cantidadMinimaValida = stock_minimo && Number(cantidad_minima) < 0;

    if(cantidadMinimaValida){
      this.alertService.formularioInvalido();
      return;         
    }

    const formularioValido = this.productoForm.valid && 
                             codigo.trim() !== '' && 
                             descripcion.trim() !== '' &&
                             unidad_medida.trim() !== '' && 
                             Number(cantidad) >= 0 &&
                             (Number(precio_costo) >= 0) 

    if(formularioValido){
      
      this.alertService.loading();
      
      // Se arma la data para la creacion del producto
      const data = this.productoForm.value;
      data.precio = this.precio_venta; 
      data.tipo = this.tipo;

      if(!this.stockMinimo) data['cantidad_minima'] = 0;
      
      this.tipo === 'Normal' ? data.carne = 'false': data.carne;

      this.productosService.nuevoProducto(data).subscribe( () => {
        this.alertService.success('Producto creado correctamente');
        this.dataService.detectarStockMinimo();
        this.reiniciarFormulario();  
        this.alertService.success('Producto creado correctamente');
      },({error}) => {
        this.alertService.errorApi(error.msg);
      }); 
    }else{
      this.alertService.formularioInvalido();
    }
  }
  
  // Obtener unidades de medida
  obtenerUnidades(): void {
    this.unidadMedidaService.listarUnidades().subscribe( ({ unidades }) => {
      this.unidades= unidades;      
      if(unidades) this.reiniciarFormulario();
      this.alertService.close();
    },({error}) => {
      this.alertService.errorApi(error.msg);
    }); 
  }
  
  // Se reinician los valores del formulario
  reiniciarFormulario() {
    this.stockMinimo = false;
    this.precio_venta = 0;
    this.productoForm.setValue({
      codigo: '',
      descripcion: '',
      unidad_medida: '',
      cantidad: 0,
      stock_minimo: false,
      cantidad_minima: 0,
      porcentaje_ganancia: 40,
      precio_costo: 0,
      carne: 'false',
      activo: true
    })  
  }

}
