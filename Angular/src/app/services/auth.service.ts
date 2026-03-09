import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   // private URL = 'http://181.193.24.142:3900/apu'; Museo
   // private URL = 'http://31.220.97.126:3900/apu';
   // private URL = 'https://origenes.museocostarica.go.cr:3900/apu';
   //private URL = 'apu';
    //private URL = '/apu';
   private URL = 'http://127.0.0.1:3900/apu';

    _isLoggedIn: boolean = false

  

  
  constructor(private http: HttpClient, private router: Router) { 
   
  }

  signUpUser(user: {}) {
    return this.http.post<any>(this.URL + '/signup', user);
  }

  signInUser(user: any) {
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(this.URL + '/signin', user, {'headers':headers});
  }

  nuevacontra(user: any) {
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(this.URL + '/nuevacontra', user, {'headers':headers});
  }

  updateUser(id: string,user: any) {
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(this.URL + '/update'+id, user, {'headers':headers});
  }

   update(id: string, ceramic: any):Observable<any>{
          let params = JSON.stringify(ceramic);
          let headers = new HttpHeaders().set('Content-Type', 'application/json');
  
          return this.http.put(this.URL+'update/'+id, params,{headers: headers});
      }

  updateAuthStatus(value: boolean) {
    this._isLoggedIn = value
    //this.authSub.next(this._isLoggedIn);
    localStorage.setItem('isLoggedIn', value ? "true" : "false");
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  search(searchString: any){
    return this.http.get<any>(this.URL + '/search/' +searchString);
}

getIngresosEstadisticas() {
  return this.http.get<any[]>(this.URL+'/estadisticas/ingresos');
}

getIngresosPorUsuario() {
  return this.http.get<any[]>(this.URL+'/estadisticas/ingresos-por-usuario');
}

getIngresosPorUsuarioYMES(usuario: string, mes: string) {
  return this.http.post<any>(`${this.URL}/ingresos/usuario-mes`, {
    usuario,
    mes
  });
}

getRetencionYPromedio() {
  return this.http.get<any>(`${this.URL}/estadisticas/retencion-y-promedio`);
}



isAuthenticated(): boolean {
  return !!this.getToken(); // o tu lógica de sesión
}

resetPassword(email: string) {
  return this.http.post(`${this.URL}/admin/reset-password`, { email });
}

}