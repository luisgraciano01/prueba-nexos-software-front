/**
 * Interfaz que define las propiedades de la petición de registro de una mercancía.
 *
 * Create at 08/08/2021
 * @author Luis Alberto Graciano Padierna <luisgraciano721@gmail.com>
 */
export interface IRegistroMercanciaRequest {
  /**
   * Identificador del usuario que registra.
   */
  idUsuarioRegistra: number;

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
