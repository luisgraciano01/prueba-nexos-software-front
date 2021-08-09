/**
 * Interfaz que define las propiedades de la petición de la actualización de una mercancía.
 *
 * Create at 08/08/2021
 * @author Luis Alberto Graciano Padierna <luisgraciano721@gmail.com>
 */
export interface IActualizarMercanciaRequest {
  /**
   * Identificador de la mercancía.
   */
  idMercancia: number;

  /**
   * Identificador del usuario que actualiza.
   */
  idUsuarioActualiza: number;

  /**
   * Nombre del producto.
   */
  nombreProducto: string;

  /**
   * Cantidad ingresada del producto.
   */
  cantidad: number;

  /**
   * Fecha de ingreso del producto.
   */
  fechaIngreso: Date;
}
