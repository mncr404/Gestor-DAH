import { Component, OnInit } from '@angular/core';
import { SitioService } from 'src/app/services/sitio.service';
import { Sitio } from 'src/app/models/sitio';
import { Globals } from 'src/app/services/globals';
import { Router, ActivatedRoute, Params  } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser';
import { MatDividerModule } from '@angular/material/divider';



@Component({
  selector: 'app-sitio-detalle',
  templateUrl: './sitio-detalle.component.html',
  styleUrls: ['./sitio-detalle.component.css'],
  providers: [SitioService,AuthService],
})
export class SitioDetalleComponent implements OnInit {
  public sitio!: Sitio;
  public url: string;
  public page_title!: string;
  public cadena!: string;
  public cadena_result!: string[];
  public separador = ';';
  public separadorUna = '';
  public administrador!: boolean;
  public registrado!: boolean;
  public usuario!: any;
  public title!: string;
  public tama!: number;
  public cadenalinks!: string[];
  public mostrar!: boolean;
  public filtered!: String;
  public filtrosBusqueda: any = {};

  constructor(
    private _sitioService: SitioService,
    private _route: ActivatedRoute,
    private _router: Router,
    public authService : AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.url = Globals.url;
    this.page_title = 'Sitio';
    this.mostrar = false;
  }

  ngOnInit() {
  this.authService.search(localStorage.getItem('email'))
    .subscribe(
      res => {
        if(res.usuarios){
          this.usuario = res.usuarios;
          this.title = JSON.stringify(this.usuario, ['email']);
        }

        if (this.title == '[{"email":"jbrenes@museocostarica.go.cr"}]' || this.title =='[{"email":"jtapia@museocostarica.go.cr"}]'){
          this.administrador = true;
        } else if (this.title == '[{"email":"bm@kraken.com"}]'){
          this.registrado = true;
        } else {
          this.administrador = false;
        }
      },
      err => {
        console.log(err);
      }
    );

  // Cargar filtros desde query params si están disponibles
  this._route.queryParams.subscribe(params => {
    this.filtrosBusqueda = {
      provincia: params['provincia'] || '',
      canton: params['canton'] || '',
      distrito: params['distrito'] || '',
      nombre: params['nombre'] || ''
      
    };

    // Si no vino ningún parámetro por URL, intentar cargar desde localStorage
    const sinParametros = !params['provincia'] && !params['canton'] && !params['distrito'] && !params['nombre'];
    if (sinParametros) {
      const guardados = localStorage.getItem('filtrosBusqueda');
      if (guardados) {
        this.filtrosBusqueda = JSON.parse(guardados);
      }
    }
  });

  // Cargar el sitio a partir del ID de la ruta
  this._route.params.subscribe((params) => {
    let id = params['id'];

    this._sitioService.getSitio(id).subscribe(
      (response) => {
        if (response.sitio) {
          this.sitio = response.sitio;

          this.cadena = this.sitio.links;
          this.tama = this.cadena?.length;

          if(this.tama > 0){
            this.dividirCadena(this.cadena, this.separador);
            this.mostrar = true;
          }

        } else {
          this._router.navigate(['/pag-ori/sitio']);
        }
      },
      (error) => {
        console.log(error);
        this._router.navigate(['/home']);
      }
    );
  });
}

convertToDMS(decimal: number | null | undefined, isLat: boolean): string {
  if (decimal === null || decimal === undefined || isNaN(Number(decimal))) {
    return '';
  }

  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesDecimal = (abs - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = ((minutesDecimal - minutes) * 60).toFixed(2);

  const direction = isLat
    ? (decimal >= 0 ? 'N' : 'S')
    : (decimal >= 0 ? 'E' : 'W');

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}


    
  

  public getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
}
 

resultado!: string[];
datos!: string;

dividirCadena(cadenaADividir: any, separador: any) {
  var arrayDeCadenas = cadenaADividir.split(separador);
  for (var i = 1; i < arrayDeCadenas.length; i++) {
    this.datos = this.datos + '#' + arrayDeCadenas[i];
  }
  this.resultado = this.datos?.split('#');
  
}

volver(): void {
  this._router.navigate(['/pag-lite-sitios'], {
    queryParams: this.filtrosBusqueda
  });
}

parseFecha(fecha: string): Date | null {
  const partes = fecha.split('/');
  if (partes.length !== 3) return null;

  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1; // los meses en JS van de 0 a 11
  const anio = parseInt(partes[2], 10);

  return new Date(anio, mes, dia);
}

periodosConFase = [
  { label: "10000 - 8000 aC", campo: "fase_1", check: "mil_dos_ocho_mi_ac" },
  { label: "8000 - 4000 aC", campo: "fase_2", check: "ocho_mil_cuatro_mil_ac" },
  { label: "4000 - 1500 aC", campo: "fase_3", check: "cuatro_mil_mil_quinientos_ac" },
  { label: "1500 - 500 aC", campo: "fase_4", check: "mil_quinientos_quinientos_ac" },
  { label: "500 - 300 dC", campo: "fase_5", check: "quinientos_trecientos_dc" },
  { label: "300 - 800 dC", campo: "fase_6", check: "trescientos_ochocientos_dc" },
  { label: "800 - 1350 dC", campo: "fase_7", check: "ochocientos_mil_tres_cincuenta_dc" },
  { label: "1350 - 1550 dC", campo: "fase_8", check: "mil_tres_cincuenta_mil_quinientos_dc" },
  { label: "1550 - 1821 dC", campo: "fase_9", check: "mil_quinientos_mil_ochocientos_dc" },
  { label: "1821 - 1950 dC", campo: "fase_10", check: "mil_ochocientos_mil_novecientos_sc" }
];



 
}
  

