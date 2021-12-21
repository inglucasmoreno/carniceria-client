import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private http: HttpClient) { }

  // Proveedor por ID
  getProveedor(id: string): Observable<any> {
    return this.http.get(`${base_url}/proveedores/${id}`, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Listar proveedores
  listarProveedores(
    direccion: number = 1,
    columna: string = 'razon_social'
  ): Observable<any>{
    return this.http.get(`${base_url}/proveedores`,{
      params:{
        direccion: String(direccion),
        columna
      },
      headers:{'x-token': localStorage.getItem('token')}
    });
  }

  // Nuevo proveedor
  nuevoProveedor(data: any): Observable<any> {
    return this.http.post(`${base_url}/proveedores`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Actualizar proveedor
  actualizarProveedor(id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/proveedores/${id}`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })  
  }

}
