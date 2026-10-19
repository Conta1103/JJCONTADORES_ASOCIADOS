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

  /* ---------- Formulario de consulta: arma un correo ---------- */
  var form = document.getElementById('consulta');
  var error = document.getElementById('form-error');
  if (form) {
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
      if (mensaje) {
        error.textContent = mensaje;
        error.classList.add('visible');
        if (faltan[0]) faltan[0].focus();
        return;
      }
      error.classList.remove('visible');

      var lineas = [];
      new FormData(form).forEach(function (valor, nombre) {
        if (nombre === 'autorizacion' || !String(valor).trim()) return;
        lineas.push((nombre === 'tipo' ? 'Tipo de cliente' : nombre) + ': ' + valor);
      });
      location.href = 'mailto:jjcontadores_asociados@hotmail.com?subject=' +
        encodeURIComponent('Solicitud de consulta') + '&body=' + encodeURIComponent(lineas.join('\n'));
    });
  }
})();
