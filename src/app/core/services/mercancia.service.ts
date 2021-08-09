import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IHttpResponse } from '@core/interfaces/http-response';
import { IMercancia } from '@core/interfaces/mercancia';
import { AppConfigService } from './app-config.service';

/**
 * Clase Service que contiene los métodos que construyen los observables
 * para las peticiones relacionados con `mercancia`.
 *
 * Create at 08/08/2021
 * @author Luis Alberto Graciano Padierna <luisgraciano721@gmail.com>
 */
@Injectable()
export class MercanciaService {
  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) {}

  /**
   * Construye un observable que hace la petición al endpoint `/usuario/findAll`
   * que obtiene la lista de usuarios registrados en la base de datos.
   * @param idUsuarioRegistra Valor filtro Indentificador usuario registra.
   * @param nombreProducto Valor filtro nombreProducto.
   * @param fechaIngreso Valor filtro fecha ingreso.
   * @returns Obsevable con la petición lista para ser cosumida.
   */
  findByMultipleCriteria(
    idUsuarioRegistra: number,
    nombreProducto: string,
    fechaIngreso: Date
  ) {
    const params: { [key: string]: string } = {};
    if (nombreProducto && nombreProducto.trim()) {
      params.nombreProducto = nombreProducto.trim();
    }

    if (idUsuarioRegistra && idUsuarioRegistra > 0) {
      params.idUsuarioRegistra = idUsuarioRegistra.toString();
    }

    if (fechaIngreso) {
      params.fechaIngreso =
        fechaIngreso.getFullYear() +
        '-' +
        fechaIngreso.getMonth().toString().padStart(2, '0') +
        '-' +
        fechaIngreso.getDate().toString().padStart(2, '0');
    }

    return this.httpClient.get<IHttpResponse<IMercancia[]>>(
      this.appConfigService.endpoints.mercancia.findByMultipleCriteria,
      { params: params }
    );
  }
}
