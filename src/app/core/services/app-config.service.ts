import { Injectable } from '@angular/core';
import { buildEnpoints, Endpoints } from '@core/endpoints';

/**
 * Clase Service que contiene los datos de configuración de la aplicación.
 *
 * Create at 08/08/2021 13:06:37
 * @author Luis Alberto Graciano Padierna <luisgraciano721@gmail.com>
 */
@Injectable()
export class AppConfigService {
  /**
   * URL de API configurada.
   */
  private _apiUrl: string;

  /**
   * Objeto con los endpoints mapeados.
   */
  private _endpoints: Endpoints;

  constructor() {
    this._apiUrl = null;
    this._endpoints = null;
  }

  /**
   * Obtiene la URL de la API actualmente configurada.
   */
  get apiUrl(): string {
    return this._apiUrl;
  }

  /**
   * Asigna la URL de la API.
   */
  set apiUrl(apiUrl: string) {
    this._apiUrl = apiUrl;
  }

  /**
   * Obtiene el objeto con los endpoints configurados,
   * si no están configurados intentará contruirlo.
   * @throws Error si se ha asignado previamente la URL de la API.
   */
  get endpoints(): Endpoints | null {
    if (!this._endpoints) {
      if (this._apiUrl) {
        this._endpoints = buildEnpoints(this._apiUrl);
      } else {
        throw new Error('Api URL is null');
      }
    }

    return this._endpoints;
  }
}
