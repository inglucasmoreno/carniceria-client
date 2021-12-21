import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Mayoristas } from 'src/app/models/mayoristas.models';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { MayoristasService } from 'src/app/services/mayoristas.service';

@Component({
  selector: 'app-editar-mayorista',
  templateUrl: './editar-mayorista.component.html',
  styles: [
  ]
})
export class EditarMayoristaComponent implements OnInit {

  public mayorista: Mayoristas;

  public mayoristaForm = this.fb.group({
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
              private mayoristasService: MayoristasService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Mayoristas - Editando';
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.getMayorista(id);
    })
  }
  
  // Se traen los datos del mayorista
  getMayorista(id: string): void {
    this.mayoristasService.getMayorista(id).subscribe(({ mayorista })=>{
      this.mayorista = mayorista;
      this.mayoristaForm.setValue({
        razon_social: mayorista.razon_social,
        cuit: mayorista.cuit,
        domicilio: mayorista.domicilio,
        telefono: mayorista.telefono,
        condicion_iva: mayorista.condicion_iva,
        activo: mayorista.activo
      });
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Actualizando mayorista
  actualizarMayorista(): void {

    const {razon_social, cuit} = this.mayoristaForm.value;
    
    const formularioValido = razon_social.trim() !== '' &&
                             cuit.trim() !== '' &&
                             this.mayoristaForm.valid

    if(formularioValido){
      this.alertService.loading();
      this.mayoristasService.actualizarMayorista(this.mayorista._id, this.mayoristaForm.value).subscribe(()=>{
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
