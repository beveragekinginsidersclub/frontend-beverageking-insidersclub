<#
PowerShell helper to transcode the hero video into web-optimized outputs.
Usage (PowerShell):
  ./scripts/encode-hero.ps1 -Input "public/videos/input.mp4" -Duration 10

Prerequisites:
- Install ffmpeg and make sure `ffmpeg` is on your PATH:
  https://ffmpeg.org/download.html
#>
param(
  [string]$Input = "public/videos/Dec_31__1410_16s_202512311424_nv6f2.mp4",
  [int]$Duration = 10
)

function Abort($msg) {
  Write-Error $msg
  exit 1
}

# Check FFmpeg
try {
  & ffmpeg -version > $null 2>&1
} catch {
  Abort "ffmpeg is not available on PATH. Install ffmpeg and re-run. See https://ffmpeg.org/download.html"
}

if (-Not (Test-Path $Input)) { Abort "Input file not found: $Input" }

Write-Host "Encoding hero video from: $Input (duration: ${Duration}s)"

# Ensure output folders exist
New-Item -ItemType Directory -Force -Path public/videos > $null
New-Item -ItemType Directory -Force -Path public/images > $null

# Desktop MP4 (1080p)
Write-Host "Creating desktop MP4 (1080p)..."
ffmpeg -y -ss 0 -i "$Input" -t 00:00:$Duration -vf "scale=-2:1080:force_original_aspect_ratio=decrease" -c:v libx264 -preset slow -crf 20 -c:a aac -b:a 128k -movflags +faststart public/videos/hero-background-desktop.mp4
if ($LASTEXITCODE -ne 0) { Abort "Failed to create desktop MP4" }

# Mobile MP4 (720p)
Write-Host "Creating mobile MP4 (720p)..."
ffmpeg -y -ss 0 -i "$Input" -t 00:00:$Duration -vf "scale=-2:720:force_original_aspect_ratio=decrease" -c:v libx264 -preset medium -crf 22 -c:a aac -b:a 96k -movflags +faststart public/videos/hero-background-mobile.mp4
if ($LASTEXITCODE -ne 0) { Abort "Failed to create mobile MP4" }

# Desktop WebM (VP9)
Write-Host "Creating desktop WebM (VP9)..."
ffmpeg -y -ss 0 -i "$Input" -t 00:00:$Duration -vf "scale=-2:1080" -c:v libvpx-vp9 -crf 30 -b:v 0 -deadline good -cpu-used 1 -row-mt 1 -c:a libopus -b:a 96k public/videos/hero-background-desktop.webm
if ($LASTEXITCODE -ne 0) { Abort "Failed to create desktop WebM" }

# Mobile WebM (VP9)
Write-Host "Creating mobile WebM (VP9)..."
ffmpeg -y -ss 0 -i "$Input" -t 00:00:$Duration -vf "scale=-2:720" -c:v libvpx-vp9 -crf 32 -b:v 0 -deadline good -cpu-used 1 -row-mt 1 -c:a libopus -b:a 64k public/videos/hero-background-mobile.webm
if ($LASTEXITCODE -ne 0) { Abort "Failed to create mobile WebM" }

# Low-bandwidth fallback (480p)
Write-Host "Creating low-bandwidth MP4 (480p)..."
ffmpeg -y -ss 0 -i "$Input" -t 00:00:$Duration -vf "scale=-2:480" -c:v libx264 -preset veryfast -crf 24 -c:a aac -b:a 64k -movflags +faststart public/videos/hero-background-low.mp4
if ($LASTEXITCODE -ne 0) { Abort "Failed to create low-bandwidth MP4" }

# Poster image (JPG)
Write-Host "Generating poster image..."
ffmpeg -y -ss 00:00:02 -i "$Input" -vframes 1 -q:v 2 public/images/hero-poster.jpg
if ($LASTEXITCODE -ne 0) { Abort "Failed to generate poster" }

Write-Host "All outputs created in public/videos/ and poster in public/images/"
Write-Host "Files created:"
Get-ChildItem -Path public/videos -Filter "hero-background*" | ForEach-Object { Write-Host " - $_" }
Write-Host " - public/images/hero-poster.jpg"
