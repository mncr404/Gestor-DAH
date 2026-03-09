import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CeramicService } from 'src/app/services/ceramic.service';
import { ContextoService } from 'src/app/services/contexto.service';
import { LiticoService } from 'src/app/services/litico.service';
import { MetalicoService } from 'src/app/services/metalico.service';
import { SitioService } from 'src/app/services/sitio.service';
import { DataService} from 'src/app/services/data.service';
import { Sitio } from '../../models/sitio';
import { AuthService } from 'src/app/services/auth.service';
import { RegistroService } from 'src/app/services/registro.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [CeramicService,ContextoService,LiticoService,MetalicoService,SitioService,AuthService, RegistroService]
})
export class SidebarComponent implements OnInit {
  
  @Output() openFilters = new EventEmitter<void>();
  @Output() openHelp = new EventEmitter<void>();
  public searchString!: string;
  public searchString2!: string;
  public searchString3!: string;
  public searchString4!: string;
  public searchString5!: string;
  public searchStringNomb!: string;
  public administrador: boolean;
  public registrado: boolean;
  public arqueo: boolean;
  public usuario!: any;
  public user!: any;
  public registro!: any;
  public title: string;
  public acceso!: string;
  public searchSitio!: string;
  // public sitios: Sitio[] = [];
  prov:any;
  cant:any;
  dist:any;
  provincias: any;
  cantones: any;
  distritos: any;

  selectedProvincia: any = null;
  selectedCanton: any = null;
  selectedDistrito: any = null;
  sitios: any[] = [];

  @Input() titulo!: string;
  @Input() advancedFilters: { tipoProyecto: string[]; tipoMonumento: string[] } = {
  tipoProyecto: [],
  tipoMonumento: []
};

  constructor(
    private _ceramicService: CeramicService,
    private _contextoService: ContextoService,
    private _liticoService: LiticoService,
    private _metalicoService: MetalicoService,
    private _sitioService: SitioService,
    private _router: Router,
    private _route: ActivatedRoute,
    private dataService: DataService,
    public authService : AuthService,
    public _registroService: RegistroService
  ) {
    this.administrador = false;
    this.registrado = false;
    this.arqueo = false;
    this.usuario = '';
    this.title = '';
    this.user = '';
   }

  ngOnInit(): void {

    this.authService.search(localStorage.getItem('email'))
    .subscribe(
      res => {
        if(res.usuarios){
          //console.log(res.usuarios)
          this.usuario = res.usuarios;
          this.title = JSON.stringify(this.usuario, ['email'])
          //console.log(this.title)
         this.searchPerfil(localStorage.getItem('email'));
        }

        if (this.title == '[{"email":"jbrenes@museocostarica.go.cr"}]' || this.title =='[{"email":"jtapia@museocostarica.go.cr"}]'){
        
          this.registrado = true;
          console.log(this.registrado)
     
        } 
 
       
       else{
        this.administrador = false;
      } 
    

      err => {console.log(err)
       
  }});  
     

      this.dataService.getAll().subscribe((res: any) => {
        this.provincias = res.provincias;
        this.cantones = [];
        this.distritos = [];
    
        // Solo si hay una provincia seleccionada se ejecuta el filtro
        if (this.selectedProvincia) {
          this.onSelect(this.selectedProvincia);
        }
      });

  }

  searchPerfil(searstring: any) {
    this._registroService.search(searstring).subscribe(
      response => {
        if (response.registro) {
          this.user = response.registro;
          console.log("Usuario encontrado en Registro:", this.user);
  
          // Acceso directo a la propiedad "acceso"
          this.arqueo = !!this.user.acceso; // convierte a booleano
          console.log("Acceso ampliado:", this.arqueo);
        }
      },
      err => {
        console.error("Error al buscar en Registro:", err);
      }
    );
  }
  

  goSearch(){
    this._router.navigate(['/buscar', this.searchString]);
  }

  goSearchComb(){
    this._router.navigate(['/buscarcombcera', this.searchString2]);
  }

  goSearchCont(){
    this._router.navigate(['/buscarcontexto', this.searchString]);
  }

  goSearchLit(){
    this._router.navigate(['/buscarlitico', this.searchString]);
  }

  goSearchSit(){
    this._router.navigate(['/buscarsitio', this.searchString]);
  }

  goSearchCombLit(){
    this._router.navigate(['/buscarcomblit', this.searchString3]);
  }

  goSearchMet(){
    this._router.navigate(['/buscarmetalico', this.searchString]);
  }

  goSearchCombMet(){
    this._router.navigate(['/buscarcombmet', this.searchString4]);
  }

  goSearchNombre() {
    const nombre = this.searchStringNomb?.trim();
    if (nombre) {
      this._router.navigate(['/pag-lite-sitios'], {
        queryParams: { nombre }
      });
    }
  }
  

  showAll(){
    this.dataService.getAll().subscribe(
      (data:any)=>{
        this.provincias = data,
        console.log(this.provincias)
      }
    )
  }


  onSelect(event: Event): void {
    const selected = (event.target as HTMLSelectElement).value;
    const provinciaId = this.selectedProvincia?.id;
  
    this.dataService.getAll().subscribe((res: any) => {
      this.cantones = res.cantones.filter((c: any) => c.provincia_id == provinciaId);
      this.selectedCanton = null;
      this.distritos = [];
    });
  }


    onSelectCanton(event: Event): void {
      const cantonId = this.selectedCanton?.id;
    
      this.dataService.getAll().subscribe((res: any) => {
        this.distritos = res.distritos.filter((d: any) => d.canton_id == cantonId);
        this.selectedDistrito = null;
      });
    }

    buscarSitios(): void {
      console.log("Botón de búsqueda presionado");
    
      const provincia = this.selectedProvincia?.title || "";
      const canton = this.selectedCanton?.title || "";
      const distrito = this.selectedDistrito?.title || "";
    
      const tipoProyecto = this.advancedFilters?.tipoProyecto ?? [];
      const tipoMonumento = this.advancedFilters?.tipoMonumento ?? [];

      const payload: any = { provincia, canton, distrito, tipoProyecto, tipoMonumento };
      
    
     this._sitioService.buscarSitios(payload).subscribe(
  (res: any) => {
    // Navegación con queryParams (arrays incluidos)
    this._router.navigate(['/pag-lite-sitios'], {
      queryParams: {
        provincia: provincia || null,
        canton: canton || null,
        distrito: distrito || null,
        tipoProyecto: tipoProyecto.length ? tipoProyecto : null,
        tipoMonumento: tipoMonumento.length ? tipoMonumento : null,
      }
      });
    },
        (error) => {
          console.error("Error en la búsqueda:", error);
          if (error.status === 404) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron sitios con los criterios seleccionados.'
            });
          }else {
            Swal.fire({
              icon: 'error',
              title: 'Error en la búsqueda',
              text: 'Ocurrió un error inesperado al consultar los datos.'
            });
          }
        }
      );
    }

}
