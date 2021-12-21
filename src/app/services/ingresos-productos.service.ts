import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class IngresosProductosService {

  constructor(private http: HttpClient) { }
  
  // Producto por ID (id de producto)
  getProducto(id: string): Observable<any> {
    return this.http.get(`${base_url}/ingreso_productos/${id}`, {
      headers: { 'x-token': localStorage.getItem('token') }
    });  
  };

  // Productos por Ingreso
  productosPorIngreso(
    id: string,
    direccion = -1,
    columna = 'createdAt',
    ): Observable<any> {
    return this.http.get(`${base_url}/ingreso_productos/ingreso/${id}`, {
      headers: { 'x-token': localStorage.getItem('token') },
      params: {
        direccion,
        columna
      }
    })
  } 

  // Nuevo producto
  nuevoProducto(data: any): Observable<any> {
    return this.http.post(`${base_url}/ingreso_productos`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    });
  };

  // Nuevo media res
  nuevaMediaRes(data: any): Observable<any> {
    return this.http.post(`${base_url}/ingreso_productos/mediaRes`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    });
  };

  // Nuevo cerdo
  nuevoCerdo(data: any): Observable<any> {
    return this.http.post(`${base_url}/ingreso_productos/cerdo`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    });
  };

  // Nuevo pollo
  nuevoPollo(data: any): Observable<any> {
    return this.http.post(`${base_url}/ingreso_productos/pollo`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    });
  };

  // Actualizar producto
  actualizarProducto(id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/ingreso_productos/${id}`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    });  
  };

  // Eliminar producto
  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${base_url}/ingreso_productos/${id}`, {
      headers: { 'x-token': localStorage.getItem('token') }
    });
  };

}
