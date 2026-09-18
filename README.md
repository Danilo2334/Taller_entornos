# El taller del tiempo

Taller de medios, animación y audio espacial en Three.js.

Un reloj de madera sigue funcionando en una mesa de trabajo, mientras tres engranajes flotan a su alrededor. La esfera del reloj muestra un video de manecillas y el sonido de tictac sale de esa misma posición.

## Ejecutar

Necesitas Node.js 22.12 o superior.

```sh
npm install
npm run dev
```

Abre **http://127.0.0.1:5174/** en Edge o Chrome. El navegador integrado de VS Code puede tener deshabilitado WebGL. No abras el HTML directamente: el proyecto necesita el servidor de Vite.

Para compilar: `npm run build`. Para revisar la compilación: `npm run preview`.

## Controles

- El botón inicia y pausa el video y el audio juntos.
- Arrastra sobre el escenario para girar la cámara.
- Usa la rueda del ratón o un gesto de pinza para acercarte y alejarte.
- Prueba con audífonos: el tictac sale del reloj y disminuye al alejarte.

## Cómo está organizado

- **index.html**: título, espacio para el escenario, botón e instrucciones.
- **src/main.js**: video, botón y bucle de animación.
- **src/scene.js**: cámara, luces, mesa, reloj, péndulo y engranajes.
- **src/media.js**: audio espacial unido a la esfera del reloj.
- **src/style.css**: estilos básicos de la página.
- **public/assets/**: video.mp4, audio.mp3 y primer fotograma de referencia.
- **vite.config.js**: servidor local y exclusiones para evitar bloqueos de Windows.

## Requisitos del taller

La esfera del reloj usa `VideoTexture` sobre una geometría circular. Los tres engranajes son objetos adicionales, construidos con aros, cajas y cilindros. La mesa y el péndulo también forman parte de la ambientación.

Los engranajes giran y flotan, y el péndulo se balancea en `requestAnimationFrame`. La animación utiliza el tiempo transcurrido: su velocidad no depende de cuántos fotogramas pueda renderizar el equipo. El objetivo es fluidez a 60 FPS. El video tiene 24 FPS, independientemente de la animación 3D.

El audio usa `PositionalAudio` unido a la esfera y un `AudioListener` en la cámara. La atenuación es lineal, con distancia de referencia de 2 y alcance de 18 unidades. El video queda silenciado como elemento HTML porque el sonido se reproduce por separado en el espacio 3D.

El MP4 muestra una manecilla roja que avanza cada medio segundo, completando una vuelta en 12 segundos. El MP3 alterna dos sonidos de tictac cada medio segundo. Ambos archivos fueron generados por código para este proyecto.

## Entrega

El profesor pide un RAR sin contraseña que contenga:

1. Un documento con el enlace al repositorio público.
2. Una demostración MP4 de 30 a 60 segundos, con audio.
3. Una ficha PDF de una página explicando el concepto, con el nombre del estudiante.

Graba esta versión del reloj: muestra la escena, inicia los medios, acércate y aléjate, y prueba pausar y reanudar. Activa el audio del sistema en el grabador.

Los archivos de `scripts/` son herramientas opcionales para generar medios y preparar la entrega. Para crear la ficha con tu nombre:

```powershell
.venv\Scripts\python scripts/generate_concept.py --author "Nombre Apellido"
```

Ese comando crea `entrega/03_FICHA_CONCEPTO.pdf`. Después debes añadir el enlace real al repositorio, tu grabación y comprimir los tres documentos.