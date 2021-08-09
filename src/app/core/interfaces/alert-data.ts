/**
 * Interfaz que define las propiedades de una alerta.
 *
 * Create at 08/08/2021
 * @see https://ng-bootstrap.github.io/#/components/alert/examples#selfclosing
 * @author Luis Alberto Graciano Padierna <luisgraciano721@gmail.com>
 */
export interface IAlertData {
  /**
   * Tipo de alerta a mostrar al usuario.
   */
  type:
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'light'
    | 'dark';

  /**
   * Mensaje a mostrar al usuario.
   */
  message: string;
}
