import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expediente, ExpedienteDraft } from '../domain/models/expediente.model';
import { ExpedienteRepository } from '../domain/repositories/expediente.repository';

@Injectable()
export class CrearExpedienteUseCase {
  private readonly repository = inject(ExpedienteRepository);

  execute(draft: ExpedienteDraft): Observable<Expediente> {
    return this.repository.crear({
      ...draft,
      numero: draft.numero.trim(),
      descripcion: draft.descripcion.trim(),
    });
  }
}
