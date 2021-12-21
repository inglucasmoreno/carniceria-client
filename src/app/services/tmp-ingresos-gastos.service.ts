import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TmpIngresosGastosService {

  constructor(private http: HttpClient) { }
  
  // Nuevo elemento
  nuevoElemento(data: any): Observable<any> {
    return this.http.post(`${base_url}/tmp-ingresos-gastos`, data, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });
  };

  // Listar elementos
  listarElementos(): Observable<any> {
    return this.http.get(`${base_url}/tmp-ingresos-gastos`, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });
  };

  // Eliminar elemento
  eliminarElemento(id: string): Observable<any> {
    return this.http.delete(`${base_url}/tmp-ingresos-gastos/${id}`, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });
  };

  // Limpiar elementos
  limpiarElemento(): Observable<any> {
    return this.http.delete(`${base_url}/tmp-ingresos-gastos/limpiar/all`, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });
  };

}
