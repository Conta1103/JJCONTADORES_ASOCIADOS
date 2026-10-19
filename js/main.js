/* ==========================================================================
   JJ Contadores & Asociados — interacciones generales del sitio
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Menú en celular ---------- */
  var boton = document.querySelector('.menu-boton');
  var menu = document.getElementById('menu');
  function cerrarMenu() {
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir menú');
    menu.classList.remove('abierto');
  }
  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      if (abierto) return cerrarMenu();
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', 'Cerrar menú');
      menu.classList.add('abierto');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrarMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarMenu();
    });
  }

  /* ---------- Sombra del encabezado al bajar ---------- */
  var encabezado = document.querySelector('.encabezado');
  window.addEventListener('scroll', function () {
    encabezado.classList.toggle('con-sombra', window.scrollY > 8);
  }, { passive: true });

  /* ---------- Aparición de secciones al hacer scroll ---------- */
  var revelables = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        // escalonar elementos hermanos dentro de una misma cuadrícula
        var hermanos = Array.prototype.filter.call(el.parentNode.children, function (h) {
          return h.classList.contains('revelar');
        });
        el.style.transitionDelay = (hermanos.indexOf(el) % 3) * 90 + 'ms';
        el.classList.add('visible');
        observador.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revelables.forEach(function (el) { observador.observe(el); });
  } else {
    revelables.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Formulario de consulta: envía la solicitud al correo de la firma ----------
     Usa FormSubmit (formsubmit.co), servicio gratuito que reenvía el formulario por correo.
     La primera vez llega a la bandeja un correo de activación que hay que confirmar. */
  var DESTINO = 'https://formsubmit.co/ajax/jjcontadores_asociados@hotmail.com';
  var form = document.getElementById('consulta');
  var error = document.getElementById('form-error');
  var exito = document.getElementById('form-exito');
  var enviar = document.getElementById('form-enviar');

  function mostrarError(texto, campo) {
    error.textContent = texto;
    error.classList.add('visible');
    if (campo) campo.focus();
  }

  if (form) {
    document.getElementById('form-otra').addEventListener('click', function () {
      form.reset();
      exito.hidden = true;
    });

    // Regreso desde FormSubmit tras un envío tradicional
    if (/[?&]enviado=1/.test(location.search)) {
      exito.hidden = false;
      history.replaceState(null, '', location.pathname + '#contacto');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var faltan = Array.prototype.filter.call(
        form.querySelectorAll('input[required]:not([type=checkbox]), textarea[required]'),
        function (campo) { return !campo.value.trim(); }
      );
      var correo = form.querySelector('input[type=email]');
      var mensaje = '';
      if (faltan.length) {
        mensaje = 'Por favor complete los campos obligatorios (*).';
      } else if (correo.value && !correo.checkValidity()) {
        mensaje = 'Revise el correo electrónico: parece incompleto.';
        faltan = [correo];
      } else if (!form.autorizacion.checked) {
        mensaje = 'Debe autorizar el tratamiento de datos para enviar la solicitud.';
      }
      if (mensaje) return mostrarError(mensaje, faltan[0]);
      error.classList.remove('visible');

      // opciones que FormSubmit también lee en el envío tradicional
      form._subject.value = 'Nueva solicitud de consulta — ' + form['Nombre o razón social'].value.trim();
      form._replyto.value = correo.value;

      var datos = {};
      new FormData(form).forEach(function (valor, nombre) {
        if (nombre === 'autorizacion' || nombre.charAt(0) === '_') return;
        if (!String(valor).trim()) return;
        datos[nombre === 'tipo' ? 'Tipo de cliente' : nombre] = valor;
      });
      datos['Autorización de datos'] = 'Sí (Ley 1581 de 2012)';
      ['_subject', '_replyto', '_template', '_captcha', '_honey'].forEach(function (n) { datos[n] = form[n].value; });

      form.classList.add('enviando');
      enviar.textContent = 'Enviando…';

      function terminar() {
        form.classList.remove('enviando');
        enviar.textContent = 'Enviar solicitud';
      }

      fetch(DESTINO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(datos)
      }).then(function (r) {
        return r.json().then(function (j) {
          terminar();
          if (r.ok && String(j.success) === 'true') {
            exito.hidden = false;
            exito.focus();
          } else {
            mostrarError('No pudimos enviar la solicitud. Intente de nuevo o escríbanos por WhatsApp al 305 277 8792.');
          }
        });
      }).catch(function () {
        // El navegador bloqueó el envío directo (bloqueador, red, etc.):
        // se envía el formulario de forma tradicional y FormSubmit regresa a ?enviado=1
        HTMLFormElement.prototype.submit.call(form);
      });
    });
  }
})();
