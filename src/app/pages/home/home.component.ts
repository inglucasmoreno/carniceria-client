import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  public dirManual = environment.url_manual;
  
  constructor(private dataService: DataService) { }


  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Home';
  }

}
