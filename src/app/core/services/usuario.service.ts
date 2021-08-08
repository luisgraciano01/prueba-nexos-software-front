import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IHttpResponse } from '@core/interfaces/http-response';
import { IUsuario } from '@core/interfaces/usuario';
import { AppConfigService } from '@core/services/app-config.service';

/**
 * Clase Service que contiene los métodos que construyen los observables
 * para las peticiones relacionados con `usuario`.
 *
 * Create at 08/08/2021 13:06:37
 * @author Luis Alberto Graciano Padierna <luisgraciano721@gmail.com>
 */
@Injectable()
export class UsuarioService {
  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) {}

  /**
   * Construye un observable que hace la petición al endpoint `/usuario/findAll`
   * que obtiene la lista de usuarios registrados en la base de datos.
   *
   * @returns Obsevable con la petición lista para ser cosumida.
   */
  findAll() {
    return this.httpClient.get<IHttpResponse<IUsuario[]>>(
      this.appConfigService.endpoints.usuario.findAll
    );
  }
}
