import * as THREE from 'three';

export function crearAudio(camara, pantalla) {
  let oyente;
  let sonido;

  async function preparar() {
    // Se crean en el primer clic por la restricción de autoplay.
    if (!oyente) {
      oyente = new THREE.AudioListener();
      camara.add(oyente);
      sonido = new THREE.PositionalAudio(oyente);
      pantalla.add(sonido);
      sonido.setDistanceModel('linear');
      sonido.setRefDistance(2);
      sonido.setMaxDistance(18);
      sonido.setRolloffFactor(1);
      sonido.setLoop(true);
      sonido.setVolume(0.8);
    }

    await oyente.context.resume();
    if (!sonido.buffer) {
      const cargador = new THREE.AudioLoader();
      const buffer = await cargador.loadAsync(`${import.meta.env.BASE_URL}assets/audio.mp3`);
      sonido.setBuffer(buffer);
    }
  }

  function reproducir(segundos) {
    if (!sonido?.buffer) return;
    sonido.stop();
    // Al reanudar, el sonido retoma el mismo instante que el video.
    sonido.offset = segundos % sonido.buffer.duration;
    sonido.play();
  }

  function pausar() {
    if (sonido?.isPlaying) sonido.stop();
  }

  return { preparar, reproducir, pausar };
}