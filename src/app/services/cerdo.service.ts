import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CerdoService {

  constructor(private http:HttpClient) { }

    // Producto de cerdo por ID
    getCerdo(id: string): Observable<any> {
      return this.http.get(`${base_url}/cerdo/${id}`, {
        headers: {'x-token': localStorage.getItem('token')}
      })
    }
   
    // Listar productos de cerdo
    listarCerdo(
      direccion: number = 1,
      columna: string = 'descripcion'
    ): Observable<any>{
      return this.http.get(`${base_url}/cerdo`,{
        params:{
          direccion: String(direccion),
          columna
        },
        headers:{'x-token': localStorage.getItem('token')}
      });
    }
   
    // Actualizar cerdo
    actualizarCerdo(data: any): Observable<any> {
      return this.http.put(`${base_url}/cerdo`, data, {
        headers: {'x-token': localStorage.getItem('token')}
      })  
    }


}
