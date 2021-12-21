import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  constructor(private http: HttpClient) {}

  // Nueva unidad de medida
  nuevaUnidad(data: any): Observable<any> {
    return this.http.post(`${base_url}/unidad_medida`, data, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });
  };

  // Unidad de medida por ID
  getUnidad(id: string): Observable<any> {
    return this.http.get(`${base_url}/unidad_medida/${ id }`,{ 
      headers: {
      'x-token': localStorage.getItem('token')
      }
    });
  };

  // Listar unidades de medida
  listarUnidades(
    direccion: number = 1,
    columna: string = 'descripcion'  
  ): Observable<any> {
    return this.http.get(`${base_url}/unidad_medida`, {
      params: {
        direccion: String(direccion),
        columna
      },
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });
  }

  // Actualizar unidad de medida
  actualizarUnidad(id:string, data: any): Observable<any> {
    return this.http.put(`${base_url}/unidad_medida/${id}`, data, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    });
  }  

}
