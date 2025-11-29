export class Objeto {
  constructor(
    public clave_monumento: string,
    public nombre_monumento: string,
    public tipo_contexto: string,
    public fecha_de_ingreso_ano_mes_dia: number,
    public tipo_coleccion: string,
    public tipo_materia: string,
    public numero_de_registro_de_artefacto: string,
    public numero_anterior_artefacto: string,
    public tipo_de_ingreso: string,
    public localizacion_general: string,
    public tipo_de_objeto: string,
    public descripcion_del_artefacto: string,
    public medidas_del_artefacto: number,
    public clasificacion_bienes_arqueologicos: string,
    public clasificacion_bienes_historicos: string,
    public procedencia_por_region_cultural: string,
    public division_geografica: string,
    public temporalidad_arqueologica: string,
    public temporalidad_historica: string,
    public organizacion_trabajo_campo: string,
    public unidad_de_recoleccion: string,
    public unidad_arquitectonica: string,
    public nivel: number,
    public profundidad: number,
    public nombre_proyecto: string,
    public nombre_investigador: string,
    public ano_de_recuperacion: number,
    public documentos_asociados_al_bien: any[], // DocRef[]
    public observaciones: string,               // (único campo; estaba duplicado en el listado)
    public estado_de_conservacion: string,
    public intervencion: string,
    public diagnostico_del_estado_del_bien: string,
    public enviar_a_conservacion: string,
    public prestamo: string,
    public nombre_registrador: string,
    public fecha_registro: number,
    public nombre_digitador: string,
    public fecha_digitacion: number,
    public nombre_del_verificador: string,
    public fecha_de_verificacion: number,
    public resultado_de_la_verificacion: string,
    public observaciones_de_las_verificacion: string, // corregido el typo "obsevaciones..."
    public nombre_del_curador: string,
    public fecha_curatorial: number,
    public fotografia: any[], // ImageRef[]

    // vínculo con monumentos
    public clave_norm?: string,

    // opcionales habituales
    public _id?: string
  ) {}
}