import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { MayoristasService } from 'src/app/services/mayoristas.service';

@Component({
  selector: 'app-nuevo-mayorista',
  templateUrl: './nuevo-mayorista.component.html',
  styles: [
  ]
})
export class NuevoMayoristaComponent implements OnInit {

  public mayoristaForm = this.fb.group({
    razon_social: ['', Validators.required],
    cuit: ['', Validators.required],
    domicilio: '',
    telefono: '',
    condicion_iva: 'IVA Responsable Inscripto',
    activo: true
  });

  constructor(private fb: FormBuilder,
              private dataService: DataService,
              private mayoristaService: MayoristasService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Mayoristas - Creando';
  }
  
  // Nuevo mayorista
  crearMayorista(): void {
    
    const {razon_social, cuit, domicilio, telefono, condicion_iva, activo} = this.mayoristaForm.value;
    
    const formularioValido = razon_social.trim() !== '' &&
                             cuit.trim() !== '' &&
                             this.mayoristaForm.valid
                            
    if(formularioValido){
      let data = { razon_social, cuit, condicion_iva, activo };
      if(domicilio.trim() != '') data['domicilio'] = domicilio;
      if(telefono.trim() != '') data['telefono'] = telefono;
      this.alertService.loading();
      this.mayoristaService.nuevoMayorista(data).subscribe(()=>{
        this.alertService.close();
        this.router.navigateByUrl('/dashboard/mayoristas');
      },({error})=>{
        this.alertService.errorApi(error.msg);
      }); 

    }else{
      this.alertService.formularioInvalido();
    }
  }

}
