"""Crea un video de reloj y un sonido de tictac originales para el taller."""
from pathlib import Path
import math
import subprocess
import tempfile
import wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

RAIZ = Path(__file__).resolve().parents[1]
ASSETS = RAIZ / 'public' / 'assets'
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
TAMANO, FPS, DURACION = 720, 24, 12

def crear_video():
    fuente = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 43)
    fondo = Image.new('RGB', (TAMANO, TAMANO), '#f3e2bf')
    dibujo = ImageDraw.Draw(fondo)
    centro = TAMANO / 2
    dibujo.ellipse((23, 23, 697, 697), outline='#775630', width=5)
    dibujo.ellipse((36, 36, 684, 684), outline='#b2986b', width=2)
    for i in range(60):
        angulo = i * math.tau / 60 - math.pi / 2
        radio_interno = 292 if i % 5 == 0 else 305
        puntos = [(centro + math.cos(angulo)*radio_interno, centro + math.sin(angulo)*radio_interno),
                  (centro + math.cos(angulo)*319, centro + math.sin(angulo)*319)]
        dibujo.line(puntos, fill='#413324', width=5 if i % 5 == 0 else 2)
    for numero in range(1, 13):
        angulo = numero * math.tau / 12 - math.pi / 2
        dibujo.text((centro+math.cos(angulo)*258, centro+math.sin(angulo)*258),
                    str(numero), font=fuente, anchor='mm', fill='#413324')
    proceso = subprocess.Popen([
        FFMPEG, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
        '-s', f'{TAMANO}x{TAMANO}', '-r', str(FPS), '-i', '-', '-an',
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart', str(ASSETS / 'video.mp4')
    ], stdin=subprocess.PIPE)
    for fotograma in range(FPS * DURACION):
        tiempo = fotograma / FPS
        imagen = fondo.copy()
        dibujo = ImageDraw.Draw(imagen)
        for angulo, largo, grosor, color in [
            (10 * math.tau / 12 - math.pi / 2, 145, 16, '#35281d'),
            (2 * math.tau / 12 - math.pi / 2, 215, 10, '#35281d'),
            (math.floor(tiempo * 2) * math.tau / 24 - math.pi / 2, 238, 4, '#9d3e32'),
        ]:
            dibujo.line([(centro, centro), (centro+math.cos(angulo)*largo, centro+math.sin(angulo)*largo)],
                        fill=color, width=grosor)
        dibujo.ellipse((349, 349, 371, 371), fill='#b38948', outline='#493322', width=2)
        if fotograma == 0:
            imagen.save(ASSETS / 'poster.jpg', quality=90)
        proceso.stdin.write(imagen.tobytes())
    proceso.stdin.close()
    if proceso.wait() != 0:
        raise RuntimeError('No se pudo generar el video.')
    print('Video del reloj: 720 x 720, 24 FPS, 12 segundos.')

def crear_audio():
    frecuencia = 44100
    tiempo = np.arange(frecuencia * DURACION) / frecuencia
    azar = np.random.default_rng(12)
    ruido = azar.normal(0, 1, tiempo.size)
    audio = 0.012 * np.sin(math.tau * 120 * tiempo)
    for pulso in range(DURACION * 2):
        transcurrido = np.maximum(tiempo-pulso*0.5, 0)
        envolvente = (tiempo >= pulso*0.5) * np.exp(-transcurrido*65) * (1-np.exp(-transcurrido*1800))
        tono = 1750 if pulso % 2 == 0 else 1250
        audio += envolvente * (0.4*np.sin(math.tau*tono*transcurrido) + 0.08*ruido)
    rampa = np.minimum(1, np.minimum(tiempo/0.005, (DURACION-tiempo)/0.005))
    muestras = np.int16(np.clip(audio*rampa, -1, 1)*32767)
    with tempfile.TemporaryDirectory(prefix='reloj-audio-') as temporal:
        wav = Path(temporal) / 'tictac.wav'
        with wave.open(str(wav), 'wb') as archivo:
            archivo.setnchannels(1)
            archivo.setsampwidth(2)
            archivo.setframerate(frecuencia)
            archivo.writeframes(muestras.tobytes())
        subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(wav),
                        '-c:a', 'libmp3lame', '-b:a', '160k', str(ASSETS/'audio.mp3')], check=True)
    print('Audio de tictac: mono, 12 segundos.')

if __name__ == '__main__':
    ASSETS.mkdir(parents=True, exist_ok=True)
    crear_audio()
    crear_video()