import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PolloService {

  constructor(private http:HttpClient) { }

  // Producto de pollo por ID
  getPollo(id: string): Observable<any> {
    return this.http.get(`${base_url}/pollo/${id}`, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }
 
  // Listar productos de pollo
  listarPollo(
    direccion: number = 1,
    columna: string = 'descripcion'
  ): Observable<any>{
    return this.http.get(`${base_url}/pollo`,{
      params:{
        direccion: String(direccion),
        columna
      },
      headers:{'x-token': localStorage.getItem('token')}
    });
  }
 
  // Actualizar pollo
  actualizarPollo(data: any): Observable<any> {
    return this.http.put(`${base_url}/pollo`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })  
  }

}
