import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-ficha-objetos',
  templateUrl: './ficha-objetos.component.html',
  styleUrls: ['./ficha-objetos.component.css']
})

export class FichaObjetosComponent {

    // === OPCIONES DE SELECTS (debe ir DENTRO de la clase) ===
  readonly OPT_TIPO_CONTEXTO = [
    { value: 'Terrestre', label: 'Terrestre' },
    { value: 'Subacuático', label: 'Subacuático' }
  ];

    readonly OPT_TIPO_COLECCION = [
    { value: 'Arqueológico', label: 'Arqueológico' },
    { value: 'Histórico', label: 'Histórico' }
  ];

   readonly OPT_TIPO_INGRESO = [
    { value: 'Entrada', label: 'Entrada' },
    { value: 'Compra', label: 'Compra' },
    { value: 'Donación', label: 'Donación' },
    { value: 'Entrega', label: 'Entrega' },
    { value: 'Decomiso', label: 'Decomiso' }
  ];

  // ===== Opciones de Tipo de materia =====
readonly OPT_MATERIA: Record<string, string[]> = {
  'Orgánico': [
    'Flora (madera, semillas, fibras, polen, carbón, papel)',
    'Fauna (restos óseos, malacológico, pieles, cabello)'
  ],
  'Inorgánico': [
    'Arcilla', 'Piedra', 'Mineral', 'Metal', 'Vidrio',
    'Sintético (negativos, diapositivas)'
  ],
  'Digital': [
    'Digital'
  ]
};

// ===== Localización (general) =====
// Catálogos base (puedes ampliar luego)
readonly OPT_MOBILIARIO = [
  'Estante', 'Planera', 'Archivo', 'Armario', 'Casillero', 'Malla', 'Sección'
];

readonly OPT_CONTENEDOR = [
  'Caja', 'Bulto', 'Bandeja', 'Gaveta'
];

readonly OPT_UNIDAD_MINIMA = [
  'Tubo de ensayo', 'Bolsa'
];

readonly OPT_PROC_REGION_CULTURAL = {
  "Región Gran Nicoya": [],
  
  "Región Central": [
    "Subregión Llanuras del Norte",
    "Subregión Caribe Central",
    "Subregión Pacífico Central"
  ],
  
  "Región Gran Chiriquí": [
    "Subregión Caribe Sur",
    "Subregión Diquís"
  ]
};


  form!: FormGroup;

  tesauro: any;                 // el JSON cargado
artefactos: string[] = [];
categorias: string[] = [];
materiales: string[] = [];
subMateriales: string[] = [];
procRegiones: string[] = [];
procSubregiones: string[] = [];
// ===== División geográfica (Provincia / Cantón / Distrito) =====
provincias: any[] = [];
cantones: any[] = [];
distritos: any[] = [];



// ===== Tesauro CLASIFICACIÓN BIENES ARQUEOLÓGICOS =====
clasifTesauro: any = null;          // JSON completo
clasifRegiones: string[] = [];      // p.ej. "Gran Nicoya", "Región Central" (si lo manejas así)
clasifSubregiones: string[] = [];   // p.ej. "Bagaces", "Orosi", "Barva"
clasifComplejos: string[] = [];     // p.ej. "Cangel Negro sobre Rojo", etc.



  constructor(private http: HttpClient,private fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnInit() {
  

  this.http.get<any>('assets/tesauro_tipo_objeto.json')
    .subscribe(t => {
      this.tesauro = t;
      this.artefactos = Object.keys(t).sort();
    });

  // Cuando cambia el artefacto…
  this.form.get('artefacto')!.valueChanges.subscribe(art => {
    const entry = this.tesauro?.[art];

    this.categorias = entry ? entry.categorias || [] : [];
    this.materiales = entry ? Object.keys(entry.materiales || {}).sort() : [];
    this.subMateriales = [];

    this.form.patchValue({
      categoria: null,
      material: null,
      material_subtipo: null
    }, { emitEvent: false });
  });

  // Cuando cambia el material…
  this.form.get('material')!.valueChanges.subscribe(mat => {
    const art = this.form.get('artefacto')!.value;
    const entry = this.tesauro?.[art];

    this.subMateriales = entry?.materiales?.[mat] || [];
    this.form.patchValue({ material_subtipo: null }, { emitEvent: false });
  });
  // ─────────────────────────────────────────────
  // 2) TESAURO CLASIFICACIÓN BIENES ARQUEOLÓGICOS
  // ─────────────────────────────────────────────
  this.http.get<any>('assets/tesauro_bienes_arqueologicos.json')
    .subscribe(t => {
      this.clasifTesauro  = t;
      this.clasifRegiones = Object.keys(t).sort();
    });

  const regionCtrl    = this.form.get('clasif_region');
  const subregionCtrl = this.form.get('clasif_subregion');
  const complejoCtrl  = this.form.get('clasif_complejo');

  // Región → Subregiones
  regionCtrl?.valueChanges.subscribe(region => {
    const sub = this.clasifTesauro?.[region] || {};
    this.clasifSubregiones = Object.keys(sub).sort();
    this.clasifComplejos   = [];

    this.form.patchValue({
      clasif_subregion: null,
      clasif_complejo: null
    }, { emitEvent: false });

    this.syncClasificacionTexto();
  });

  // Subregión → Complejos
  subregionCtrl?.valueChanges.subscribe(subregion => {
    const region = regionCtrl?.value;
    const complejos = this.clasifTesauro?.[region]?.[subregion] || [];
    this.clasifComplejos = complejos;

    this.form.patchValue({ clasif_complejo: null }, { emitEvent: false });
    this.syncClasificacionTexto();
  });

  // Complejo → texto final
  complejoCtrl?.valueChanges.subscribe(() => {
    this.syncClasificacionTexto();
  });

  this.procRegiones = Object.keys(this.OPT_PROC_REGION_CULTURAL);
  const procRegionCtrl    = this.form.get('proc_region_cultural');
  const procSubregionCtrl = this.form.get('proc_subregion_cultural');

  // Región cultural → subregiones
  procRegionCtrl?.valueChanges.subscribe(region => {
    this.procSubregiones = this.OPT_PROC_REGION_CULTURAL[region] || [];

    // reset subregión cuando cambia región
    this.form.patchValue(
      { proc_subregion_cultural: null },
      { emitEvent: false }
    );

    this.syncProcedenciaRegionTexto();
  });

  // Subregión cultural → actualizar texto final
  procSubregionCtrl?.valueChanges.subscribe(() => {
    this.syncProcedenciaRegionTexto();
  });

  // 3) DIVISIÓN GEOGRÁFICA
  // ──────────────────────────────
  this.http.get<any[]>('assets/provincias.json')
    .subscribe(data => {
      this.provincias = data || [];
    });

  const provCtrl = this.form.get('div_provincia');
  const cantCtrl = this.form.get('div_canton');
  const distCtrl = this.form.get('div_distrito');

  // Provincia → cantones
  provCtrl?.valueChanges.subscribe(provNombre => {
    const prov = this.provincias.find(p => p.nombre === provNombre);
    // 👇 ajusta 'nombre' y 'cantones' según tu JSON
    this.cantones = prov?.cantones || [];
    this.distritos = [];

    this.form.patchValue(
      { div_canton: null, div_distrito: null },
      { emitEvent: false }
    );

    this.syncDivisionGeograficaTexto();
  });

  // Cantón → distritos
  cantCtrl?.valueChanges.subscribe(cantonNombre => {
    const provNombre = provCtrl?.value;
    const prov = this.provincias.find(p => p.nombre === provNombre);
    const canton = prov?.cantones?.find((c: any) => c.nombre === cantonNombre);
    // 👇 ajusta 'nombre' y 'distritos' según tu JSON
    this.distritos = canton?.distritos || [];

    this.form.patchValue(
      { div_distrito: null },
      { emitEvent: false }
    );

    this.syncDivisionGeograficaTexto();
  });

  // Distrito → actualizar texto final
  distCtrl?.valueChanges.subscribe(() => {
    this.syncDivisionGeograficaTexto();
  });


}

  /** Si quieres derivar clave_norm desde clave_monumento */
  private normalizeClave = (s?: string|null) =>
    (s ?? '').toString().trim().toUpperCase().replace(/[\s-]+/g,'');

  // util para 2 dígitos
private pad2 = (n: number) => (n < 10 ? '0' + n : '' + n);

// convierte Date -> yyyymmdd (number)
private dateToYyyymmddNum(d: Date): number {
  const y = d.getFullYear();
  const m = this.pad2(d.getMonth() + 1);
  const day = this.pad2(d.getDate());
  return Number(`${y}${m}${day}`);
}

// si editas un registro existente: yyyymmdd -> Date
private yyyymmddNumToDate(n?: number|null): Date | null {
  if (!n) return null;
  const s = String(n);
  if (s.length !== 8) return null;
  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(4, 6)) - 1;
  const d = Number(s.slice(6, 8));
  const dt = new Date(y, m, d);
  return isNaN(dt.getTime()) ? null : dt;
}

  /** FormGroup con todos los campos */
  private buildForm(): FormGroup {
    return this.fb.group({
      // ===== Cabecera (Datos Generales superiores)
      nombre_objeto: [''],
      numero_registro_de_artefacto: [''],  // “Número Registro Artefacto”
      clave_monumento: [''],
      nombre_monumento: [''],
      clave_norm: [''],                        // vínculo con monumentos

      // ===== Identificador del Bien
       tipo_contexto: [null, Validators.required],
       fecha_de_ingreso_date: [null],          // Date, para el datepicker
      fecha_de_ingreso_ano_mes_dia: [null],   // number (yyyymmdd)
      tipo_coleccion: [null, Validators.required],
      materia_grupo:   [null],  // Orgánico / Inorgánico / Digital
      materia_subtipo: [null],  // según el grupo
      tipo_materia: [''],
      numero_anterior_artefacto: [''],
      tipo_ingreso: [null, Validators.required],
       deposito: [null],            // texto libre (nombre/identificador del depósito)
    mobiliario: [null],          // select
    ubicacion_codigo: [null],    // ej. A-1-18-I-Y
    contenedor: [null],          // select (habilitado al elegir mobiliario)
    unidad_minima: [null],       // select (habilitado al elegir contenedor)
    localizacion_general: [null], // texto combinado que irá al backend
      // ===== Caracterización del Bien
      nombre_artefacto: [null],
  categoria: [null],
  material: [null],
  material_subtipo: [null],
      descripcion_del_artefacto: [''],
      // Medidas detalladas (cm / g)
medida_largo_cm:         [null],
medida_fondo_cm:         [null],
medida_grosor_cm:        [null],
medida_ancho_cm:         [null],
medida_alto_cm:          [null],
medida_diametro_cm:      [null],
medida_circunferencia_cm:[null],
peso_gramos:             [null],

clasif_region: [null],
clasif_subregion: [null],
clasif_complejo: [null],


      clasificacion_bienes_arqueologicos: [''],
      clasificacion_bienes_historicos: [''],
      proc_region_cultural:   [null],  // combo región
    proc_subregion_cultural:[null],  // combo subregión
      procedencia_por_region_cultural: [''],
       // 🔹 División geográfica (nuevos campos)
    div_provincia: [null],
    div_canton:    [null],
    div_distrito:  [null],
      division_geografica: [''],
      temporalidad_arqueologica: [''],
      temporalidad_historica: [''],

      // ===== Información Contextual
      organizacion_trabajo_campo: [''],
      unidad_de_recoleccion: [''],
      unidad_arquitectonica: [''],
      nivel: [null],                           // number
      profundidad: [null],                     // number
      nombre_proyecto: [''],
      nombre_investigador: [''],
      ano_de_recuperacion: [null],             // number
      documentos_asociados_al_bien: [''],      // si luego usas DocRef[], cambia a this.fb.array([])
      observaciones: [''],

      // ===== Estado del Bien
      estado_de_conservacion: [''],
      intervencion: [''],
      diagnostico_del_estado_del_bien: [''],
      enviar_a_conservacion: [''],

      // ===== Movimiento del Bien
      prestamo: [''],
      observaciones_movimiento: [''],
      // Si quieres un campo propio: observaciones_movimiento: [''],

      // ===== Registro y Verificación
      nombre_registrador: [''],
      fecha_registro: [null],                  // number
      nombre_digitador: [''],
      fecha_digitacion: [null],                // number
      nombre_del_verificador: [''],
      fecha_de_verificacion: [null],           // number
      resultado_de_la_verificacion: [''],
      observaciones_de_las_verificacion: [''],
      nombre_del_curador: [''],
      fecha_curatorial: [null],                // number
      fotografia: ['']                         // si luego usas múltiples files => this.fb.control<File[] | null>(null)
    });
  }

  /** Mapa de secciones para iterar en el template */
  secciones = {
    identificadorBien: [
      'clave_monumento','tipo_contexto','fecha_de_ingreso_ano_mes_dia',
      'tipo_coleccion','tipo_materia','numero_anterior_artefacto'
    ],
    caracterizacionBien: [
      'artefacto','categoria','material','material_subtipo',
  'descripcion_del_artefacto',
  'medida_largo_cm','medida_fondo_cm','medida_grosor_cm',
  'medida_ancho_cm','medida_alto_cm',
  'medida_diametro_cm','medida_circunferencia_cm',
  'peso_gramos',
      'clasificacion_bienes_arqueologicos','clasificacion_bienes_historicos',
      'procedencia_por_region_cultural','division_geografica',
      'temporalidad_arqueologica','temporalidad_historica'
    ],
    informacionContextual: [
      'organizacion_trabajo_campo','unidad_de_recoleccion','unidad_arquitectonica',
      'nivel','profundidad','nombre_proyecto','nombre_investigador',
      'ano_de_recuperacion','documentos_asociados_al_bien','observaciones'
    ],
    estadoBien: [
      'estado_de_conservacion','intervencion',
      'diagnostico_del_estado_del_bien','enviar_a_conservacion'
    ],
    movimientoBien: [
      'prestamo','observaciones' // o 'observaciones_movimiento' si lo separas
    ],
    registroVerificacion: [
      'nombre_registrador','fecha_registro','nombre_digitador','fecha_digitacion',
      'nombre_del_verificador','fecha_de_verificacion','resultado_de_la_verificacion',
      'observaciones_de_las_verificacion','nombre_del_curador','fecha_curatorial',
      'fotografia'
    ]
  };

  /** Forzar/derivar clave_norm cuando cambie la clave */
  onClaveMonumentoChange(val: string) {
    const norm = this.normalizeClave(val);
    this.form.patchValue({ clave_norm: norm }, { emitEvent: false });
  }

/** Normaliza el payload (vacíos -> null) antes de enviar */
getCleanPayload() {
  const raw = this.form.value;
  const out: any = {};

  // 1️⃣ Normalizar vacíos
  for (const [k, v] of Object.entries(raw)) {
    out[k] = (v === '' || v === undefined) ? null : v;
  }

  // 2️⃣ Completar tipo_materia si viene separado en grupo/subtipo
  if (!out.tipo_materia && out.materia_grupo && out.materia_subtipo) {
    // ejemplo: "Orgánico - Flora (madera, semillas, fibras...)"
    out.tipo_materia = `${out.materia_grupo} - ${out.materia_subtipo}`;
  }

  // 3️⃣ Por si no vino clave_norm
  if (!out.clave_norm && out.clave_monumento) {
    out.clave_norm = this.normalizeClave(out.clave_monumento);
  }

  return out;
}

  // sincroniza al elegir fecha
syncFechaIngresoNumber(d: Date | null) {
  const num = d ? this.dateToYyyymmddNum(d) : null;
  this.form.patchValue({ fecha_de_ingreso_ano_mes_dia: num }, { emitEvent: false });
}

// Getter para poblar subtipos según grupo elegido
get materiaSubtipos(): string[] {
  const grupo = this.form.get('materia_grupo')?.value as string;
  return this.OPT_MATERIA[grupo] ?? [];
}

// Helpers para armar el texto combinado y el preview
private joinClean(parts: (string | null | undefined)[], sep = ' | '): string {
  return parts.filter(Boolean).join(sep);
}

updateLocalizacionGeneral() {
  const f = this.form.value;
  // Texto compacto para guardar (compatible con tu campo actual)
  const compacto = this.joinClean([
    f.deposito ? `Depósito: ${f.deposito}` : null,
    f.mobiliario ? `Mobiliario: ${f.mobiliario}${f.ubicacion_codigo ? ` (${f.ubicacion_codigo})` : ''}` : null,
    f.contenedor ? `Contenedor: ${f.contenedor}` : null,
    f.unidad_minima ? `Unidad mínima: ${f.unidad_minima}` : null
  ]);

  this.form.patchValue({ localizacion_general: compacto }, { emitEvent: false });
}

/** Construye el texto final de clasificación arqueológica */
private syncClasificacionTexto() {

  const region    = this.form.get('clasif_region')?.value || null;
  const subregion = this.form.get('clasif_subregion')?.value || null;
  const complejo  = this.form.get('clasif_complejo')?.value || null;

  // Armamos el texto limpio
  const texto = [region, subregion, complejo]
    .filter(v => v && v !== '')  // elimina nulls y vacíos
    .join(' | ');                // separador visual

  // Lo guardamos en un campo oculto del form
  this.form.patchValue({
    clasificacion_bienes_arqueologicos: texto || null
  }, { emitEvent: false });
}

/** Construye el texto final de procedencia por región cultural */
private syncProcedenciaRegionTexto() {
  const region    = this.form.get('proc_region_cultural')?.value || null;
  const subregion = this.form.get('proc_subregion_cultural')?.value || null;

  const texto = [region, subregion]
    .filter(v => v && v !== '')
    .join(' | ');   // ej. "Región Central | Subregión Caribe Central"

  this.form.patchValue(
    { procedencia_por_region_cultural: texto || null },
    { emitEvent: false }
  );
}

private syncDivisionGeograficaTexto() {
  const prov = this.form.get('div_provincia')?.value || null;
  const cant = this.form.get('div_canton')?.value || null;
  const dist = this.form.get('div_distrito')?.value || null;

  const texto = [prov, cant, dist]
    .filter(v => v && v !== '')
    .join(' | ');

  this.form.patchValue(
    { division_geografica: texto || null },
    { emitEvent: false }
  );
}


  onGuardar() {
    this.updateLocalizacionGeneral(); // asegura el combinado
    const payload = this.getCleanPayload();
    // this.http.post('/apio/crear', payload).subscribe(...)
  }
}