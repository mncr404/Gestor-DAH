import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface AdvancedFilters {
  tipoProyecto: string[];
  tipoMonumento: string[];
}

@Component({
  selector: 'app-monumentos-filtros-drawer',
  templateUrl: './monumentos-filtros-drawer.component.html',
  styleUrls: ['./monumentos-filtros-drawer.component.css']
})
export class MonumentosFiltrosDrawerComponent {
  @Input() filters: AdvancedFilters = { tipoProyecto: [], tipoMonumento: [] };

  @Output() filtersChange = new EventEmitter<AdvancedFilters>();
  @Output() apply = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  tipoProyectoOptions = [
    { key: 'estudio_de_impacto_ambiental', label: 'Estudio Impacto Ambiental' },
    { key: 'monitoreo_de_movimiento_de_tierras', label: 'Monitoreo Movimiento Tierras' },
    { key: 'evaluacion', label: 'Evaluación' },
    { key: 'peritaje', label: 'Peritaje' },
    { key: 'excavacion', label: 'Excavación Aislada' },
    { key: 'rescate', label: 'Rescate' },
    { key: 'inspeccion', label: 'Inspección' },
    { key: 'trabajo_final_de_graduacion', label: 'Trabajo Final Graduación' },
    { key: 'regional', label: 'Investigación Regional' },
    { key: 'investigacion_subregional', label: 'Investigación Subregional' }
  ];

  tipoMonumentoOptions = [
    { key: 'abrigo_cueva_o_caverna', label: 'Abrigo, Cueva o Caverna' },
    { key: 'habitacion', label: 'Habitación' },
    { key: 'arquitectonico', label: 'Arquitectónico' },
    { key: 'materiales_dispersos', label: 'Materiales Dispersos' },
    { key: 'basurero', label: 'Basurero' },
    { key: 'petroglifo', label: 'Petroglifo' },
    { key: 'camino', label: 'Camino' },
    { key: 'salina', label: 'Salina' },
    { key: 'conchero', label: 'Conchero' },
    { key: 'taller_litico', label: 'Taller Lítico' },
    { key: 'funerario', label: 'Funerario' }
  ];

  // helpers para selección (mat-selection-list devuelve array de keys)
  onTipoProyectoChange(values: string[]) {
    this.filters = { ...this.filters, tipoProyecto: values ?? [] };
    this.filtersChange.emit(this.filters);
  }

  onTipoMonumentoChange(values: string[]) {
    this.filters = { ...this.filters, tipoMonumento: values ?? [] };
    this.filtersChange.emit(this.filters);
  }

  onClear() {
    this.filters = { tipoProyecto: [], tipoMonumento: [] };
    this.filtersChange.emit(this.filters);
    this.clear.emit();
  }

  get hasAnySelection(): boolean {
  return (this.filters?.tipoProyecto?.length ?? 0) > 0 || (this.filters?.tipoMonumento?.length ?? 0) > 0;
}
}