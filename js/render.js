import { getPaso } from './estado.js';

export function renderizarPantallas() {
  const pasoActivo = getPaso();
  const secciones = document.querySelectorAll('section[data-paso]');

  secciones.forEach((seccion) => {
    // Si el data-paso de la sección coincide con nuestro estado, le sacamos el hidden
    if (parseInt(seccion.dataset.paso) === pasoActivo) {
      seccion.removeAttribute('hidden');
    } else {
      // A todas las demás las ocultamos
      seccion.setAttribute('hidden', '');
    }
  });

  // Cada vez que cambiamos de pantalla, hacemos que la página suba arriba de todo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}