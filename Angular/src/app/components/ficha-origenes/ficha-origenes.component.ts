import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SitioService } from 'src/app/services/sitio.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Sitio } from 'src/app/models/sitio';
import { Globals } from 'src/app/services/globals';
import { IDropdownSettings,NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { StorageService } from 'src/app/services/storage.service';
// Importaciones para actualizar la pantalla
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-ficha-origenes',
  templateUrl: './ficha-origenes.component.html',
  styleUrls: ['./ficha-origenes.component.css'],
  providers: [SitioService],
})
export class FichaOrigenesComponent implements OnInit {
  dropdownList: any[] = [];
  dropdownList2: any[] = [];
  dropdownList3: any[] = [];
  dropdownList4: any[] = [];
  dropdownList5: any[] = [];
  dropdownList6: any[] = [];
  selectedItems: any[] = [];
  selectedItems2: any[] = [];
  selectedItems3: any[] = [];
  selectedItems4: any[] = [];
  selectedItems5: any[] = [];
  selectedItems6: any[] = [];
  periodos: any[] = [];
  materialesDisponibles: any[] = [];
  estadosConservacion: any[] = [];
  patrimonioOpciones: any[] = [];
  img: any[] = [];
  dropdownSettings!: IDropdownSettings;
  dropdownSettings2!: IDropdownSettings;
  dropdownSettings3!: IDropdownSettings;
  dropdownSettings4!: IDropdownSettings;
  dropdownSettings5!: IDropdownSettings;
  dropdownSettings6!: IDropdownSettings;
  
  

  user: any;
  // public sitio!: Sitio;
  public sitio: Partial<Sitio> = {};
  public status!: string;
  public url: string;
  public is_edit: boolean;
  latitud_decimal!: number;
  longitud_decimal!: number;
  public page_title!: string;

  afuConfig = {
    multiple: false,
    maxSize: 5,
    uploadAPI: {
      url: Globals.url + 'upload-image',
    },

    fileNameIndex: true,
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
    private storageService: StorageService
  ) {
    this.url = Globals.url;
    this.is_edit = true;

    this.page_title = 'Agregar Sitio';

 /*    this.sitio = {
      _id: '',
      date: '',
      image: '',
      numero_caso: '',
      nombre_sitio: '',
      clave_sitio: '',
      cod_ucr: '',
      clave_antigua: '',
      estudio_impacto_ambiental: false,
      monitoreo_mov_tierras: false,
      evaluacion: false,
      peritaje: false,
      excavacion_aislada: false,
      rescate: false,
      inspeccion: false,
      trabajo_graduacion: false,
      regional: false,
      subregional: false,
      tipo_proyecto: '',
      abrigo_cueva_caverna: false,
      arquitectonico: false,
      basurero: false,
      camino: false,
      conchero: false,
      funerario: false,
      habitacion: false,
      materiales_dispersos: false,
      petroglifo: false,
      salina: false,
      taller: false,
      tipo_monumento:'',
      registrador: '',
      consultoria: false,
      fundacion: false,
      ice: false,
      literatura: false,
      mncr: false,
      parques_nacionales: false,
      ucr: false,
      institucion:'',
      hallazgo: '',
      fecha_registro: '',
      provincia: '',
      canton: '',
      distrito: '',
      hoja_cartografica: '',
      region: '',
      zona_vida: '',
      altitud: '',
      territorio_indigena: false,
      lambert_oe: '',
      lambert_ns: '',
      crtm05_e: 0,
      crtm05_n: 0,
      grad_lat: '',
      min_lat: '',
      seg_lat: '',
      grad_long: '',
      min_long: '',
      seg_log: '',
      localizacion_gps: false,
      latitude: 0,
      Logitude: 0,
      longitude: 0,
      patrimonio_acuatico: '',
      excavacion: false,
      arbitratia: false,
      probabilistico: false,
      horizontal: false,
      sondeo: false,
      trinchera: false,
      ceramica: false,
      litica: false,
      tierra: false,
      carbon: false,
      fauna: false,
      flora: false,
      oro: false,
      jade: false,
      cobre: false,
      vidrio: false,
      porcelana: false,
      hierro: false,
      lapidaria: false,
      esferas: false,
      pisos: false,
      tesis: false,
      monografia: false,
      publicacion: false,
      titulo: '',
      artefactos: false,
      croquis: false,
      planos: false,
      dibujos: false,
      video: false,
      trabajo_campo:'',
      recoleccion:'',
      excava:'',
      material_grafico:'',
      coordenadas: '',
      google: '',
      id_google: '',
      coordenadas_google: '',
      num_consecutivo: '',
      reportes: '',
      direccion: '',
      huaqueado: false,
      sembrado: false,
      area_estimada: '',
      mil_dos_ocho_mi_ac: false,
      diezmil_ochomil_ac: false,
      coordenada_convert: '',
      ocho_mil_cuatro_mil_ac: false,
      cuatro_mil_mil_quinientos_ac: false,
      mil_quinientos_quinientos_ac: false,
      quinientos_trecientos_dc: false,
      trescientos_ochocientos_dc: false,
      ochocientos_mil_tres_cincuenta_dc: false,
      mil_tres_cincuenta_mil_quinientos_dc: false,
      mil_quinientos_mil_ochocientos_dc: false,
      mil_ochocientos_mil_novecientos_sc: false,
      periodo:'',
      lev_cartografico: false,
      rec_superficie: false,
      cala_estratatigrafica: false,
      limpieza_perfiles: false,
      limpieza_razgos: false,
      huesos_humanos: false,
      madera_fibra: false,
      arcilla_cocida: false,
      litica_dat: false,
      ceramica_dat: false,
      radiocarbono_dat: false,
      hoja_registro: false,
      material_fotografico: false,
      id_google_comillas: '',
      diarios_campo: false,
      documento_kml: '',
      nombre_sitio_google: '',
      rio_cercano: '',
      levantamiento_cartografico: '',
      fase_9: '',
      arado: false,
      bibliografia: '',
      biodeterioro: false,
      catalogo_sitios_ucr: false,
      causa_penal: '',
      composicion_cronologica: '',
      concha: false,
      construccion: false,
      erosion: false,
      estado_conservacion: '',
      estatuaria: false,
      expediente_setena: '',
      fase_1: '',
      fase_2: '',
      fase_3: '',
      fase_4: '',
      fase_5: '',
      fase_6: '',
      fase_7: '',
      fase_8: '',
      fase_10: '',
      fecha_digitacion: '',
      investigador: '',
      loza: false,
      mecanizado: false,
      meteorizacion: false,
      materiales_recuperados: '',
      no_perturbado: false,
      otra: '',
      otro: '',
      otro_m: '',
      otro_r: '',
      otro_rec_superficie: '',
      otr_tc: '',
      otro_tipo_proyecto: '',
      otro_ts: '',
      otros: '',
      otros_da: '',
      paisajes_culturales_sumergidos: false,
      pastoreo: false,
      registro_numero: '',
      plano_catrasto: '',
      profundidad_depositos: '',
      rec_propiedad: false,
      registro_fotografico: false,
      reserva_arqueologica: false,
      resina: false,
      restos_barcos: false,
      ruinas_asentamientos: false,
      vestigios_cavernas: false,
      fechamiento_adiometrico: '',
      sitios_marina: false,
      informe: false,
      doc_tipo_info: '',
      doc_ubicacion: '',
      doc_autor: '',
      doc_titulo: '',
      doc_numero: '',
      doc_contenido: '',
      doc_observaciones: '',
      doc_web: '',
      doc_fecha_digita: '',
      doc_descripcion_material: '',
      doc_cantidad: 0,
      links: ''
    }; */
  }

  
  ngOnInit() {
    this.periodos = [
  { campo: 'diezmil_ochomil_ac', fase: 'fase_1', etiqueta: '10.000-8.000 a.C' },
  { campo: 'ocho_mil_cuatro_mil_ac', fase: 'fase_10', etiqueta: '8.000-4.000 a.C' },
  { campo: 'cuatro_mil_mil_quinientos_ac', fase: 'fase_7', etiqueta: '4.000-1.500 a.C' },
  { campo: 'mil_quinientos_quinientos_ac', fase: 'fase_3', etiqueta: '1.500-500 a.C' },
  { campo: 'quinientos_trecientos_dc', fase: 'fase_8', etiqueta: '500 a.C - 300 d.C' },
  { campo: 'trescientos_ochocientos_dc', fase: 'fase_6', etiqueta: '300-800 d.C' },
  { campo: 'ochocientos_mil_tres_cincuenta_dc', fase: 'fase_9', etiqueta: '800-1350 d.C' },
  { campo: 'mil_tres_cincuenta_mil_quinientos_dc', fase: 'fase_2', etiqueta: '1350-1550 d.C' },
  { campo: 'mil_quinientos_mil_ochocientos_dc', fase: 'fase_4', etiqueta: '1550-1821 d.C' },
  { campo: 'mil_ochocientos_mil_novecientos_sc', fase: 'fase_5', etiqueta: '1821-1950 d.C' },
];
this.estadosConservacion = ['Bueno', 'Regular', 'Dañado', 'Inaccesible'];
this.patrimonioOpciones = ['Restos de embarcaciones','Sitios Sumergidos','Artefactos dispersos'];
this.materialesDisponibles  = ['Arcilla Cocida', 'Cerámica', 'Concha', 'Esferas', 'Estatuaria', 'Fauna', 'Flora', 'Hierro', 'Lapidaria', 'Litica', 'Loza', 'Madera o Fibra', 'Oro', 'Piedra Verde', 'Porcelana', 'Resina', 'Restos Humanos', 'Tierra', 'Vidrio'];
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
      allowSearchFilter: true
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
   this.sitio.estado_conservacion = JSON.stringify(item.item_text) + ' ';
  }
  onItemSelect3(item: any) {
    this.sitio.patrimonio_acuatico =
      this.sitio.patrimonio_acuatico + JSON.stringify(item.item_text) + ' ';
  }
  onItemSelect4(item: any) {
    this.sitio.doc_descripcion_material =
      this.sitio.doc_descripcion_material +
      JSON.stringify(item.item_text) +
      ' ';
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

  onSelectAll(items: any) {}

  OnSubmit() {
    console.log(this.sitio);
    this._sitioService.create(this.sitio).subscribe(
      (response) => {
        if (response.status == 'success') {
          this.status = 'success';
          this.sitio = response.sitio;

          Swal.fire('Monumento Creado', 'Guardado Correctamente!', 'success');

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
    this.sitio.image = data.body.image;
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
    let longitud_decimal = (-Math.abs(a) + min + seg).toFixed(4);
    
    this.sitio.Logitude = Number(longitud_decimal);
    console.log(this.sitio.Logitude);
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
          
          this.sitio.links = this.sitio.links + ";" + urlImagen;
        });
      }
    }

     
  }

guardarCambios() {
  console.log(this.sitio); // Podés quitarlo si ya no lo necesitás

  this._sitioService.create(this.sitio).subscribe(
    (response) => {
      if (response.status == 'success') {
        this.status = 'success';
        this.sitio = response.sitio;

        Swal.fire('Monumento Guardado', 'Los cambios se han guardado correctamente.', 'success');

        this._router.navigate(['/pag-ori']);
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



volverInicio() {
  this._router.navigate(['/pag-ori']); // Reemplaza '/home' por tu ruta real
}

}
