import './style.css';
import { crearEscenario } from './scene.js';
import { crearAudio } from './media.js';

const contenedor = document.querySelector('#escenario');
const boton = document.querySelector('#reproducir');
const estado = document.querySelector('#estado');

// El video es una textura, por eso no se muestra como reproductor HTML.
const video = document.createElement('video');
video.src = `${import.meta.env.BASE_URL}assets/video.mp4`;
video.loop = true;
video.muted = true;
video.playsInline = true;
video.preload = 'auto';
video.hidden = true;
document.body.appendChild(video);

try {
  const mundo = crearEscenario(contenedor, video);
  const audio = crearAudio(mundo.camara, mundo.pantalla);
  let reproduciendo = false;
  let cargando = false;

  video.addEventListener('loadeddata', () => {
    boton.disabled = false;
    estado.textContent = 'Listo. Pulsa el botón para comenzar.';
  }, { once: true });

  video.addEventListener('error', () => {
    pausar();
    boton.disabled = true;
    estado.textContent = 'No se pudo cargar el video. Recarga la página para reintentar.';
  });

  function pausar() {
    video.pause();
    audio.pausar();
    reproduciendo = false;
    boton.textContent = 'Reproducir video y sonido';
    estado.textContent = 'Video y sonido en pausa.';
  }

  // El clic habilita el audio que el navegador bloquea al abrir la página.
  boton.addEventListener('click', async () => {
    if (cargando) return;
    if (reproduciendo) {
      pausar();
      return;
    }

    cargando = true;
    boton.disabled = true;
    estado.textContent = 'Cargando sonido…';
    try {
      await audio.preparar();
      if (document.hidden) return;
      await video.play();
      audio.reproducir(video.currentTime);
      reproduciendo = true;
      boton.textContent = 'Pausar video y sonido';
      estado.textContent = 'Reproduciendo. Prueba acercarte y alejarte del reloj.';
    } catch (error) {
      pausar();
      estado.textContent = 'No se pudo reproducir. Vuelve a intentarlo.';
      console.error(error);
    } finally {
      cargando = false;
      boton.disabled = false;
      if (!reproduciendo && document.hidden) estado.textContent = 'En pausa. Vuelve a pulsar el botón.';
    }
  });

  // Si el video debe cargar más datos, el sonido espera y retoma su posición.
  video.addEventListener('waiting', () => audio.pausar());
  video.addEventListener('playing', () => {
    if (reproduciendo) audio.reproducir(video.currentTime);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && reproduciendo) pausar();
  });

  // El entorno sigue animándose al pausar el video y el sonido.
  const inicio = performance.now();
  function animar(ahora) {
    requestAnimationFrame(animar);
    mundo.actualizar((ahora - inicio) / 1000);
  }
  requestAnimationFrame(animar);
  video.load();
} catch (error) {
  estado.textContent = error.code === 'WEBGL_UNAVAILABLE'
    ? 'Este navegador no permite gráficos 3D. Abre el enlace en Edge o Chrome, fuera de VS Code.'
    : 'No se pudo iniciar la escena. Recarga la página para reintentar.';
  contenedor.textContent = 'No se pudo mostrar el escenario 3D.';
  const enlace = document.querySelector('#abrir-edge');
  enlace.href = `microsoft-edge:${window.location.href}`;
  enlace.hidden = false;
  console.error(error);
}
