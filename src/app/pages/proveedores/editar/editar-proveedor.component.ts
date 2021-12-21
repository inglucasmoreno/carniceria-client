import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Proveedor } from 'src/app/models/proveedor.model';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styles: [
  ]
})
export class EditarProveedorComponent implements OnInit {

  public proveedor: Proveedor;

  public proveedorForm = this.fb.group({
    razon_social: ['', Validators.required],
    cuit: ['', Validators.required],
    domicilio: '',
    telefono: '',
    condicion_iva: '',
    activo: true
  });

  constructor(private activatedRoute: ActivatedRoute,
              private dataService: DataService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private proveedoresService: ProveedoresService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Proveedores - Editando';
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.getProveedor(id);
    })
  }
  
  // Se traen los datos del proveedor
  getProveedor(id: string): void {
    this.proveedoresService.getProveedor(id).subscribe(({proveedor})=>{
      this.proveedor = proveedor;
      this.proveedorForm.setValue({
        razon_social: proveedor.razon_social,
        cuit: proveedor.cuit,
        domicilio: proveedor.domicilio,
        telefono: proveedor.telefono,
        condicion_iva: proveedor.condicion_iva,
        activo: proveedor.activo
      });
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Actualizando proveedor
  actualizarProveedor(): void {

    const {razon_social, cuit} = this.proveedorForm.value;
    
    const formularioValido = razon_social.trim() !== '' &&
                             cuit.trim() !== '' &&
                             this.proveedorForm.valid

    if(formularioValido){
      this.alertService.loading();
      this.proveedoresService.actualizarProveedor(this.proveedor._id, this.proveedorForm.value).subscribe(()=>{
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
