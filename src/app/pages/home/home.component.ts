import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import gsap from 'gsap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {
  
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    gsap.from(".gsap-intro", { duration: 0.2, y: -100, opacity: 0.2 });
    this.dataService.ubicacionActual = 'Dashboard - Home';
  }

}
