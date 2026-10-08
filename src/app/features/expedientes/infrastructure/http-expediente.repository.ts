import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Expediente, ExpedienteDraft } from '../domain/models/expediente.model';
import { Page } from '../domain/models/page.model';
import { ExpedienteRepository } from '../domain/repositories/expediente.repository';
import { ExpedienteResponseDto, PageResponseDto } from './dtos/expediente.dto';
import { toExpediente, toPage, toRequestDto } from './mappers/expediente.mapper';

@Injectable()
export class HttpExpedienteRepository extends ExpedienteRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/expedientes';

  listar(page: number, size: number): Observable<Page<Expediente>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http
      .get<PageResponseDto<ExpedienteResponseDto>>(this.baseUrl, { params })
      .pipe(map(toPage));
  }

  obtener(id: number): Observable<Expediente> {
    return this.http.get<ExpedienteResponseDto>(`${this.baseUrl}/${id}`).pipe(map(toExpediente));
  }

  crear(draft: ExpedienteDraft): Observable<Expediente> {
    return this.http
      .post<ExpedienteResponseDto>(this.baseUrl, toRequestDto(draft))
      .pipe(map(toExpediente));
  }

  actualizar(id: number, draft: ExpedienteDraft): Observable<Expediente> {
    return this.http
      .put<ExpedienteResponseDto>(`${this.baseUrl}/${id}`, toRequestDto(draft))
      .pipe(map(toExpediente));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
