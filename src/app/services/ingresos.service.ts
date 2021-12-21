import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  constructor(private http: HttpClient) { }
  
  // Nuevo ingreso
  nuevoIngreso(data: any): Observable<any> {
    return this.http.post(`${base_url}/ingresos`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    });  
  };

  // Ingreso por ID
  getIngreso(id: string): Observable<any> {
    return this.http.get(`${base_url}/ingresos/${id}`, {
      headers: {'x-token': localStorage.getItem('token')}  
    });
  };

  // Listar ingresos
  listarIngresos(
    direccion = 1,
    columna = 'createdAt',
  ): Observable<any> {
    return this.http.get(`${base_url}/ingresos`,{
      params: { direccion, columna },
      headers: {'x-token': localStorage.getItem('token')}
    });
  };

  // Actualizar ingreso
  actualizarIngreso(id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/ingresos/${id}`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    });
  };
  
}
