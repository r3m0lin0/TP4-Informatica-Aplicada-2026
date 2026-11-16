// ---------- IMÁGENES ----------
let fondo, arbol, arbolCortado;       
let troncoImg, ramaIzq, ramaDer;      
let hachaDer, hachaIzq;               
let motosierraDer, motosierraIzq;
let hachaDoble;
let sierraDer, sierraIzq;

// ---------- SONIDOS ----------
let sndMuerte, sndFinTiempo, sndHachazo;

// ---------- MEDIDAS Y POSICIONES ----------
const CENTRO_X = 480;         
const Y_CORTE = 306;           
const MITAD_TRONCO = 47;       
const SEPARACION_RAMAS = 58;   
const ANCHO_RAMA = 280;        
const ANCHO_TRONCO = 100;      
const ANCHO_HERRAMIENTA = 140; 
const PRIMERA_RAMA = 2; 

// ---------- ESTADO DEL JUEGO ----------
let pausa = true;
let puntos = 0;
let aceptarTecla = true;
let ladoJugador = 'DERECHA';

// Barra de tiempo
let anchoBarraIni = 200;
let anchoBarra = 200;
let altoBarra = 20;
let posXBarra = 0;
let posYBarra = 0;
let tiempoRestante = 0;

// Herramienta y animación del corte
let hachaVisible = false;
let animacionCorte = { activo: false, tiempo: 0 };

// Pedazo de tronco que sale volando
let posTronco = { x: CENTRO_X, y: Y_CORTE };
let velTroncoX = 0;
let velTroncoY = -12.5;
let troncoActivo = false;

// Ramas
let ramas = [];
const NUM_RAMAS = 6;

// Textos
let textoPuntos = "Puntos = 0";
let textoMensaje = "Presiona Enter para comenzar!";


// ============================================================
// CARGA DE IMÁGENES Y SONIDOS
// ============================================================

function preload() {

  // Sonidos
  sndMuerte = loadSound('sonido/muerte.wav');
  sndFinTiempo = loadSound('sonido/fin_tiempo.mp3');
  sndHachazo = loadSound('sonido/hachazo.wav');

  // Faltan: sonidos de las otras herramientas

  // Escenario
  fondo = loadImage('img/fondonivel1.png');
  arbol = loadImage('img/arbol.png');                 // árbol completo
  arbolCortado = loadImage('img/arbolcortado.png');   // árbol con el hueco del corte

  // Tronco y ramas
  troncoImg = loadImage('img/tronco.png');
  ramaIzq = loadImage('img/rama2.png');   // rama del lado izquierdo (punta gruesa hacia la derecha)
  ramaDer = loadImage('img/rama1.png');   // rama del lado derecho (punta gruesa hacia la izquierda)

  // Herramientas
  hachaDer = loadImage('img/hacha1.png');
  hachaIzq = loadImage('img/hacha2.png');

  motosierraDer = loadImage('img/Motosierra2.png');
  motosierraIzq = loadImage('img/Motosierra1.png');

  hachaDoble = loadImage('img/hachadoble.png');

  sierraDer = loadImage('img/sierra1.png');
  sierraIzq = loadImage('img/sierra2.png');
}

function setup() {
  createCanvas(960, 540);
  textAlign(CENTER, CENTER);

  posXBarra = width - 10 - anchoBarraIni;
  posYBarra = 90;

  // Recorta el espacio transparente que sobra alrededor de estas imágenes
  troncoImg = recortarTransparencia(troncoImg);
  ramaIzq = recortarTransparencia(ramaIzq);
  ramaDer = recortarTransparencia(ramaDer);
  hachaDer = recortarTransparencia(hachaDer);
  hachaIzq = recortarTransparencia(hachaIzq);
  motosierraDer = recortarTransparencia(motosierraDer);
  motosierraIzq = recortarTransparencia(motosierraIzq);
  hachaDoble = recortarTransparencia(hachaDoble);
  sierraDer = recortarTransparencia(sierraDer);
  sierraIzq = recortarTransparencia(sierraIzq);

  for (let i = 0; i < NUM_RAMAS; i++) {
    ramas.push({ lado: 'NINGUNA' });
  }

  // Llamamos a la función del OTRO archivo js
  mostrarFormularioInicio();
}

// Devuelve la imagen sin los bordes transparentes
function recortarTransparencia(img) {
  img.loadPixels();
  let minX = img.width, minY = img.height, maxX = -1, maxY = -1;

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let alfa = img.pixels[(y * img.width + x) * 4 + 3];
      if (alfa > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) return img; // imagen totalmente transparente
  return img.get(minX, minY, maxX - minX + 1, maxY - minY + 1);
}


function imagenHerramienta() {
  const herramientas = {
    hacha:      { der: hachaDer,      izq: hachaIzq },
    motosierra: { der: motosierraDer, izq: motosierraIzq },
    hachadoble: { der: hachaDoble,    izq: hachaDoble },
    sierra:     { der: sierraDer,     izq: sierraIzq },
  };
  let h = herramientas[jugadorColor] || herramientas.hacha;
  return (ladoJugador === 'DERECHA') ? h.der : h.izq;
}

 
//////////

function draw() {
  background(220);
  image(fondo, 0, 0, width, height);

  if (!pausa) {
    actualizarJuego();
  }


  let imgArbol = animacionCorte.activo ? arbolCortado : arbol;
  image(imgArbol, 0, 0, width, height);


  for (let i = 0; i < NUM_RAMAS; i++) {
    let lado = ramas[i].lado;
    if (lado === 'NINGUNA') continue;

    let img = (lado === 'IZQUIERDA') ? ramaIzq : ramaDer;
    let alto = ANCHO_RAMA * img.height / img.width;
    let y = Y_CORTE - (NUM_RAMAS - 1 - i) * SEPARACION_RAMAS;
    let x = (lado === 'IZQUIERDA')
      ? CENTRO_X - MITAD_TRONCO + 12 - ANCHO_RAMA
      : CENTRO_X + MITAD_TRONCO - 12;

    image(img, x, y - alto / 2, ANCHO_RAMA, alto);
  }

  // Pedazo de tronco que sale volando
  if (troncoActivo) {
    let alto = ANCHO_TRONCO * troncoImg.height / troncoImg.width;
    image(troncoImg, posTronco.x - ANCHO_TRONCO / 2, posTronco.y - alto / 2, ANCHO_TRONCO, alto);
  }

  if (animacionCorte.activo) {
    animacionCorte.tiempo += 1;
    if (animacionCorte.tiempo > 10) animacionCorte.activo = false;
  }

  // Herramienta
  if (hachaVisible) {
    let img = imagenHerramienta();
    let alto = ANCHO_HERRAMIENTA * img.height / img.width;
    let signo = (ladoJugador === 'DERECHA') ? 1 : -1;

    let swing = animacionCorte.activo ? constrain(animacionCorte.tiempo / 10, 0, 1) : 0;
    let ease = sin(swing * HALF_PI);

    let xReposo = CENTRO_X + signo * (MITAD_TRONCO + ANCHO_HERRAMIENTA / 2 + 120);
    let xGolpe  = CENTRO_X + signo * (MITAD_TRONCO + ANCHO_HERRAMIENTA / 2);
    let x = lerp(xReposo, xGolpe, ease);
    let y = lerp(Y_CORTE + 40, Y_CORTE, ease);

    image(img, x - ANCHO_HERRAMIENTA / 2, y - alto / 2, ANCHO_HERRAMIENTA, alto);
  }

  // USUARIO
  fill(255);
  textSize(40);
  textAlign(LEFT, TOP);
  text(textoPuntos, 10, 60);

  textAlign(RIGHT, TOP);
  text("Tiempo: " + tiempoRestante + "s", width - 10, 60);

  fill(255, 0, 0);
  noStroke();
  rect(posXBarra, posYBarra, anchoBarra, altoBarra);

  if (pausa && !formVisible) {
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(255);
    text(textoMensaje, width / 2, height / 2);
    troncoActivo = false;
    posTronco = { x: CENTRO_X, y: Y_CORTE };
  }
}

////

function actualizarJuego() {
  anchoBarra -= 1.0;
  tiempoRestante = floor(anchoBarra / 10);

  if (anchoBarra <= 0) {
    anchoBarra = 0;
    pausa = true;
    textoMensaje = "¡Tiempo terminado!";
    if (audioHabilitado && sndFinTiempo) sndFinTiempo.play();
    mostrarPantallaDerrota(puntos, tiempoRestante, anchoBarraIni, textoMensaje);
  }

  if (troncoActivo) {
    posTronco.x += velTroncoX;
    posTronco.y += velTroncoY;
    if (posTronco.x < -50 || posTronco.x > 1000) {
      troncoActivo = false;
      posTronco = { x: CENTRO_X, y: Y_CORTE };
    }
  }

  if (ramas[5].lado === ladoJugador && ramas[5].lado !== 'NINGUNA') {
    morir();
  }

  textoPuntos = "Puntos = " + puntos;
}

function moverRamas() {
  for (let i = NUM_RAMAS - 1; i > 0; i--) {
    ramas[i].lado = ramas[i - 1].lado;
  }

  // Los lugares de arriba quedan siempre vacíos
  for (let i = 0; i < PRIMERA_RAMA; i++) {
    ramas[i].lado = 'NINGUNA';
  }

  // La rama nueva nace en PRIMERA_RAMA
  let r = floor(random(4));
  if (r === 0) ramas[PRIMERA_RAMA].lado = 'IZQUIERDA';
  else if (r === 1) ramas[PRIMERA_RAMA].lado = 'DERECHA';
  else ramas[PRIMERA_RAMA].lado = 'NINGUNA';

  // Evita dos ramas seguidas: si el lugar de abajo ya tiene una, esta queda vacía
  if (ramas[PRIMERA_RAMA + 1].lado !== 'NINGUNA') ramas[PRIMERA_RAMA].lado = 'NINGUNA';
}

function morir() {
  pausa = true;
  hachaVisible = false;
  animacionCorte.activo = false;
  textoMensaje = "¡APLASTADO!";
  if (audioHabilitado && sndMuerte) sndMuerte.play();
  mostrarPantallaDerrota(puntos, tiempoRestante, anchoBarraIni, textoMensaje);
}

// Esta función es llamada desde formulario.js
function iniciarJuego() {
  anchoBarra = anchoBarraIni;
  pausa = false;
  puntos = 0;
  aceptarTecla = true;
  hachaVisible = true;
  ladoJugador = 'DERECHA';
  animacionCorte = { activo: false, tiempo: 0 };

  for (let r of ramas) r.lado = 'NINGUNA';
  moverRamas();

  if (sndFinTiempo) sndFinTiempo.stop();
  if (sndMuerte) sndMuerte.stop();
}


// ============================================================
// CONTROLES
// ============================================================

function keyPressed() {
  if (key === 'f' || key === 'F') toggleFullscreen();

  if ((keyCode === RETURN || keyCode === ENTER) && !formVisible) {
    mostrarFormularioInicio();
  }

  if (!pausa && aceptarTecla) {
    let sumarBarra = 100.0 - puntos * 0.1;
    if (anchoBarra < anchoBarraIni) anchoBarra += sumarBarra;

    puntos++;
    aceptarTecla = false;
    hachaVisible = true;
    troncoActivo = true;
    animacionCorte = { activo: true, tiempo: 0 };
    posTronco = { x: CENTRO_X, y: Y_CORTE };

    if (keyCode === RIGHT_ARROW) {
      ladoJugador = 'DERECHA';
      velTroncoX = -17.5;
      if (audioHabilitado && sndHachazo) sndHachazo.play();
    }
    else if (keyCode === LEFT_ARROW) {
      ladoJugador = 'IZQUIERDA';
      velTroncoX = 17.5;
      if (audioHabilitado && sndHachazo) sndHachazo.play();
    }

    moverRamas();
  }
}

function keyReleased() {
  if (!pausa && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
    aceptarTecla = true;
    hachaVisible = true;
  }
}

function mousePressed() {
  userStartAudio();
}
