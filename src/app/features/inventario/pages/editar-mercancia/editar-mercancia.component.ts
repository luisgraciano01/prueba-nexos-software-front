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
import { ActivatedRoute, Router } from '@angular/router';
import { IAlertData } from '@core/interfaces/alert-data';
import { IMercancia } from '@core/interfaces/mercancia';
import { IUsuario } from '@core/interfaces/usuario';
import { MercanciaService } from '@core/services/mercancia.service';
import { SessionService } from '@core/services/session.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { debounceTime, finalize, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-editar-mercancia',
  templateUrl: './editar-mercancia.component.html',
  styleUrls: ['./editar-mercancia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditarMercanciaComponent implements OnInit, OnDestroy {
  public editarMercanciaForm: FormGroup;
  public loading: boolean;

  @ViewChild('selfClosingAlert', { static: false })
  public selfClosingAlert: NgbAlert;
  public alerts$: Subject<IAlertData>;
  public alertData: IAlertData;

  public currentMercancia: IMercancia;
  public currentUser: IUsuario;
  public currentDate: Date;

  private destroy$: Subject<boolean>;
  constructor(
    private mercanciaService: MercanciaService,
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.alerts$ = new Subject<IAlertData>();
    this.loading = false;
    this.alertData = null;
    this.currentMercancia = null;
    this.currentDate = new Date();
    this.destroy$ = new Subject<boolean>();
    this.currentUser = this.sessionService.getCurrentUser();
    this.editarMercanciaForm = this.formBuilder.group({
      nombreProducto: [null, [this.validatorEmpty, Validators.maxLength(100)]],
      cantidad: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10000000)],
      ],
      fechaIngreso: [null, Validators.required],
    });
  }

  get nombreProductoFormControl(): AbstractControl {
    return this.editarMercanciaForm.controls.nombreProducto;
  }

  get cantidadFormControl(): AbstractControl {
    return this.editarMercanciaForm.controls.cantidad;
  }

  get fechaIngresoFormControl(): AbstractControl {
    return this.editarMercanciaForm.controls.fechaIngreso;
  }

  validatorEmpty(control: AbstractControl): ValidationErrors {
    if (control.value && control.value.trim()) {
      return null;
    }

    return { required: true };
  }

  createValidatorNombreProducto(
    mercanciaService: MercanciaService,
    nombreProductoActual: string
  ): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<ValidationErrors> | Promise<ValidationErrors> => {
      if (
        control.value &&
        control.value.trim() &&
        nombreProductoActual != control.value.trim()
      ) {
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
    this.editarMercanciaForm.disable();
    this.loading = true;

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params.idMercancia && !isNaN(params.idMercancia)) {
          this.mercanciaService
            .findById(params.idMercancia)
            .pipe(
              finalize(() => {
                this.loading = false;
                this.editarMercanciaForm.enable();
                this.changeDetectorRef.detectChanges();
              })
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (response) => {
                if (response.exitoso) {
                  if (response.data) {
                    this.currentMercancia = response.data;
                    this.nombreProductoFormControl.setValue(
                      response.data.nombreProducto
                    );
                    this.nombreProductoFormControl.addAsyncValidators(
                      this.createValidatorNombreProducto(
                        this.mercanciaService,
                        response.data.nombreProducto
                      )
                    );

                    this.cantidadFormControl.setValue(response.data.cantidad);

                    const fechaIngreso = new Date(response.data.fechaIngreso);
                    this.fechaIngresoFormControl.setValue({
                      year: fechaIngreso.getFullYear(),
                      month: fechaIngreso.getMonth(),
                      day: fechaIngreso.getDate(),
                    });
                  } else {
                    this.router.navigate(['/inventario/consultar-mercancia']);
                  }
                } else {
                  this.alerts$.next({
                    type: 'danger',
                    message:
                      'Ha ocurrido un error durante la consulta de la mercancía, inténtelo de nuevo más tarde.',
                  });
                }
              },
              (error) => {
                this.alerts$.next({
                  type: 'danger',
                  message:
                    'Ha ocurrido un error durante la consulta de la mercancía, inténtelo de nuevo más tarde.',
                });
                console.error(error);
              }
            );
        } else {
          this.router.navigate(['/inventario/consultar-mercancia']);
        }
      });

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

  actualizar() {
    if (this.editarMercanciaForm.valid) {
      this.loading = true;
      this.editarMercanciaForm.disable();
      this.changeDetectorRef.detectChanges();

      this.mercanciaService
        .update({
          cantidad: this.cantidadFormControl.value as number,
          fechaIngreso: new Date(
            this.fechaIngresoFormControl.value.year,
            this.fechaIngresoFormControl.value.month,
            this.fechaIngresoFormControl.value.day
          ),
          idMercancia: this.currentMercancia.idMercancia,
          idUsuarioActualiza: this.sessionService.getCurrentUser().idUsuario,
          nombreProducto: this.nombreProductoFormControl.value as string,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            if (response.exitoso) {
              if (response.data && response.data == true) {
                this.alerts$.next({
                  type: 'info',
                  message: 'Se ha actualizado con éxito la mercancía.',
                });

                setTimeout(() => {
                  this.router.navigate(['/inventario/consultar-mercancia']);
                }, 2000);
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
                  'Ha ocurrido un error durante la actualización, inténtelo de nuevo más tarde.',
              });
            }
          },
          (error) => {
            this.alerts$.next({
              type: 'danger',
              message:
                'Ha ocurrido un error durante la actualización, inténtelo de nuevo más tarde.',
            });
            console.error(error);
          }
        );
    }
  }
}
