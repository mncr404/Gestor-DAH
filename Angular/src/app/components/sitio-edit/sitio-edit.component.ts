import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SitioService } from 'src/app/services/sitio.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Sitio } from 'src/app/models/sitio';
import { Globals } from 'src/app/services/globals';
import { RestService } from 'src/app/services/rest.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-sitio-edit',
  templateUrl: '../ficha-origenes/ficha-origenes.component.html',
  styleUrls: ['./sitio-edit.component.css'],
  providers: [SitioService, RestService],
})
export class SitioEditComponent implements OnInit {
  periodos = [
    { campo: 'diezmil_ochomil_ac', fase: 'fase_1', etiqueta: '10.000-8.000 a.C' },
    { campo: 'ocho_mil_cuatro_mil_ac', fase: 'fase_10', etiqueta: '8.000-4.000 a.C' },
    { campo: 'cuatro_mil_mil_quinientos_ac', fase: 'fase_7', etiqueta: '4.000-1.500 a.C' },
    { campo: 'mil_quinientos_quinientos_ac', fase: 'fase_3', etiqueta: '1.500-500 a.C' },
    { campo: 'quinientos_trecientos_dc', fase: 'fase_8', etiqueta: '500 a.C - 300 d.C' },
    { campo: 'trescientos_ochocientos_dc', fase: 'fase_6', etiqueta: '300-800 d.C' },
    { campo: 'ochocientos_mil_tres_cincuenta_dc', fase: 'fase_9', etiqueta: '800-1350 d.C' },
    { campo: 'mil_tres_cincuenta_mil_quinientos_dc', fase: 'fase_2', etiqueta: '1350-1550 d.C' },
    { campo: 'mil_quinientos_mil_ochocientos_dc', fase: 'fase_4', etiqueta: '1550-1821 d.C' },
    { campo: 'mil_ochocientos_mil_novecientos_sc', fase: 'fase_5', etiqueta: '1821-1950 d.C' }
  ];
  dropdownList: any[] = [];
  dropdownList2: any[] = [];
  dropdownList3: any[] = [];
  dropdownList4: any[] = [];
  dropdownList5: any[] = [];
  dropdownList6: any[] = [];
  materialesDisponibles: any[] = [];
  patrimonioOpciones: any[] = [];
  estadosConservacion: any[] = [];
  selectedItems: any[] = [];
  selectedItems2: any[] = [];
  selectedItems3: any[] = [];
  selectedItems4: any[] = [];
  selectedItems5: any[] = [];
  selectedItems6: any[] = [];
  dropdownSettings!: IDropdownSettings;
  dropdownSettings2!: IDropdownSettings;
  dropdownSettings3!: IDropdownSettings;
  dropdownSettings4!: IDropdownSettings;
  dropdownSettings5!: IDropdownSettings;
  dropdownSettings6!: IDropdownSettings;

  user: any;
  public sitio: Partial<Sitio> = {};
  public status!: string;
  public url: string;
  public is_edit: boolean;
  latitud_decimal!: number;
  longitud_decimal!: number;
  public page_title!: string;
  private fileTmp: any;

  afuConfig = {
    multiple: true,
    maxSize: 5,
    uploadAPI: {
      url: Globals.url + 'upload-image',
    },
   
    replaceTexts: {
      selectFileBtn: 'Seleccione Archivo',
      resetBtn: 'Resetear',
      uploadBtn: 'Subir',
      dragNDropBox: 'Arrastre sus Archivos',
      attachPinBtn: 'Subiendo Archivo...',
      afterUploadMsg_success: 'Archivo Subido !',
      afterUploadMsg_error: 'Fallo en el proceso !',
      sizeLimit: 'Tamaño Máximo',
    },
  };
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _sitioService: SitioService,
    private restService: RestService,
    private storageService: StorageService
  ) {
    this.url = Globals.url;
    this.is_edit = true;

    this.is_edit = true;
    this.page_title = 'Editar Sitio';
    this.url = Globals.url;

    /* this.sitio = new Sitio(
      '',
'',
'',
'',
'',
'',
'',
'',
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
'',
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
'',
'',
false,
false,
false,
false,
false,
false,
false,
'',
'',
'',
'',
'',
'',
'',
'',
'',
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
'',
false,
false,
false,
false,
false,
0,
0,
0,
'',
'',
'',
'',
'',
'',
'',
false,
false,
'',
'',
'',
'',
'',
'',
'',
'',
'',
false,
'',
'',
false,
'',
false,
false,
false,
false,
0,
false,
false,
false,
false,
false,
false,
'',
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
false,
'',
false,
'',
'',
0,
'',
'',
'',
false,
'',
false,
false,
'',
'',
'',
'',
'',
'',
false,
false,
false,
false,
false,
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
false,
false,
false,
false,
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
false,
false,
false,
'',
'',
'',
false,
false,
false,
false,
false,
false,
false,
false,
false,
'',
false,
false,
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
0

      
    ); */
  }



  ngOnInit() {
    this.getArticle();

    this.dropdownList = [
      { item_id: 1, item_text: 'Arcilla Cocida' },
      { item_id: 2, item_text: 'Carbón' },
      { item_id: 3, item_text: 'Cerámica' },
      { item_id: 4, item_text: 'Cobre, Guanina o Pirita' },
      { item_id: 5, item_text: 'Concha' },
      { item_id: 6, item_text: 'Esferas' },
      { item_id: 7, item_text: 'Estatuaria' },
      { item_id: 8, item_text: 'Fauna' },
      { item_id: 9, item_text: 'Flora' },
      { item_id: 10, item_text: 'Hierro' },
      { item_id: 11, item_text: 'Lapidaria' },
      { item_id: 12, item_text: 'Litica' },
      { item_id: 13, item_text: 'Loza' },
      { item_id: 14, item_text: 'Madera o Fibra' },
      { item_id: 15, item_text: 'Oro' },
      { item_id: 16, item_text: 'Piedra Verde' },
      { item_id: 17, item_text: 'Porcelana' },
      { item_id: 18, item_text: 'Resina' },
      { item_id: 19, item_text: 'Restos Humanos' },
      { item_id: 20, item_text: 'Tierra' },
      { item_id: 21, item_text: 'Vidrio' },
    ];

    this.dropdownList2 = [
      { item_id: 1, item_text: 'Arado' },
      { item_id: 2, item_text: 'Biodeterioro' },
      { item_id: 3, item_text: 'Construcción' },
      { item_id: 4, item_text: 'Erosión' },
      { item_id: 5, item_text: 'Huaqueado' },
      { item_id: 6, item_text: 'Mecanizado' },
      { item_id: 7, item_text: 'Meteorización' },
      { item_id: 8, item_text: 'No Perturbado' },
      { item_id: 9, item_text: 'Pastoreo' },
      { item_id: 10, item_text: 'Sembrado' },
    ];

    this.dropdownList3 = [
      { item_id: 1, item_text: 'Paisajes Culturales Sumergidos' },
      {
        item_id: 2,
        item_text: 'Restos de Barcos y otros su cargamento u otro contenido',
      },
      {
        item_id: 3,
        item_text: 'Ruinas de asentamientos humanos y su contexto',
      },
      { item_id: 4, item_text: 'Sitios Explotación Marina' },
      { item_id: 5, item_text: 'Vestigios en Cavernas Sumergidas' },
    ];

    this.dropdownList4 = [
      { item_id: 1, item_text: 'Fot. Papel' },
      { item_id: 2, item_text: 'Fot. Digital' },
      { item_id: 3, item_text: 'Diapositivas' },
      { item_id: 4, item_text: 'Negativos' },
      { item_id: 5, item_text: 'Croquis' },
      { item_id: 6, item_text: 'Planos' },
    ];

    this.dropdownList5 = [
      { item_id: 1, item_text: 'Impacto Ambiental' },
      { item_id: 2, item_text: 'Movimimiento Tierras' },
      { item_id: 3, item_text: 'Evaluación' },
      { item_id: 4, item_text: 'Peritaje' },
      { item_id: 5, item_text: 'Excavación Aislada' },
      { item_id: 6, item_text: 'Rescate' },
      { item_id: 7, item_text: 'Inspección' },
      { item_id: 8, item_text: 'Trabajo Graduación' },
      { item_id: 9, item_text: 'Inv. Regional' },
      { item_id: 10, item_text: 'Inv. Sub Regional' }
    ];

    this.dropdownList6 = [
      { item_id: 1, item_text: 'Abrigo,Cueva,Caverna' },
      { item_id: 2, item_text: 'Arquitectónico' },
      { item_id: 3, item_text: 'Basurero' },
      { item_id: 4, item_text: 'Camino' },
      { item_id: 5, item_text: 'Conchero' },
      { item_id: 6, item_text: 'Funerario' },
      { item_id: 7, item_text: 'Habitación' },
      { item_id: 8, item_text: 'Materiales Dispersos' },
      { item_id: 9, item_text: 'Petroglifo' },
      { item_id: 10, item_text: 'Salina' },
      { item_id: 11, item_text: 'Taller' },
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 12,
      allowSearchFilter: true,
    };

    this.dropdownSettings3 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 12,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item: any) {
    this.sitio.materiales_recuperados =
      this.sitio.materiales_recuperados + JSON.stringify(item.item_text) + ' ';
  }
  onItemSelect2(item: any) {
    this.sitio.estado_conservacion =
      this.sitio.estado_conservacion + JSON.stringify(item.item_text) + ' ';
    console.log(this.sitio.estado_conservacion);
  }
  onItemSelect3(item: any) {
    this.sitio.patrimonio_acuatico =
      this.sitio.patrimonio_acuatico + JSON.stringify(item.item_text) + ' ';
    console.log(this.sitio.patrimonio_acuatico);
  }
  onItemSelect4(item: any) {
    this.sitio.doc_descripcion_material =
      this.sitio.doc_descripcion_material +
      JSON.stringify(item.item_text) +
      ' ';
    console.log(this.sitio.doc_descripcion_material);
  }
  onItemSelect5(item: any) {
    this.sitio.tipo_proyecto =
      this.sitio.tipo_proyecto +
      JSON.stringify(item.item_text) +
      ' ';
  }
  onItemSelect6(item: any) {
    this.sitio.tipo_monumento =
      this.sitio.tipo_monumento +
      JSON.stringify(item.item_text) +
      ' ';
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  OnSubmit() {
    this._sitioService.update(this.sitio._id!, this.sitio).subscribe(
      response => {
        if (response.status == 'success') {
          // this.status = 'success';
          this.sitio = response.sitioUpdated;
         
          Swal.fire('Sitio Editado', 'Cambios Aplicados!', 'success');

          this._router.navigate(['/pag-ori']);
        } else {
          this.status = 'error';
        }
      },
      (error) => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

  imageUpload(data: any) {
    console.log(data);
    this.sitio.image = data.body.image;
  }

  getArticle() {
    this._route.params.subscribe((params) => {
      let id = params['id'];
      
      this._sitioService.getSitio(id).subscribe(
        (response) => {
          if (response.sitio) {
            this.sitio = response.sitio;
          } else {
            this._router.navigate(['/home']);
          }
        },
        (error) => {
          console.log(error);
          this._router.navigate(['/home']);
        }
      );
    });
  }

  cambiarcoordenadas() {
    let a = Number(this.sitio.grad_lat);
    let b = Number(this.sitio.min_lat);
    let c = Number(this.sitio.seg_lat);
    let min = b / 60;
    let seg = c / 3600;
    let latitud_decimal = (a + min + seg).toFixed(4);
    this.sitio.latitude = Number(latitud_decimal);
  }

  cambiarcoordenadaslong() {
    let a = Number(this.sitio.grad_long);
    let b = Number(this.sitio.min_long);
    let c = Number(this.sitio.seg_log);
    let min = b / 60;
    let seg = c / 3600;
    let longitud_decimal = (a + min + seg).toFixed(4);
    this.sitio.Logitude = Number(longitud_decimal);
  }

  imagenes: any[] = [];
  cargarImagen(event:any){
    let archivos = event.target.files;
    let nombre = this.sitio.nombre_sitio;
  
    for (let i = 0; i < archivos.length; i++) {

      let reader = new FileReader();
      reader.readAsDataURL(archivos[i]);
      reader.onloadend = () => {
        console.log(reader.result);
        this.imagenes.push(reader.result);
        this.storageService.subirImagen(nombre + "_" + Date.now(), reader.result).then(urlImagen => {
          console.log(urlImagen);
          this.sitio.links = this.sitio.links + "\\" + urlImagen;
        });
      }
    }
  
  }

  volverInicio() {
  this._router.navigate(['/home']); // Reemplaza '/home' por tu ruta real
}

guardarSitio() {
    this._sitioService.crearSitio(this.sitio).subscribe(
      response => {
        if (response.status === 'success') {
          this.status = 'success';
          this.sitio = {}; // Reiniciar formulario si se desea

          Swal.fire('Sitio Guardado', 'El sitio fue creado correctamente.', 'success');
        } else {
          this.status = 'error';
          Swal.fire('Error', 'No se pudo guardar el sitio.', 'error');
        }
      },
      error => {
        console.error(error);
        this.status = 'error';
        Swal.fire('Error', 'Error en el servidor.', 'error');
      }
    );
  }

  actualizarSitio() {
  if (!this.sitio._id) {
    Swal.fire('Error', 'El ID del sitio no está disponible.', 'error');
    return;
  }

  this._sitioService.actualizarSitio(this.sitio._id, this.sitio).subscribe(
    response => {
      if (response.status === 'success') {
        this.status = 'success';
        Swal.fire('Sitio Actualizado', 'Cambios guardados correctamente.', 'success');
      } else {
        this.status = 'error';
        Swal.fire('Error', 'No se pudo actualizar el sitio.', 'error');
      }
    },
    error => {
      console.error(error);
      this.status = 'error';
      Swal.fire('Error', 'Error en el servidor.', 'error');
    }
  );
}

convertToDMS(decimal: number, isLat: boolean): string {
  if (decimal === null || decimal === undefined) return '';

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

guardarCambios() {
  console.log(this.sitio); // Podés quitarlo si ya no lo necesitás

  this._sitioService.create(this.sitio).subscribe(
    (response) => {
      if (response.status == 'success') {
        this.status = 'success';
        this.sitio = response.sitio;

        Swal.fire('Monumento Guardado', 'Los cambios se han guardado correctamente.', 'success');

       // this._router.navigate(['/pag-ori']);
      } else {
        this.status = 'error';
        Swal.fire('Error', 'Hubo un problema al guardar el monumento.', 'error');
      }
    },
    (error) => {
      console.error(error);
      this.status = 'error';
      Swal.fire('Error de conexión', 'No se pudo conectar con el servidor.', 'error');
    }
  );
}

}
