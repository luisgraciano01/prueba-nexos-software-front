import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { IAlertData } from '@core/interfaces/alert-data';
import { IUsuario } from '@core/interfaces/usuario';
import { MercanciaService } from '@core/services/mercancia.service';
import { SessionService } from '@core/services/session.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { debounceTime, finalize, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-mercancia',
  templateUrl: './registrar-mercancia.component.html',
  styleUrls: ['./registrar-mercancia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrarMercanciaComponent implements OnInit, OnDestroy {
  public registroMercanciaForm: FormGroup;
  public loading: boolean;

  @ViewChild('selfClosingAlert', { static: false })
  public selfClosingAlert: NgbAlert;
  public alerts$: Subject<IAlertData>;
  public alertData: IAlertData;

  public currentUser: IUsuario;
  public currentDate: Date;

  private destroy$: Subject<boolean>;
  constructor(
    private mercanciaService: MercanciaService,
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.alerts$ = new Subject<IAlertData>();
    this.loading = false;
    this.alertData = null;
    this.currentDate = new Date();
    this.destroy$ = new Subject<boolean>();
    this.currentUser = this.sessionService.getCurrentUser();
    this.registroMercanciaForm = this.formBuilder.group({
      nombreProducto: [
        null,
        [this.validatorEmpty, Validators.maxLength(100)],
        this.createValidatorNombreProducto(this.mercanciaService),
      ],
      cantidad: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10000000)],
      ],
      fechaIngreso: [null, Validators.required],
    });
  }

  get nombreProductoFormControl(): AbstractControl {
    return this.registroMercanciaForm.controls.nombreProducto;
  }

  get cantidadFormControl(): AbstractControl {
    return this.registroMercanciaForm.controls.cantidad;
  }

  get fechaIngresoFormControl(): AbstractControl {
    return this.registroMercanciaForm.controls.fechaIngreso;
  }

  validatorEmpty(control: AbstractControl): ValidationErrors {
    if (control.value && control.value.trim()) {
      return null;
    }

    return { required: true };
  }

  createValidatorNombreProducto(
    mercanciaService: MercanciaService
  ): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<ValidationErrors> | Promise<ValidationErrors> => {
      if (control.value && control.value.trim()) {
        return mercanciaService
          .checkIfExistsMercancia(control.value.trim())
          .pipe(
            map((response): ValidationErrors => {
              return response.exitoso && response.data == false
                ? null
                : { existsMercancia: true };
            })
          );
      }

      return new Promise<ValidationErrors>((resolve, _reject) => resolve(null));
    };
  }

  ngOnInit(): void {
    this.alerts$
      .pipe(takeUntil(this.destroy$))
      .subscribe((alertData) => (this.alertData = alertData));

    this.alerts$
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(5000))
      .subscribe(() => {
        if (this.selfClosingAlert) {
          this.selfClosingAlert.close();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  guardar() {
    if (this.registroMercanciaForm.valid) {
      this.loading = true;
      this.registroMercanciaForm.disable();
      this.changeDetectorRef.detectChanges();

      this.mercanciaService
        .save({
          cantidad: this.cantidadFormControl.value as number,
          fechaIngreso: new Date(
            this.fechaIngresoFormControl.value.year,
            this.fechaIngresoFormControl.value.month,
            this.fechaIngresoFormControl.value.day
          ),
          idUsuarioRegistra: this.sessionService.getCurrentUser().idUsuario,
          nombreProducto: this.nombreProductoFormControl.value as string,
        })
        .pipe(
          finalize(() => {
            this.loading = false;
            this.registroMercanciaForm.enable();
            this.changeDetectorRef.detectChanges();
          })
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            if (response.exitoso) {
              if (response.data && response.data == true) {
                this.alerts$.next({
                  type: 'info',
                  message: 'Se ha registrado con éxito la mercancía.',
                });

                this.registroMercanciaForm.reset();
                this.registroMercanciaForm.updateValueAndValidity();
              }
            } else if (response.mensaje == 'VALIDATION_ERROR') {
              this.alerts$.next({
                type: 'warning',
                message:
                  'Al menos un campo es inválido, verifica e inténtelo de nuevo.',
              });
            } else {
              this.alerts$.next({
                type: 'danger',
                message:
                  'Ha ocurrido un error durante el, inténtelo de nuevo más tarde.',
              });
            }
          },
          (error) => {
            this.alerts$.next({
              type: 'danger',
              message:
                'Ha ocurrido un error durante el registro, inténtelo de nuevo más tarde.',
            });
            console.error(error);
          }
        );
    }
  }
}
