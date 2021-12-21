import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../models/producto.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http:HttpClient) { }

  // Producto por ID
  getProducto(id: string): Observable<any> {
    return this.http.get(`${base_url}/productos/${id}`, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    })
  }

  // Producto por Codigo
  productoPorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${base_url}/productos/codigo/${codigo}`, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    })
  }

  // Listar productos
  listarProductos(
    direccion: number = 1,
    columna: string = 'descripcion'
  ): Observable<any> {
    return this.http.get(`${base_url}/productos`,{
      params: {
        direccion: String(direccion),
        columna
      },
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });  
  }  

  // Nuevo producto
  nuevoProducto(data: Producto): Observable<any> {
    return this.http.post(`${base_url}/productos`, data, { 
      headers: { 
        'x-token': localStorage.getItem('token')  
      }
    });
  }
  
  // Actualizar producto
  actualizarProducto( id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/productos/${id}`, data, {
      headers: { 
        'x-token': localStorage.getItem('token') 
      }
    });
  }


}
