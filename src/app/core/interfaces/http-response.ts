/**
 * Interfaz genérica para la respuestas de la API.
 *
 * Create at 08/08/2021 13:06:37
 * @author Luis Alberto Graciano Padierna <luisgraciano721@gmail.com>
 */
export interface IHttpResponse<T> {
  /**
   * Determina que todo el proceso realizado ha finalizado con éxito.
   *
   * - `true`: Todo el proceso ha finalizado con éxito. <br/>
   * - `false`: No se pudo finalizar con éxito el proceso sea por validaciones o errores internos
   * del programa.
   */
  exitoso: boolean;

  /**
   * Mensaje opcional como respuesta del servicio.
   */
  mensaje?: string;

  /**
   * Datos / información adicional como respuesta del servcio.
   */
  data?: T;
}
