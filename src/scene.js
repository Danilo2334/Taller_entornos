import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function crearEscenario(contenedor, video) {
  // 1. Escena, cámara y renderizador.
  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x292526);
  escena.fog = new THREE.Fog(0x292526, 18, 40);
  const camara = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camara.position.set(5.5, 4.8, 10.5);

  const canvas = document.createElement('canvas');
  const contexto = canvas.getContext('webgl2', { antialias: true });
  if (!contexto) {
    const error = new Error('WebGL 2 no está disponible.');
    error.code = 'WEBGL_UNAVAILABLE';
    throw error;
  }
  const renderer = new THREE.WebGLRenderer({ canvas, context: contexto, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.setAttribute('aria-label', 'Arrastra para girar la cámara y usa la rueda para acercarte');
  renderer.domElement.tabIndex = 0;
  contenedor.appendChild(renderer.domElement);

  // 2. Cámara móvil para comprobar el audio espacial.
  const controles = new OrbitControls(camara, renderer.domElement);
  controles.target.set(0, 2.8, 0);
  controles.enableDamping = true;
  controles.enablePan = false;
  controles.minDistance = 5;
  controles.maxDistance = 22;
  controles.maxPolarAngle = Math.PI / 2 - 0.05;
  controles.update();

  escena.add(new THREE.AmbientLight(0xffe5c5, 1.5));
  const luz = new THREE.DirectionalLight(0xffedd3, 2.5);
  luz.position.set(-3, 8, 5);
  escena.add(luz);

  function agregar(geometria, material, x, y, z, grupo = escena) {
    const objeto = new THREE.Mesh(geometria, material);
    objeto.position.set(x, y, z);
    grupo.add(objeto);
    return objeto;
  }

  // 3. Una mesa de trabajo y la caja de madera del reloj.
  const madera = new THREE.MeshStandardMaterial({ color: 0x69442c, roughness: 0.8 });
  const maderaOscura = new THREE.MeshStandardMaterial({ color: 0x38261e, roughness: 0.8 });
  const laton = new THREE.MeshStandardMaterial({ color: 0xc89546, metalness: 0.45, roughness: 0.4 });
  const suelo = agregar(new THREE.PlaneGeometry(35, 35), new THREE.MeshStandardMaterial({ color: 0x403836 }), 0, -0.15, 0);
  suelo.rotation.x = -Math.PI / 2;
  agregar(new THREE.BoxGeometry(8, 0.25, 3.8), madera, 0, 0.9, 0);
  for (const x of [-3.4, 3.4]) {
    for (const z of [-1.3, 1.3]) agregar(new THREE.BoxGeometry(0.25, 0.8, 0.25), maderaOscura, x, 0.4, z);
  }
  agregar(new THREE.BoxGeometry(3, 0.25, 1.25), maderaOscura, 0, 1.15, 0);
  agregar(new THREE.BoxGeometry(2.65, 3, 0.85), madera, 0, 2.75, 0);
  const remate = agregar(new THREE.CylinderGeometry(1.43, 1.43, 0.85, 48), madera, 0, 4.3, 0);
  remate.rotation.x = Math.PI / 2;

  // 4. El video se proyecta en la esfera circular del reloj.
  const texturaVideo = new THREE.VideoTexture(video);
  texturaVideo.colorSpace = THREE.SRGBColorSpace;
  const materialPantalla = new THREE.MeshBasicMaterial({ map: texturaVideo });
  const pantalla = agregar(new THREE.CircleGeometry(1.25, 64), materialPantalla, 0, 4.3, 0.45);
  agregar(new THREE.TorusGeometry(1.3, 0.065, 8, 64), laton, 0, 4.3, 0.49);

  // 5. Péndulo colgado debajo de la esfera.
  agregar(new THREE.BoxGeometry(1.65, 1.4, 0.06), maderaOscura, 0, 2.15, 0.46);
  const pendulo = new THREE.Group();
  pendulo.position.set(0, 2.78, 0.55);
  escena.add(pendulo);
  agregar(new THREE.CylinderGeometry(0.035, 0.035, 1, 8), laton, 0, -0.5, 0, pendulo);
  const peso = agregar(new THREE.CylinderGeometry(0.25, 0.25, 0.12, 24), laton, 0, -1, 0, pendulo);
  peso.rotation.x = Math.PI / 2;

  // 6. Tres engranajes: aros, radios y dientes hechos con geometrías básicas.
  const engranajes = [];
  for (const [x, y, z, radio, color] of [
    [-3.1, 3.5, 0, 0.8, 0xb87942],
    [3.2, 4.2, -0.4, 0.95, 0xc4a363],
    [2.7, 1.9, 1, 0.55, 0x83888c],
  ]) {
    const grupo = new THREE.Group();
    grupo.position.set(x, y, z);
    escena.add(grupo);
    const material = new THREE.MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.5 });
    agregar(new THREE.TorusGeometry(radio * 0.8, radio * 0.13, 6, 32), material, 0, 0, 0, grupo);
    const centro = agregar(new THREE.CylinderGeometry(radio * 0.18, radio * 0.18, 0.22, 12), material, 0, 0, 0, grupo);
    centro.rotation.x = Math.PI / 2;
    for (let i = 0; i < 12; i++) {
      const angulo = i * Math.PI / 6;
      const diente = agregar(new THREE.BoxGeometry(radio * 0.25, radio * 0.3, 0.2), material,
        Math.sin(angulo) * radio, Math.cos(angulo) * radio, 0, grupo);
      diente.rotation.z = -angulo;
    }
    for (let i = 0; i < 3; i++) {
      const radioCentral = agregar(new THREE.BoxGeometry(radio * 1.55, radio * 0.12, 0.12), material, 0, 0, 0, grupo);
      radioCentral.rotation.z = i * Math.PI / 3;
    }
    engranajes.push({ grupo, altura: y });
  }

  function ajustarTamano() {
    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;
    camara.aspect = ancho / alto;
    camara.fov = camara.aspect < 1 ? 75 : 50;
    camara.updateProjectionMatrix();
    renderer.setSize(ancho, alto);
  }
  new ResizeObserver(ajustarTamano).observe(contenedor);
  ajustarTamano();

  function actualizar(tiempo) {
    pendulo.rotation.z = Math.cos(tiempo * Math.PI * 2) * 0.28;
    engranajes.forEach(({ grupo, altura }, i) => {
      grupo.position.y = altura + Math.sin(tiempo + i * 2) * 0.15;
      grupo.rotation.z = tiempo * (i % 2 === 0 ? 0.35 : -0.3);
    });
    controles.update();
    renderer.render(escena, camara);
  }

  return { camara, pantalla, actualizar };
}
