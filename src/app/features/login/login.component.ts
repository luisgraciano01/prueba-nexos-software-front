import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUsuario } from '@core/interfaces/usuario';
import { SessionService } from '@core/services/session.service';
import { UsuarioService } from '@core/services/usuario.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public listaUsuarios: IUsuario[];
  public loginForm: FormGroup;

  private destroy$: Subject<boolean>;

  constructor(
    private usarioService: UsuarioService,
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.listaUsuarios = [];
    this.destroy$ = new Subject<boolean>();
    this.loginForm = this.formBuilder.group({
      usuario: [null, [Validators.required]],
    });
  }

  get usuarioFormControl() {
    return this.loginForm.controls.usuario;
  }

  ngOnInit(): void {
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

  trackByFnUsuario: TrackByFunction<IUsuario> = (
    _index: number,
    usuario: IUsuario
  ) => usuario.idUsuario;

  login() {
    if (this.loginForm.valid) {
      this.sessionService.setUsuario(
        this.listaUsuarios.find(
          (usuario) => usuario.idUsuario == this.usuarioFormControl.value
        )
      );

      this.router.navigate(['/inventario']);
    }
  }
}
