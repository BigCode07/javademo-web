import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expediente } from '../domain/models/expediente.model';
import { Page } from '../domain/models/page.model';
import { ExpedienteRepository } from '../domain/repositories/expediente.repository';

@Injectable()
export class ListarExpedientesUseCase {
  private readonly repository = inject(ExpedienteRepository);

  execute(page: number, size: number): Observable<Page<Expediente>> {
    return this.repository.listar(page, size);
  }
}
