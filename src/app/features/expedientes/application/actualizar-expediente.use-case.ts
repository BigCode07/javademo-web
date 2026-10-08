import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expediente, ExpedienteDraft } from '../domain/models/expediente.model';
import { ExpedienteRepository } from '../domain/repositories/expediente.repository';

@Injectable()
export class ActualizarExpedienteUseCase {
  private readonly repository = inject(ExpedienteRepository);

  execute(id: number, draft: ExpedienteDraft): Observable<Expediente> {
    return this.repository.actualizar(id, {
      ...draft,
      numero: draft.numero.trim(),
      descripcion: draft.descripcion.trim(),
    });
  }
}
