import { Component, OnInit } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-tarjeta-formulario',
  templateUrl: './tarjeta-formulario.component.html',
  styles: [
  ]
})
export class TarjetaFormularioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    gsap.from(".gsap-intro", { duration: 0.3, y: -20, opacity: 0.2 });
  }

}
