/* ==========================================================================
   JJ Contadores & Asociados — Liquidador de intereses de mora (art. 635 ET)
   Intereses = K × ((usura − 2) / 365) × días. Tasa de usura: Superfinanciera,
   consumo y ordinario. Para agregar un mes nuevo, añada una fila al inicio de TASAS.
   ========================================================================== */
(function () {
  'use strict';

  // [desde, hasta, tasa de usura E.A. %, resolución] — de la más reciente a la más antigua
  var TASAS = [
    ["2026-11-01", "2026-11-30", 28.34, "Resolución 1707 de octubre 30 de 2026"],
    ["2026-10-01", "2026-10-31", 28.59, "Resolución 1472 de 2026"],
    ["2026-09-01", "2026-09-30", 29.24, "Resolución 1260 de 2026"],
    ["2026-08-01", "2026-08-31", 29.66, "Resolución 1139 de julio 31 de 2026"],
    ["2026-07-01", "2026-07-31", 28.79, "Resolución 0965 de junio 30 de 2026"],
    ["2026-06-01", "2026-06-30", 28.79, "Resolución 0823 de mayo 29 de 2026"],
    ["2026-05-01", "2026-05-31", 28.17, "Resolución 0662 de abril 30 de 2026"],
    ["2026-04-01", "2026-04-30", 26.76, "Resolución 0517 de marzo 27 de 2026"],
    ["2026-03-01", "2026-03-31", 25.52, "Resolución 0405 de febrero 27 de 2026"],
    ["2026-02-01", "2026-02-28", 25.23, "Resolución 0250 de enero 30 de 2026"],
    ["2026-01-01", "2026-01-31", 24.36, "Resolución 2288 de diciembre 26 de 2025"],
    ["2025-12-01", "2025-12-31", 25.02, "Resolución 2134 de noviembre 28 de 2025"],
    ["2025-11-01", "2025-11-30", 24.99, "Resolución 1995 de octubre 31 de 2025"],
    ["2025-10-01", "2025-10-31", 24.36, "Resolución 1821 de septiembre 30 de 2025"],
    ["2025-09-01", "2025-09-30", 25, "Resolución 1658 de agosto 29 de 2025"],
    ["2025-08-01", "2025-08-31", 25.17, "Resolución 1490 de julio 31 de 2025"],
    ["2025-07-01", "2025-07-31", 24.78, "Resolución 1254 de junio 27 de 2025"],
    ["2025-06-01", "2025-06-30", 25.55, "Resolución 1078 de mayo 30 de 2025"],
    ["2025-05-01", "2025-05-31", 25.97, "Resolución 0837 de abril 30 de 2025"],
    ["2025-04-01", "2025-04-30", 25.62, "Resolución 0579 de marzo 31 de 2025"],
    ["2025-03-01", "2025-03-31", 24.92, "Resolución 0352 de febrero 28 de 2025"],
    ["2025-02-01", "2025-02-28", 26.3, "Resolución 0138 de enero 30 de 2025"],
    ["2025-01-01", "2025-01-31", 24.89, "Resolución 2620 de diciembre 27 de 2024"],
    ["2024-12-01", "2024-12-31", 26.39, "Resolución 2394 de noviembre 30 de 2024"],
    ["2024-11-01", "2024-11-30", 27.9, "Resolución 2168 de octubre 31 de 2024"],
    ["2024-10-01", "2024-10-31", 28.17, "Resolución 1901 de septiembre 30 de 2024"],
    ["2024-09-01", "2024-09-30", 28.85, "Resolución 1688 de agosto 30 de 2024"],
    ["2024-08-01", "2024-08-31", 29.21, "Resolución 1519 de julio 31 de 2024"],
    ["2024-07-01", "2024-07-31", 29.49, "Resolución 1308 de junio 28 de 2024"],
    ["2024-06-01", "2024-06-30", 30.84, "Resolución 1143 de mayo 31 de 2024"],
    ["2024-05-01", "2024-05-31", 31.53, "Resolución 0872 de abril 30 de 2024"],
    ["2024-04-01", "2024-04-30", 33.09, "Resolución 0598 de marzo 21 de 2024"],
    ["2024-03-01", "2024-03-31", 33.3, "Resolución 0400 de febrero 29 de 2024"],
    ["2024-02-01", "2024-02-29", 34.97, "Resolución 0150 de enero 29 de 2024"],
    ["2024-01-01", "2024-01-31", 34.98, "Resolución 2331 de diciembre 29 de 2023"],
    ["2023-12-01", "2023-12-31", 37.56, "Resolución 2074 de noviembre 30 de 2023"],
    ["2023-11-01", "2023-11-30", 38.28, "Resolución 1801 de octubre 30 2023"],
    ["2023-10-01", "2023-10-31", 39.8, "Resolución 1520 de septiembre 27 de 2023"],
    ["2023-09-01", "2023-09-30", 42.05, "Resolución 1328 de agosto 31 de 2023"],
    ["2023-08-01", "2023-08-31", 43.13, "Resolución 1090 de julio 31 de 2023"],
    ["2023-07-01", "2023-07-31", 44.04, "Resolución 0945 de junio 30 de 2023"],
    ["2023-06-01", "2023-06-30", 44.64, "Resolución 0766 de mayo 31 de 2023"],
    ["2023-05-01", "2023-05-31", 45.41, "Resolución 0606 de abril 28 de 2023"],
    ["2023-04-01", "2023-04-30", 47.09, "Resolución 0472 de marzo 30 de 2023"],
    ["2023-03-01", "2023-03-31", 46.26, "Resolución 0236 de febrero 24 de 2023"],
    ["2023-02-01", "2023-02-28", 45.27, "Resolución 0100 de enero 27 de 2023"],
    ["2023-01-01", "2023-01-31", 43.26, "Resolución 1968 de diciembre 29 de 2022"],
    ["2022-12-01", "2022-12-31", 41.46, "Resolución 1715 de noviembre 30 de 2022"],
    ["2022-11-01", "2022-11-30", 38.67, "Resolución 1537 de octubre 28 de 2022"],
    ["2022-10-01", "2022-10-31", 36.915, "Resolución 1327 de septiembre 29 de 2022"],
    ["2022-09-01", "2022-09-30", 35.25, "Resolución 1126 de agosto 31 de 2022"],
    ["2022-08-01", "2022-08-31", 33.315, "Resolución 0973 de julio 29 de 2022"],
    ["2022-07-01", "2022-07-31", 31.92, "Resolución 0801 de junio 30 de 2022"],
    ["2022-06-01", "2022-06-30", 30.6, "Resolución 0617 de mayo 31 de 2022"],
    ["2022-05-01", "2022-05-31", 29.565, "Resolución 0498 de abril 29 de 2022"],
    ["2022-04-01", "2022-04-30", 28.575, "Resolución 0382 de marzo 31 de 2022"],
    ["2022-03-01", "2022-03-31", 27.71, "Resolución 0256 de febrero 25 de 2022"],
    ["2022-02-01", "2022-02-28", 27.45, "Resolución 0143 de enero 28 de 2022"],
    ["2022-01-01", "2022-01-31", 26.49, "Resolución 1597 de diciembre 30 de 2021"],
    ["2021-12-01", "2021-12-31", 26.19, "Resolución 1405 de noviembre 30 de 2021"],
    ["2021-11-01", "2021-11-30", 25.91, "Resolución 1259 de octubre 29 de 2021"],
    ["2021-10-01", "2021-10-31", 25.62, "Resolución 1095 de septiembre 30 de 2021"],
    ["2021-09-01", "2021-09-30", 25.79, "Resolución 0931 de agosto 30 de 2021"],
    ["2021-08-01", "2021-08-31", 25.86, "Resolución 0804 de julio 30 de 2021"],
    ["2021-07-01", "2021-07-31", 25.77, "Resolución 0622 de junio 30 de 2021"],
    ["2021-06-01", "2021-06-30", 25.82, "Resolución 0509 de mayo 28 de 2021"],
    ["2021-05-01", "2021-05-31", 25.83, "Resolución 0407 de abril 30 de 2021"],
    ["2021-04-01", "2021-04-30", 25.97, "Resolución 0305 de marzo 31 de 2021"],
    ["2021-03-01", "2021-03-31", 26.12, "Resolución 0161 de febrero 26 de 2021"],
    ["2021-02-01", "2021-02-28", 26.31, "Resolución 0064 de enero 29 de 2021"],
    ["2021-01-01", "2021-01-31", 25.98, "Resolución 1215 de diciembre 30 de 2020"],
    ["2020-12-01", "2020-12-31", 26.19, "Resolución 1034 de noviembre 26 de 2020"],
    ["2020-11-01", "2020-11-30", 26.76, "Resolución 0947 de octubre 29 de 2020"],
    ["2020-10-01", "2020-10-31", 27.14, "Resolución 0869 de septiembre 30 de 2020"],
    ["2020-09-01", "2020-09-30", 27.53, "Resolución 0769 de agosto 28 de 2020"],
    ["2020-08-01", "2020-08-31", 27.44, "Resolución 0685 de julio 31 de 2020"],
    ["2020-07-01", "2020-07-31", 27.18, "Resolución 0605 de junio 30 de 2020"],
    ["2020-06-01", "2020-06-30", 27.18, "Resolución 0505 de mayo 29 de 2020"],
    ["2020-05-01", "2020-05-31", 27.29, "Resolución 000437 de abril 30 de 2020"],
    ["2020-04-01", "2020-04-30", 28.04, "Resolución 000351 de marzo 27 de 2020"],
    ["2020-03-01", "2020-03-31", 28.43, "Resolución 000205 de febrero 27 de 2020"],
    ["2020-02-01", "2020-02-29", 28.59, "Resolución 0094 de enero 30 de 2020"],
    ["2020-01-01", "2020-01-31", 28.16, "Resolución 1768 de diciembre 27 de 2019"],
    ["2019-12-01", "2019-12-31", 28.37, "Resolución 1603 de noviembre 29 de 2019"],
    ["2019-11-01", "2019-11-30", 28.55, "Resolución 1474 de octubre 30 de 2019"],
    ["2019-10-01", "2019-10-31", 28.65, "Resolución 1293 de septiembre 30 de 2019"],
    ["2019-09-01", "2019-09-30", 28.98, "Resolución 1145 de agosto 30 de 2019"],
    ["2019-08-01", "2019-08-31", 28.98, "Resolución 1018 de julio 31 de 2019"],
    ["2019-07-01", "2019-07-31", 28.92, "Resolución 0829 de junio 28 de 2019"],
    ["2019-06-01", "2019-06-30", 28.95, "Resolución 0697 de mayo 30 de 2019"],
    ["2019-05-01", "2019-05-31", 29.01, "Resolución 0574 de abril 30 de 2019"],
    ["2019-04-01", "2019-04-30", 28.98, "Resolución 0389 de marzo 29 de 2019"],
    ["2019-03-01", "2019-03-31", 29.06, "Resolución 0263 de febrero 28 de 2019"],
    ["2019-02-01", "2019-02-28", 29.55, "Resolución 0111 de enero 31 de 2019"],
    ["2019-01-01", "2019-01-31", 28.74, "Resolución 1872 de diciembre 27 de 2018"],
    ["2018-12-01", "2018-12-31", 29.1, "Resolución 1708 de noviembre 29 de 2018"],
    ["2018-11-01", "2018-11-30", 29.24, "Resolución 1521 de octubre 28 de 2018"],
    ["2018-10-01", "2018-10-31", 29.45, "Resolución 1294 de septiembre 28 de 2018"],
    ["2018-09-01", "2018-09-30", 29.72, "Resolución 1112 de agosto 31 de 2018"],
    ["2018-08-01", "2018-08-31", 29.91, "Resolución 0954 de julio 31 de 2018"],
    ["2018-07-01", "2018-07-31", 30.05, "Resolución 0820 de junio 28 de 2018"],
    ["2018-06-01", "2018-06-30", 30.42, "Resolución 0687 de mayo 30 de 2018"],
    ["2018-05-01", "2018-05-31", 30.66, "Resolución 0527 de abril 27 de 2018"],
    ["2018-04-01", "2018-04-30", 30.72, "Resolución 0398 de marzo 28 de 2018"],
    ["2018-03-01", "2018-03-31", 31.02, "Resolución 0259 de febrero 28 de 2018"],
    ["2018-02-01", "2018-02-28", 31.52, "Resolución 0131 de enero 31 de 2018"],
    ["2018-01-01", "2018-01-31", 31.04, "Resolución 1890 de diciembre 28 de 2017"],
    ["2017-12-01", "2017-12-31", 31.16, "Resolución 1619 de noviembre 29 de 2017"],
    ["2017-11-01", "2017-11-30", 31.44, "Resolución 1447 de octubre 27 de 2017"],
    ["2017-10-01", "2017-10-31", 31.73, "Resolución 1298 de septiembre 29 de 2017"],
    ["2017-09-01", "2017-09-30", 32.22, "Resolución 1155 de agosto 30 de 2017"],
    ["2017-07-01", "2017-08-31", 32.97, "Resolución 907 de junio 30 de 2017"],
    ["2017-04-01", "2017-06-30", 33.5, "Resolución 0488 de marzo 28 de 2017"],
    ["2017-01-01", "2017-03-31", 33.51, "Resolución 1612 de diciembre 26 de 2016"],
    ["2016-10-01", "2016-12-31", 32.99, "Resolución 1233 de septiembre 29 de 2016"],
    ["2016-07-01", "2016-09-30", 32.01, "Resolución 0811 de junio 28 de 2016"],
    ["2016-04-01", "2016-06-30", 30.81, "Resolución 0334 de marzo 29 de 2016"],
    ["2016-01-01", "2016-03-31", 29.52, "Resolución 1788 de diciembre 28 de 2015"],
    ["2015-10-01", "2015-12-31", 29, "Resolución 1341 de septiembre 29 de 2015"],
    ["2015-07-01", "2015-09-30", 28.89, "Resolución 913 de junio 30 de 2015"],
    ["2015-04-01", "2015-06-30", 29.06, "Resolución 369 de marzo 30 de 2015"],
    ["2015-01-01", "2015-03-31", 28.82, "Resolución 2359 de diciembre 30 de 2014"],
    ["2014-10-01", "2014-12-31", 28.76, "Resolución 1707 de septiembre 30 de 2014"]
  ];

  var LS_TASAS = 'jj-liq-mora-tasas-v1', LS_DATOS = 'jj-liq-mora-datos-v1';
  var DIA = 86400000;
  var nf = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });
  function pct(x, d) { d = d == null ? 2 : d; return x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' %'; }
  function pesos(x) { return '$' + nf.format(Math.round(x)); }
  function diaria(u) { return ((u - 2) / 365).toLocaleString('es-CO', { maximumFractionDigits: 6 }) + ' %'; }
  function aUTC(s) { if (!s) return null; var p = s.split('-').map(Number); return Date.UTC(p[0], p[1] - 1, p[2]); }
  function iso(t) { return new Date(t).toISOString().slice(0, 10); }
  function legible(t) { return new Date(t).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(id) { return document.getElementById(id); }

  /* ---------- Tasas (base + las que agregue el usuario) ---------- */
  var propias = [];
  try { propias = JSON.parse(localStorage.getItem(LS_TASAS) || '[]'); } catch (e) {}
  function guardarPropias() { try { localStorage.setItem(LS_TASAS, JSON.stringify(propias)); } catch (e) {} }
  function tasas() {
    var m = {};
    TASAS.forEach(function (r) { m[r[0]] = { desde: r[0], hasta: r[1], usura: r[2], res: r[3], propia: false }; });
    propias.forEach(function (r) { m[r.desde] = { desde: r.desde, hasta: r.hasta, usura: r.usura, res: r.res, propia: true }; });
    return Object.keys(m).map(function (k) { return m[k]; }).sort(function (a, b) { return b.desde.localeCompare(a.desde); });
  }
  function tasaPara(t) {
    var s = iso(t), lista = tasas();
    for (var i = 0; i < lista.length; i++) if (lista[i].desde <= s && s <= lista[i].hasta) return lista[i];
    return null;
  }

  /* ---------- Estado ---------- */
  var hoy = new Date();
  var hoyISO = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())).toISOString().slice(0, 10);
  var estado = {
    pago: hoyISO, redondeo: 'up', metodo: 'unica',
    obl: [
      { c: 'Ejemplo: renta AG 2020', v: 8597000, f: '2021-08-03' },
      { c: 'Ejemplo: retención en la fuente sep. 2025', v: 2350000, f: '2025-10-21' }
    ]
  };
  try {
    var g = JSON.parse(localStorage.getItem(LS_DATOS) || 'null');
    if (g && g.obl && g.obl.length) { estado.obl = g.obl; estado.redondeo = g.redondeo || 'up'; estado.metodo = g.metodo || 'unica'; }
  } catch (e) {}
  function persistir() { try { localStorage.setItem(LS_DATOS, JSON.stringify(estado)); } catch (e) {} }

  function redondear(x) {
    if (estado.redondeo === 'up') return Math.ceil(x / 1000 - 1e-9) * 1000;
    if (estado.redondeo === 'near') return Math.round(x / 1000) * 1000;
    return Math.round(x);
  }

  /* ---------- Cálculo ---------- */
  function liquidar(o, pagoT) {
    var venc = aUTC(o.f), K = Number(o.v) || 0;
    if (!venc || !K) return { ok: false, msg: 'Faltan datos' };
    var dias = Math.max(0, Math.round((pagoT - venc) / DIA));
    if (dias === 0) return { ok: true, dias: 0, bruto: 0, interes: 0, tramos: [] };
    if (estado.metodo === 'unica') {
      var r = tasaPara(pagoT);
      if (!r) return { ok: false, dias: dias, msg: 'Falta la tasa del mes de pago' };
      var td = (r.usura - 2) / 100 / 365, b = K * td * dias;
      return { ok: true, dias: dias, bruto: b, interes: redondear(b), td: td,
        tramos: [{ desde: venc + DIA, hasta: pagoT, dias: dias, usura: r.usura, td: td, int: b }] };
    }
    var tramos = [], t = venc + DIA, bruto = 0;
    while (t <= pagoT) {
      var rt = tasaPara(t);
      if (!rt) return { ok: false, dias: dias, msg: 'Falta tasa para ' + legible(t) };
      var fin = Math.min(aUTC(rt.hasta), pagoT), d = Math.round((fin - t) / DIA) + 1;
      var tdm = (rt.usura - 2) / 100 / 365, it = K * tdm * d;
      tramos.push({ desde: t, hasta: fin, dias: d, usura: rt.usura, td: tdm, int: it });
      bruto += it; t = fin + DIA;
    }
    return { ok: true, dias: dias, bruto: bruto, interes: redondear(bruto), tramos: tramos };
  }

  /* ---------- Filas de obligaciones ---------- */
  var tbody = document.querySelector('#obl tbody');
  function pintarFilas() {
    tbody.innerHTML = '';
    estado.obl.forEach(function (o, i) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><input id="c' + i + '" aria-label="Concepto o período"></td>' +
        '<td><input id="v' + i + '" class="num" inputmode="numeric" aria-label="Valor en mora"></td>' +
        '<td><input id="f' + i + '" type="date" aria-label="Fecha de vencimiento"></td>' +
        '<td class="n" id="d' + i + '">—</td><td class="n" id="i' + i + '">—</td>' +
        '<td><button class="liq-quitar" type="button" aria-label="Quitar obligación" data-quitar="' + i + '">✕</button></td>';
      tbody.appendChild(tr);
      var c = $('c' + i), v = $('v' + i), f = $('f' + i);
      c.value = o.c; v.value = o.v ? nf.format(o.v) : ''; f.value = o.f;
      c.addEventListener('input', function () { o.c = c.value; calcular(); });
      v.addEventListener('input', function () { o.v = Number(v.value.replace(/[^\d]/g, '')); calcular(); });
      v.addEventListener('blur', function () { v.value = o.v ? nf.format(o.v) : ''; });
      f.addEventListener('input', function () { o.f = f.value; calcular(); });
    });
    tbody.querySelectorAll('[data-quitar]').forEach(function (b) {
      b.addEventListener('click', function () {
        estado.obl.splice(Number(b.getAttribute('data-quitar')), 1);
        if (!estado.obl.length) estado.obl.push({ c: '', v: 0, f: '' });
        pintarFilas(); calcular();
      });
    });
  }
  $('add').addEventListener('click', function () {
    estado.obl.push({ c: '', v: 0, f: '' }); pintarFilas(); calcular();
    $('c' + (estado.obl.length - 1)).focus();
  });

  var fpago = $('fpago'), red = $('redondeo');
  fpago.value = estado.pago; red.value = estado.redondeo;
  $(estado.metodo === 'mes' ? 'm-mes' : 'm-unica').checked = true;
  fpago.addEventListener('input', function () { estado.pago = fpago.value; calcular(); });
  red.addEventListener('change', function () { estado.redondeo = red.value; calcular(); });
  document.querySelectorAll('input[name="metodo"]').forEach(function (r) {
    r.addEventListener('change', function () { estado.metodo = r.value; calcular(); });
  });

  /* ---------- Resultado ---------- */
  var textoCopia = '';
  function calcular() {
    persistir();
    var pagoT = aUTC(estado.pago), alertas = [], cap = 0, intT = 0, res = [];
    estado.obl.forEach(function (o, i) {
      var dEl = $('d' + i), iEl = $('i' + i);
      if (!pagoT) { dEl.textContent = '—'; iEl.textContent = '—'; res.push(null); return; }
      var r = liquidar(o, pagoT); res.push(r);
      if (!r.ok) {
        dEl.textContent = r.dias != null ? nf.format(r.dias) : '—';
        iEl.innerHTML = o.v && o.f ? '<span class="liq-chip error">' + esc(r.msg) + '</span>' : '—';
        return;
      }
      dEl.textContent = nf.format(r.dias); iEl.textContent = pesos(r.interes);
      cap += Number(o.v) || 0; intT += r.interes;
      var venc = aUTC(o.f);
      if (venc && (pagoT - venc) / DIA > 365 * 5 + 1)
        alertas.push({ t: '<b>' + esc(o.c || 'Obligación ' + (i + 1)) + '</b> tiene más de cinco años de vencida. Revise la prescripción de la acción de cobro (art. 817 ET) y la firmeza de la declaración.' });
    });
    var r0 = pagoT ? tasaPara(pagoT) : null;
    if (pagoT && !r0) alertas.unshift({ error: true, t: 'No hay tasa de usura para ' + new Date(pagoT).toLocaleDateString('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' }) + '. Agréguela en la tabla de tasas, al final de la página.' });
    if (pagoT && pagoT < aUTC(hoyISO)) alertas.push({ t: 'La fecha de pago es anterior a hoy: el cálculo usa la tasa vigente en esa fecha.' });
    $('alerts').innerHTML = alertas.map(function (a) { return '<div class="liq-alerta' + (a.error ? ' error' : '') + '">' + a.t + '</div>'; }).join('');

    var mes = estado.metodo === 'mes';
    $('r-total').textContent = pesos(cap + intT);
    $('r-cap').textContent = pesos(cap);
    $('r-int').textContent = pesos(intT);
    $('r-fecha').textContent = pagoT ? legible(pagoT) : '—';
    $('r-usura').textContent = r0 ? (mes ? 'Varía · al pago ' + pct(r0.usura) : pct(r0.usura)) : '—';
    $('r-tm').textContent = r0 ? (mes ? 'Varía por mes' : pct(r0.usura - 2)) : '—';
    $('r-td').textContent = r0 ? (mes ? 'Varía por mes' : diaria(r0.usura)) : '—';
    $('r-res').textContent = r0 ? r0.res : '—';

    pintarDetalle(res);

    var L = ['LIQUIDACIÓN DE INTERESES DE MORA (art. 635 ET)', 'JJ Contadores & Asociados', 'Fecha de pago: ' + (pagoT ? legible(pagoT) : '—'),
      'Criterio: ' + (mes ? 'tasa de cada mes de mora' : 'tasa vigente a la fecha de pago' + (r0 ? ' (usura ' + pct(r0.usura) + ' − 2 = ' + pct(r0.usura - 2) + '; ' + r0.res + ')' : '')), ''];
    estado.obl.forEach(function (o, i) {
      var r = res[i];
      if (r && r.ok) L.push((o.c || 'Obligación ' + (i + 1)) + ' | venc. ' + legible(aUTC(o.f)) + ' | capital ' + pesos(o.v) + ' | ' + r.dias + ' días | intereses ' + pesos(r.interes));
    });
    L.push('', 'Capital: ' + pesos(cap), 'Intereses: ' + pesos(intT), 'TOTAL A PAGAR: ' + pesos(cap + intT));
    textoCopia = L.join('\n');
  }

  function pintarDetalle(res) {
    var partes = [];
    estado.obl.forEach(function (o, i) {
      var r = res[i];
      if (!r || !r.ok || !r.dias) return;
      var filas = r.tramos.map(function (t) {
        return '<tr><td>' + legible(t.desde) + '</td><td>' + legible(t.hasta) + '</td><td class="n">' + nf.format(t.dias) +
          '</td><td class="n">' + pct(t.usura) + '</td><td class="n">' + diaria(t.usura) + '</td><td class="n">' + pesos(t.int) + '</td></tr>';
      }).join('');
      var linea = estado.metodo === 'unica'
        ? pesos(o.v) + ' × ' + diaria(r.tramos[0].usura) + ' × ' + nf.format(r.dias) + ' días = ' + pesos(r.bruto)
        : 'Suma de ' + r.tramos.length + ' tramos mensuales';
      partes.push('<div class="liq-detalle-item">' +
        '<div class="liq-detalle-cab"><strong>' + esc(o.c || 'Obligación ' + (i + 1)) + '</strong><span class="liq-chip">' + nf.format(r.dias) + ' días de mora</span></div>' +
        '<div class="liq-tabla-caja"><table class="liq-tabla"><thead><tr><th>Desde</th><th>Hasta</th><th class="n">Días</th><th class="n">Usura</th><th class="n">Tasa diaria</th><th class="n">Interés</th></tr></thead>' +
        '<tbody>' + filas + '</tbody><tfoot>' +
        '<tr><td colspan="5">Interés calculado ' + pesos(r.bruto) + ', redondeado</td><td class="n"><b>' + pesos(r.interes) + '</b></td></tr>' +
        '<tr><td colspan="5">Total obligación (capital + intereses)</td><td class="n"><b>' + pesos((Number(o.v) || 0) + r.interes) + '</b></td></tr>' +
        '</tfoot></table></div><p class="liq-formula-linea">' + linea + '</p></div>');
    });
    $('detalle').innerHTML = partes.length ? partes.join('') : '<p class="liq-nota">Complete el valor, la fecha de vencimiento y la fecha de pago para ver el detalle.</p>';
  }

  /* ---------- Copiar ---------- */
  $('copiar').addEventListener('click', function () {
    var aviso = $('toast'), ta = $('copytxt');
    function respaldo() { ta.hidden = false; ta.value = textoCopia; ta.focus(); ta.select(); aviso.textContent = 'Seleccione el texto y cópielo con Ctrl+C.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textoCopia).then(function () { ta.hidden = true; aviso.textContent = 'Liquidación copiada al portapapeles.'; }, respaldo);
    } else respaldo();
  });

  /* ---------- Tabla de tasas ---------- */
  function pintarTasas() {
    $('t-body').innerHTML = tasas().map(function (r) {
      return '<tr class="' + (r.propia ? 'propia' : '') + '"><td>' + r.desde + '</td><td>' + r.hasta + '</td><td class="n">' + pct(r.usura) +
        '</td><td class="n">' + pct(r.usura - 2) + '</td><td class="n">' + diaria(r.usura) + '</td><td>' + esc(r.res) +
        (r.propia ? ' <span class="liq-chip">agregada</span>' : '') + '</td><td>' +
        (r.propia ? '<button class="liq-quitar" type="button" aria-label="Quitar tasa" data-tasa="' + r.desde + '">✕</button>' : '') + '</td></tr>';
    }).join('');
    $('t-body').querySelectorAll('[data-tasa]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-tasa');
        propias = propias.filter(function (p) { return p.desde !== k; });
        guardarPropias(); pintarTasas(); calcular();
      });
    });
  }
  $('t-add').addEventListener('click', function () {
    var m = $('t-mes').value, u = parseFloat(String($('t-usura').value).replace(',', '.')), aviso = $('t-toast');
    var resol = $('t-res').value.trim() || 'Agregada por el usuario';
    if (!m || !(u > 2 && u < 100)) { aviso.textContent = 'Indique el mes y una tasa de usura válida, por ejemplo 28,34.'; return; }
    var p = m.split('-').map(Number), ult = new Date(Date.UTC(p[0], p[1], 0)).toISOString().slice(0, 10);
    propias = propias.filter(function (x) { return x.desde !== m + '-01'; });
    propias.push({ desde: m + '-01', hasta: ult, usura: u, res: resol });
    guardarPropias(); pintarTasas(); calcular();
    aviso.textContent = 'Tasa de ' + m + ' guardada.';
  });
  (function () { var d = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1); $('t-mes').value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); })();

  pintarFilas(); pintarTasas(); calcular();
})();
