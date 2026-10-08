import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { ApiError } from '../../../../../core/http/api-error';
import { ActualizarExpedienteUseCase } from '../../../application/actualizar-expediente.use-case';
import { CrearExpedienteUseCase } from '../../../application/crear-expediente.use-case';
import { ObtenerExpedienteUseCase } from '../../../application/obtener-expediente.use-case';
import { ExpedienteDraft } from '../../../domain/models/expediente.model';

@Component({
  selector: 'app-expediente-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expediente-form.html',
  styleUrl: './expediente-form.css',
})
export class ExpedienteForm implements OnInit {
  /** Param de ruta `:id` (withComponentInputBinding). Ausente en modo creación. */
  readonly id = input<string>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly crearUseCase = inject(CrearExpedienteUseCase);
  private readonly actualizarUseCase = inject(ActualizarExpedienteUseCase);
  private readonly obtenerUseCase = inject(ObtenerExpedienteUseCase);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly esEdicion = computed(() => this.id() !== undefined);

  // Mismas reglas que ExpedienteRequest del backend.
  protected readonly form = this.fb.group({
    numero: ['', [Validators.required, Validators.maxLength(50)]],
    fecha: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    const id = this.id();
    if (id === undefined) return;

    this.loading.set(true);
    this.obtenerUseCase
      .execute(Number(id))
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (e) => this.form.setValue({ numero: e.numero, fecha: e.fecha, descripcion: e.descripcion }),
        error: (err: ApiError) => {
          this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
          this.router.navigate(['/expedientes']);
        },
      });
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const draft: ExpedienteDraft = this.form.getRawValue();
    const id = this.id();
    const request$ =
      id === undefined ? this.crearUseCase.execute(draft) : this.actualizarUseCase.execute(Number(id), draft);

    this.saving.set(true);
    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.snackBar.open(id === undefined ? 'Expediente creado' : 'Expediente actualizado', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/expedientes']);
      },
      error: (err: ApiError) => this.mostrarError(err),
    });
  }

  private mostrarError(err: ApiError): void {
    if (err.status === 409) {
      this.form.controls.numero.setErrors({ server: err.message });
      this.form.controls.numero.markAsTouched();
      return;
    }
    if (err.status === 400) {
      for (const [campo, mensaje] of Object.entries(err.fieldErrors)) {
        const control = this.form.get(campo);
        control?.setErrors({ server: mensaje });
        control?.markAsTouched();
      }
    }
    this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
  }
}
