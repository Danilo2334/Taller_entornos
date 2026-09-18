"""Convert the browser recording into a 40-second H.264/AAC submission MP4."""
from argparse import ArgumentParser
from pathlib import Path
import subprocess
import imageio_ffmpeg

parser = ArgumentParser()
parser.add_argument('recording', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
output = root / 'entrega' / '02_DEMOSTRACION.mp4'
output.parent.mkdir(exist_ok=True)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([
    ffmpeg, '-y', '-loglevel', 'error', '-i', str(args.recording),
    '-vf', 'fps=30,tpad=stop_mode=clone:stop_duration=2', '-af', 'apad', '-t', '40',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', str(output)
], check=True)
print(output)
