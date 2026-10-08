/** Contratos del backend (ExpedienteRequest / ExpedienteResponse / PageResponse). */
export interface ExpedienteRequestDto {
  numero: string;
  fecha: string;
  descripcion: string;
}

export interface ExpedienteResponseDto {
  id: number;
  numero: string;
  fecha: string;
  descripcion: string;
  fechaCarga: string;
}

export interface PageResponseDto<T> {
  content: T[];
  page: number;
  size: number;
  totalElement: number;
  totalPage: number;
}
