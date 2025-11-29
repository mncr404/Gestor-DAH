import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = 'https://origenes.museocostarica.go.cr:3900/apio';

export interface ListResp<T> {
  page: number;
  limit: number;
  total: number;
  items: T[];
}

export interface ObjetoDto {
  _id: string;
  nombre_monumento?: string;
  tipo_materia?: string;
  localizacion_general?: string;
  temporalidad_arqueologica?: string;
  estado_de_conservacion?: string;
}

@Injectable({ providedIn: 'root' })
export class ObjetoService {
  constructor(private http: HttpClient) {}

  listar(page = 1, limit = 24, q = '') {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (q) params = params.set('q', q);
    return this.http.get<ListResp<ObjetoDto>>(`${API}/objetos`, { params });
  }

  // ✅ CORRECTAMENTE DENTRO DE LA CLASE
  getPorSitio(clave_norm: string) {
    return this.http.get<ObjetoDto[]>(`${API}/objetos/por-sitio/${clave_norm}`);
  }
}

