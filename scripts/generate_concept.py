"""Genera la ficha de una página. Usa --author para indicar el nombre del estudiante."""
from pathlib import Path
from argparse import ArgumentParser
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

raiz = Path(__file__).resolve().parents[1]
argumentos = ArgumentParser()
argumentos.add_argument('--author', default='Nombre completo pendiente de confirmar')
argumentos.add_argument('--output', type=Path, default=raiz / 'entrega' / '03_FICHA_CONCEPTO.pdf')
opciones = argumentos.parse_args()
autor = opciones.author
salida = opciones.output
salida.parent.mkdir(parents=True, exist_ok=True)
pdf = canvas.Canvas(str(salida), pagesize=(595.28, 841.89))
pdf.setTitle('El taller del tiempo - Ficha del concepto')
pdf.setAuthor(autor)
pdf.setFont('Helvetica-Bold', 19)
pdf.drawString(50, 786, 'El taller del tiempo')
pdf.setFont('Helvetica', 11)
pdf.drawString(50, 764, 'Taller de medios, animación y audio espacial en Three.js')
pdf.setStrokeColor(HexColor('#b9c7cd'))
pdf.line(50, 746, 545, 746)

texto = ParagraphStyle('texto', fontName='Helvetica', fontSize=11, leading=17)
subtitulo = ParagraphStyle('subtitulo', fontName='Helvetica-Bold', fontSize=12, leading=17)
secciones = [
    ('Concepto', 'La escena representa un taller de relojería donde las piezas flotan sobre una mesa. Un reloj de madera sigue funcionando aunque tres engranajes se encuentran suspendidos a su alrededor. La idea es mostrar un lugar imaginario donde el tiempo parece haberse desarmado.'),
    ('Video', 'La esfera circular del reloj es una pantalla 3D con un MP4 de manecillas. La manecilla roja avanza a un ritmo acelerado y el video se repite cada 12 segundos. El elemento HTML queda silenciado porque el tictac se reproduce por separado dentro de la escena.'),
    ('Animación', 'Los tres engranajes giran en sentidos alternados y flotan ligeramente hacia arriba y abajo. El péndulo del reloj se balancea. Estos cambios se realizan con requestAnimationFrame y continúan cuando se pausa el video y el sonido.'),
    ('Audio espacial', 'Un MP3 de tictac se conecta a la esfera del reloj mediante PositionalAudio. El AudioListener está unido a la cámara. Al acercarse al reloj el sonido se escucha más fuerte; al alejarse disminuye hasta dejar de oírse. Al girar también cambia su ubicación estéreo.'),
    ('Interacción', 'Un solo botón inicia y pausa el video y el audio juntos. La cámara se gira arrastrando el ratón y se acerca o aleja con la rueda. En una pantalla táctil se usan gestos. El primer clic habilita el sonido que los navegadores bloquean al cargar la página.'),
    ('Recursos', 'La escena se construyó con geometrías básicas de Three.js: planos, cajas, cilindros, círculos y aros. La mesa y la caja del reloj tienen tonos de madera; los engranajes usan tonos de latón, cobre y hierro. El video y el audio fueron generados por código para este proyecto.'),
]
y = 724
for titulo, contenido in secciones:
    bloque = Paragraph(titulo, subtitulo)
    _, alto = bloque.wrap(495, 200)
    bloque.drawOn(pdf, 50, y-alto)
    y -= alto+5
    bloque = Paragraph(contenido, texto)
    _, alto = bloque.wrap(495, 300)
    bloque.drawOn(pdf, 50, y-alto)
    y -= alto+17
if y < 75:
    raise RuntimeError('El contenido excede una página.')
pdf.setFont('Helvetica-Bold', 10)
pdf.drawString(50, 55, 'Nombre: '+autor)
pdf.save()
print(salida)
