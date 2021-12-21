import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProduccionInternaService {

  constructor(private http: HttpClient) { }

  // Listar produccion interna
  listarProduccionInterna(
    direccion: number = -1,
    columna: string = 'createdAt',
    activo
  ): Observable<any>{
    return this.http.get(`${base_url}/produccion-interna`,{
      params:{
        activo,
        direccion: String(direccion),
        columna
      },
      headers:{'x-token': localStorage.getItem('token')}
    });
  };

  // Nueva produccion interna
  nuevaProduccionInterna(data: any): Observable<any> {
    return this.http.post(`${base_url}/produccion-interna`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    });
  };

  // Completar producciones internas
  completarProduccionInterna(): Observable<any> {
    return this.http.put(`${base_url}/produccion-interna/completar`,{},{
      headers: {'x-token': localStorage.getItem('token')}
    });  
  };

  // Actualizar produccion interna
  actualizarProduccionInterna(id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/produccion-interna/${id}`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    });  
  };

  // Eliminar produccion interna
  eliminarProduccionInterna(id: string): Observable<any> {
    return this.http.delete(`${base_url}/produccion-interna/${id}`, {
      headers: {'x-token': localStorage.getItem('token')}
    }); 
  };

}
