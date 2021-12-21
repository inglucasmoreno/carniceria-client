import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MediaResService {

  constructor(private http: HttpClient) { }

    // Producto de media res por ID
    getMediaRes(id: string): Observable<any> {
     return this.http.get(`${base_url}/media-res/${id}`, {
       headers: {'x-token': localStorage.getItem('token')}
     })
   }
  
   // Listar productos de media res
   listarMediaRes(
     direccion: number = 1,
     columna: string = 'descripcion'
   ): Observable<any>{
     return this.http.get(`${base_url}/media-res`,{
       params:{
         direccion: String(direccion),
         columna
       },
       headers:{'x-token': localStorage.getItem('token')}
     });
   }
  
   // Actualizar media res
   actualizarMediaRes(data: any): Observable<any> {
     return this.http.put(`${base_url}/media-res`, data, {
       headers: {'x-token': localStorage.getItem('token')}
     })  
   }

}
