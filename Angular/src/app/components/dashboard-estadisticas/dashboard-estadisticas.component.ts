import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard-estadisticas',
  templateUrl: './dashboard-estadisticas.component.html',
})
export class DashboardEstadisticasComponent implements OnInit, AfterViewInit {
  ingresosPorMes: any[] = [];
  porcentajeCrecimiento: any[] = [];
  ingresosPorUsuario: any[] = [];
  usuarioSeleccionado: string | null = null;
  mesSeleccionado: string | null = null;
  mesesDisponibles: string[] = [];
  datosRetencion: any[] = [];
  datosPromedio: any[] = [];
  displayedColumns: string[] = ['usuario', 'nombre_usuario', 'total'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  usuarios: any[] = [];
  
  constructor(private apiService: AuthService) {}

  ngOnInit(): void {
    // Tabla de accesos por usuario
    this.apiService.getIngresosPorUsuario().subscribe(data => {
      this.dataSource.data = data;

      // Guardar lista para filtro
      this.usuarios = data.map((u: any) => ({
        email: u._id,
        nombre: u.nombre_usuario
      }));

      // Paginador debe esperarse al render
      setTimeout(() => this.dataSource.paginator = this.paginator);
    });

    // Datos mensuales generales
    this.apiService.getIngresosEstadisticas().subscribe(data => {
      this.ingresosPorMes = data.map(d => ({
        name: d._id,
        value: d.total
      }));
// Poblar lista de meses únicos
  this.mesesDisponibles = data.map(d => d._id);
      // Calcular crecimiento mensual
// Calcular crecimiento acumulado mensual para el gráfico de líneas
// Evolución mensual con depuración
this.porcentajeCrecimiento = [
  {
    name: 'Crecimiento',
    series: []
  }
];

for (let i = 1; i < data.length; i++) {
  const actual = data[i];
  const anterior = data[i - 1];

  if (anterior.total > 0) {
    const porcentaje = ((actual.total - anterior.total) / anterior.total) * 100;
    console.log('Mes actual:', actual._id, 'Anterior total:', anterior.total, 'Actual total:', actual.total, 'Porcentaje:', porcentaje);

    this.porcentajeCrecimiento[0].series.push({
      name: actual._id,
      value: Number(porcentaje.toFixed(2))
    });
  };

  this.apiService.getRetencionYPromedio().subscribe(data => {
    console.log('Datos retencion y promedio:', data);

 this.datosRetencion = [
    {
      name: 'Retención',
      series: data.map(d => ({
        name: d.mes,
        value: d.tasaRetencion
      }))
    }
  ];

  this.datosPromedio = data.map(d => ({
    name: d.mes,
    value: d.promedioAccesos
  }));
});
}

      /* this.porcentajeCrecimiento = [];
      for (let i = 1; i < data.length; i++) {
        const actual = data[i];
        const anterior = data[i - 1];
        const porcentaje = anterior.total > 0
          ? ((actual.total - anterior.total) / anterior.total) * 100
          : null;

        if (porcentaje !== null) {
          this.porcentajeCrecimiento.push({
          name: actual._id,
          value: Number(porcentaje.toFixed(2))
    }); 
  }

      }
      console.log('Porcentaje de crecimiento:', this.porcentajeCrecimiento);
*/
    });
  }

  ngAfterViewInit() {
    // En caso de que ngOnInit no lo haya asignado a tiempo
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

filtrarIngresosUsuario() {
  if (this.usuarioSeleccionado && this.mesSeleccionado) {
    this.apiService.getIngresosPorUsuarioYMES(this.usuarioSeleccionado, this.mesSeleccionado).subscribe(data => {
      this.ingresosPorUsuario = data.map(d => ({
        name: d._id,
        value: d.total
      }));
    });
  }
}


  exportarPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    pdf.setFontSize(16);
    pdf.text('Estadísticas de Ingreso al Sistema', 105, 15, { align: 'center' });

    pdf.setFontSize(11);
    pdf.text('Reporte mensual y por usuario del sistema Orígenes', 105, 22, { align: 'center' });

    autoTable(pdf, {
      startY: 30,
      head: [['Usuario', 'Nombre', 'Total Ingresos']],
      body: this.dataSource.data.map((row: any) => [
        row._id,
        row.nombre_usuario,
        row.total
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        halign: 'center'
      },
      bodyStyles: {
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      theme: 'striped',
      margin: { top: 10 }
    });

    pdf.save('estadisticas_ingresos.pdf');
  }
}

