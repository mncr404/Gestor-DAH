import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patrimonia-home',
  templateUrl: './patrimonia-home.component.html',
  styleUrls: ['./patrimonia-home.component.css']
})
export class PatrimoniaHomeComponent {

  // Filtros del sidebar
  form: FormGroup = this.fb.group({
    tipo_coleccion: [''],
    tipo_materia: ['']
  });

  // Opciones (mock). Luego las puedes traer desde un endpoint /catalogos
  colecciones = [
    { value: 'Arqueológica', label: 'Arqueológica' },
    { value: 'Histórica', label: 'Histórica' }
  ];
  materias = [
    { value: 'Cerámica', label: 'Cerámica' },
    { value: 'Piedra', label: 'Piedra' },
    { value: 'Metal', label: 'Metal' },
    { value: 'Concha', label: 'Concha' },
    { value: 'Otros', label: 'Otros' }
  ];

  // Donut mock: distribución por tipo de colección
  chartData = [
    { name: 'Arqueológica', value: 320 },
    { name: 'Histórica',     value: 120 }
  ];

  materialData = [
  { name: 'Cerámica', value: 45 },
  { name: 'Piedra', value: 30 },
  { name: 'Metal', value: 15 },
  { name: 'Vidrio', value: 10 }
];

  // Estética Patrimonia
  materialColorScheme = {
    domain: ['#7A4E2D', '#D4A017', '#B0855B', '#2C2C2C', '#F9F7F5']
  };

  // Opciones de ngx-charts
  view: [number, number] = [700, 360];
  gradient = false;
  showLegend = true;
  showLabels = true;
  isDoughnut = true;   // donut
  legendPosition: 'right' | 'below' = 'right';

  constructor(private fb: FormBuilder, private router: Router) {}

  buscar() {
    const q: any = {};
    if (this.form.value.tipo_coleccion) q.tipo_coleccion = this.form.value.tipo_coleccion;
    if (this.form.value.tipo_materia)   q.tipo_materia   = this.form.value.tipo_materia;
    // Navega al listado de objetos con query params
    this.router.navigate(['/objetos'], { queryParams: q });
  }
}
