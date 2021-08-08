import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUsuario } from '@core/interfaces/usuario';
import { BehaviorSubject } from 'rxjs';

/**
 * Clase Service que gestiona la información de la sesión del usuario.
 *
 * Create at 08/08/2021 13:06:37
 * @author Luis Alberto Graciano Padierna <luisgraciano721@gmail.com>
 */
@Injectable()
export class SessionService {
  /**
   * Subject en el que almacena el usuario de la sesión,
   * si no hay sesión tendrá valor `null`.
   */
  private usuario$: BehaviorSubject<IUsuario>;

  constructor(private router: Router) {
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.usuario$ = new BehaviorSubject<IUsuario>(usuario);
  }

  /**
   * Asigna el usuario actual en la sesión.
   * @param usuario Objeto con los datos del usuario
   */
  setUsuario(usuario: IUsuario) {
    this.usuario$.next(usuario);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  /**
   * @returns BehaviorSubject que guarda el usuario de la sesión.
   */
  getUsuario$(): BehaviorSubject<IUsuario> {
    return this.usuario$;
  }

  /**
   * @returns Objeto con los datos del usuario actual de la sesión.
   */
  getCurrentUser(): IUsuario {
    return this.usuario$.value;
  }

  /**
   * Cierra la sesión del usuario y lo redirecciona al login.
   */
  terminateSession(): void {
    this.usuario$.next(null);
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
