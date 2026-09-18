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


```powershell
.venv\Scripts\python scripts/generate_concept.py --author "Nombre Apellido"
```

Ese comando crea `entrega/03_FICHA_CONCEPTO.pdf`. Después debes añadir el enlace real al repositorio, tu grabación y comprimir los tres documentos.
