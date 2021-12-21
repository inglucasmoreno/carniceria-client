import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CuentaCorrienteService {

  constructor(private http: HttpClient) { }

   // Elemento de cuenta corriente por ID
   getCuentaCorriente(id: string): Observable<any> {
    return this.http.get(`${base_url}/cuenta_corriente/${id}`, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }
  
  // Listar elementos de cuenta corriente
  listarCuentasCorrientes(
    usuario: string,
    direccion: number = -1,
    columna: string = 'createdAt',
    activo: any
  ): Observable<any>{
    return this.http.get(`${base_url}/cuenta_corriente/usuario/${usuario}`,{
      params:{
        direccion: String(direccion),
        columna,
        activo
      },
      headers:{'x-token': localStorage.getItem('token')}
    });
  }
  
  // Nueva cuenta corriente
  nuevaCuentaCorriente(data: any): Observable<any> {
    return this.http.post(`${base_url}/cuenta_corriente`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }
  
  // Actualizar cuenta corriente
  actualizarCuentaCorriente(id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/cuenta_corriente/${id}`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })  
  }

  // Completar todos los ingresos x Usuario
  completarCuentasCorrientes(id: string): Observable<any> {
    return this.http.put(`${base_url}/cuenta_corriente/todos/${id}`, {}, {
      headers: {'x-token': localStorage.getItem('token')}
    })  
  }

}
