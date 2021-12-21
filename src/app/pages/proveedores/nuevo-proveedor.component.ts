import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-nuevo-proveedor',
  templateUrl: './nuevo-proveedor.component.html',
  styles: [
  ]
})
export class NuevoProveedorComponent implements OnInit {

  public proveedorForm = this.fb.group({
    razon_social: ['', Validators.required],
    cuit: ['', Validators.required],
    domicilio: '',
    telefono: '',
    condicion_iva: 'IVA Responsable Inscripto',
    activo: true
  });

  constructor(private fb: FormBuilder,
              private dataService: DataService,
              private proveedorService: ProveedoresService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Proveedores - Creando';
  }
  
  // Nuevo proveedor
  crearProveedor(): void {
    
    const {razon_social, cuit, domicilio, telefono, condicion_iva, activo} = this.proveedorForm.value;
    
    const formularioValido = razon_social.trim() !== '' &&
                             cuit.trim() !== '' &&
                             this.proveedorForm.valid
                            
    if(formularioValido){
      let data = { razon_social, cuit, condicion_iva, activo };
      if(domicilio.trim() != '') data['domicilio'] = domicilio;
      if(telefono.trim() != '') data['telefono'] = telefono;
      this.alertService.loading();
      this.proveedorService.nuevoProveedor(data).subscribe(()=>{
        this.alertService.close();
        this.router.navigateByUrl('/dashboard/proveedores');
      },({error})=>{
        this.alertService.errorApi(error.msg);
      }); 

    }else{
      this.alertService.formularioInvalido();
    }
  }
}
