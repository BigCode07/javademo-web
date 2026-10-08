import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpedienteRepository } from '../domain/repositories/expediente.repository';

@Injectable()
export class EliminarExpedienteUseCase {
  private readonly repository = inject(ExpedienteRepository);

  execute(id: number): Observable<void> {
    return this.repository.eliminar(id);
  }
}
