import { Component, OnInit } from '@angular/core';
import { Sitio } from '../../models/sitio';
import { SitioService } from 'src/app/services/sitio.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { DataService} from 'src/app/services/data.service';
import { ExporterService } from 'src/app/services/exporter';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-mapa-origenes',
  templateUrl: './mapa-origenes.component.html',
  styleUrls: ['./mapa-origenes.component.css'],
  providers : [SitioService]
})
export class MapaOrigenesComponent implements OnInit, AfterViewInit {

  public lat;
  public lng;
  public zoom!: number;
  map!: L.Map;
  markersLayer!: any;
  public mapTypeId!: any;
  public searchString!: any;
  public searchNombre!: any;
  public searchString2!: String;
  public sitios: Sitio[] = [];
  prov:any;
  cant:any;
  dist:any;
  provincias: any;
  cantones: any;
  distritos: any;
  clave: any;
  selectedProvincia: any = {
    id:0, name:''
  };
  selectedCanton: any = {
    id:0, name:''
  };
  selectedDistrito: any = {
    id:0, name:''
  };

  origenes!: any [];

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
  this.map = L.map('map').setView([this.lat || 9.7489, this.lng || -83.7534], this.zoom || 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);

  this.markersLayer = (L as any).markerClusterGroup().addTo(this.map);

  this.map.on('zoomend', () => {
    this.renderMarkers();
  });

  setTimeout(() => {
    this.map.invalidateSize();
  }, 200);
}

  constructor(
    private _sitioService: SitioService,
    private _route: ActivatedRoute,
    private _router: Router,
    private dataService: DataService,
    private excelService: ExporterService,
  ) { 
    this.lat = 9.954144929210663;
    this.lng = -84.04138360587075;
    this.zoom = 8;
    this.mapTypeId = 'hybrid';
    
  }

  onZoomChange(nuevoZoom: number) {
    this.zoom = nuevoZoom;
    console.log("Nivel de Zoom Actual:", this.zoom);
}

getMarkerLabel(nombre: string | null | undefined): any {
  if (!nombre) return ''; // Si es null o undefined, devuelve una cadena vacía
  
  if (this.zoom > 10) {
      return {
          text: nombre,
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
      };
  }
  return ''; // Si el zoom es menor, no se muestra el label
}

  ngOnInit(): void {

    /* navigator.geolocation.getCurrentPosition(position=>{
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.zoom = 7
    }) */
    this.getLocation();

  /*   this.showAll();
    this.onSelect(this.selectedProvincia.id);
    this.onSelectCanton(this.selectedCanton.id); */

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

  volverInicioMapa(): void {
  this._router.navigate(['/pag-ori']);
}

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lng);
        }
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

/*   renderMarkers(): void {
  if (!this.map || !this.markersLayer) return;

  this.markersLayer.clearLayers();

  if (!this.sitios || !this.sitios.length) return;

  this.sitios.forEach((sitio: any) => {
    const lat = Number(sitio.y || sitio.latitud);
    const lng = Number(sitio.x || sitio.longitude || sitio.longitud);

    if (!lat || !lng) return;

    const marker = L.marker([lat, lng]);

    const popupHtml = `
      <div style="min-width:220px;">
        <h3 style="margin:0 0 8px 0;">Nombre: <b>${sitio.nombre_sitio || '-'}</b></h3>
        <p style="margin:0 0 6px 0;">Clave: ${sitio.clave_sitio || '-'}</p>
        <p style="margin:0 0 6px 0;">Área Estimada: ${sitio.area_estimada || '-'} mts</p>
        <a href="/pag-ori/sitio/${sitio._id}">Ficha Completa</a>
        <br><br>
        <a href="http://origenes.museocostarica.go.cr/informes/${sitio.clave_sitio || ''}/" target="_blank">Informes</a>
      </div>
    `;

    marker.bindPopup(popupHtml);
    marker.addTo(this.markersLayer);
  });
} */
renderMarkers(): void {
  if (!this.map || !this.markersLayer) return;

  this.markersLayer.clearLayers();

  if (!this.sitios || !this.sitios.length) return;

  const currentZoom = this.map.getZoom();

  this.sitios.forEach((sitio: any) => {
    const lat = Number(sitio.y || sitio.latitude || sitio.latitud);
    const lng = Number(sitio.x || sitio.Logitude || sitio.longitude || sitio.longitud);

    if (!lat || !lng) return;

    const marker = L.marker([lat, lng]);

    const popupHtml = `
      <div style="min-width:220px;">
        <h3 style="margin:0 0 8px 0;">Nombre: <b>${sitio.nombre_sitio || '-'}</b></h3>
        <p style="margin:0 0 6px 0;">Clave: ${sitio.clave_sitio || '-'}</p>
        <p style="margin:0 0 6px 0;">Área Estimada: ${sitio.area_estimada || '-'} mts</p>
        <a href="/pag-ori/sitio/${sitio._id}" target="_blank">🔎 Ver ficha completa</a>
        <br><br>
        <a href="http://origenes.museocostarica.go.cr/informes/${sitio.clave_sitio || ''}/" target="_blank">📄 Informes</a>
      </div>
    `;

    marker.bindPopup(popupHtml);

    if (sitio.nombre_sitio && currentZoom >= 14) {
      marker.bindTooltip(String(sitio.nombre_sitio), {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
        className: 'site-label'
      });
    }

    this.markersLayer.addLayer(marker);
  });
}

limpiarMapaBusqueda(): void {
  this.sitios = [];
  this.selectedProvincia = null;
  this.selectedCanton = null;
  this.selectedDistrito = null;
  this.searchNombre = '';

  if (this.markersLayer) {
    this.markersLayer.clearLayers();
  }

  if (this.map) {
    this.map.setView([9.7489, -83.7534], 7);
  }
}
   
  showAll(){
    this.dataService.getAll().subscribe(
      (data:any)=>{
        this.provincias = data
        
      }
    )
  }

  exportAsXLSX(): void{
    this.excelService.exportToExcel(this.sitios, 'my_export');
  }

  exportAsXLSXFiltered(): void{
    this.excelService.exportToExcel(this.sitios, 'my_export');
  }


/*   goSearch(provincia_id: any) {

    if(provincia_id == 1){
      this.prov = 'San José'
    }
    else if (provincia_id == 2){
      this.prov = 'Alajuela'
    }
    else if (provincia_id == 3){
      this.prov = 'Cartago'
    }
    else if (provincia_id == 4){
      this.prov = 'Heredia'
    }
    else if (provincia_id == 5){
      this.prov = 'Guanacaste'
    }
    else if (provincia_id == 6){
      this.prov = 'Puntarenas'
    }
    else if (provincia_id == 7){
      this.prov = 'Limón'
    }

    var search = this.prov
    console.log(search)
    this._sitioService.search(search).subscribe(
      response => {
        if (response.sitio) {
          this.sitios = response.sitio;
          console.log(response.sitio);

        } else {
          this.sitios = [];
          
        }
        this.renderMarkers();
      },
      error => {
        console.log(error);
        this.sitios = [];

      }
    );
  } */

  goSearchNombre(){
    var search = this.searchNombre
    console.log(search)
    this._sitioService.searchNombre(search).subscribe(
      response => {
        if (response.sitio) {
          this.sitios = response.sitio;

        } else {
          this.sitios = [];
        }
      },
      error => {
        console.log(error);
        this.sitios = [];

      }
    );
  }



/* goSearchCanton(canton_id : any) {

  if(canton_id == 1){
    this.cant = '^San Jose$'
  }
  else if (canton_id == 2){
    this.cant = '^Escazú$'
  }
  else if (canton_id == 3){
    this.cant = '^Desamparados$'
  }
  else if (canton_id == 4){
    this.cant = '^Puriscal$'
  }
  else if (canton_id == 5){
    this.cant = '^Tarrazu$'
  }
  else if (canton_id == 6){
    this.cant = '^Aserri$'
  }
  else if (canton_id == 7){
    this.cant = '^Mora$'
  }
  else if (canton_id == 8){
    this.cant = '^Goicoechea$'
  }
  else if (canton_id == 9){
    this.cant = '^Santa Ana$'
  }
  else if (canton_id == 10){
    this.cant = '^Alajuelita$'
  }
  else if (canton_id == 11){
    this.cant = '^Vazquez de Coronado$'
  }
  else if (canton_id == 12){
    this.cant = '^Acosta$'
  }
  else if (canton_id == 13){
    this.cant = '^Tibas$'
  }
  else if (canton_id == 14){
    this.cant = '^Moravia$'
  }
  else if (canton_id == 15){
    this.cant = '^Montes de Oca$'
  }
  else if (canton_id == 16){
    this.cant = '^Turrubares$'
  }
  else if (canton_id == 17){
    this.cant = '^Dota$'
  }
  else if (canton_id == 18){
    this.cant = '^Curridabat$'
  }
  else if (canton_id == 19){
    this.cant = '^Perez Zeledon$'
  }
  else if (canton_id == 20){
    this.cant = '^Leon Cortes$'
  }
  else if (canton_id == 21){
    this.cant = '^Alajuela$'
  }
  else if (canton_id == 22){
    this.cant = '^San Ramón$'
  }
  else if (canton_id == 23){
    this.cant = '^Grecia$'
  }
  else if (canton_id == 24){
    this.cant = '^San Mateo$'
  }
  else if (canton_id == 25){
    this.cant = '^Atenas$'
  }
  else if (canton_id == 26){
    this.cant = '^Naranjo$'
  }
  else if (canton_id == 27){
    this.cant = '^Palmares$'
  }
  else if (canton_id == 28){
    this.cant = '^Poas$'
  }
  else if (canton_id == 29){
    this.cant = '^Orotina$'
  }
  else if (canton_id == 30){
    this.cant = '^San Carlos$'
  }
  else if (canton_id == 31){
    this.cant = '^Zarcero$'
  }
  else if (canton_id == 32){
    this.cant = '^Valverde Vega$'
  }
  else if (canton_id == 33){
    this.cant = '^Upala$'
  }
  else if (canton_id == 34){
    this.cant = '^Los Chiles$'
  }
  else if (canton_id == 35){
    this.cant = '^Guatuso$'
  }
  else if (canton_id == 36){
    this.cant = '^Río Cuarto$'
  }
  else if (canton_id == 37){
    this.cant = '^Cartago$'
  }
  else if (canton_id == 38){
    this.cant = '^Paraiso$'
  }
  else if (canton_id == 39){
    this.cant = '^La Union$'
  }
  else if (canton_id == 40){
    this.cant = '^Jimenez$'
  }
  else if (canton_id == 41){
    this.cant = '^Turrialba$'
  }
  else if (canton_id == 42){
    this.cant = '^Alvarado$'
  }
  else if (canton_id == 43){
    this.cant = '^Oreamuno$'
  }
  else if (canton_id == 44){
    this.cant = '^El Guarco$'
  }
  else if (canton_id == 45){
    this.cant = '^Heredia$'
  }
  else if (canton_id == 46){
    this.cant = '^Barva$'
  }
  else if (canton_id == 47){
    this.cant = '^Santo Domingo$'
  }
  else if (canton_id == 48){
    this.cant = '^Santa Barbara$'
  }
  else if (canton_id == 49){
    this.cant = '^San Rafael$'
  }
  else if (canton_id == 50){
    this.cant = '^San Isidro$'
  }
  else if (canton_id == 51){
    this.cant = '^Belen$'
  }
  else if (canton_id == 52){
    this.cant = '^Flores$'
  }
  else if (canton_id == 53){
    this.cant = '^San Pablo$'
  }
  else if (canton_id == 54){
    this.cant = '^Sarapiqui$'
  }
  else if (canton_id == 55){
    this.cant = '^Liberia$'
  }
  else if (canton_id == 56){
    this.cant = '^Nicoya$'
  }
  else if (canton_id == 57){
    this.cant = '^Santa Cruz$'
  }
  else if (canton_id == 58){
    this.cant = '^Bagaces$'
  }
  else if (canton_id == 59){
    this.cant = '^Carrillo$'
  }
  else if (canton_id == 60){
    this.cant = '^Canas$'
  }
  else if (canton_id == 61){
    this.cant = '^Abangares$'
  }
  else if (canton_id == 62){
    this.cant = '^Tilaran$'
  }
  else if (canton_id == 63){
    this.cant = '^Nandayure$'
  }
  else if (canton_id == 64){
    this.cant = '^La Cruz$'
  }
  else if (canton_id == 65){
    this.cant = '^Hojancha$'
  }
  else if (canton_id == 66){
    this.cant = '^Puntarenas$'
  }
  else if (canton_id == 67){
    this.cant = '^Esparza$'
  }
  else if (canton_id == 68){
    this.cant = '^Buenos Aires$'
  }
  else if (canton_id == 69){
    this.cant = '^Montes de Oro$'
  }
  else if (canton_id == 70){
    this.cant = '^Osa$'
  }
  else if (canton_id == 71){
    this.cant = '^Quepos$'
  }
  else if (canton_id == 72){
    this.cant = '^Golfito$'
  }
  else if (canton_id == 73){
    this.cant = '^Coto Brus$'
  }
  else if (canton_id == 74){
    this.cant = '^Parrita$'
  }
  else if (canton_id == 75){
    this.cant = '^Corredores$'
  }
  else if (canton_id == 76){
    this.cant = '^Garabito$'
  }
  else if (canton_id == 77){
    this.cant = '^Limon$'
  }
  else if (canton_id == 78){
    this.cant = '^Pococi$'
  }
  else if (canton_id == 79){
    this.cant = '^Siquirres$'
  }
  else if (canton_id == 80){
    this.cant = '^Talamanca$'
  }
  else if (canton_id == 81){
    this.cant = '^Matina$'
  }
  else if (canton_id == 82){
    this.cant = '^Guácimo$'
  }
  


  var search = this.cant
  console.log(search)
  this._sitioService.searchCanton(search).subscribe(
    response => {
      if (response.sitio) {
        this.sitios = response.sitio;

      } else {
        this.sitios = [];
        this.renderMarkers();
      }
    },
    error => {
      console.log(error);
      this.sitios = [];

    }
  );
} */

/* goSearchDistrito(distrito_id: any) {



  if(distrito_id == 1){
    this.dist = 'San José|San José|Carmen'
  }
  else if (distrito_id == 2){
    this.dist = 'San Jose|San Jose|Merced'
  }
  else if (distrito_id == 3){
    this.dist = 'San Jose|San Jose|Hospital'
  }
  else if (distrito_id == 4){
    this.dist = 'San Jose|San Jose|Catedral'
  }
  else if (distrito_id == 5){
    this.dist = 'San Jose|San Jose|Zapote'
  }
  else if (distrito_id == 6){
    this.dist = 'San Jose|San Jose|San Francisco de Dos Rios'
  }
  else if (distrito_id == 7){
    this.dist = 'San Jose|San Jose|Uruca'
  }
  else if (distrito_id == 8){
    this.dist = 'San Jose|San Jose|Mata Redonda'
  }
  else if (distrito_id == 9){
    this.dist = 'San Jose|San Jose|Pavas'
  }
  else if (distrito_id == 10){
    this.dist = 'San Jose|San Jose|Hatillo'
  }
  else if (distrito_id == 11){
    this.dist = 'San Jose|San Jose|San Sebastian'
  }
  else if (distrito_id == 12){
    this.dist = 'San Jose|Escazu|Escazu'
  }
  else if (distrito_id == 13){
    this.dist = 'San Jose|Escazu|San Antonio'
  }
  else if (distrito_id == 14){
    this.dist = 'San Jose|Escazu|San Rafael'
  }
  else if (distrito_id == 15){
    this.dist = 'San Jose|Desamparados|Desamparados'
  }
  else if (distrito_id == 16){
    this.dist = 'San Jose|Desamparados|San Miguel'
  }
  else if (distrito_id == 17){
    this.dist = 'San Jose|Desamparados|San Juan de Dios'
  }
  else if (distrito_id == 18){
    this.dist = 'San Jose|Desamparados|San Rafael Arriba'
  }
  else if (distrito_id == 19){
    this.dist = 'San Jose|Desamparados|San Antonio'
  }
  else if (distrito_id == 20){
    this.dist = 'San Jose|Desamparados|Frailes'
  }
  else if (distrito_id == 21){
    this.dist = 'San Jose|Desamparados|Patarra'
  }
  else if (distrito_id == 22){
    this.dist = 'San Jose|Desamparados|San Cristobal'
  }
  else if (distrito_id == 23){
    this.dist = 'San Jose|Desamparados|Rosario'
  }
  else if (distrito_id == 24){
    this.dist = 'San Jose|Desamparados|Damas'
  }
  else if (distrito_id == 25){
    this.dist = 'San Jose|Desamparados|San Rafael Abajo'
  }
  else if (distrito_id == 26){
    this.dist = 'San Jose|Desamparados|Gravilias'
  }
  else if (distrito_id == 27){
    this.dist = 'San Jose|Desamparados|Los Guido'
  }
  else if (distrito_id == 28){
    this.dist = 'San Jose|Desamparados|Santiago'
  }
  else if (distrito_id == 29){
    this.dist = 'San Jose|Puriscal|Mercedes Sur'
  }
  else if (distrito_id == 30){
    this.dist = 'San Jose|Puriscal|Barbacoas'
  }
  else if (distrito_id == 31){
    this.dist = 'San Jose|Puriscal|Grifo Alto'
  }
  else if (distrito_id == 32){
    this.dist = 'San Jose|Puriscal|San Rafael'
  }
  else if (distrito_id == 33){
    this.dist = 'San Jose|Puriscal|Candelaria'
  }
  else if (distrito_id == 34){
    this.dist = 'San Jose|Puriscal|Desamparaditos'
  }
  else if (distrito_id == 35){
    this.dist = 'San Jose|Puriscal|San Antonio'
  }
  else if (distrito_id == 36){
    this.dist = 'San Jose|Puriscal|Chires'
  }
  else if (distrito_id == 37){
    this.dist = 'San Jose|Tarrazu|San Marcos'
  }
  else if (distrito_id == 38){
    this.dist = 'San Jose|Tarrazu|San Lorenzo'
  }
  else if (distrito_id == 39){
    this.dist = 'San Jose|Tarrazu|San Carlos'
  }
  else if (distrito_id == 40){
    this.dist = 'San Jose|Aserri|Aserri'
  }
  else if (distrito_id == 41){
    this.dist = 'San Jose|Aserri|Tarbaca'
  }
  else if (distrito_id == 42){
    this.dist = 'San Jose|Aserri|Vuelta de Jorco'
  }
  else if (distrito_id == 43){
    this.dist = 'San Jose|Aserri|San Gabriel'
  }
  else if (distrito_id == 44){
    this.dist = 'San Jose|Aserri|La Legua'
  }
  else if (distrito_id == 45){
    this.dist = 'San Jose|Aserri|Monterrey'
  }
  else if (distrito_id == 46){
    this.dist = 'Aserri|Salitrillos'
  }
  else if (distrito_id == 47){
    this.dist = 'San Jose|Mora|Colon'
  }
  else if (distrito_id == 48){
    this.dist = 'San Jose|Mora|Guayabo'
  }
  else if (distrito_id == 49){
    this.dist = 'San Jose|Mora|Tabarcia'
  }
  else if (distrito_id == 50){
    this.dist = 'San Jose|Mora|Piedras Negras'
  }
  else if (distrito_id == 51){
    this.dist = 'San Jose|Mora|Picagres'
  }
  else if (distrito_id == 52){
    this.dist = 'San Jose|Mora|Caris'
  }
  else if (distrito_id == 53){
    this.dist = 'San Jose|Mora|Quitirrisi'
  }
  else if (distrito_id == 54){
    this.dist = 'San Jose|Goicoechea|Guadalupe'
  }
  else if (distrito_id == 55){
    this.dist = 'San Jose|Goicoechea|San Francisco'
  }
  else if (distrito_id == 56){
    this.dist = 'San Jose|Goicoechea|Calle Blancos'
  }
  else if (distrito_id == 57){
    this.dist = 'San Jose|Goicoechea|Mata de Platano'
  }
  else if (distrito_id == 58){
    this.dist = 'San Jose|Goicoechea|Ipis'
  }
  else if (distrito_id == 59){
    this.dist = 'San Jose|Goicoechea|Rancho Redondo'
  }
  else if (distrito_id == 60){
    this.dist = 'San Jose|Goicoechea|Purral'
  }
  else if (distrito_id == 61){
    this.dist = 'San Jose|Santa Ana|Santa Ana'
  }
  else if (distrito_id == 62){
    this.dist = 'San Jose|Santa Ana|Salitral'
  }
  else if (distrito_id == 63){
    this.dist = 'San Jose|Santa Ana|Pozos'
  }
  else if (distrito_id == 64){
    this.dist = 'San Jose|Santa Ana|Uruca'
  }
  else if (distrito_id == 65){
    this.dist = 'San Jose|Santa Ana|Piedades'
  }
  else if (distrito_id == 66){
    this.dist = 'San Jose|Santa Ana|Brasil'
  }
  else if (distrito_id == 67){
    this.dist = 'San Jose|Alajuelita|Alajuelita'
  }
  else if (distrito_id == 68){
    this.dist = 'San Jose|Alajuelita|San Josecito'
  }
  else if (distrito_id == 69){
    this.dist = 'San Jose|Alajuelita|San Antonio'
  }
  else if (distrito_id == 70){
    this.dist = 'San Jose|Alajuelita|Concepcion'
  }
  else if (distrito_id == 71){
    this.dist = 'San Jose|Alajuelita|San Felipe'
  }
  else if (distrito_id == 72){
    this.dist = 'San Jose|Coronado|San Isidro'
  }
  else if (distrito_id == 73){
    this.dist = 'San Jose|Coronado|San Rafael'
  }
  else if (distrito_id == 74){
    this.dist = 'San Jose|Coronado|Dulce Nombe de Jesus'
  }
  else if (distrito_id == 75){
    this.dist = 'San Jose|Coronado|Patalillo'
  }
  else if (distrito_id == 76){
    this.dist = 'San Jose|Coronado|Cascajal'
  }
  else if (distrito_id == 77){
    this.dist = 'San Jose|Acosta|San Ignacio'
  }
  else if (distrito_id == 78){
    this.dist = 'San Jose|Acosta|Guaitil'
  }
  else if (distrito_id == 79){
    this.dist = 'San Jose|Acosta|Palmichal'
  }
  else if (distrito_id == 80){
    this.dist = 'San Jose|Acosta|Cangrejal'
  }
  else if (distrito_id == 81){
    this.dist = 'San Jose|Acosta|Sabanillas'
  }
  else if (distrito_id == 82){
    this.dist = 'San Jose|Tibas|San Juan'
  }
  else if (distrito_id == 83){
    this.dist = 'San Jose|Tibas|Cinco Esquinas'
  }
  else if (distrito_id == 84){
    this.dist = 'San Jose|Tibas|Anselmo Llorente'
  }
  else if (distrito_id == 85){
    this.dist = 'San Jose|Tibas|Leon XIII'
  }
  else if (distrito_id == 86){
    this.dist = 'San Jose|Tibas|Colima'
  }
  else if (distrito_id == 87){
    this.dist = 'San Jose|Moravia|San Vicente'
  }
  else if (distrito_id == 88){
    this.dist = 'San Jose|Moravia|San Jeronimo'
  }
  else if (distrito_id == 89){
    this.dist = 'San Jose|Moravia|Trinidad'
  }
  else if (distrito_id == 90){
    this.dist = 'San Jose|Montes de Oca|San Pedro'
  }
  else if (distrito_id == 91){
    this.dist = 'San Jose|Montes de Oca|Sabanilla'
  }
  else if (distrito_id == 92){
    this.dist = 'San Jose|Montes de Oca|Mercedes'
  }
  else if (distrito_id == 93){
    this.dist = 'San Jose|Montes de Oca|San Rafael'
  }
  else if (distrito_id == 94){
    this.dist = 'San Jose|Turrubares|San Pablo'
  }
  else if (distrito_id == 95){
    this.dist = 'San Jose|Turrubares|San Pedro'
  }
  else if (distrito_id == 96){
    this.dist = 'San Jose|Turrubares|San Juan de Mata'
  }
  else if (distrito_id == 97){
    this.dist = 'San Jose|Turrubares|San Luis'
  }
  else if (distrito_id == 98){
    this.dist = 'San Jose|Turrubares|Carara'
  }
  else if (distrito_id == 99){
    this.dist = 'San Jose|Dota|Santa Maria'
  }
  else if (distrito_id == 100){
    this.dist = 'San Jose|Dota|Jardin'
  }
  else if (distrito_id == 101){
    this.dist = 'San Jose|Dota|Copey'
  }
  else if (distrito_id == 102){
  this.dist = 'San Jose|Curridabat|Curridabat'
  }
  else if (distrito_id == 103){
    this.dist = 'San Jose|Curridabat|Granadilla'
    }
  else if (distrito_id == 104){
  this.dist = 'San Jose|Curridabat|Sanchez'
  }
  else if (distrito_id == 105){
    this.dist = 'San Jose|Curridabat|Tirrases'
  }
  else if (distrito_id == 106){
    this.dist = 'San Jose|Perez Zeledon|San Isidro del General'
  }
  else if (distrito_id == 107){
    this.dist = 'San Jose|Perez Zeledon|General'
  }
  else if (distrito_id == 108){
    this.dist = 'San Jose|Perez Zeledon|Daniel Flores'
  }
  else if (distrito_id == 109){
    this.dist = 'San Jose|Perez Zeledon|Rivas'
  }
  else if (distrito_id == 110){
    this.dist = 'San Jose|Perez Zeledon|San Pedro'
  }
  else if (distrito_id == 111){
    this.dist = 'San Jose|Perez Zeledon|Platanares'
  }
  else if (distrito_id == 112){
    this.dist = 'San Jose|Perez Zeledon|Pejibaye'
  }
  else if (distrito_id == 113){
    this.dist = 'San Jose|Perez Zeledon|Cajon'
  }
  else if (distrito_id == 114){
    this.dist = 'San Jose|Perez Zeledon|Baru'
  }
  else if (distrito_id == 115){
    this.dist = 'San Jose|Perez Zeledon|Rio Nuevo'
  }
  else if (distrito_id == 116){
    this.dist = 'San Jose|Perez Zeledon|Paramo'
  }
  else if (distrito_id == 117){
    this.dist = 'San Jose|Perez Zeledon|La Amistad'
  }
  else if (distrito_id == 118){
    this.dist = 'San Jose|Leon Cortes|San Pablo'
  }
  else if (distrito_id == 119){
    this.dist = 'San Jose|Leon Cortes|San Andres'
  }
  else if (distrito_id == 120){
    this.dist = 'San Jose|Leon Cortes|Llano Bonito'
  }
  else if (distrito_id == 121){
    this.dist = 'San Jose|Leon Cortes|San Isidro'
  }
  else if (distrito_id == 122){
    this.dist = 'San Jose|Leon Cortes|Santa Cruz'
  }
  else if (distrito_id == 123){
    this.dist = 'San Jose|Leon Cortes|San Antonio'
  }
  else if (distrito_id == 124){
    this.dist = 'Alajuela|Alajuela|Alajuela'
  }
  else if (distrito_id == 125){
    this.dist = 'Alajuela|Alajuela|San Jose'
  }
  else if (distrito_id == 126){
    this.dist = 'Alajuela|Alajuela|Carrizal'
  }
  else if (distrito_id == 127){
    this.dist = 'Alajuela|Alajuela|San Antonio'
  }
  else if (distrito_id == 128){
    this.dist = 'Alajuela|Alajuela|Guacima'
  }
  else if (distrito_id == 129){
    this.dist = 'Alajuela|Alajuela|San Isidro'
  }
  else if (distrito_id == 130){
    this.dist = 'Alajuela|Alajuela|Sabanilla'
  }
  else if (distrito_id == 131){
    this.dist = 'Alajuela|Alajuela|San Rafael'
  }
  else if (distrito_id == 132){
    this.dist = 'Alajuela|Alajuela|Rio Segundo'
  }
  else if (distrito_id == 133){
    this.dist = 'Alajuela|Alajuela|Desamparados'
  }
  else if (distrito_id == 134){
    this.dist = 'Alajuela|Alajuela|Turrucares'
  }
  else if (distrito_id == 135){
    this.dist = 'Alajuela|Alajuela|Tambor'
  }
  else if (distrito_id == 136){
    this.dist = 'Alajuela|Alajuela|La Garita'
  }
  else if (distrito_id == 137){
    this.dist = 'Alajuela|Alajuela|Sarapiqui'
  }
  else if (distrito_id == 138){
    this.dist = 'Alajuela|San Ramon|San Ramon'
  }
  else if (distrito_id == 139){
    this.dist = 'Alajuela|San Ramon|Santiago'
  }
  else if (distrito_id == 140){
    this.dist = 'Alajuela|San Ramon|San Juan'
  }
  else if (distrito_id == 141){
    this.dist = 'Alajuela|San Ramon|Piedades Norte'
  }
  else if (distrito_id == 142){
    this.dist = 'Alajuela|San Ramon|Piedades Sur'
  }
  else if (distrito_id == 143){
    this.dist = 'Alajuela|San Ramon|San Rafael'
  }
  else if (distrito_id == 144){
    this.dist = 'Alajuela|San Ramon|San Isidro'
  }
  else if (distrito_id == 145){
    this.dist = 'Alajuela|San Ramon|Angeles'
  }
  else if (distrito_id == 146){
    this.dist = 'Alajuela|San Ramon|Alfaro'
  }
  else if (distrito_id == 147){
    this.dist = 'Alajuela|San Ramon|Volio'
  }
  else if (distrito_id == 148){
    this.dist = 'Alajuela|San Ramon|Concepcion'
  }
  else if (distrito_id == 149){
    this.dist = 'Alajuela|San Ramon|Zapotal'
  }
  else if (distrito_id == 150){
    this.dist = 'Alajuela|San Ramon|San Isidro de Piedras Blancas'
  }
  else if (distrito_id == 151){
    this.dist = 'Alajuela|San Ramon|San Lorenzo'
  }
  else if (distrito_id == 152){
    this.dist = 'Alajuela|Grecia|Grecia'
  }
  else if (distrito_id == 153){
    this.dist = 'Alajuela|Grecia|San Isidro'
  }
  else if (distrito_id == 154){
    this.dist = 'Alajuela|Grecia|San Jose'
  }
  else if (distrito_id == 155){
    this.dist = 'Alajuela|Grecia|San Roque'
  }
  else if (distrito_id == 156){
    this.dist = 'Alajuela|Grecia|Tacares'
  }
  else if (distrito_id == 157){
    this.dist = 'Alajuela|Grecia|Puente Piedra'
  }
  else if (distrito_id == 158){
    this.dist = 'Alajuela|Grecia|Bolivar'
  }
  else if (distrito_id == 159){
    this.dist = 'Alajuela|San Mateo|San Mateo'
  }
  else if (distrito_id == 160){
    this.dist = 'Alajuela|San Mateo|Desmonte'
  }
  else if (distrito_id == 161){
    this.dist = 'Alajuela|San Mateo|Jesus Maria'
  }
  else if (distrito_id == 162){
    this.dist = 'Alajuela|San Mateo|Labrador'
  }
  else if (distrito_id == 163){
    this.dist = 'Alajuela|Atenas|Atenas'
  }
  else if (distrito_id == 164){
    this.dist = 'Alajuela|Atenas|Jesus'
  }
  else if (distrito_id == 165){
    this.dist = 'Alajuela|Atenas|Mercedes'
  }
  else if (distrito_id == 166){
    this.dist = 'Alajuela|Atenas|San Isidro'
  }
  else if (distrito_id == 167){
    this.dist = 'Alajuela|Atenas|Concepcion'
  }
  else if (distrito_id == 168){
    this.dist = 'Alajuela|Atenas|San Jose'
  }
  else if (distrito_id == 169){
    this.dist = 'Alajuela|Atenas|Santa Eulalia'
  }
  else if (distrito_id == 170){
    this.dist = 'Alajuela|Atenas|Escobal'
  }
  else if (distrito_id == 171){
    this.dist = 'Alajuela|Naranjo|Naranjo'
  }
  else if (distrito_id == 172){
    this.dist = 'Alajuela|Naranjo|San Miguel'
  }
  else if (distrito_id == 173){
    this.dist = 'Alajuela|Naranjo|San Jose'
  }
  else if (distrito_id == 174){
    this.dist = 'Alajuela|Naranjo|Cirri Sur'
  }
  else if (distrito_id == 175){
    this.dist = 'Alajuela|Naranjo|San Jeronimo'
  }
  else if (distrito_id == 176){
    this.dist = 'Alajuela|Naranjo|San Juan'
  }
  else if (distrito_id == 177){
    this.dist = 'Alajuela|Naranjo|Rosario'
  }
  else if (distrito_id == 178){
    this.dist = 'Alajuela|Naranjo|Palmitos'
  }
  else if (distrito_id == 179){
    this.dist = 'Alajuela|Palmares|Palmares'
  }
  else if (distrito_id == 180){
    this.dist = 'Alajuela|Palmares|Zaragoza'
  }
  else if (distrito_id == 181){
    this.dist = 'Alajuela|Palmares|Buenos Aires'
  }
  else if (distrito_id == 182){
    this.dist = 'Alajuela|Palmares|Santiago'
  }
  else if (distrito_id == 183){
    this.dist = 'Alajuela|Palmares|Candelaria'
  }
  else if (distrito_id == 184){
    this.dist = 'Alajuela|Palmares|Esquipulas'
  }
  else if (distrito_id == 185){
    this.dist = 'Alajuela|Palmares|La Granja'
  }
  else if (distrito_id == 186){
    this.dist = 'Alajuela|Poas|San Pedro'
  }
  else if (distrito_id == 187){
    this.dist = 'Alajuela|Poas|San Juan'
  }
  else if (distrito_id == 188){
    this.dist = 'Alajuela|Poas|San Rafael'
  }
  else if (distrito_id == 189){
    this.dist = 'Alajuela|Poas|Carrillos'
  }
  else if (distrito_id == 190){
    this.dist = 'Alajuela|Poas|Sabana Redonda'
  }
  else if (distrito_id == 191){
    this.dist = 'Alajuela|Orotina|Orotina'
  }
  else if (distrito_id == 192){
    this.dist = 'Alajuela|Orotina|Mastate'
  }
  else if (distrito_id == 193){
    this.dist = 'Alajuela|Orotina|Hacienda Vieja'
  }
  else if (distrito_id == 194){
    this.dist = 'Alajuela|Orotina|Coyolar'
  }
  else if (distrito_id == 195){
    this.dist = 'Alajuela|Orotina|Ceiba'
  }
  else if (distrito_id == 196){
    this.dist = 'Alajuela|San Carlos|Quesada'
  }
  else if (distrito_id == 197){
    this.dist = 'Alajuela|San Carlos|Florencia'
  }
  else if (distrito_id == 198){
    this.dist = 'Alajuela|San Carlos|Buenavista'
  }
  else if (distrito_id == 199){
    this.dist = 'Alajuela|San Carlos|Aguas Zarcas'
  }
  else if (distrito_id == 200){
    this.dist = 'Alajuela|San Carlos|Venecia'
  }
  else if (distrito_id == 201){
    this.dist = 'Alajuela|San Carlos|Pital'
  }
  else if (distrito_id == 202){
    this.dist = 'Alajuela|San Carlos|Fortuna'
  }
  else if (distrito_id == 203){
    this.dist = 'Alajuela|San Carlos|Tigra'
  }
  else if (distrito_id == 204){
    this.dist = 'Alajuela|San Carlos|Palmera'
  }
  else if (distrito_id == 205){
    this.dist = 'Alajuela|San Carlos|Venado'
  }
  else if (distrito_id == 206){
    this.dist = 'Alajuela|San Carlos|Cutris'
  }
  else if (distrito_id == 207){
    this.dist = 'Alajuela|San Carlos|Monterrey'
  }
  else if (distrito_id == 208){
    this.dist = 'Alajuela|San Carlos|Pocosol'
  }
  else if (distrito_id == 209){
    this.dist = 'Alajuela|Zarcero|Zarcero'
  }
  else if (distrito_id == 210){
    this.dist = 'Alajuela|Zarcero|Laguna'
  }
  else if (distrito_id == 211){
    this.dist = 'Alajuela|Zarcero|Tapezco'
  }
  else if (distrito_id == 212){
    this.dist = 'Alajuela|Zarcero|Guadalupe'
  }
  else if (distrito_id == 213){
    this.dist = 'Alajuela|Zarcero|Palmira'
  }
  else if (distrito_id == 214){
    this.dist = 'Alajuela|Zarcero|Zapote'
  }
  else if (distrito_id == 215){
    this.dist = 'Alajuela|Zarcero|Las Brisas'
  }
  else if (distrito_id == 216){
    this.dist = 'Alajuela|Valverde Vega|Sarchi Norte'
  }
  else if (distrito_id == 217){
    this.dist = 'Alajuela|Valderde Vega|Sarchi Sur'
  }
  else if (distrito_id == 218){
    this.dist = 'Alajuela|Valderde Vega|Toro Amarillo'
  }
  else if (distrito_id == 219){
    this.dist = 'Alajuela|Valderde Vega|San Pedro'
  }
  else if (distrito_id == 220){
    this.dist = 'Alajuela|Valderde Vega|Rodriguez'
  }
  else if (distrito_id == 221){
    this.dist = 'Alajuela|Upala|Upala'
  }
  else if (distrito_id == 222){
    this.dist = 'Alajuela|Upala|Aguas Claras'
  }
  else if (distrito_id == 223){
    this.dist = 'Alajuela|Upala|San Jose'
  }
  else if (distrito_id == 224){
    this.dist = 'Alajuela|Upala|Bijagua'
  }
  else if (distrito_id == 225){
    this.dist = 'Alajuela|Upala|Delicias'
  }
  else if (distrito_id == 226){
    this.dist = 'Alajuela|Upala|Dos Rios'
  }
  else if (distrito_id == 227){
    this.dist = 'Alajuela|Upala|Yolillal'
  }
  else if (distrito_id == 228){
    this.dist = 'Alajuela|Upala|Canalete'
  }
  else if (distrito_id == 229){
    this.dist = 'Alajuela|Los Chiles|Los Chiles'
  }
  else if (distrito_id == 230){
    this.dist = 'Alajuela|Los Chiles|Cano Negro'
  }
  else if (distrito_id == 230){
    this.dist = 'Alajuela|Los Chiles|Caño Negro'
  }
  else if (distrito_id == 231){
    this.dist = 'Alajuela|Los Chiles|Amparo'
  }
  else if (distrito_id == 232){
    this.dist = 'Alajuela|Los Chiles|San Jorge'
  }
  else if (distrito_id == 233){
    this.dist = 'Alajuela|Guatuso|San Rafael'
  }
  else if (distrito_id == 234){
    this.dist = 'Alajuela|Guatuso|Buenavista'
  }
  else if (distrito_id == 235){
    this.dist = 'Alajuela|Guatuso|Cote'
  }
  else if (distrito_id == 236){
    this.dist = 'Alajuela|Guatuso|Katira'
  }
  else if (distrito_id == 237){
    this.dist = 'Alajuela|Rio Cuarto|Rio Cuarto'
  }
  else if (distrito_id == 238){
    this.dist = 'Alajuela|Rio Cuarto|Santa Isabel'
  }
  else if (distrito_id == 239){
    this.dist = 'Alajuela|Rio Cuarto|Santa Rita'
  }
  else if (distrito_id == 240){
    this.dist = 'Cartago|Cartago|Oriental'
  }
  else if (distrito_id == 241){
    this.dist = 'Cartago|Cartago|Occidental'
  }
  else if (distrito_id == 242){
    this.dist = 'Cartago|Cartago|Carmen'
  }
  else if (distrito_id == 243){
    this.dist = 'Cartago|Cartago|San Nicolas'
  }
  else if (distrito_id == 244){
    this.dist = 'Cartago|Cartago|Aguacaliente'
  }
  else if (distrito_id == 245){
    this.dist = 'Cartago|Cartago|Guadalupe'
  }
  else if (distrito_id == 246){
    this.dist = 'Cartago|Cartago|Corralillo'
  }
  else if (distrito_id == 247){
    this.dist = 'Cartago|Cartago|Tierra Blanca'
  }
  else if (distrito_id == 248){
    this.dist = 'Cartago|Cartago|Dulce Nombre'
  }
  else if (distrito_id == 249){
    this.dist = 'Cartago|Cartago|Llano Grande'
  }
  else if (distrito_id == 250){
    this.dist = 'Cartago|Cartago|Quebradilla'
  }
  else if (distrito_id == 251){
    this.dist = 'Cartago|Paraiso|Paraiso'
  }
  else if (distrito_id == 252){
    this.dist = 'Cartago|Paraiso|Santiago'
  }
  else if (distrito_id == 253){
    this.dist = 'Cartago|Paraiso|Orosi'
  }
  else if (distrito_id == 254){
    this.dist = 'Cartago|Paraiso|Cachi'
  }
  else if (distrito_id == 255){
    this.dist = 'Cartago|Paraiso|Los Llanos de Santa Lucia'
  }
  else if (distrito_id == 256){
    this.dist = 'Cartago|La Union|Tres Rios'
  }
  else if (distrito_id == 257){
    this.dist = 'Cartago|La Union|San Diego'
  }
  else if (distrito_id == 258){
    this.dist = 'Cartago|La Union|San Juan'
  }
  else if (distrito_id == 259){
    this.dist = 'Cartago|La Union|San Rafael'
  }
  else if (distrito_id == 260){
    this.dist = 'Cartago|La Union|Concepcion'
  }
  else if (distrito_id == 261){
    this.dist = 'Cartago|La Union|Dulce Nombre'
  }
  else if (distrito_id == 262){
    this.dist = 'Cartago|La Union|San Ramon'
  }
  else if (distrito_id == 263){
    this.dist = 'Cartago|La Union|Rio Azul'
  }
  else if (distrito_id == 264){
    this.dist = 'Cartago|Jimenez|Juan Vinas'
  }
  else if (distrito_id == 264){
    this.dist = 'Cartago|Jimenez|Juan Viñas'
  }
  else if (distrito_id == 265){
    this.dist = 'Cartago|Jimenez|Tucurrique'
  }
  else if (distrito_id == 266){
    this.dist = 'Cartago|Jimenez|Pejibaye'
  }
  else if (distrito_id == 267){
    this.dist = 'Cartago|Turrialba|Turrialba'
  }
  else if (distrito_id == 268){
    this.dist = 'Cartago|Turrialba|La Suiza'
  }
  else if (distrito_id == 269){
    this.dist = 'Cartago|Turrialba|Peralta'
  }
  else if (distrito_id == 270){
    this.dist = 'Cartago|Turrialba|Santa Cruz'
  }
  else if (distrito_id == 271){
    this.dist = 'Cartago|Turrialba|Santa Teresita'
  }
  else if (distrito_id == 272){
    this.dist = 'Cartago|Turrialba|Pavones'
  }
  else if (distrito_id == 273){
    this.dist = 'Cartago|Turrialba|Tuis'
  }
  else if (distrito_id == 274){
    this.dist = 'Cartago|Turrialba|Tayutic'
  }
  else if (distrito_id == 275){
    this.dist = 'Cartago|Turrialba|Santa Rosa'
  }
  else if (distrito_id == 276){
    this.dist = 'Cartago|Turrialba|Tres Equis'
  }
  else if (distrito_id == 277){
    this.dist = 'Cartago|Turrialba|La Isabel'
  }
  else if (distrito_id == 278){
    this.dist = 'Cartago|Turrialba|Chirripo'
  }
  else if (distrito_id == 279){
    this.dist = 'Cartago|Alvarado|Pacayas'
  }
  else if (distrito_id == 280){
    this.dist = 'Cartago|Alvarado|Cervantes'
  }
  else if (distrito_id == 281){
    this.dist = 'Cartago|Alvarado|Capellades'
  }
  else if (distrito_id == 282){
    this.dist = 'Cartago|Oreamuno|San Rafael'
  }
  else if (distrito_id == 283){
    this.dist = 'Cartago|Oreamuno|Cot'
  }
  else if (distrito_id == 284){
    this.dist = 'Cartago|Oreamuno|Potrero Cerrado'
  }
  else if (distrito_id == 285){
    this.dist = 'Cartago|Oreamuno|Cipreses'
  }
  else if (distrito_id == 286){
    this.dist = 'Cartago|Oreamuno|Santa Rosa'
  }
  else if (distrito_id == 287){
    this.dist = 'Cartago|El Guarco|El Tejar'
  }
  else if (distrito_id == 288){
    this.dist = 'Cartago|El Guarco|San Isidro'
  }
  else if (distrito_id == 289){
    this.dist = 'Cartago|El Guarco|Tobosi'
  }
  else if (distrito_id == 290){
    this.dist = 'Cartago|El Guarco|Patio de Agua'
  }
  else if (distrito_id == 291){
    this.dist = 'Heredia|Heredia|Heredia'
  }
  else if (distrito_id == 292){
    this.dist = 'Heredia|Heredia|Mercedes'
  }
  else if (distrito_id == 293){
    this.dist = 'Heredia|Heredia|San Francisco'
  }
  else if (distrito_id == 294){
    this.dist = 'Heredia|Heredia|Ulloa'
  }
  else if (distrito_id == 295){
    this.dist = 'Heredia|Heredia|Varablanca'
  }
  else if (distrito_id == 296){
    this.dist = 'Heredia|Barva|Barva'
  }
  else if (distrito_id == 297){
    this.dist = 'Heredia|Barva|San Pedro'
  }
  else if (distrito_id == 298){
    this.dist = 'Heredia|Barva|San Pablo'
  }
  else if (distrito_id == 299){
    this.dist = 'Heredia|Barva|San Roque'
  }
  else if (distrito_id == 300){
    this.dist = 'Heredia|Barva|Santa Lucia'
  }
  else if (distrito_id == 301){
    this.dist = 'Heredia|Barva|San Jose de la Montana'
  }
  else if (distrito_id == 301){
    this.dist = 'Heredia|Barva|San José de la Montaña'
  }
  else if (distrito_id == 302){
    this.dist = 'Heredia|Santo Domingo|Santo Domingo'
  }
  else if (distrito_id == 303){
    this.dist = 'Heredia|Santo Domingo|San Vicente'
  }
  else if (distrito_id == 304){
    this.dist = 'Heredia|Santo Domingo|San Miguel'
  }
  else if (distrito_id == 305){
    this.dist = 'Heredia|Santo Domingo|Paracito'
  }
  else if (distrito_id == 306){
    this.dist = 'Heredia|Santo Domingo|Santo Tomas'
  }
  else if (distrito_id == 307){
    this.dist = 'Heredia|Santo Domingo|Santa Rosa'
  }
  else if (distrito_id == 308){
    this.dist = 'Heredia|Santo Domingo|Tures'
  }
  else if (distrito_id == 309){
    this.dist = 'Heredia|Santo Domingo|Para'
  }
  else if (distrito_id == 310){
    this.dist = 'Heredia|Santa Barbara|Santa Barbara'
  }
  else if (distrito_id == 311){
    this.dist = 'Heredia|Santa Barbara|San Pedro'
  }
  else if (distrito_id == 312){
    this.dist = 'Heredia|Santa Barbara|San Juan'
  }
  else if (distrito_id == 313){
    this.dist = 'Heredia|Santa Barbara|Jesus'
  }
  else if (distrito_id == 314){
    this.dist = 'Heredia|Santa Barbara|Santo Domingo del Roble'
  }
  else if (distrito_id == 315){
    this.dist = 'Heredia|Santa Barbara|Puraba'
  }
  else if (distrito_id == 316){
    this.dist = 'Heredia|San Rafael|San Rafael'
  }
  else if (distrito_id == 317){
    this.dist = 'Heredia|San Rafael|San Josecito'
  }
  else if (distrito_id == 318){
    this.dist = 'Heredia|San Rafael|Santiago'
  }
  else if (distrito_id == 319){
    this.dist = 'Heredia|San Rafael|Angeles'
  }
  else if (distrito_id == 320){
    this.dist = 'Heredia|San Rafael|Concepcion'
  }
  else if (distrito_id == 321){
    this.dist = 'Heredia|San Isidro|San Isidro'
  }
  else if (distrito_id == 322){
    this.dist = 'Heredia|San Isidro|San Jose'
  }
  else if (distrito_id == 323){
    this.dist = 'Heredia|San Isidro|Concepcion'
  }
  else if (distrito_id == 324){
    this.dist = 'Heredia|San Isidro|San Francisco'
  }
  else if (distrito_id == 325){
    this.dist = 'Heredia|Belen|San Antonio'
  }
  else if (distrito_id == 326){
    this.dist = 'Heredia|Belen|La Rivera'
  }
  else if (distrito_id == 327){
    this.dist = 'Heredia|Belen|Asuncion'
  }
  else if (distrito_id == 328){
    this.dist = 'Heredia|Flores|San Joaquin'
  }
  else if (distrito_id == 329){
    this.dist = 'Heredia|Flores|Barrantes'
  }
  else if (distrito_id == 330){
    this.dist = 'Heredia|Flores|Llorente'
  }
  else if (distrito_id == 331){
    this.dist = 'Heredia|San Pablo|San Pablo'
  }
  else if (distrito_id == 332){
    this.dist = 'Heredia|San Pablo|Rincon de Sabanilla'
  }
  else if (distrito_id == 333){
    this.dist = 'Heredia|Sarapiqui|Puerto Viejo'
  }
  else if (distrito_id == 334){
    this.dist = 'Heredia|Sarapiqui|La Virgen'
  }
  else if (distrito_id == 335){
    this.dist = 'Heredia|Sarapiqui|Horquetas'
  }
  else if (distrito_id == 336){
    this.dist = 'Heredia|Sarapiqui|Llanuras de Gaspar'
  }
  else if (distrito_id == 337){
    this.dist = 'Heredia|Sarapiqui|Cureña'
  }
  else if (distrito_id == 338){
    this.dist = 'Guanacaste|Liberia|Liberia'
  }
  else if (distrito_id == 339){
    this.dist = 'Guanacaste|Liberia|Canas Dulces'
  }
  else if (distrito_id == 339){
    this.dist = 'Guanacaste|Liberia|Cañas Dulces'
  }
  else if (distrito_id == 340){
    this.dist = 'Guanacaste|Liberia|Mayorga'
  }
  else if (distrito_id == 341){
    this.dist = 'Guanacaste|Liberia|Nacascolo'
  }
  else if (distrito_id == 342){
    this.dist = 'Guanacaste|Liberia|Curubande'
  }
  else if (distrito_id == 343){
    this.dist = 'Guanacaste|Nicoya|Nicoya'
  }
  else if (distrito_id == 344){
    this.dist = 'Guanacaste|Nicoya|Mansion'
  }
  else if (distrito_id == 345){
    this.dist = 'Guanacaste|Nicoya|San Antonio'
  }
  else if (distrito_id == 346){
    this.dist = 'Guanacaste|Nicoya|Quebrada Honda'
  }
  else if (distrito_id == 347){
    this.dist = 'Guanacaste|Nicoya|Samara'
  }
  else if (distrito_id == 348){
    this.dist = 'Guanacaste|Nicoya|Nosara'
  }
  else if (distrito_id == 349){
    this.dist = 'Guanacaste|Nicoya|Belen de Nosarita'
  }
  else if (distrito_id == 350){
    this.dist = 'Guanacaste|Santa Cruz|Santa Cruz'
  }
  else if (distrito_id == 351){
    this.dist = 'Guanacaste|Santa Cruz|Bolson'
  }
  else if (distrito_id == 352){
    this.dist = 'Guanacaste|Santa Cruz|Veintisiete de Abril'
  }
  else if (distrito_id == 353){
    this.dist = 'Guanacaste|Santa Cruz|Tempate'
  }
  else if (distrito_id == 354){
    this.dist = 'Guanacaste|Santa Cruz|Cartagena'
  }
  else if (distrito_id == 355){
    this.dist = 'Guanacaste|Santa Cruz|Cuajiniquil'
  }
  else if (distrito_id == 356){
    this.dist = 'Guanacaste|Santa Cruz|Diria'
  }
  else if (distrito_id == 357){
    this.dist = 'Guanacaste|Santa Cruz|Cabo Velas'
  }
  else if (distrito_id == 358){
    this.dist = 'Guanacaste|Santa Cruz|Tamarindo'
  }
  else if (distrito_id == 359){
    this.dist = 'Guanacaste|Bagaces|Bagaces'
  }
  else if (distrito_id == 360){
    this.dist = 'Guanacaste|Bagaces|Fortuna'
  }
  else if (distrito_id == 361){
    this.dist = 'Guanacaste|Bagaces|Mogote'
  }
  else if (distrito_id == 362){
    this.dist = 'Guanacaste|Bagaces|Rio Naranjo'
  }
  else if (distrito_id == 363){
    this.dist = 'Guanacaste|Carrillo|Filadelfia'
  }
  else if (distrito_id == 364){
    this.dist = 'Guanacaste|Carrillo|Palmira'
  }
  else if (distrito_id == 365){
    this.dist = 'Guanacaste|Carrillo|Sardinal'
  }
  else if (distrito_id == 366){
    this.dist = 'Guanacaste|Carrillo|Belen'
  }
  else if (distrito_id == 367){
    this.dist = 'Guanacaste|Cañas|Cañas'
  }
  else if (distrito_id == 368){
    this.dist = 'Guanacaste|Cañas|Palmira'
  }
  else if (distrito_id == 369){
    this.dist = 'Guanacaste|Cañas|San Miguel'
  }
  else if (distrito_id == 370){
    this.dist = 'Guanacaste|Cañas|Bebedero'
  }
  else if (distrito_id == 371){
    this.dist = 'Guanacaste|Cañas|Porozal'
  }
  else if (distrito_id == 372){
    this.dist = 'Guanacaste|Abangares|Juntas'
  }
  else if (distrito_id == 373){
    this.dist = 'Guanacaste|Abangares|Sierra'
  }
  else if (distrito_id == 374){
    this.dist = 'Guanacaste|Abangares|San Juan'
  }
  else if (distrito_id == 375){
    this.dist = 'Guanacaste|Abangares|Colorado'
  }
  else if (distrito_id == 376){
    this.dist = 'Guanacaste|Tilaran|Tilaran'
  }
  else if (distrito_id == 377){
    this.dist = 'Guanacaste|Tilaran|Quebrada Grande'
  }
  else if (distrito_id == 378){
    this.dist = 'Guanacaste|Tilaran|Tronadora'
  }
  else if (distrito_id == 379){
    this.dist = 'Guanacaste|Tilaran|Santa Rosa'
  }
  else if (distrito_id == 380){
    this.dist = 'Guanacaste|Tilaran|Libano'
  }
  else if (distrito_id == 381){
    this.dist = 'Guanacaste|Tilaran|Tierras Morenas'
  }
  else if (distrito_id == 382){
    this.dist = 'Guanacaste|Tilaran|Arenal'
  }
  else if (distrito_id == 383){
    this.dist = 'Guanacaste|Nandayure|Carmona'
  }
  else if (distrito_id == 384){
    this.dist = 'Guanacaste|Nandayure|Santa Rita'
  }
  else if (distrito_id == 385){
    this.dist = 'Guanacaste|Nandayure|Zapotal'
  }
  else if (distrito_id == 386){
    this.dist = 'Guanacaste|Guanacaste|Nandayure|San Pablo'
  }
  else if (distrito_id == 387){
    this.dist = 'Guanacaste|Nandayure|Porvenir'
  }
  else if (distrito_id == 388){
    this.dist = 'Guanacaste|Nandayure|Bejuco'
  }
  else if (distrito_id == 389){
    this.dist = 'Guanacaste|La Cruz|La Cruz'
  }
  else if (distrito_id == 390){
    this.dist = 'Guanacaste|La Cruz|Santa Cecilia'
  }
  else if (distrito_id == 391){
    this.dist = 'Guanacaste|La Cruz|Garita'
  }
  else if (distrito_id == 392){
    this.dist = 'Guanacaste|La Cruz|Santa Elena'
  }
  else if (distrito_id == 393){
    this.dist = 'Guanacaste|Hojancha|Hojancha'
  }
  else if (distrito_id == 394){
    this.dist = 'Guanacaste|Hojancha|Monte Romo'
  }
  else if (distrito_id == 395){
    this.dist = 'Guanacaste|Hojancha|Puerto Carillo'
  }
  else if (distrito_id == 396){
    this.dist = 'Guanacaste|Hojancha|Huacas'
  }
  else if (distrito_id == 397){
    this.dist = 'Puntarenas|Puntarenas|Puntarenas'
  }
  else if (distrito_id == 398){
    this.dist = 'Puntarenas|Puntarenas|Pitahaya'
  }
  else if (distrito_id == 399){
    this.dist = 'Puntarenas|Puntarenas|Chomes'
  }
  else if (distrito_id == 400){
    this.dist = 'Puntarenas|Puntarenas|Lepanto'
  }
  else if (distrito_id == 401){
    this.dist = 'Puntarenas|Puntarenas|Paquera'
  }
  else if (distrito_id == 402){
    this.dist = 'Puntarenas|Puntarenas|Manzanillo'
  }
  else if (distrito_id == 403){
    this.dist = 'Puntarenas|Puntarenas|Guacimal'
  }
  else if (distrito_id == 404){
    this.dist = 'Puntarenas|Puntarenas|Barranca'
  }
  else if (distrito_id == 405){
    this.dist = 'Puntarenas|Puntarenas|Monte Verde'
  }
  else if (distrito_id == 406){
    this.dist = 'Puntarenas|Puntarenas|Isla del Coco'
  }
  else if (distrito_id == 407){
    this.dist = 'Puntarenas|Puntarenas|Cobano'
  }
  else if (distrito_id == 408){
    this.dist = 'Puntarenas|Puntarenas|Chacarita'
  }
  else if (distrito_id == 409){
    this.dist = 'Puntarenas|Puntarenas|Chira'
  }
  else if (distrito_id == 410){
    this.dist = 'Puntarenas|Puntarenas|Acapulco'
  }
  else if (distrito_id == 411){
    this.dist = 'Puntarenas|Puntarenas|Roble'
  }
  else if (distrito_id == 412){
    this.dist = 'Puntarenas|Puntarenas|Arancibia'
  }
  else if (distrito_id == 413){
    this.dist = 'Puntarenas|Esparza|Espiritu Santo'
  }
  else if (distrito_id == 414){
    this.dist = 'Puntarenas|Esparza|San Juan Grande'
  }
  else if (distrito_id == 415){
    this.dist = 'Puntarenas|Esparza|Macacona'
  }
  else if (distrito_id == 416){
    this.dist = 'Puntarenas|Esparza|San Rafael'
  }
  else if (distrito_id == 417){
    this.dist = 'Puntarenas|Esparza|San Jeronimo'
  }
  else if (distrito_id == 418){
    this.dist = 'Puntarenas|Esparza|Caldera'
  }
  else if (distrito_id == 419){
    this.dist = 'Puntarenas|Buenos Aires|Buenos Aires'
  }
  else if (distrito_id == 420){
    this.dist = 'Puntarenas|Buenos Aires|Volcan'
  }
  else if (distrito_id == 421){
    this.dist = 'Puntarenas|Buenos Aires|Potrero Grande'
  }
  else if (distrito_id == 422){
    this.dist = 'Puntarenas|Buenos Aires|Boruca'
  }
  else if (distrito_id == 423){
    this.dist = 'Puntarenas|Buenos Aires|Pilas'
  }
  else if (distrito_id == 424){
    this.dist = 'Puntarenas|Buenos Aires|Colinas'
  }
  else if (distrito_id == 425){
    this.dist = 'Puntarenas|Buenos Aires|Changuena'
  }
  else if (distrito_id == 426){
    this.dist = 'Puntarenas|Buenos Aires|Bioley'
  }
  else if (distrito_id == 427){
    this.dist = 'Puntarenas|Buenos Aires|Brunka'
  }
  else if (distrito_id == 428){
    this.dist = 'Puntarenas|Montes de Oro|Miramar'
  }
  else if (distrito_id == 429){
    this.dist = 'Puntarenas|Montes de Oro|Union'
  }
  else if (distrito_id == 430){
    this.dist = 'Puntarenas|Montes de Oro|San Isidro'
  }
  else if (distrito_id == 431){
    this.dist = 'Puntarenas|Osa|Puerto Cortes'
  }
  else if (distrito_id == 432){
    this.dist = 'Puntarenas|Osa|Palmar'
  }
  else if (distrito_id == 433){
    this.dist = 'Puntarenas|Osa|Sierpe'
  }
  else if (distrito_id == 434){
    this.dist = 'Puntarenas|Osa|Bahia Ballena'
  }
  else if (distrito_id == 435){
    this.dist = 'Puntarenas|Osa|Piedras Blancas'
  }
  else if (distrito_id == 436){
    this.dist = 'Puntarenas|Osa|Bahia Drake'
  }
  else if (distrito_id == 437){
    this.dist = 'Puntarenas|Quepos|Quepos'
  }
  else if (distrito_id == 438){
    this.dist = 'Puntarenas|Quepos|Savegre'
  }
  else if (distrito_id == 439){
    this.dist = 'Puntarenas|Quepos|Naranjito'
  }
  else if (distrito_id == 440){
    this.dist = 'Puntarenas|Golfito|Golfito'
  }
  else if (distrito_id == 441){
    this.dist = 'Puntarenas|Golfito|Puerto Jimenez'
  }
  else if (distrito_id == 442){
    this.dist = 'Puntarenas|Golfito|Guaycara'
  }
  else if (distrito_id == 443){
    this.dist = 'Puntarenas|Golfito|Pavon'
  }
  else if (distrito_id == 444){
    this.dist = 'Puntarenas|Coto Brus|San Vito'
  }
  else if (distrito_id == 445){
    this.dist = 'Puntarenas|Coto Brus|Sabalito'
  }
  else if (distrito_id == 446){
    this.dist = 'Puntarenas|Coto Brus|Agua Buena'
  }
  else if (distrito_id == 447){
    this.dist = 'Puntarenas|Coto Brus|Limoncito'
  }
  else if (distrito_id == 448){
    this.dist = 'Puntarenas|Coto Brus|Pittier'
  }
  else if (distrito_id == 449){
    this.dist = 'Puntarenas|Coto Brus|Gutierrez Brown'
  }
  else if (distrito_id == 450){
    this.dist = 'Puntarenas|Parrita|Parrita'
  }
  else if (distrito_id == 451){
    this.dist = 'Puntarenas|Corredores|Corredores'
  }
  else if (distrito_id == 452){
    this.dist = 'Puntarenas|Corredores|La Cuesta'
  }
  else if (distrito_id == 453){
    this.dist = 'Puntarenas|Corredores|Paso Canoas'
  }
  else if (distrito_id == 454){
    this.dist = 'Puntarenas|Corredores|Laurel'
  }
  else if (distrito_id == 455){
    this.dist = 'Puntarenas|Garabito|Jaco'
  }
  else if (distrito_id == 456){
    this.dist = 'Puntarenas|Garabito|Tarcoles'
  }
  else if (distrito_id == 457){
    this.dist = 'Limon|Limon|Limon'
  }
  else if (distrito_id == 458){
    this.dist = 'Limon|Limon|Valle La Estrella'
  }
  else if (distrito_id == 459){
    this.dist = 'Limon|Limon|Rio Blanco'
  }
  else if (distrito_id == 460){
    this.dist = 'Limon|Limon|Matama'
  }
  else if (distrito_id == 461){
    this.dist = 'Limon|Pocosi|Guapiles'
  }
  else if (distrito_id == 462){
    this.dist = 'Limon|Pocosi|Jimenez'
  }
  else if (distrito_id == 463){
    this.dist = 'Limon|Pocosi|Rita'
  }
  else if (distrito_id == 464){
    this.dist = 'Limon|Pocosi|Roxana'
  }
  else if (distrito_id == 465){
    this.dist = 'Limon|Pocosi|Cariari'
  }
  else if (distrito_id == 466){
    this.dist = 'Limon|Pocosi|Colorado'
  }
  else if (distrito_id == 467){
    this.dist = 'Limon|Pocosi|La Colonia'
  }
  else if (distrito_id == 468){
    this.dist = 'Limon|Siquirres|Siquirres'
  }
  else if (distrito_id == 469){
    this.dist = 'Limon|Siquirres|Pacuarito'
  }
  else if (distrito_id == 470){
    this.dist = 'Limon|Siquirres|Florida'
  }
  else if (distrito_id == 471){
    this.dist = 'Limon|Siquirres|Germania'
  }
  else if (distrito_id == 472){
    this.dist = 'Limon|Siquirres|Cairo'
  }
  else if (distrito_id == 473){
    this.dist = 'Limon|Siquirres|Alegria'
  }
  else if (distrito_id == 474){
    this.dist = 'Limon|Talamanca|Bratsi'
  }
  else if (distrito_id == 475){
    this.dist = 'Limon|Talamanca|Sixaola'
  }
  else if (distrito_id == 476){
    this.dist = 'Limon|Talamanca|Cauhita'
  }
  else if (distrito_id == 477){
    this.dist = 'Limon|Talamanca|Telire'
  }
  else if (distrito_id == 478){
    this.dist = 'Limon|Matina|Matina'
  }
  else if (distrito_id == 479){
    this.dist = 'Limon|Matina|Batan'
  }
  else if (distrito_id == 480){
    this.dist = 'Limon|Matina|Carrandi'
  }
  else if (distrito_id == 481){
    this.dist = 'Limon|Guacimo|Guacimo'
  }
  else if (distrito_id == 482){
    this.dist = 'Limon|Guacimo|Mercedes'
  }
  else if (distrito_id == 483){
    this.dist = 'Limon|Guacimo|Pocora'
  }
  else if (distrito_id == 484){
    this.dist = 'Limon|Guacimo|Rio Jimenez'
  }
  else if (distrito_id == 485){
    this.dist = 'Limon|Guacimo|Duacari'
  }


  var search = this.dist
  console.log(search)
  this._sitioService.searchDistrito(search).subscribe(
    response => {
      if (response.sitio) {
        this.sitios = response.sitio;
        console.log(response.sitio)
      } else {
        this.sitios = [];
        this.renderMarkers();
      }
    },
    error => {
      console.log(error);

      Swal.fire(

        'Busqueda Sitios',

        'No existen Sitios Registrados en la Zona.',

        'error'

      )
      this.sitios = [];

    }
  );
} */

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

  /*   buscarSitios(): void {
      const provincia = this.selectedProvincia?.title || "";
      const canton = this.selectedCanton?.title || "";
      const distrito = this.selectedDistrito?.title || "";
    
      const payload = { provincia, canton, distrito };
      console.log("Payload enviado:", payload);
      
      
      this._sitioService.buscarSitios(payload).subscribe(
        (res: any) => {
          if (!res.sitio || res.sitio.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron sitios con los criterios seleccionados.'
            });
            this.sitios = [];
            return;
          }
    
          this.sitios = res.sitio;
          
    
          // Centrar en el primer resultado
          const primerSitio = this.sitios[0];
          if (primerSitio.latitude && primerSitio.longitude) {
            this.lat = primerSitio.latitude;
            this.lng = primerSitio.longitude;
            //this.zoom = 10;
          }
              // Limpiar los selects después de búsqueda exitosa
    this.selectedProvincia = null;
    this.selectedCanton = null;
    this.selectedDistrito = null;
    this.searchNombre = ''; 
    this.lat = 9.7489; // Centro de CR
    this.lng = -83.7534;
    this.zoom = 8// si usás un input para nombre o clave
        },
        (error) => {
          console.error("Error al buscar sitios:", error);
        }
      );
    } */

    buscarSitios(): void {
  const provincia = this.selectedProvincia?.title || "";
  const canton = this.selectedCanton?.title || "";
  const distrito = this.selectedDistrito?.title || "";

  const payload = { provincia, canton, distrito };
  console.log("Payload enviado:", payload);

  this._sitioService.buscarSitios(payload).subscribe(
    (res: any) => {
      if (!res.sitio || res.sitio.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin resultados',
          text: 'No se encontraron sitios con los criterios seleccionados.'
        });
        this.sitios = [];
        this.renderMarkers();
        return;
      }

      this.sitios = res.sitio;

      // centrar en el primer resultado usando x/y
      const primerSitio = this.sitios[0];
      const lat = Number(primerSitio.y || primerSitio.latitude || primerSitio.latitude);
      const lng = Number(primerSitio.x || primerSitio.Logitude || primerSitio.longitude || primerSitio.longitude);

      if (lat && lng) {
        this.lat = lat;
        this.lng = lng;
        this.map.setView([lat, lng], 10);
      }

      this.renderMarkers();

      // Limpiar los selects después de búsqueda exitosa
      this.selectedProvincia = null;
      this.selectedCanton = null;
      this.selectedDistrito = null;
      this.searchNombre = '';
    },
    (error) => {
      console.error("Error al buscar sitios:", error);
    }
  );
}


}


