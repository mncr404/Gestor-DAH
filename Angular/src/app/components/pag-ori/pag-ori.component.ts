import { Component, OnInit } from '@angular/core';
import { SitioService } from 'src/app/services/sitio.service';
import { Sitio } from 'src/app/models/sitio';
import { Globals } from 'src/app/services/globals';
import { ChartType } from 'angular-google-charts';
import { AuthService } from 'src/app/services/auth.service';
import { RegistroService } from 'src/app/services/registro.service';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component'; // ajustá ruta
import { MatDialog } from '@angular/material/dialog';
import { AdvancedFiltersHelpDialogComponent } from '../advanced-filters-help-dialog/advanced-filters-help-dialog.component';
@Component({
  selector: 'app-pag-ori',
  templateUrl: './pag-ori.component.html',
  styleUrls: ['./pag-ori.component.css'],
  providers: [SitioService,AuthService,RegistroService]
})
export class PagOriComponent implements OnInit {

  public sitios: Sitio[] = [];
  public url: string;
  public page_title!: string;
  public administrador!: boolean;
  public registrado!: boolean;
  public arqueo!: boolean;
  public usuario!: any;
  public title!: string;
  public user!: any;
  public acceso!: any;
  
  @ViewChild(SidebarComponent) sidebarComp!: SidebarComponent;
  
datosProvincias = [
  { name: 'San José', value: 591 },
  { name: 'Alajuela', value: 567 },
  { name: 'Cartago', value: 520 },
  { name: 'Heredia', value: 201 },
  { name: 'Guanacaste', value: 1255 },
  { name: 'Puntarenas', value: 1658 },
  { name: 'Limón', value: 306 }
];

view: [number, number] = [700, 400];

colorScheme = {
  domain: ['#1E88E5', '#F4511E', '#00ACC1', '#E53935', '#43A047', '#FB8C00', '#8E24AA']
};

  
  

  constructor(
    private dialog: MatDialog,
    private _SitioService: SitioService,
    public authService : AuthService,
    public _registroService: RegistroService
    
  ) {
    this.url = Globals.url
    this.page_title = 'Sitio';
    this.administrador = false;
    this.registrado = false;
    this.arqueo = false;
    this.usuario = '';
    this.title = '';
   }

  ngOnInit() {

    const dismissed = localStorage.getItem('ori_help_advanced_filters_dismissed');
  if (!dismissed) {
    this.openAdvancedHelp(true);
  }
    this._SitioService.getSitios(true).subscribe(
      response => { 
        if(response.sitio){
          this.sitios = response.sitio;
        }
      },
       error => {
        console.log(error);
      }
    );

    this.authService.search(localStorage.getItem('email'))
    .subscribe(
      res => {
        if(res.usuarios){
          console.log(res.usuarios)
          this.usuario = res.usuarios;
          this.title = JSON.stringify(this.usuario, ['email'])
          this.searchPerfil(localStorage.getItem('email'));
        }

        if (this.title == '[{"email":"jbrenes@museocostarica.go.cr"}]' || this.title =='[{"email":"jtapia@museocostarica.go.cr"}]'){
          this.administrador = true;
          this.registrado = true;
        }
         /* else if (this.title == '[{"email":"jtapia@museocostarica.go.cr"}]'){
        this.administrador = true;
       
       else{
        this.administrador = false;
      } */
    },

      err => {console.log(err)
       
      });  


  }

  openAdvancedHelp(isAuto = false) {
  const ref = this.dialog.open(AdvancedFiltersHelpDialogComponent, {
    width: '520px',
    maxWidth: '92vw',
    disableClose: false,
    data: { isAuto }
  });

  ref.afterClosed().subscribe((result: any) => {
    if (result?.dontShowAgain) {
      localStorage.setItem('ori_help_advanced_filters_dismissed', '1');
    }
  });
}

  searchPerfil(searstring:any){
    this._registroService.search(searstring).subscribe(
      response => {
       if(response.registro){

        this.user = response.registro
        this.acceso = JSON.stringify(this.user, ['acceso'])

           if(this.acceso == '[{"acceso":true}]'){
            this.administrador = true;
          } 
          if(this.acceso == '[{"acceso":false}]'){
            this.registrado = true;
          } 
        
      }},

      err => {
        console.log(err);
      }
    );
  }

  advancedFilters = { tipoProyecto: [], tipoMonumento: [] };

onAdvancedFiltersChange(f: any) { this.advancedFilters = { ...f }; }
onClearAdvancedFilters() { this.advancedFilters = { tipoProyecto: [], tipoMonumento: [] }; }

onApplyAdvancedFilters(drawer: MatSidenav) {
  // 1) cerrar el drawer
  drawer.close();

  // 2) ejecutar búsqueda desde el sidebar
  // (esto navega a /pag-lite-sitios con los queryParams ya armados)
  if (this.sidebarComp?.buscarSitios) {
    this.sidebarComp.buscarSitios();
  }
}


}


