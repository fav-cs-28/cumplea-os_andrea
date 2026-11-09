/* ==========================================================
   CUMPLEAÑOS DE ANDERA · script.js
   Índice:
   1. Configuración  (¡lo que vas a editar!)
   2. Ayudantes y elementos de la página
   3. Saludo según la hora y contador
   4. Partículas, pétalos y chispas
   5. Galería de fotos
   6. Visor para ampliar fotos
   7. Aparición al desplazarse
   8. Deseos y foto sorpresa
   9. Música
   10. Sorpresa final
   11. Apertura del sobre
   12. Arranque
   ========================================================== */

"use strict";

/* Avisamos al CSS de que JavaScript funciona (activa las animaciones) */
document.documentElement.classList.add("js");

/* Al recargar, el navegador no debe recordar la posición del scroll */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";


/* ==========================================================
   1. CONFIGURACIÓN
   ========================================================== */

/* Fecha del cumpleaños (mes: 1 = enero ... 11 = noviembre) */
const FECHA_CUMPLE = { anio: 2026, mes: 11, dia: 9 };

/* Volumen de la música, de 0 (silencio) a 1 (máximo) */
const VOLUMEN_MUSICA = 0.7;

/* Carpeta donde guardas las fotos */
const RUTA_FOTOS = "img/galeria/";
/* Canción que suena al abrir una foto (archivo dentro de audio/) */
const CANCION_FOTOS = "audio/foto.mp3";
const VOLUMEN_CANCION_FOTO = 0.8;

/* ✏️ TUS FOTOS: una línea por foto.
   - archivo: nombre exacto del archivo dentro de img/galeria/
   - frase:   texto bajo la foto (puede ser "" si no quieres frase)
   - tamano:  "pequeno", "mediano" o "grande"
   - formato: "cuadrado", "vertical" u "horizontal" (la forma de la foto)
   Para añadir una foto: copia una línea, pégala y cambia los datos.
   Para quitarla: borra la línea. No te olvides de las comas. */
const FOTOS = [
  { archivo: "16.jpeg", frase: "You are my cinema I could watching for ever", tamano: "grande",  formato: "horizontal", cancion: "cinema.mp3" },
  { archivo: "21.jpeg", frase: "Eres Tú la luz de mi camino",tamano: "mediano", formato: "vertical" , cancion: "luzde.mp3"  },
  { archivo: "04.jpg", frase: "En esos tus ojos dulces quiero mirarme por siempre, amor", tamano: "mediano", formato: "cuadrado" , cancion: "miNuevPri.mp3"  },
  { archivo: "12.jpg", frase: "Yo te propongo de madrugada si estás cansada darte mis brazos y en un abrazo hacerte a ti dormir", tamano: "pequeno", formato: "vertical" , cancion: "propongo.mp3"   },
  { archivo: "24.jpeg", frase: "Dejaría todo porque vengas a mi encuentro", tamano: "pequeno", formato: "cuadrado" , cancion: "cantarina.mp3"   },
  { archivo: "08.jpg", frase: "Tú eres mi Clara, y contigo cada instante se convierte en un cuento de magia",tamano: "pequeno", formato: "vertical" , cancion: "pasdedeux.mp3"   },
  { archivo: "01.jpg", frase: "Mi recuerdo mas feliz para invocar mi patronum", tamano: "grande",  formato: "horizontal" , cancion: "children.mp3" },
  { archivo: "05.jpg", frase: "Tú lo eres todo, todo en mi vida",tamano: "mediano", formato: "cuadrado" , cancion: "todoen.mp3"   },
  { archivo: "15.jpeg", frase: "Conocerte fue mi suerte, amarte es un placer", tamano: "mediano", formato: "cuadrado", cancion: "amarte.mp3" },
  { archivo: "28.jpeg", frase: "Si al final esta vida es un sueño, solo sé que a tu lado me quiero despertar", tamano: "pequeno", formato: "vertical" , cancion: "talisman.mp3 "},
  { archivo: "26.jpeg", frase: "No pienso dar ni un paso atrás, en el camino que me lleve hacia tus besos", tamano: "pequeno", formato: "cuadrado" , cancion: "correcta.mp3" },
];

/* ==========================================================
   2. AYUDANTES Y ELEMENTOS DE LA PÁGINA
   ========================================================== */
const $ = (id) => document.getElementById(id);                       // atajo para buscar por id
const azar = (min, max) => Math.random() * (max - min) + min;        // número al azar
const esMovil = () => window.matchMedia("(max-width: 800px)").matches;
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const invitacion = $("invitacion");
const sobre = $("sobre");
const btnAbrir = $("btn-abrir");
const contenido = $("contenido");

const musica = $("musica");
const btnMusica = $("btn-musica");
const iconoMusica = $("icono-musica");
const musicaFoto = $("musica-foto");

const visor = $("visor");
const visorImg = $("visor-img");
const visorTexto = $("visor-texto");

/* Guardamos la dedicatoria original para escribirla letra a letra después */
const textoDedicatoria = $("dedicatoria-texto").textContent.trim();


/* ==========================================================
   3. SALUDO SEGÚN LA HORA Y CONTADOR
   ========================================================== */
function mostrarSaludo() {
  const hora = new Date().getHours();
  let saludo = "Buenas noches";
  if (hora >= 6 && hora < 12) saludo = "Buenos días";
  else if (hora >= 12 && hora < 20) saludo = "Buenas tardes";
  $("saludo-hora").textContent = saludo;
}

function mostrarContador() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);                       // medianoche de hoy
  const cumple = new Date(FECHA_CUMPLE.anio, FECHA_CUMPLE.mes - 1, FECHA_CUMPLE.dia);
  const dias = Math.round((cumple - hoy) / 86400000);   // milisegundos en un día

  let texto;
  if (dias > 1)        texto = `Faltan ${dias} días para tu día`;
  else if (dias === 1) texto = "Mañana es tu día";
  else if (dias === 0) texto = "Hoy es tu día";
  else                 texto = "Celebrando tu día";

  $("contador").textContent = "✦ " + texto + " ✦";
}


/* ==========================================================
   4. PARTÍCULAS, PÉTALOS Y CHISPAS
   Crean pequeños elementos <span> con valores al azar.
   El CSS se encarga de moverlos.
   ========================================================== */
function crearParticulas(contenedor, cantidad) {
  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement("span");
    p.className = "particula";
    p.style.left = azar(0, 100) + "%";
    p.style.setProperty("--t", azar(2, 5) + "px");
    p.style.setProperty("--dur", azar(9, 16) + "s");
    p.style.setProperty("--ret", "-" + azar(0, 14) + "s");   // retraso negativo: ya están a medio camino
    contenedor.appendChild(p);
  }
}

function crearPetalos(contenedor, cantidad, esRafaga) {
  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement("span");
    p.className = "petalo";
    p.style.left = azar(0, 100) + "%";
    p.style.setProperty("--t", azar(9, 16) + "px");
    p.style.setProperty("--dur", azar(9, 16) + "s");
    p.style.setProperty("--deriva", azar(-60, 90) + "px");
    p.style.setProperty("--ret", esRafaga ? azar(0, 4) + "s" : "-" + azar(0, 12) + "s");
    contenedor.appendChild(p);
  }
}

function crearChispas(contenedor, cantidad) {
  for (let i = 0; i < cantidad; i++) {
    const c = document.createElement("span");
    c.className = "chispa";
    c.style.left = azar(4, 96) + "%";
    c.style.top = azar(4, 96) + "%";
    c.style.setProperty("--ret", azar(0, 2.5) + "s");
    contenedor.appendChild(c);
  }
}

/* Pausa los pétalos cuando su sección no se ve (ahorra batería) */
function vigilarAnimaciones(seccion) {
  const observador = new IntersectionObserver((entradas) => {
    const estado = entradas[0].isIntersecting ? "running" : "paused";
    seccion.querySelectorAll(".petalo, .chispa").forEach((el) => {
      el.style.animationPlayState = estado;
    });
  });
  observador.observe(seccion);
}


/* ==========================================================
   5. GALERÍA DE FOTOS
   Lee la lista FOTOS y crea una polaroid por cada una.
   ========================================================== */
function construirGaleria() {
  const galeria = $("galeria");
  const giros = [-3, 2, -1.5, 3, -2.5, 1.5];          // inclinaciones, se repiten en ciclo
  const formatos = { cuadrado: "1 / 1", vertical: "4 / 5", horizontal: "4 / 3" };

  FOTOS.forEach((foto, i) => {
    const figura = document.createElement("figure");
    figura.className = "polaroid polaroid-" + (foto.tamano || "mediano");
    figura.style.setProperty("--giro", giros[i % giros.length] + "deg");
    figura.style.setProperty("--ret", (i % 3) * 0.12 + "s");
    figura.tabIndex = 0;
    figura.setAttribute("role", "button");
    figura.setAttribute("aria-label", "Ampliar foto " + (i + 1));

    const img = document.createElement("img");
    img.src = RUTA_FOTOS + foto.archivo;
    img.alt = foto.frase || "Recuerdo " + (i + 1);
    img.loading = "lazy";                              // carga la foto solo al acercarse
    img.decoding = "async";
    img.style.aspectRatio = formatos[foto.formato] || formatos.cuadrado;
    img.addEventListener("error", () => {
      console.warn("⚠️ No se encontró la foto: " + img.getAttribute("src"));
    });

    const pie = document.createElement("figcaption");
    pie.textContent = foto.frase || "";

    figura.append(img, pie);
    figura.addEventListener("click", () => abrirVisor(i, figura));
    figura.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrirVisor(i, figura); }
    });

    galeria.appendChild(figura);
  });
}

//Seccion 6: Visor para ampliar fotos

let fotoActual = 0;
let elementoOrigen = null;
let xInicio = 0;

let fondoSonaba = false;   // ¿sonaba la música de fondo antes de abrir la foto?

function reproducirCancionFoto(foto) {
  /* Si es la primera foto abierta, recordamos si la música de fondo sonaba */
  if (!visor.classList.contains("abierto")) fondoSonaba = !musica.paused;

  /* Si la foto tiene su propia canción, la usa; si no, la de siempre */
  const ruta = foto.cancion ? "audio/" + foto.cancion : CANCION_FOTOS;
  if (musicaFoto.getAttribute("src") !== ruta) {
    musicaFoto.src = ruta;
    musicaFoto.currentTime = 0;
  }

  musicaFoto.volume = VOLUMEN_CANCION_FOTO;
  const promesa = musicaFoto.play();
  if (promesa !== undefined) {
    promesa
      .then(() => { if (!musica.paused) musica.pause(); })   // pausa el fondo solo si la canción sí suena
      .catch((error) => {
        console.warn("⚠️ No se pudo reproducir la canción de la foto. ¿Existe " + ruta + "?", error);
      });
  }
}

function mostrarFotoEnVisor(indice) {
  fotoActual = (indice + FOTOS.length) % FOTOS.length;   // da la vuelta al llegar al final
  const foto = FOTOS[fotoActual];
  visorImg.src = RUTA_FOTOS + foto.archivo;
  visorImg.alt = foto.frase || "Recuerdo";
  visorTexto.textContent = foto.frase || "";
  reproducirCancionFoto(foto);
}

function abrirVisor(indice, desde) {
  elementoOrigen = desde;
  mostrarFotoEnVisor(indice);
  visor.classList.add("abierto");
  visor.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";               // evita mover la página de fondo
  $("visor-cerrar").focus();
}

function cerrarVisor() {
  visor.classList.remove("abierto");
  visor.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (elementoOrigen) elementoOrigen.focus();

  /* Se detiene la canción de la foto y vuelve la música de fondo */
  musicaFoto.pause();
  musicaFoto.currentTime = 0;
  if (fondoSonaba) reproducirMusica(true);
}

function activarVisor() {
  $("visor-cerrar").addEventListener("click", cerrarVisor);
  $("visor-anterior").addEventListener("click", () => mostrarFotoEnVisor(fotoActual - 1));
  $("visor-siguiente").addEventListener("click", () => mostrarFotoEnVisor(fotoActual + 1));

  /* Clic en el fondo (fuera de la foto) cierra */
  visor.addEventListener("click", (e) => { if (e.target === visor) cerrarVisor(); });

  /* Teclado: Esc cierra, flechas cambian de foto */
  document.addEventListener("keydown", (e) => {
    if (!visor.classList.contains("abierto")) return;
    if (e.key === "Escape")     cerrarVisor();
    if (e.key === "ArrowLeft")  mostrarFotoEnVisor(fotoActual - 1);
    if (e.key === "ArrowRight") mostrarFotoEnVisor(fotoActual + 1);
  });

  /* Celular: deslizar con el dedo */
  visor.addEventListener("touchstart", (e) => { xInicio = e.changedTouches[0].clientX; }, { passive: true });
  visor.addEventListener("touchend", (e) => {
    const diferencia = e.changedTouches[0].clientX - xInicio;
    if (Math.abs(diferencia) > 50) mostrarFotoEnVisor(fotoActual + (diferencia < 0 ? 1 : -1));
  });
}

/* ==========================================================
   7. APARICIÓN AL DESPLAZARSE
   Cuando un elemento entra en pantalla, le ponemos la clase
   "visible" y el CSS hace la animación.
   ========================================================== */
function activarAparicionAlDesplazar() {
  /* Textos que aparecen con un ascenso suave */
  document.querySelectorAll(
    ".encabezado-seccion .subtitulo, .encabezado-seccion .titulo-seccion, " +
    ".contador, .frase-hoy, .indicador-scroll, #carta-hoja > *"
  ).forEach((el) => el.classList.add("revelar"));

  /* Pequeños retrasos para que aparezcan en orden en la primera pantalla */
  $("contador").style.transitionDelay = "0s";
  document.querySelector(".frase-hoy").style.transitionDelay = "1.8s";
  document.querySelector(".indicador-scroll").style.transitionDelay = "2.6s";

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("visible");
      obs.unobserve(entrada.target);                    // ya apareció: dejamos de vigilarlo
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });

  const objetivos = [
    ...document.querySelectorAll(".revelar"),
    ...[...document.querySelectorAll(".linea-dorada")].filter((el) => !el.closest("#dedicatoria")),
    ...document.querySelectorAll(".titulo-grande, .flor, #galeria .polaroid, .deseo, .carta")
  ];
  objetivos.forEach((el) => observador.observe(el));
}


/* ==========================================================
   8. DESEOS Y FOTO SORPRESA
   ========================================================== */
function activarDeseos() {
  document.querySelectorAll(".deseo").forEach((deseo, i) => {
    deseo.style.setProperty("--ret", (i % 3) * 0.15 + "s");
    deseo.tabIndex = 0;
    deseo.setAttribute("role", "button");

    const brillar = () => {
      deseo.classList.add("brillo");
      setTimeout(() => deseo.classList.remove("brillo"), 1800);
    };
    deseo.addEventListener("click", brillar);
    deseo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); brillar(); }
    });
  });
}

function activarFotoSorpresa() {
  const boton = $("destello-secreto");
  const foto = $("foto-sorpresa");

  boton.addEventListener("click", () => {
    const mostrar = !foto.classList.contains("revelada");
    foto.classList.toggle("revelada", mostrar);
    foto.setAttribute("aria-hidden", mostrar ? "false" : "true");
    if (mostrar) {
      setTimeout(() => foto.scrollIntoView({ behavior: "smooth", block: "center" }), 900);
    }
  });
}


/* ==========================================================
   9. MÚSICA
   ========================================================== */
function actualizarBotonMusica() {
  const sonando = !musica.paused;
  btnMusica.classList.toggle("sonando", sonando);
  iconoMusica.textContent = sonando ? "❚❚" : "▶\uFE0E";
}

function subirVolumen() {
  const reloj = setInterval(() => {
    musica.volume = Math.min(VOLUMEN_MUSICA, musica.volume + 0.05);
    if (musica.volume >= VOLUMEN_MUSICA) clearInterval(reloj);
  }, 200);
}

function reproducirMusica(conFundido) {
  musica.volume = conFundido ? 0 : VOLUMEN_MUSICA;
  const promesa = musica.play();
  if (promesa !== undefined) {
    promesa
      .then(() => { if (conFundido) subirVolumen(); })
      .catch((error) => {
        console.warn("⚠️ No se pudo reproducir la música. ¿Existe el archivo audio/musica.mp3?", error);
      });
  }
}

function activarMusica() {
  musica.addEventListener("play", actualizarBotonMusica);
  musica.addEventListener("pause", actualizarBotonMusica);
  btnMusica.addEventListener("click", () => {
    if (musica.paused) reproducirMusica(false);
    else musica.pause();
  });
  actualizarBotonMusica();
}


/* ==========================================================
   10. SORPRESA FINAL
   ========================================================== */
function mostrarCierre() {
  const elementos = [document.querySelector(".frase-cierre"), $("btn-reiniciar")];
  elementos.forEach((el) => {
    el.style.visibility = "";
    el.style.animation = "entrada 1.4s ease both";
  });
}

function escribirDedicatoria() {
  const el = $("dedicatoria-texto");
  el.textContent = "";

  /* Cada letra va en su propio <span>, invisible al principio */
  const letras = [];
  for (const caracter of textoDedicatoria) {
    const span = document.createElement("span");
    span.textContent = caracter;
    span.style.opacity = "0";
    span.style.transition = "opacity 0.7s ease";
    el.appendChild(span);
    letras.push(span);
  }

  if (sinMovimiento || letras.length === 0) {
    letras.forEach((s) => (s.style.opacity = "1"));
    mostrarCierre();
    return;
  }

  /* La velocidad se ajusta para que no tarde más de ~7 segundos */
  const intervalo = Math.max(30, Math.min(90, 6500 / letras.length));
  let i = 0;
  setTimeout(() => {
    const reloj = setInterval(() => {
      letras[i].style.opacity = "1";
      i++;
      if (i >= letras.length) {
        clearInterval(reloj);
        setTimeout(mostrarCierre, 600);
      }
    }, intervalo);
  }, 800);
}

function activarSorpresa() {
  /* Escondemos la frase de cierre y el botón final hasta terminar de escribir */
  document.querySelector(".frase-cierre").style.visibility = "hidden";
  $("btn-reiniciar").style.visibility = "hidden";

  $("btn-sorpresa").addEventListener("click", () => {
    const boton = $("btn-sorpresa");
    const intro = $("sorpresa-intro");
    boton.disabled = true;

    [boton, intro].forEach((el) => {
      el.style.transition = "opacity 0.6s ease";
      el.style.opacity = "0";
    });

    /* Lluvia de pétalos y destellos */
    crearPetalos($("petalos-final"), esMovil() ? 18 : 32, true);
    crearChispas($("petalos-final"), esMovil() ? 8 : 14);

    setTimeout(() => {
      boton.classList.add("oculto");
      intro.classList.add("oculto");

      const dedicatoria = $("dedicatoria");
      dedicatoria.classList.add("revelada");
      dedicatoria.setAttribute("aria-hidden", "false");
      dedicatoria.querySelector(".linea-dorada").classList.add("visible");
      escribirDedicatoria();
    }, 600);
  });

  /* "Volver a empezar": recarga la página y vuelve a aparecer el sobre */
  $("btn-reiniciar").addEventListener("click", () => {
    window.scrollTo(0, 0);
    location.reload();
  });
}


/* ==========================================================
   11. APERTURA DEL SOBRE
   ========================================================== */
let sobreAbierto = false;

function abrirSobre() {
  if (sobreAbierto) return;
  sobreAbierto = true;

  btnAbrir.disabled = true;
  btnAbrir.style.transition = "opacity 0.5s ease";
  btnAbrir.style.opacity = "0";

  /* La música empieza aquí: el clic cuenta como la interacción
     que exigen los navegadores */
  reproducirMusica(true);

  sobre.classList.add("abierto");          // el CSS anima sello, solapa y carta
  invitacion.classList.add("saliendo");    // el CSS funde la pantalla

  setTimeout(mostrarContenido, 2300);      // esperamos a que acaben las animaciones
}

function mostrarContenido() {
  invitacion.classList.add("oculto");
  contenido.classList.remove("oculto");
  btnMusica.classList.remove("oculto");
  document.body.classList.remove("bloqueado");
  window.scrollTo({ top: 0, behavior: "instant" });

  crearPetalos($("petalos-hoy"), esMovil() ? 8 : 16, false);
  vigilarAnimaciones($("hoy"));
  vigilarAnimaciones($("sorpresa"));
  activarAparicionAlDesplazar();
}

function activarSobre() {
  btnAbrir.addEventListener("click", abrirSobre);
  sobre.style.cursor = "pointer";
  sobre.addEventListener("click", abrirSobre);
}

/* ==========================================================
   13. FLORES DECORATIVAS Y EFECTOS DEL VISOR
   ========================================================== */

/* Colores de las flores. "claro" es para fondos claros y "oscuro" para fondos borgoña.
   a = pétalos de fuera, b = pétalos del medio, c = pétalos del centro, l = bordes */
const PALETAS = {
  claro: [
    { a: "#A52F49", b: "#C7596F", c: "#E9DCC8", l: "#641D35" },
    { a: "#B79BC7", b: "#DCC9E5", c: "#F5EFF5", l: "#704477" },
    { a: "#E9DCC8", b: "#F5EFF5", c: "#D4AF69", l: "#D4AF69" }
  ],
  oscuro: [
    { a: "#E9DCC8", b: "#F5EFF5", c: "#D4AF69", l: "#D4AF69" },
    { a: "#E8A8B6", b: "#F3D3DA", c: "#D4AF69", l: "#E9DCC8" },
    { a: "#D4AF69", b: "#E9DCC8", c: "#F5EFF5", l: "#F5EFF5" }
  ]
};

/* Una flor de tres capas de pétalos, centrada en (0,0) */
function florSVG(p) {
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += `<path transform="rotate(${i * 45})" d="M0 0C-16-16-14-44 0-52C14-44 16-16 0 0Z" fill="${p.a}" fill-opacity=".88" stroke="${p.l}" stroke-width="1"/>`;
  }
  for (let i = 0; i < 8; i++) {
    s += `<path transform="rotate(${i * 45 + 22.5})" d="M0 0C-11-11-10-32 0-38C10-32 11-11 0 0Z" fill="${p.b}" fill-opacity=".95" stroke="${p.l}" stroke-width=".8"/>`;
  }
  for (let i = 0; i < 5; i++) {
    s += `<path transform="rotate(${i * 72})" d="M0 0C-7-7-6-20 0-24C6-20 7-7 0 0Z" fill="${p.c}" stroke="${p.l}" stroke-width=".7"/>`;
  }
  s += `<circle r="5" fill="#D4AF69"/><circle r="2" fill="#F5EFF5" fill-opacity=".8"/>`;
  return s;
}

/* Un ramo: tallo curvo, hojas, ramitas y varias flores.
   ex / ey = voltear horizontal / verticalmente (para usarlo en otras esquinas) */
function ramoSVG(modo, ex, ey) {
  const paletas = PALETAS[modo];
  const color = modo === "claro" ? "#704477" : "#D4AF69";

  let s = `<path d="M5 295C60 240 90 160 170 110S270 60 290 20" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;
  s += `<path d="M95 190C80 130 100 90 130 60" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>`;
  s += `<path d="M175 108C205 160 250 170 285 150" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>`;

  /* Hojas: [x, y, giro] */
  const hojas = [[32,262,-70],[58,228,15],[82,198,-80],[112,162,10],[150,126,-70],
                 [200,96,15],[245,68,-60],[100,120,-100],[230,160,20]];
  hojas.forEach(([x, y, r]) => {
    s += `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0C10-14 28-14 40 0C28 12 10 12 0 0Z" fill="${color}" fill-opacity=".35" stroke="${color}" stroke-width=".8"/>`;
  });

  /* Flores: [x, y, tamaño] */
  const flores = [[95,188,0.85],[172,108,1.1],[262,52,0.62],[130,60,0.5],[284,150,0.48],[36,258,0.45]];
  flores.forEach(([x, y, t], i) => {
    s += `<g transform="translate(${x} ${y}) scale(${t}) rotate(${i * 17})">${florSVG(paletas[i % paletas.length])}</g>`;
  });

  const giro = `translate(${ex ? 300 : 0} ${ey ? 300 : 0}) scale(${ex ? -1 : 1} ${ey ? -1 : 1})`;
  return `<svg viewBox="0 0 300 300" aria-hidden="true"><g transform="${giro}">${s}</g></svg>`;
}

/* Hace aparecer ("visible") cada ramo cuando entra en pantalla */
const observadorDeco = new IntersectionObserver((entradas, obs) => {
  entradas.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    obs.unobserve(e.target);
  });
}, { threshold: 0.05 });

/* Coloca ramos en un contenedor.
   Posiciones: ai/ad = abajo izq./der., ti/td = arriba izq./der., ml/mr = lados del medio */
function ponerDecoracion(contenedor, modo, lista) {
  lista.forEach(([pos, ancho]) => {
    const d = document.createElement("div");
    d.className = "deco deco-" + pos;
    if (ancho) d.style.setProperty("--w", ancho);
    d.style.setProperty("--mec", azar(7, 11) + "s");
    d.style.animationDelay = "-" + azar(0, 8) + "s";
    d.innerHTML = ramoSVG(modo, pos === "ad" || pos === "td" || pos === "mr", pos === "ti" || pos === "td");
    contenedor.appendChild(d);
    observadorDeco.observe(d);
  });
}

function crearDecoraciones() {
  const grande = "clamp(170px, 36vw, 440px)";
  const medio  = "clamp(120px, 24vw, 300px)";
  const lado   = "clamp(110px, 18vw, 220px)";

  ponerDecoracion($("particulas-invitacion"), "oscuro", [["ai"], ["ad"], ["ti", medio], ["td", medio]]);
  ponerDecoracion($("hoy"), "claro", [["ai", grande], ["ad", grande], ["ti", medio], ["td", medio]]);
  ponerDecoracion($("recuerdos"), "oscuro", [["ti"], ["td"], ["ml", lado], ["mr", lado], ["ai"], ["ad"]]);
  ponerDecoracion($("carta"), "claro", [["ti"], ["td"], ["ai"], ["ad"]]);
  ponerDecoracion($("deseos"), "claro", [["ai"], ["ad"], ["ti"], ["td"]]);
  ponerDecoracion($("sorpresa"), "oscuro", [["ai"], ["ad"], ["ti"], ["td"]]);
  ponerDecoracion(visor, "oscuro", [["ai", medio], ["ad", medio]]);   // flores dentro del visor de fotos
}


/* --- Efectos del visor de fotos --- */
const fxVisor = document.createElement("div");
fxVisor.className = "visor-fx";
visor.appendChild(fxVisor);

/* Ecualizador con notas, debajo del texto de la foto */
const ecualizador = document.createElement("div");
ecualizador.className = "visor-eq";
ecualizador.setAttribute("aria-hidden", "true");
ecualizador.innerHTML = "<i>♪</i>" + "<span></span>".repeat(5) + "<i>♪</i>";
visorTexto.after(ecualizador);

function crearFxVisor() {
  fxVisor.innerHTML = "";
  const cantidad = esMovil() ? 14 : 26;
  const simbolos = ["♥", "✦", "✿"];
  for (let i = 0; i < cantidad; i++) {
    const el = document.createElement("span");
    el.className = "fx-item";
    el.textContent = simbolos[i % simbolos.length];
    el.style.left = azar(2, 98) + "%";
    el.style.setProperty("--t", azar(0.8, 1.9) + "rem");
    el.style.setProperty("--dur", azar(8, 16) + "s");
    el.style.setProperty("--ret", "-" + azar(0, 14) + "s");
    el.style.setProperty("--deriva", azar(-70, 70) + "px");
    fxVisor.appendChild(el);
  }
}

/* Cuando el visor se abre, nacen los efectos; cuando se cierra, se limpian */
let fxActivo = false;
new MutationObserver(() => {
  const abierto = visor.classList.contains("abierto");
  if (abierto && !fxActivo) {
    fxActivo = true;
    crearFxVisor();
  } else if (!abierto && fxActivo) {
    fxActivo = false;
    setTimeout(() => { if (!fxActivo) fxVisor.innerHTML = ""; }, 500);
  }
}).observe(visor, { attributes: true, attributeFilter: ["class"] });

/* El ecualizador y el halo "bailan" solo cuando la canción de la foto suena */
musicaFoto.addEventListener("playing", () => visor.classList.add("sonando"));
musicaFoto.addEventListener("pause",   () => visor.classList.remove("sonando"));

/* Entrada suave cada vez que cambia la foto */
new MutationObserver(() => {
  visorImg.classList.remove("cambiando");
  void visorImg.offsetWidth;               // reinicia la animación
  visorImg.classList.add("cambiando");
}).observe(visorImg, { attributes: true, attributeFilter: ["src"] });

crearDecoraciones();

/* ==========================================================
   12. ARRANQUE
   ========================================================== */
mostrarSaludo();
mostrarContador();
crearParticulas($("particulas-invitacion"), esMovil() ? 10 : 20);
construirGaleria();
activarVisor();
activarDeseos();
activarFotoSorpresa();
activarSorpresa();
activarMusica();
activarSobre();