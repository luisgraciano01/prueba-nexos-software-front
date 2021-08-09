import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IHttpResponse } from '@core/interfaces/http-response';
import { IMercancia } from '@core/interfaces/mercancia';
import { IRegistroMercanciaRequest } from '@core/interfaces/registro-mercancia.request';
import { IValidationError } from '@core/interfaces/validation-error';
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
   * Construye un observable que hace la petición al endpoint `/mercancia/findByMultipleCriteria`
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

  /**
   * Construye un observable que hace la petición al endpoint `/mercancia/checkIfExistsMercancia`
   * que obtiene la lista de usuarios registrados en la base de datos.
   *
   * @returns Obsevable con la petición lista para ser cosumida.
   */
  checkIfExistsMercancia(nombreProducto: string) {
    return this.httpClient.get<IHttpResponse<boolean>>(
      this.appConfigService.endpoints.mercancia.checkIfExistsMercancia,
      { params: { nombreProducto: nombreProducto.trim() } }
    );
  }

  /**
   * Construye un observable que hace la petición al endpoint `/mercancia/save`
   * que obtiene registra una mercancía.
   *
   * @returns Obsevable con la petición lista para ser cosumida.
   */
  save(registroMercanciaRequest: IRegistroMercanciaRequest) {
    return this.httpClient.post<IHttpResponse<boolean | IValidationError>>(
      this.appConfigService.endpoints.mercancia.save,
      registroMercanciaRequest
    );
  }
}
