import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, finalize, switchMap } from 'rxjs';
import { ApiError } from '../../../../../core/http/api-error';
import { EliminarExpedienteUseCase } from '../../../application/eliminar-expediente.use-case';
import { ListarExpedientesUseCase } from '../../../application/listar-expedientes.use-case';
import { Expediente } from '../../../domain/models/expediente.model';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-expediente-list',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expediente-list.html',
  styleUrl: './expediente-list.css',
})
export class ExpedienteList implements OnInit {
  private readonly listarUseCase = inject(ListarExpedientesUseCase);
  private readonly eliminarUseCase = inject(EliminarExpedienteUseCase);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly columns = ['numero', 'fecha', 'descripcion', 'fechaCarga', 'acciones'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  protected readonly expedientes = signal<readonly Expediente[]>([]);
  protected readonly total = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly loading = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.cargar();
  }

  protected eliminar(expediente: Expediente): void {
    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Eliminar expediente',
          message: `¿Eliminar el expediente ${expediente.numero}? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.eliminarUseCase.execute(expediente.id)),
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Expediente eliminado', 'Cerrar', { duration: 3000 });
          // Si se borró el último de la página, retroceder una.
          if (this.expedientes().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((i) => i - 1);
          }
          this.cargar();
        },
        error: (err: ApiError) => this.snackBar.open(err.message, 'Cerrar', { duration: 5000 }),
      });
  }

  private cargar(): void {
    this.loading.set(true);
    this.listarUseCase
      .execute(this.pageIndex(), this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (page) => {
          this.expedientes.set(page.content);
          this.total.set(page.totalElements);
        },
        error: (err: ApiError) => this.snackBar.open(err.message, 'Cerrar', { duration: 5000 }),
      });
  }
}
