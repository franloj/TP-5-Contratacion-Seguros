// js/app.js
import { getPaso, setPaso } from './estado.js';
import { renderizarPantallas } from './render.js';
import {
  inicializarPantallaProducto,
  inicializarPantallaCotizacion,
  inicializarPantallaPlanes,
  inicializarPantallaDatos,
  actualizarResumenP4,
  inicializarPantallaPago,
  actualizarResumenP5,
  actualizarResumenExito
} from './interacciones.js';

document.addEventListener('DOMContentLoaded', () => {
  renderizarPantallas();
  inicializarPantallaProducto();
  inicializarPantallaCotizacion();
  inicializarPantallaPlanes();
  inicializarPantallaDatos();
  inicializarPantallaPago();

  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a');
    if (!btn || btn.disabled || btn.id === 'btn-producto-celular') return;
    e.preventDefault();

    const textoBoton = btn.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
    const pasoActual = getPaso();

    // Botones de retroceso (Volver o flecha del header)
    const esBotonVolver = textoBoton === 'volver' || (btn.closest('header') && textoBoton === '');

    if (esBotonVolver) {
      if (pasoActual > 0) navegar(pasoActual - 1);
      return;
    }

    if (textoBoton === 'volver al inicio') {
      // 1. Vaciamos todos los inputs y formularios visualmente
      document.querySelectorAll('form').forEach(form => form.reset());

      // 2. Recargamos la página para limpiar el estado en memoria y volver a cero
      window.location.reload();
      return;
    }

    switch (pasoActual) {
      case 0:
        if (textoBoton.includes('cotizar')) navegar(1);
        break;
      case 1:
        if (textoBoton.includes('ver planes')) navegar(2);
        break;
      case 2:
        if (textoBoton === 'continuar') navegar(3);
        break;
      case 3:
        if (textoBoton.includes('continuar al pago')) navegar(4);
        break;
      case 4:
        if (textoBoton.includes('pagar y contratar')) {
          // LÓGICA DE SIMULACIÓN DE PAGO
          const inputTarjeta = document.getElementById('numero-tarjeta');
          const numeroTarjeta = inputTarjeta ? inputTarjeta.value : '';

          if (numeroTarjeta === '4000 0000 0000 0002') {
            navegar(6); // Va a la Pantalla 07 (Rechazado)
          } else {
            navegar(5); // Va a la Pantalla 06 (Éxito)
          }
        }
        break;
      case 6:
        // NUEVO: Si toca "reintentar pago" o "cambiar medio de pago", vuelve a la pantalla 5 (paso 4)
        if (textoBoton.includes('reintentar') || textoBoton.includes('cambiar medio')) {
          navegar(4);
        }
        break;
    }
  });
});

function navegar(nuevoPaso) {
  setPaso(nuevoPaso);
  renderizarPantallas();

  if (nuevoPaso === 3) {
    actualizarResumenP4();
  }

  if (nuevoPaso === 4) {
    actualizarResumenP5();
  }

  if (nuevoPaso === 5) {
    actualizarResumenExito();
  }
}