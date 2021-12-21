import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  constructor(private http: HttpClient) { }

  // ---- | Saldo inicial | ----

  // Obtener saldo inicial de caja
  getSaldoInicial():Observable<any> {
    return this.http.get(`${base_url}/cajas/saldo_inicial`, {
      headers: { 'x-token': localStorage.getItem('token') }
    });
  };

  // Creacion o actualizacion de saldo inicial de caja
  actualizarSaldoInicial(data: any): Observable<any> {
    return this.http.put(`${base_url}/cajas/saldo_inicial`, data, {
      headers: { 'x-token': localStorage.getItem('token')}
    });
  }

  // ---- | Cajas | ----

  // Obtener caja por ID
  getCaja(id: string): Observable<any> {
    return this.http.get(`${base_url}/cajas/${ id }`, {
      headers: { 'x-token': localStorage.getItem('token')}
    });
  }

  // Listar cajas
  listarCajas(
    direccion: number = -1,
    columna: string = 'createdAt'
  ): Observable<any> {
    return this.http.get(`${base_url}/cajas`, {
      params: {
        direccion: String(direccion),
        columna
      },
      headers: { 'x-token': localStorage.getItem('token')}
    });
  }

  // Creacion de nueva caja
  nuevaCaja(data: any): Observable<any> {
    return this.http.post(`${base_url}/cajas`, data, {
      headers: { 'x-token': localStorage.getItem('token')}
    });
  }

}
