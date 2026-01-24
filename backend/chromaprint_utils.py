import subprocess
import json
import shutil

fpcalc = r"C:\Users\DELL\Downloads\chromaprint-fpcalc-1.6.0-windows-x86_64\chromaprint-fpcalc-1.6.0-windows-x86_64\fpcalc.exe"
ffmpeg = r"C:\Users\DELL\Downloads\ffmpeg-8.0.1-full_build\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"

def check_fpcalc():
    if not shutil.which(fpcalc):
        raise EnvironmentError("fpcalc.exe not found at given path.")

def generate_fingerprint(filepath: str):
    check_fpcalc()
    try:
        result = subprocess.run(
            [fpcalc, "-json", "-raw", filepath],
            capture_output=True,
            text=True,
            check=True
        )
        data = json.loads(result.stdout)
        return data.get("duration"), data.get("fingerprint")
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Failed to generate fingerprint: {e.stderr}")
    except json.JSONDecodeError:
        raise RuntimeError("Failed to parse fpcalc output")

def convert_audio(input_path: str, output_path: str):
    if not shutil.which(ffmpeg):
        raise EnvironmentError("ffmpeg.exe not found at given path.")

    try:
        subprocess.run(
            [ffmpeg, "-i", input_path, "-y", output_path],
            capture_output=True,
            text=True,
            check=True
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"FFmpeg conversion failed: {e.stderr}")
