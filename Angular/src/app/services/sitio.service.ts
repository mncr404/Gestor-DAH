import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Globals } from "./globals";

@Injectable()

export class SitioService {
    [x: string]: any;

    public url: string;

    constructor(
        private _http: HttpClient
    ){
        this.url =Globals.url;

    }
    create(sitio: any):Observable<any>{
        let params = JSON.stringify(sitio);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url+'save/',params, {headers:headers});
    }

    crearSitio(sitio: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url+'/crear', sitio, { headers: headers });
  }

  actualizarSitio(id: string, sitio: any): Observable<any> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this._http.put(`${this.url}/actualizar/${id}`, sitio, { headers });
}


    update(id: string, sitio: any):Observable<any>{
        let params = JSON.stringify(sitio);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.put(this.url+'sitio/'+id, params,{headers: headers});
    }

    getSitios(last:any = null):Observable<any>{
        var sitios = 'sitios';
       
        if(last!= null){
          
            sitios = 'sitios/true';
        }
        return this._http.get(this.url+sitios);
    }

    getSitio(sitioId: string):Observable<any>{
        return this._http.get(this.url+'sitio/'+ sitioId);
    }

    
    search(searchString: string):Observable<any>{
        return this._http.get(this.url+'search/'+searchString);
    }

    searchCanton(searchString: string):Observable<any>{
        return this._http.get(this.url+'searchCanton/'+searchString);
    }

    searchDistrito(searchString: string):Observable<any>{
        return this._http.get(this.url+'searchDistrito/'+searchString);
    }

    searchNombre(searchString: string):Observable<any>{
        return this._http.get(this.url+'searchNombre/'+searchString);
    }

    buscarSitios(filtros: any): Observable<any> {
        return this._http.post(`${this.url}buscar`, filtros);
      }
      

}