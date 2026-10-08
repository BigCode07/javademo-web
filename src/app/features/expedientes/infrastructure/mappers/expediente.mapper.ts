import { Expediente, ExpedienteDraft } from '../../domain/models/expediente.model';
import { Page } from '../../domain/models/page.model';
import { ExpedienteRequestDto, ExpedienteResponseDto, PageResponseDto } from '../dtos/expediente.dto';

export const toExpediente = (dto: ExpedienteResponseDto): Expediente => ({
  id: dto.id,
  numero: dto.numero,
  fecha: dto.fecha,
  descripcion: dto.descripcion,
  fechaCarga: new Date(dto.fechaCarga),
});

export const toRequestDto = (draft: ExpedienteDraft): ExpedienteRequestDto => ({
  numero: draft.numero,
  fecha: draft.fecha,
  descripcion: draft.descripcion,
});

export const toPage = (dto: PageResponseDto<ExpedienteResponseDto>): Page<Expediente> => ({
  content: dto.content.map(toExpediente),
  page: dto.page,
  size: dto.size,
  totalElements: dto.totalElement,
  totalPages: dto.totalPage,
});
