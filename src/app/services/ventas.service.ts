import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http: HttpClient) { }

  // Venta por ID
  getVenta(id: string): Observable<any> {
    return this.http.get(`${base_url}/ventas/${id}`, {
      headers: { 'x-token': localStorage.getItem('token') }
    });
  }

  // Crear nueva venta
  nuevaVenta(data: any): Observable<any> {
    return this.http.post(`${base_url}/ventas`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    });
  }

  // Listar ventas
  listarVentas(
    direccion: number = -1,
    columna: string = 'codigo'  
  ): Observable<any> {
    return this.http.get(`${base_url}/ventas`, {
      params: {
        direccion: String(direccion),
        columna
      },
      headers: { 'x-token': localStorage.getItem('token') }
    });
  }


}
