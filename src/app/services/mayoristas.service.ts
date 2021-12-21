import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MayoristasService {

  constructor(private http: HttpClient) { }

   // Mayorista por ID
   getMayorista(id: string): Observable<any> {
    return this.http.get(`${base_url}/mayoristas/${id}`, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Listar mayoristas
  listarMayoristas(
    direccion: number = 1,
    columna: string = 'razon_social'
  ): Observable<any>{
    return this.http.get(`${base_url}/mayoristas`,{
      params:{
        direccion: String(direccion),
        columna
      },
      headers:{'x-token': localStorage.getItem('token')}
    });
  }

  // Nuevo mayorista
  nuevoMayorista(data: any): Observable<any> {
    return this.http.post(`${base_url}/mayoristas`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Actualizar mayorista
  actualizarMayorista(id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/mayoristas/${id}`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })  
  }


}
