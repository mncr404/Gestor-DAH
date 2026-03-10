import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './app.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';
import { AngularFileUploaderModule } from "angular-file-uploader";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import { AppComponent } from './app.component';
import { PeliculasComponent } from './components/peliculas/peliculas.component';
import { HeaderComponent } from './components/header/header.component';
import { SliderComponent } from './components/slider/slider.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { CeramicaComponent } from './components/ceramica/ceramica.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { PaginaComponent } from './components/pagina/pagina.component';
import { ErrorComponent } from './components/error/error.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptionsComponent } from './components/modal-options/modal-options.component';
import { TipoDisComponent } from './components/tipo-dis/tipo-dis.component';
import { PlasticaComponent } from './components/plastica/plastica.component';
import { ContextoComponent } from './components/contexto/contexto.component';
import { CeramicsComponent } from './components/ceramics/ceramics.component';
import { ArticleComponent } from './components/article/article.component';
import { SearchComponent } from './components/search/search.component';
import { ArticleNewComponent } from './components/article-new/article-new.component';
import { ArticleEditComponent } from './components/article-edit/article-edit.component';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { AuthenticationButtonComponent } from './components/authentication-button/authentication-button.component';
import { LandingComponent } from './pages/landing/landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog'
import { ExporterService } from './services/exporter';
import { FichaContextoComponent } from './components/ficha-contexto/ficha-contexto.component';
import { ReportePublicoComponent } from './components/reporte-publico/reporte-publico.component';
import { ContextoDetalleComponent } from './components/contexto-detalle/contexto-detalle.component';
import { ContextoEditComponent } from './components/contexto-edit/contexto-edit.component';
import { ContextoExcelComponent } from './components/contexto-excel/contexto-excel.component';
import { SearchContextoComponent } from './components/search-contexto/search-contexto.component';
import { PagLitComponent } from './components/pag-lit/pag-lit.component';
import { LiticoComponent } from './components/litico/litico.component';
import { FichaLiticaComponent } from './components/ficha-litica/ficha-litica.component';
import { LiticaDetalleComponent } from './components/litica-detalle/litica-detalle.component';
import { LiticaEditComponent } from './components/litica-edit/litica-edit.component';
import { LiticaExcelComponent } from './components/litica-excel/litica-excel.component';
import { MetalicoComponent } from './components/metalico/metalico.component';
import { PagMetComponent } from './components/pag-met/pag-met.component';
import { FichaMetalComponent } from './components/ficha-metal/ficha-metal.component';
import { MetalDetalleComponent } from './components/metal-detalle/metal-detalle.component';
import { MetalEditComponent } from './components/metal-edit/metal-edit.component';
import { MetalExcelComponent } from './components/metal-excel/metal-excel.component';
import { SearchLiticoComponent } from './components/search-litico/search-litico.component';
import { SitioExcelComponent } from './components/sitio-excel/sitio-excel.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import {AuthGuard} from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { PagOriComponent } from './components/pag-ori/pag-ori.component';
import { SitioComponent } from './components/sitio/sitio.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SitioDetalleComponent } from './components/sitio-detalle/sitio-detalle.component';
import { SearchCombCeraComponent } from './components/search-comb-cera/search-comb-cera.component';
import { SearchComblitComponent } from './components/search-comblit/search-comblit.component';
import { SearchCombMetComponent } from './components/search-comb-met/search-comb-met.component';
import { FichaOrigenesComponent } from './components/ficha-origenes/ficha-origenes.component';
import { MapaOrigenesComponent } from './components/mapa-origenes/mapa-origenes.component';
import { SearchSitioComponent } from './components/search-sitio/search-sitio.component';
import { PoliticasUsoComponent } from './components/politicas-uso/politicas-uso.component';
import { RegistroOrigenesComponent } from './components/registro-origenes/registro-origenes.component';
import { PagLiteSitiosComponent } from './components/pag-lite-sitios/pag-lite-sitios.component';
import { PagDetalleLiteSitioComponent } from './components/pag-detalle-lite-sitio/pag-detalle-lite-sitio.component';
import { PagLiteSitioNombreComponent } from './components/pag-lite-sitio-nombre/pag-lite-sitio-nombre.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SitioEditComponent } from './components/sitio-edit/sitio-edit.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { ResetComponent } from './components/reset/reset.component';
import { PerfilesComponent } from './components/perfiles/perfiles.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PopupOrigenesComponent } from './components/popup-origenes/popup-origenes.component';
import { PopupPerfilComponent } from './components/popup-perfil/popup-perfil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardEstadisticasComponent } from './components/dashboard-estadisticas/dashboard-estadisticas.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ObjetosListComponent } from './components/objetos-list/objetos-list.component';
import { SharedUiModule } from './shared-ui/shared-ui.module';
import { PatrimoniaHomeComponent } from './components/patrimonia-home/patrimonia-home.component';
import { FichaObjetosComponent } from './components/ficha-objetos/ficha-objetos.component';
import { MonumentosFiltrosDrawerComponent } from './components/monumentos-filtros-drawer/monumentos-filtros-drawer.component';
import { AdvancedFiltersHelpDialogComponent } from './components/advanced-filters-help-dialog/advanced-filters-help-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    PeliculasComponent,
    HeaderComponent,
    SliderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    CeramicaComponent,
    FormularioComponent,
    PaginaComponent,
    ErrorComponent,
    ModalOptionsComponent,
    TipoDisComponent,
    PlasticaComponent,
    ContextoComponent,
    CeramicsComponent,
    ArticleComponent,
    SearchComponent,
    ArticleNewComponent,
    ArticleEditComponent,
    LoginButtonComponent,
    LogoutButtonComponent,
    AuthenticationButtonComponent,
    LandingComponent,
    FichaContextoComponent,
    ReportePublicoComponent,
    ContextoDetalleComponent,
    ContextoEditComponent,
    ContextoExcelComponent,
    SearchContextoComponent,
    PagLitComponent,
    LiticoComponent,
    FichaLiticaComponent,
    LiticaDetalleComponent,
    LiticaEditComponent,
    LiticaExcelComponent,
    MetalicoComponent,
    PagMetComponent,
    FichaMetalComponent,
    MetalDetalleComponent,
    MetalEditComponent,
    MetalExcelComponent,
    SearchLiticoComponent,
    SitioExcelComponent,
    LoginComponent,
    RegistroComponent,
    PagOriComponent,
    SitioComponent,
    SitioDetalleComponent,
    SearchCombCeraComponent,
    SearchComblitComponent,
    SearchCombMetComponent,
    FichaOrigenesComponent,
    MapaOrigenesComponent,
    SearchSitioComponent,
    PoliticasUsoComponent,
    RegistroOrigenesComponent,
    PagLiteSitiosComponent,
    PagDetalleLiteSitioComponent,
    PagLiteSitioNombreComponent,
    SitioEditComponent,
    ForgotComponent,
    ResetComponent,
    PerfilesComponent,
    PopupOrigenesComponent,
    PopupPerfilComponent,
    DashboardComponent,
    DashboardEstadisticasComponent,
    ObjetosListComponent,
    PatrimoniaHomeComponent,
    FichaObjetosComponent,
    MonumentosFiltrosDrawerComponent,
    AdvancedFiltersHelpDialogComponent
    
    
  ],
  
  imports: [
    BrowserModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    routing,
    MatTabsModule,
    NgbModule,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatExpansionModule,
    NgxChartsModule,
    MatSelectModule,
    MomentModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    AngularFileUploaderModule,
      /*  AuthModule.forRoot({
      ...env.auth,
    }),   */
    BrowserAnimationsModule,
    SharedUiModule,
    GoogleChartsModule.forRoot()
  ],
  providers: [appRoutingProviders, ExporterService, AuthGuard, {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true}, { provide: MAT_DATE_LOCALE, useValue: 'es-CR' }],
 
  bootstrap: [AppComponent],

  entryComponents : [PagDetalleLiteSitioComponent,PopupOrigenesComponent],
})
export class AppModule { }
