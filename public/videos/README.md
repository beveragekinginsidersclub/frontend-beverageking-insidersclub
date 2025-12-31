Place your site hero videos in this folder:

- hero-background-desktop.mp4 (1080p desktop MP4)
- hero-background-desktop.webm (1080p desktop WebM VP9)
- hero-background-mobile.mp4 (720p mobile MP4)
- hero-background-mobile.webm (720p mobile WebM VP9)
- hero-background-low.mp4 (480p low-bandwidth fallback)

Poster image:
- ../images/hero-poster.jpg

Quick encoding helper (Windows PowerShell):
- Run: `./scripts/encode-hero.ps1 -Input "public/videos/YourSource.mp4" -Duration 10`
- Requires `ffmpeg` installed and on PATH: https://ffmpeg.org/download.html

ffmpeg tips (commands used by the script):
- Desktop MP4 (1080p, good quality):
  ffmpeg -ss 0 -i input.mp4 -t 00:00:10 -vf "scale=-2:1080:force_original_aspect_ratio=decrease" -c:v libx264 -preset slow -crf 20 -c:a aac -b:a 128k -movflags +faststart public/videos/hero-background-desktop.mp4

- Mobile MP4 (720p):
  ffmpeg -ss 0 -i input.mp4 -t 00:00:10 -vf "scale=-2:720:force_original_aspect_ratio=decrease" -c:v libx264 -preset medium -crf 22 -c:a aac -b:a 96k -movflags +faststart public/videos/hero-background-mobile.mp4

- Desktop WebM (VP9):
  ffmpeg -ss 0 -i input.mp4 -t 00:00:10 -vf "scale=-2:1080" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus public/videos/hero-background-desktop.webm

- Poster generation (JPG):
  ffmpeg -ss 00:00:02 -i input.mp4 -vframes 1 -q:v 2 public/images/hero-poster.jpg

Notes:
- Shorter clips (6–12s) are recommended. Adjust `-t` duration in the script.
- If encoding is slow for VP9, reduce quality (increase CRF) or skip WebM.

Optional: Create a vertical mobile version (9:16) if your hero composition requires filling the full mobile viewport without letterbox or crop. Example ffmpeg command to generate a 720x1280 vertical version (adds black padding if needed):

ffmpeg -ss 0 -i input.mp4 -t 00:00:10 -vf "scale=720:-2:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2,setsar=1" -c:v libx264 -preset medium -crf 22 -c:a aac -b:a 96k -movflags +faststart public/videos/hero-background-mobile-vertical.mp4

If you produce a vertical mobile file, update the component to prefer that file for portrait screens, or I can add that fallback for you.