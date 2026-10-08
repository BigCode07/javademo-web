import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expediente } from '../domain/models/expediente.model';
import { ExpedienteRepository } from '../domain/repositories/expediente.repository';

@Injectable()
export class ObtenerExpedienteUseCase {
  private readonly repository = inject(ExpedienteRepository);

  execute(id: number): Observable<Expediente> {
    return this.repository.obtener(id);
  }
}
