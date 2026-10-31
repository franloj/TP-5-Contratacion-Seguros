export const solicitud = {
  pasoActual: 0,
  equipo: {
    marca: '',
    modelo: '',
    valor: 0,
    antiguedad: ''
  },
  plan: '',
  datosPersonales: {
    nombre: '',
    apellido: '',
    dni: '',
    nacimiento: '',
    email: '',
    celular: ''
  },
  pago: {
    metodo: '',
    numero: '',
    titular: '',
    vencimiento: '',
    cvv: ''
  }
};

// Función para cambiar de paso
export function setPaso(nuevoPaso) {
  solicitud.pasoActual = nuevoPaso;
}

// Función para saber en qué paso estamos
export function getPaso() {
  return solicitud.pasoActual;
}