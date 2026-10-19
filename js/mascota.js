/* ==========================================================================
   Jota — comportamiento del personaje animado
   - Sigue el cursor (o el dedo) con la mirada
   - Parpadea solo, saluda al cargar y cada cierto tiempo
   - Al hacer clic salta y cuenta un dato tributario nuevo
   Para cambiar lo que dice, edite la lista MENSAJES.
   ========================================================================== */
(function () {
  'use strict';

  var MENSAJES = [
    '¡Hola! Soy <b>Jota</b>, su contador de confianza.',
    'La <b>UVT 2026</b> está en $52.374.',
    'Renta de personas naturales: vence el <b>26 de octubre</b>.',
    '¿Le llegó un requerimiento de la DIAN? Le respondemos en <b>un día hábil</b>.',
    'Interés de mora art. 635 en octubre: <b>26,59 % E.A.</b>',
    'Cada lunes publicamos el <b>boletín</b> de jurisprudencia.',
    '¿Hablamos? Agende su consulta <b>aquí abajo</b>.'
  ];
  // Lo que muestra la pantalla de la calculadora, en el mismo orden
  var PANTALLA = ['52.374', '52.374', '26-OCT', '1 DÍA', '26,59%', 'LUNES', 'HOLA!'];

  var jota = document.getElementById('jota');
  var globo = document.getElementById('globo');
  var escenario = document.getElementById('escenario');
  if (!jota || !globo) return;

  var pantalla = document.getElementById('jota-pantalla');
  var pupilas = jota.querySelectorAll('.jota-pupila');
  var svg = jota.querySelector('svg');
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var indice = 0;
  var MAX_MIRADA = 5.5; // cuánto se mueven las pupilas (unidades del SVG)

  /* ---------- Clases de animación de un solo uso ---------- */
  function animar(clase, duracion) {
    if (quieto) return;
    jota.classList.remove(clase);
    void jota.offsetWidth; // reinicia la animación
    jota.classList.add(clase);
    setTimeout(function () { jota.classList.remove(clase); }, duracion);
  }

  /* ---------- Mirada que sigue el puntero ---------- */
  function mirarHacia(x, y) {
    var caja = svg.getBoundingClientRect();
    var escala = caja.width / 400; // ancho del viewBox
    pupilas.forEach(function (p) {
      var cx = caja.left + parseFloat(p.dataset.cx) * escala;
      var cy = caja.top + parseFloat(p.dataset.cy) * escala;
      var dx = x - cx;
      var dy = y - cy;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var fuerza = Math.min(dist / 120, 1) * MAX_MIRADA;
      p.style.transform = 'translate(' + (dx / dist * fuerza).toFixed(2) + 'px,' + (dy / dist * fuerza).toFixed(2) + 'px)';
    });
  }

  var pendiente = false;
  function alMoverPuntero(e) {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () {
      mirarHacia(e.clientX, e.clientY);
      pendiente = false;
    });
  }
  window.addEventListener('pointermove', alMoverPuntero, { passive: true });
  window.addEventListener('pointerdown', alMoverPuntero, { passive: true });

  // En celular, sin mouse: mira a un punto al azar de vez en cuando
  if (!quieto && !window.matchMedia('(hover: hover)').matches) {
    setInterval(function () {
      var caja = svg.getBoundingClientRect();
      mirarHacia(caja.left + Math.random() * caja.width, caja.top + Math.random() * caja.height * 0.6);
    }, 2200);
  }

  /* ---------- Parpadeo natural ---------- */
  function programarParpadeo() {
    setTimeout(function () {
      animar('parpadeando', 200);
      // a veces parpadea dos veces seguidas
      if (Math.random() < 0.25) setTimeout(function () { animar('parpadeando', 200); }, 260);
      programarParpadeo();
    }, 2200 + Math.random() * 3200);
  }

  /* ---------- Mensajes ---------- */
  function mostrarMensaje(i) {
    indice = (i + MENSAJES.length) % MENSAJES.length;
    globo.innerHTML = MENSAJES[indice];
    if (pantalla) pantalla.textContent = PANTALLA[indice] || '';
    if (globo.classList.contains('listo')) {
      globo.classList.remove('cambiando');
      void globo.offsetWidth;
      globo.classList.add('cambiando');
    }
  }

  globo.addEventListener('animationend', function (e) {
    if (e.animationName === 'globo-entra') globo.classList.add('listo');
    if (e.animationName === 'globo-cambia') globo.classList.remove('cambiando');
  });

  var rotacion;
  function reiniciarRotacion() {
    clearInterval(rotacion);
    rotacion = setInterval(function () {
      mostrarMensaje(indice + 1);
      if (indice % 3 === 0) animar('saludando', 1400);
    }, 6500);
  }

  jota.addEventListener('click', function () {
    animar('saltando', 600);
    mostrarMensaje(indice + 1);
    reiniciarRotacion();
  });

  /* ---------- Parallax suave al hacer scroll ---------- */
  if (!quieto && escenario) {
    var hero = document.getElementById('inicio');
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > hero.offsetHeight) return;
      jota.style.transform = 'translateY(' + (y * 0.12).toFixed(1) + 'px)';
    }, { passive: true });
  }

  /* ---------- Arranque ---------- */
  if (quieto) {
    globo.classList.add('listo');
  } else {
    setTimeout(function () { animar('saludando', 1400); }, 1300);
    programarParpadeo();
  }
  reiniciarRotacion();
})();
