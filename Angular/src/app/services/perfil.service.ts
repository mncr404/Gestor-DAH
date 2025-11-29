import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Globalp } from "./globalp";


@Injectable()

export class PerfilService {
    [x: string]: any;

    public url: string;

    constructor(
        private _http: HttpClient
    ){
        this.url =Globalp.url;

    }
    

    update(id: string, registro: any):Observable<any>{
        let params = JSON.stringify(registro);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.put(this.url+'registro/'+id, params,{headers: headers});
    }

  

    getPerfiles(last:any = null):Observable<any>{
        var perfiles = 'registros';
       
        if(last!= null){
          
           perfiles = 'registros/true';
        }
        return this._http.get(this.url+perfiles);
    }

    getPerfil(perfilId: string):Observable<any>{
        return this._http.get(this.url+'perfil/'+ perfilId);
    }

    
    search(searchString: string):Observable<any>{
        return this._http.get(this.url+'search/'+searchString);
    }


    searchNombre(searchString: string):Observable<any>{
        return this._http.get(this.url+'searchNombre/'+searchString);
    }

}