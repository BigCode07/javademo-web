import { Routes } from '@angular/router';
import { ActualizarExpedienteUseCase } from './application/actualizar-expediente.use-case';
import { CrearExpedienteUseCase } from './application/crear-expediente.use-case';
import { EliminarExpedienteUseCase } from './application/eliminar-expediente.use-case';
import { ListarExpedientesUseCase } from './application/listar-expedientes.use-case';
import { ObtenerExpedienteUseCase } from './application/obtener-expediente.use-case';
import { ExpedienteRepository } from './domain/repositories/expediente.repository';
import { HttpExpedienteRepository } from './infrastructure/http-expediente.repository';

/**
 * Composition root de la feature: aquí se enlaza el puerto con su adaptador
 * y se proveen los casos de uso. Solo existen mientras la feature está cargada.
 */
export const EXPEDIENTES_ROUTES: Routes = [
  {
    path: '',
    providers: [
      { provide: ExpedienteRepository, useClass: HttpExpedienteRepository },
      ListarExpedientesUseCase,
      ObtenerExpedienteUseCase,
      CrearExpedienteUseCase,
      ActualizarExpedienteUseCase,
      EliminarExpedienteUseCase,
    ],
    children: [
      {
        path: '',
        title: 'Expedientes',
        loadComponent: () =>
          import('./presentation/pages/expediente-list/expediente-list').then((m) => m.ExpedienteList),
      },
      {
        path: 'nuevo',
        title: 'Nuevo expediente',
        loadComponent: () =>
          import('./presentation/pages/expediente-form/expediente-form').then((m) => m.ExpedienteForm),
      },
      {
        path: ':id/editar',
        title: 'Editar expediente',
        loadComponent: () =>
          import('./presentation/pages/expediente-form/expediente-form').then((m) => m.ExpedienteForm),
      },
    ],
  },
];
