import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { UnidadMedidaService } from 'src/app/services/unidad-medida.service';
import { AlertService } from '../../../services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-editar-unidad',
  templateUrl: './editar-unidad.component.html',
  styles: [
  ]
})
export class EditarUnidadComponent implements OnInit {

  public id = '';

  public formUnidad = this.fb.group({
    descripcion: ['', Validators.required],
    activo: [true, Validators.required]
  });

  constructor(private fb: FormBuilder,
              private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private unidadMedidaService: UnidadMedidaService,
              private router: Router 
            ) { }
          
  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Unidad de medida - Editando'
    this.alertService.loading();
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.id = id;
      this.getUnidad(id);
    });
  }

  // Obtener datos de unidad de medida por ID
  getUnidad(id: string): void {
    this.unidadMedidaService.getUnidad(id).subscribe( ({ unidad }) => { 
      this.formUnidad.setValue({
        descripcion: unidad.descripcion,
        activo: unidad.activo
      });
      this.alertService.close();
    },(({error}) => {
      this.alertService.errorApi(error.msg);
    }))    
  }
  
  // Actualizar unidad de medida
  actualizarUnidad(): void {
    const { descripcion } = this.formUnidad.value;
    if(this.formUnidad.status === 'INVALID' || descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }
    this.alertService.loading();
    this.unidadMedidaService.actualizarUnidad(this.id, this.formUnidad.value).subscribe( () => {
      this.alertService.success('Unidad actualizada correctamente'); 
      this.alertService.close();
      this.router.navigateByUrl('dashboard/unidad_medida');
    },(({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }

}
