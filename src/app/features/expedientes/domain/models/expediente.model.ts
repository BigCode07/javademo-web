export interface Expediente {
  readonly id: number;
  readonly numero: string;
  /** Formato ISO yyyy-MM-dd (LocalDate en el backend). */
  readonly fecha: string;
  readonly descripcion: string;
  readonly fechaCarga: Date;
}

export interface ExpedienteDraft {
  readonly numero: string;
  readonly fecha: string;
  readonly descripcion: string;
}
