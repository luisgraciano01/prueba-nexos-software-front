/**
 * Interfaz con las propiedades de un objeto que tiene los endpoints,
 * esto es para ayudar al autocompletar del IDE.
 */
interface Endpoints {
  usuario: {
    findAll: string;
  };
}

/**
 * Construye un objeto que contendrá la URL completa de cada uno de los endpoints mapeados.
 *
 * @param apiUrl URL de API
 * @returns Objeto con las URL completas de los endpoints
 */
const buildEnpoints = (apiUrl: string): Endpoints => ({
  get usuario() {
    const base = apiUrl + '/usuario';
    return {
      findAll: base + '/findAll',
    };
  },
});

export { Endpoints, buildEnpoints };
