import { Observable } from 'rxjs';
import { Expediente, ExpedienteDraft } from '../models/expediente.model';
import { Page } from '../models/page.model';

/** Puerto: la capa de aplicación depende de esta abstracción, no de HttpClient. */
export abstract class ExpedienteRepository {
  abstract listar(page: number, size: number): Observable<Page<Expediente>>;
  abstract obtener(id: number): Observable<Expediente>;
  abstract crear(draft: ExpedienteDraft): Observable<Expediente>;
  abstract actualizar(id: number, draft: ExpedienteDraft): Observable<Expediente>;
  abstract eliminar(id: number): Observable<void>;
}
