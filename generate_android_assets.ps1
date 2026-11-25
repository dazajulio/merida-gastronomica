Add-Type -AssemblyName System.Drawing

$srcLogoPath = "C:\Proyectos\merida-gastronomica\public\logo-merida-gastronomica.png"
if (-not (Test-Path $srcLogoPath)) {
    Write-Error "Logo not found at $srcLogoPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcLogoPath)
$brandColor = [System.Drawing.ColorTranslator]::FromHtml("#C85A32")
$darkBrandColor = [System.Drawing.ColorTranslator]::FromHtml("#1E1C1A")
$warmCream = [System.Drawing.ColorTranslator]::FromHtml("#FAF7F2")

# Función para redimensionar con alta calidad
function Draw-Icon {
    param(
        [int]$width,
        [int]$height,
        [string]$outPath,
        [bool]$isRound = $false,
        [bool]$isForeground = $false
    )

    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if ($isForeground) {
        # Foreground para Adaptive Icons (fondo transparente, logo centrado ocupando el 65% del área segura)
        $g.Clear([System.Drawing.Color]::Transparent)
        $logoSize = [int]($width * 0.65)
        $x = [int](($width - $logoSize) / 2)
        $y = [int](($height - $logoSize) / 2)
        $g.DrawImage($srcImg, $x, $y, $logoSize, $logoSize)
    } elseif ($isRound) {
        # Icono Redondo (con fondo #C85A32)
        $g.Clear([System.Drawing.Color]::Transparent)
        $brush = New-Object System.Drawing.SolidBrush $brandColor
        $g.FillEllipse($brush, 0, 0, $width - 1, $height - 1)
        $brush.Dispose()

        $logoSize = [int]($width * 0.72)
        $x = [int](($width - $logoSize) / 2)
        $y = [int](($height - $logoSize) / 2)
        $g.DrawImage($srcImg, $x, $y, $logoSize, $logoSize)
    } else {
        # Icono Estándar (fondo #C85A32 con esquinas suaves o full-bleed)
        $g.Clear($brandColor)
        $logoSize = [int]($width * 0.75)
        $x = [int](($width - $logoSize) / 2)
        $y = [int](($height - $logoSize) / 2)
        $g.DrawImage($srcImg, $x, $y, $logoSize, $logoSize)
    }

    $g.Dispose()
    
    # Crear directorio si no existe
    $dir = [System.IO.Path]::GetDirectoryName($outPath)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $outPath ($width x $height)"
}

# 1. GENERAR ICONOS ANDROID MIPMAP
$resRoot = "C:\Proyectos\merida-gastronomica\android\app\src\main\res"

$mipmapSpecs = @(
    @{ Name = "mipmap-mdpi";    Size = 48;  FgSize = 108 },
    @{ Name = "mipmap-hdpi";    Size = 72;  FgSize = 162 },
    @{ Name = "mipmap-xhdpi";   Size = 96;  FgSize = 216 },
    @{ Name = "mipmap-xxhdpi";  Size = 144; FgSize = 324 },
    @{ Name = "mipmap-xxxhdpi"; Size = 192; FgSize = 432 }
)

foreach ($spec in $mipmapSpecs) {
    $folder = Join-Path $resRoot $spec.Name
    
    # ic_launcher.png (estándar)
    Draw-Icon -width $spec.Size -height $spec.Size -outPath (Join-Path $folder "ic_launcher.png") -isRound $false
    
    # ic_launcher_round.png (redondo)
    Draw-Icon -width $spec.Size -height $spec.Size -outPath (Join-Path $folder "ic_launcher_round.png") -isRound $true
    
    # ic_launcher_foreground.png (adaptativo)
    Draw-Icon -width $spec.FgSize -height $spec.FgSize -outPath (Join-Path $folder "ic_launcher_foreground.png") -isForeground $true
}

# 2. GENERAR ICONO OFICIAL DE GOOGLE PLAY STORE (512x512)
$playStoreIconPath = "C:\Proyectos\merida-gastronomica\android\app\src\main\play_store_512.png"
$playStorePublicPath = "C:\Proyectos\merida-gastronomica\public\play_store_512.png"
Draw-Icon -width 512 -height 512 -outPath $playStoreIconPath -isRound $false
Draw-Icon -width 512 -height 512 -outPath $playStorePublicPath -isRound $false

# 3. GENERAR SPLASH SCREENS NATIVOS
function Draw-Splash {
    param(
        [int]$width,
        [int]$height,
        [string]$outPath
    )

    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Fondo Obsidiana de Lujo
    $g.Clear($darkBrandColor)

    # Logo centrado
    $minDim = [Math]::Min($width, $height)
    $logoSize = [int]($minDim * 0.42)
    if ($logoSize -gt 380) { $logoSize = 380 }
    if ($logoSize -lt 120) { $logoSize = 120 }

    $x = [int](($width - $logoSize) / 2)
    $y = [int](($height - $logoSize) / 2 - 20)
    $g.DrawImage($srcImg, $x, $y, $logoSize, $logoSize)

    $g.Dispose()

    $dir = [System.IO.Path]::GetDirectoryName($outPath)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created Splash: $outPath ($width x $height)"
}

$splashSpecs = @(
    @{ Folder = "drawable";             W = 480;  H = 800 },
    @{ Folder = "drawable-port-mdpi";    W = 320;  H = 480 },
    @{ Folder = "drawable-port-hdpi";    W = 480;  H = 800 },
    @{ Folder = "drawable-port-xhdpi";   W = 720;  H = 1280 },
    @{ Folder = "drawable-port-xxhdpi";  W = 960;  H = 1600 },
    @{ Folder = "drawable-port-xxxhdpi"; W = 1280; H = 1920 },
    @{ Folder = "drawable-land-mdpi";    W = 480;  H = 320 },
    @{ Folder = "drawable-land-hdpi";    W = 800;  H = 480 },
    @{ Folder = "drawable-land-xhdpi";   W = 1280; H = 720 },
    @{ Folder = "drawable-land-xxhdpi";  W = 1600; H = 960 },
    @{ Folder = "drawable-land-xxxhdpi"; W = 1920; H = 1280 }
)

foreach ($spec in $splashSpecs) {
    $outPath = Join-Path $resRoot (Join-Path $spec.Folder "splash.png")
    Draw-Splash -width $spec.W -height $spec.H -outPath $outPath
}

$srcImg.Dispose()
Write-Host "All Android Assets Successfully Generated!"
