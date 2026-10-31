import { solicitud } from './estado.js';

// LÓGICA: Pantalla 01 (Selección de Producto)
export function inicializarPantallaProducto() {
  const btnCelular = document.getElementById('btn-producto-celular');
  const btnCotizarDesktop = document.getElementById('btn-cotizar-desktop');
  const btnCotizarMobile = document.getElementById('btn-cotizar-mobile');

  if (!btnCelular || !btnCotizarDesktop || !btnCotizarMobile) return;

  btnCotizarDesktop.disabled = true;
  btnCotizarMobile.disabled = true;
  btnCotizarDesktop.classList.add('opacity-50', 'cursor-not-allowed');
  btnCotizarMobile.classList.add('opacity-50', 'cursor-not-allowed');

  btnCelular.addEventListener('click', () => {
    solicitud.productoSeleccionado = 'celular';
    btnCelular.classList.remove('border-border', 'opacity-70');
    btnCelular.classList.add('border-primary', 'border-2', 'shadow-sm', 'opacity-100');
    btnCotizarDesktop.disabled = false;
    btnCotizarMobile.disabled = false;
    btnCotizarDesktop.classList.remove('opacity-50', 'cursor-not-allowed');
    btnCotizarMobile.classList.remove('opacity-50', 'cursor-not-allowed');
  });
}

// LÓGICA: Pantalla 02 (Cotización / Antigüedad y Resumen)
export function inicializarPantallaCotizacion() {
  const seccionCotizar = document.querySelector('section[data-paso="1"]');
  if (!seccionCotizar) return;

  const botonesAntiguedad = Array.from(seccionCotizar.querySelectorAll('button')).filter(btn =>
    btn.textContent.toLowerCase().includes('año')
  );

  const selectMarca = seccionCotizar.querySelector('select');
  const inputsTexto = seccionCotizar.querySelectorAll('input[type="text"]');
  const inputModelo = inputsTexto[0];
  const inputValor = inputsTexto[1];

  const resumenEquipo = document.getElementById('resumen-equipo');
  const resumenValor = document.getElementById('resumen-valor');
  const mensajeAyudaValor = inputValor ? inputValor.nextElementSibling : null;

  // Los enganchamos directo con los IDs a prueba de fallos
  const btnPlanesDesktop = document.getElementById('btn-planes-desktop');
  const btnPlanesMobile = document.getElementById('btn-planes-mobile');

  const validarFormularioCotizacion = () => {
    let esValido = true;

    // 1. Marca vacía
    if (!selectMarca || selectMarca.value === "") esValido = false;
    
    // 2. Modelo muy corto
    if (!inputModelo || inputModelo.value.trim().length < 2) esValido = false;

    // 3. Valor fuera de rango
    if (inputValor) {
      let valorNumerico = Number(inputValor.value.replace(/\D/g, ''));
      if (valorNumerico < 100000 || valorNumerico > 2500000) {
        esValido = false;
        if (valorNumerico > 0) {
          inputValor.classList.add('border-red-600', 'text-red-600');
          if (mensajeAyudaValor) {
            mensajeAyudaValor.classList.add('text-red-600');
            mensajeAyudaValor.classList.remove('text-muted');
          }
        }
      } else {
        inputValor.classList.remove('border-red-600', 'text-red-600');
        if (mensajeAyudaValor) {
          mensajeAyudaValor.classList.remove('text-red-600');
          mensajeAyudaValor.classList.add('text-muted');
        }
      }
    } else {
      esValido = false;
    }

    // 4. Antigüedad sin tildar
    if (!solicitud.equipo.antiguedad) esValido = false;

    // 5. Prender/Apagar
    const actualizarBoton = (btn) => {
      if (!btn) return;
      if (esValido) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    };

    actualizarBoton(btnPlanesDesktop);
    actualizarBoton(btnPlanesMobile);
  };

  if (inputValor) {
    inputValor.addEventListener('input', (e) => {
      let numero = e.target.value.replace(/\D/g, '');
      if (numero) {
        e.target.value = '$ ' + new Intl.NumberFormat('es-AR').format(numero);
      }
      validarFormularioCotizacion();
      actualizarResumen();
    });
  }

  botonesAntiguedad.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      botonesAntiguedad.forEach(b => {
        b.classList.remove('border-primary', 'text-primary', 'bg-primary-50');
        b.classList.add('border-border', 'text-text', 'bg-white');
      });
      boton.classList.remove('border-border', 'text-text', 'bg-white');
      boton.classList.add('border-primary', 'text-primary', 'bg-primary-50');
      
      solicitud.equipo.antiguedad = boton.textContent.trim();
      validarFormularioCotizacion();
    });
  });

  const actualizarResumen = () => {
    if (resumenEquipo && selectMarca && inputModelo) {
      const marcaTxt = selectMarca.value.includes('Elegí') ? '' : selectMarca.value;
      resumenEquipo.textContent = `${marcaTxt} ${inputModelo.value}`.trim() || '-';
    }
    if (resumenValor && inputValor) {
      resumenValor.textContent = inputValor.value || '-';
    }
  };

  if (selectMarca) selectMarca.addEventListener('change', () => { actualizarResumen(); validarFormularioCotizacion(); });
  if (inputModelo) inputModelo.addEventListener('input', () => { actualizarResumen(); validarFormularioCotizacion(); });

  // Disparamos la validación de entrada para que analice todo
  validarFormularioCotizacion();
}

// LÓGICA: Pantalla 03 (Planes)
export function inicializarPantallaPlanes() {
  const seccionPlanes = document.querySelector('section[data-paso="2"]');
  if (!seccionPlanes) return;

  const tarjetas = seccionPlanes.querySelectorAll('.tarjeta-plan');
  
  const resumenEquipoP3 = document.getElementById('resumen-equipo-p3');
  const resumenPlanP3 = document.getElementById('resumen-plan-p3');
  const resumenTotalP3 = document.getElementById('resumen-total-p3');
  
  const resumenMobileTexto = document.getElementById('resumen-mobile-texto-p3');
  const resumenMobilePrecio = document.getElementById('resumen-mobile-precio-p3');

  const actualizarEquipoDesdePantalla2 = () => {
    const seccionCotizar = document.querySelector('section[data-paso="1"]');
    const selectMarca = seccionCotizar.querySelector('select');
    const inputModelo = seccionCotizar.querySelectorAll('input[type="text"]')[0];
    
    if (selectMarca && inputModelo) {
      const nombreEquipo = `${selectMarca.value} ${inputModelo.value}`;
      if (resumenEquipoP3) resumenEquipoP3.textContent = nombreEquipo;
      return nombreEquipo;
    }
    return 'Galaxy A55'; 
  };

  tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', (e) => {
      e.preventDefault(); 
      
      const equipoActual = actualizarEquipoDesdePantalla2();
      let nombrePlan = 'Plus';
      let precioPlan = '$ 3.000';

      if (tarjeta.textContent.includes('Básico')) {
        nombrePlan = 'Básico';
        precioPlan = '$ 2.000';
      } else if (tarjeta.textContent.includes('Premium')) {
        nombrePlan = 'Premium';
        precioPlan = '$ 4.500';
      }

      solicitud.plan = nombrePlan;

      if (resumenPlanP3) resumenPlanP3.textContent = nombrePlan;
      if (resumenTotalP3) resumenTotalP3.textContent = precioPlan;
      
      if (resumenMobileTexto) resumenMobileTexto.textContent = `Plan ${nombrePlan} · ${equipoActual}`;
      if (resumenMobilePrecio) resumenMobilePrecio.textContent = `${precioPlan}/mes`;

      tarjetas.forEach(t => {
        t.classList.remove('border-primary', 'border-2', 'shadow-sm', 'bg-primary-50/10');
        t.classList.add('border-border', 'opacity-70');
        const circulo = t.querySelector('.w-5');
        if(circulo) {
          circulo.classList.remove('border-[6px]', 'border-primary');
          circulo.classList.add('border-2', 'border-border');
        }
      });

      tarjeta.classList.remove('border-border', 'opacity-70');
      tarjeta.classList.add('border-primary', 'border-2', 'shadow-sm', 'bg-primary-50/10');
      const circuloActivo = tarjeta.querySelector('.w-5');
      if(circuloActivo) {
        circuloActivo.classList.remove('border-2', 'border-border');
        circuloActivo.classList.add('border-[6px]', 'border-primary');
      }
    });
  });
}

// LÓGICA: Pantalla 04 (Validación de Datos Pro)
export function inicializarPantallaDatos() {
  const seccionDatos = document.querySelector('section[data-paso="3"]');
  if (!seccionDatos) return;

  const inputsText = seccionDatos.querySelectorAll('input:not([type="checkbox"])');
  const checkbox = document.getElementById('terminos');
  const btnContinuarP4 = document.getElementById('btn-continuar-p4');
  const btnContinuarMobile = document.getElementById('btn-continuar-mobile-p4');
  const textoError = document.getElementById('texto-error-p4');
  const textoErrorMobile = document.getElementById('texto-error-mobile-p4');
  
  const inputNacimiento = document.getElementById('nacimiento');
  const inputDni = document.getElementById('dni');
  const inputEmail = document.getElementById('email');

  if (inputNacimiento) {
    inputNacimiento.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, ''); 
      if (valor.length > 4) {
        valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}/${valor.slice(4, 8)}`;
      } else if (valor.length > 2) {
        valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}`;
      }
      e.target.value = valor;
    });
  }

  if (inputDni) {
    inputDni.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
    });
  }

  const validarFormulario = () => {
    let esValido = true;
    inputsText.forEach(input => {
      if (input.value.trim() === '') esValido = false;
    });

    if (inputDni && inputDni.value.length < 7) esValido = false; 
    if (inputNacimiento && inputNacimiento.value.length < 10) esValido = false; 
    if (inputEmail && !inputEmail.value.includes('@')) esValido = false; 
    if (checkbox && !checkbox.checked) esValido = false; 

    const actualizarBoton = (btn) => {
      if (!btn) return;
      if (esValido) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    };

    actualizarBoton(btnContinuarP4);
    actualizarBoton(btnContinuarMobile);

    if (textoError) {
      textoError.style.opacity = esValido ? '0' : '1'; 
    }
    if (textoErrorMobile) {
      textoErrorMobile.textContent = esValido ? '¡Todo listo!' : 'El botón se habilita cuando el formulario es válido';
      textoErrorMobile.classList.toggle('text-success', esValido);
      textoErrorMobile.classList.toggle('text-muted', !esValido);
    }
  };

  inputsText.forEach(input => input.addEventListener('input', validarFormulario));
  if (checkbox) checkbox.addEventListener('change', validarFormulario);
  validarFormulario();
}

export function actualizarResumenP4() {
  const resumenEquipoP4 = document.getElementById('resumen-equipo-p4');
  const resumenPlanP4 = document.getElementById('resumen-plan-p4');
  const resumenTotalP4 = document.getElementById('resumen-total-p4');

  const seccionCotizar = document.querySelector('section[data-paso="1"]');
  const selectMarca = seccionCotizar?.querySelector('select');
  const inputModelo = seccionCotizar?.querySelectorAll('input[type="text"]')[0];
  if (resumenEquipoP4 && selectMarca && inputModelo) {
    resumenEquipoP4.textContent = `${selectMarca.value} ${inputModelo.value}`;
  }

  const seccionPlanes = document.querySelector('section[data-paso="2"]');
  const tarjetaActiva = seccionPlanes?.querySelector('.border-primary.bg-primary-50\\/10');
  
  if (tarjetaActiva) {
    const nombrePlan = tarjetaActiva.querySelector('.font-extrabold.text-lg').textContent;
    const precioText = tarjetaActiva.querySelectorAll('.font-extrabold')[1].textContent;
    
    if (resumenPlanP4) resumenPlanP4.textContent = nombrePlan;
    if (resumenTotalP4) resumenTotalP4.textContent = precioText;
  }
}

// LÓGICA: Pantalla 05 (Pago) - Con soporte Mobile
export function inicializarPantallaPago() {
  const seccionPago = document.querySelector('section[data-paso="4"]');
  if (!seccionPago) return;

  const opcionesTarjeta = seccionPago.querySelectorAll('.opcion-tarjeta');
  const inputNumero = document.getElementById('numero-tarjeta');
  const inputTitular = document.getElementById('titular-tarjeta');
  const inputVencimiento = document.getElementById('vencimiento-tarjeta');
  const inputCvv = document.getElementById('cvv-tarjeta');
  
  const btnPagarDesktop = document.getElementById('btn-pagar-p5');
  const btnPagarMobile = document.getElementById('btn-pagar-mobile-p5');
  const textoError = document.getElementById('texto-error-p5');
  const textoErrorMobile = document.getElementById('texto-error-mobile-p5');
  
  const resumenTitularP5 = document.getElementById('resumen-titular-p5');
  const resumenTitularMobileP5 = document.getElementById('resumen-titular-mobile-p5');

  opcionesTarjeta.forEach(opcion => {
    opcion.addEventListener('click', () => {
      opcionesTarjeta.forEach(opt => {
        opt.classList.remove('border-primary', 'border-2', 'bg-primary-50/10');
        opt.classList.add('border-border', 'border');
        const indicador = opt.querySelector('.indicador-radio');
        indicador.classList.remove('border-[6px]', 'border-primary');
        indicador.classList.add('border-2', 'border-border');
      });
      opcion.classList.remove('border-border', 'border');
      opcion.classList.add('border-primary', 'border-2', 'bg-primary-50/10');
      const indicadorActivo = opcion.querySelector('.indicador-radio');
      indicadorActivo.classList.remove('border-2', 'border-border');
      indicadorActivo.classList.add('border-[6px]', 'border-primary');
    });
  });

  if (inputNumero) {
    inputNumero.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, ''); 
      valor = valor.replace(/(.{4})/g, '$1 ').trim(); 
      e.target.value = valor.substring(0, 19);
    });
  }

  if (inputVencimiento) {
    inputVencimiento.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, ''); 
      if (valor.length > 2) {
        valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}`;
      }
      e.target.value = valor;
    });
  }

  if (inputCvv) {
    inputCvv.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
  }

  if (inputTitular) {
    inputTitular.addEventListener('input', (e) => {
      const valorTxt = e.target.value.trim() === '' ? '-' : e.target.value.toUpperCase();
      if (resumenTitularP5) resumenTitularP5.textContent = valorTxt;
      if (resumenTitularMobileP5) resumenTitularMobileP5.textContent = valorTxt;
      validarFormularioPago();
    });
  }

  const validarFormularioPago = () => {
    let esValido = true;
    
    if (!inputNumero || inputNumero.value.replace(/\s/g, '').length < 15) esValido = false;
    if (!inputTitular || inputTitular.value.trim().length < 3) esValido = false;
    if (!inputVencimiento || inputVencimiento.value.length < 5) esValido = false;
    if (!inputCvv || inputCvv.value.length < 3) esValido = false;

    const actualizarBoton = (btn) => {
      if (!btn) return;
      if (esValido) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    };

    actualizarBoton(btnPagarDesktop);
    actualizarBoton(btnPagarMobile);

    if (textoError) textoError.style.opacity = esValido ? '0' : '1';
    if (textoErrorMobile) {
      textoErrorMobile.textContent = esValido ? '¡Todo listo!' : 'Completá los datos de la tarjeta';
      textoErrorMobile.classList.toggle('text-success', esValido);
      textoErrorMobile.classList.toggle('text-muted', !esValido);
    }
  };

  [inputNumero, inputVencimiento, inputCvv].forEach(input => {
    if (input) input.addEventListener('input', validarFormularioPago);
  });
}

// Actualizar el Resumen arrastrando datos a Desktop y Mobile
export function actualizarResumenP5() {
  const resumenEquipoP5 = document.getElementById('resumen-equipo-p5');
  const resumenPlanP5 = document.getElementById('resumen-plan-p5');
  const resumenTotalP5 = document.getElementById('resumen-total-p5');
  const resumenTitularP5 = document.getElementById('resumen-titular-p5');
  
  const resumenSeguroMobileP5 = document.getElementById('resumen-seguro-mobile-p5');
  const resumenEquipoMobileP5 = document.getElementById('resumen-equipo-mobile-p5');
  const resumenTitularMobileP5 = document.getElementById('resumen-titular-mobile-p5');
  const resumenTotalMobileP5 = document.getElementById('resumen-total-mobile-p5');

  const inputTitularTarjeta = document.getElementById('titular-tarjeta');

  const seccionCotizar = document.querySelector('section[data-paso="1"]');
  const selectMarca = seccionCotizar?.querySelector('select');
  const inputModelo = seccionCotizar?.querySelectorAll('input[type="text"]')[0];
  if (selectMarca && inputModelo) {
    const nombreEquipo = `${selectMarca.value} ${inputModelo.value}`;
    if (resumenEquipoP5) resumenEquipoP5.textContent = nombreEquipo;
    if (resumenEquipoMobileP5) resumenEquipoMobileP5.textContent = nombreEquipo;
  }

  const seccionPlanes = document.querySelector('section[data-paso="2"]');
  const tarjetaActiva = seccionPlanes?.querySelector('.border-primary.bg-primary-50\\/10');
  if (tarjetaActiva) {
    const nombrePlan = tarjetaActiva.querySelector('.font-extrabold.text-lg').textContent;
    const precioText = tarjetaActiva.querySelectorAll('.font-extrabold')[1].textContent;
    
    if (resumenPlanP5) resumenPlanP5.textContent = nombrePlan;
    if (resumenTotalP5) resumenTotalP5.textContent = precioText;
    
    if (resumenSeguroMobileP5) resumenSeguroMobileP5.textContent = `Celular · Plan ${nombrePlan}`;
    if (resumenTotalMobileP5) resumenTotalMobileP5.textContent = precioText;
  }

  const seccionDatos = document.querySelector('section[data-paso="3"]');
  const inputNombre = seccionDatos?.querySelector('#nombre');
  const inputApellido = seccionDatos?.querySelector('#apellido');
  
  if (inputNombre && inputApellido && inputTitularTarjeta && inputTitularTarjeta.value === '') {
    const nombreCompleto = `${inputNombre.value} ${inputApellido.value}`.trim().toUpperCase();
    inputTitularTarjeta.value = nombreCompleto;
    if (resumenTitularP5) resumenTitularP5.textContent = nombreCompleto;
    if (resumenTitularMobileP5) resumenTitularMobileP5.textContent = nombreCompleto;
  }
}

// NUEVO: Función para actualizar la Pantalla 06 (Éxito)
export function actualizarResumenExito() {
  const titulo = document.getElementById('exito-titulo');
  const txtEmail = document.getElementById('exito-email');
  const txtPlan = document.getElementById('exito-plan');
  const txtEquipo = document.getElementById('exito-equipo');
  const txtPrecio = document.getElementById('exito-precio');
  const txtFecha = document.getElementById('exito-fecha');

  // Traemos los inputs donde el usuario escribió su nombre y mail en la Pantalla 4
  const inputNombre = document.getElementById('nombre');
  const inputEmail = document.getElementById('email');

  // Traemos los datos que ya están armaditos en el resumen de la Pantalla 5
  const resumenEquipoP5 = document.getElementById('resumen-equipo-p5');
  const resumenPlanP5 = document.getElementById('resumen-plan-p5');
  const resumenTotalP5 = document.getElementById('resumen-total-p5');

  // Actualizamos el nombre en el título
  if (titulo && inputNombre) {
    const nombreUsuario = inputNombre.value.trim() || 'Amigo';
    titulo.innerHTML = `¡Listo, ${nombreUsuario}!<br>Tu celular ya está protegido`;
  }

  // Actualizamos el correo electrónico
  if (txtEmail && inputEmail) {
    txtEmail.textContent = `Te enviamos la póliza a ${inputEmail.value.trim()}`;
  }

  // Copiamos los datos del plan y el celular
  if (txtPlan && resumenPlanP5) txtPlan.textContent = resumenPlanP5.textContent;
  if (txtEquipo && resumenEquipoP5) txtEquipo.textContent = resumenEquipoP5.textContent;
  if (txtPrecio && resumenTotalP5) txtPrecio.textContent = resumenTotalP5.textContent;

  // Calculamos la fecha de HOY en automático
  if (txtFecha) {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, por eso el +1
    const anio = hoy.getFullYear();
    txtFecha.textContent = `${dia}/${mes}/${anio}`;
  }
}