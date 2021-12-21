import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VentasProductosService {

  constructor(private http: HttpClient) { }

  // Listar productos por venta
  productosPorVenta(
    id: string,
    direccion: number = -1,
    columna: string = 'createdAt'  ): Observable<any> {
    return this.http.get(`${base_url}/ventas_productos/venta/${id}`, {
      params: {
        direccion: String(direccion),
        columna
      },
      headers: { 'x-token': localStorage.getItem('token') }
    });
  }

}
