import { IUsuario } from './usuario';

/**
 * Interaz que define las propiedades de una mercacancía.
 *
 * Create at 08/08/2021
 * @author Luis Alberto Graciano Padierna <luisgraciano721@gmail.com>
 */
export interface IMercancia {
  idMercancia: number;
  usuarioRegistra: IUsuario;
  nombreProducto: string;
  cantidad: number;
  fechaIngreso: Date;
  fechaRegistro: Date;
}
