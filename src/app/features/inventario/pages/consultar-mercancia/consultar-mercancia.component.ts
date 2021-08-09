import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IMercancia } from '@core/interfaces/mercancia';
import { IUsuario } from '@core/interfaces/usuario';
import { MercanciaService } from '@core/services/mercancia.service';
import { SessionService } from '@core/services/session.service';
import { UsuarioService } from '@core/services/usuario.service';
import { Subject } from 'rxjs';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { IAlertData } from '@core/interfaces/alert-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultar-mercancia',
  templateUrl: './consultar-mercancia.component.html',
  styleUrls: ['./consultar-mercancia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultarMercanciaComponent implements OnInit, OnDestroy {
  public listaUsuarios: IUsuario[];
  public listaMercancia: IMercancia[];
  public consultaForm: FormGroup;
  public loading: boolean;

  @ViewChild('selfClosingAlert', { static: false })
  public selfClosingAlert: NgbAlert;
  public alerts$: Subject<IAlertData>;
  public alertData: IAlertData;

  public currentUser: IUsuario;

  private destroy$: Subject<boolean>;

  constructor(
    private usarioService: UsuarioService,
    private mercanciaService: MercanciaService,
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.alerts$ = new Subject<IAlertData>();
    this.loading = false;
    this.listaUsuarios = [];
    this.alertData = null;
    this.destroy$ = new Subject<boolean>();
    this.currentUser = this.sessionService.getCurrentUser();
    this.consultaForm = this.formBuilder.group({
      usuario: [this.currentUser.idUsuario],
      nombreProducto: [''],
      fechaIngreso: [null],
    });
  }

  get usuarioFormControl() {
    return this.consultaForm.controls.usuario;
  }

  get nombreProductoFormControl() {
    return this.consultaForm.controls.nombreProducto;
  }

  get fechaIngresoFormControl() {
    return this.consultaForm.controls.fechaIngreso;
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

    this.usarioService
      .findAll()
      .pipe(finalize(() => this.changeDetectorRef.detectChanges()))
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.exitoso && response.data) {
          this.listaUsuarios = response.data;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  trackByFnUsuario: TrackByFunction<IUsuario> = (
    _index: number,
    usuario: IUsuario
  ) => usuario.idUsuario;

  consultar() {
    if (
      (this.usuarioFormControl.value && this.usuarioFormControl.value > 0) ||
      this.nombreProductoFormControl.value ||
      this.fechaIngresoFormControl.value
    ) {
      this.listaMercancia = [];
      this.loading = true;
      this.alertData = null;
      this.consultaForm.disable();
      this.changeDetectorRef.detectChanges();

      this.mercanciaService
        .findByMultipleCriteria(
          this.usuarioFormControl.value,
          this.nombreProductoFormControl.value,
          this.fechaIngresoFormControl.value
            ? new Date(
                this.fechaIngresoFormControl.value.year,
                this.fechaIngresoFormControl.value.month,
                this.fechaIngresoFormControl.value.day
              )
            : null
        )
        .pipe(
          finalize(() => {
            this.loading = false;
            this.consultaForm.enable();
            this.changeDetectorRef.detectChanges();
          })
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            if (response.exitoso) {
              if (response.data && response.data.length) {
                this.listaMercancia = response.data;
              } else {
                this.alerts$.next({
                  type: 'info',
                  message:
                    'No se econtraron registros de mercacías con los filtros seleccionados.',
                });
              }
            } else {
              this.alerts$.next({
                type: 'danger',
                message:
                  'Ha ocurrido un error durante la consulta, inténtelo de nuevo más tarde.',
              });
            }
          },
          (error) => {
            this.alerts$.next({
              type: 'danger',
              message:
                'Ha ocurrido un error durante la consulta, inténtelo de nuevo más tarde.',
            });
            console.error(error);
          }
        );
    }
  }

  editar(idMercancia: number) {
    this.router.navigate(['/inventario/editar-mercancia', idMercancia]);
  }
}
