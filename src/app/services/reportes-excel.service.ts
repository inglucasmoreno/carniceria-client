import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ReportesExcelService {

  constructor(private http: HttpClient) { }

    // Ventas
    ventas(data: any): Observable<any> {
      return this.http.post(`${base_url}/reportes-excel/ventas`, data ,{
        responseType: 'blob',
        headers: {'x-token': localStorage.getItem('token')}
      });
    }

    // Productos
    productos(data: any): Observable<any> {
      return this.http.post(`${base_url}/reportes-excel/productos`, data ,{
        responseType: 'blob',
        headers: {'x-token': localStorage.getItem('token')}
      });
    }
}