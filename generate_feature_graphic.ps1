Add-Type -AssemblyName System.Drawing

$srcLogoPath = "C:\Proyectos\merida-gastronomica\public\logo-merida-gastronomica.png"
$outAndroidPath = "C:\Proyectos\merida-gastronomica\android\app\src\main\play_store_feature_graphic_1024x500.png"
$outPublicPath = "C:\Proyectos\merida-gastronomica\public\play_store_feature_graphic_1024x500.png"

$width = 1024
$height = 500

$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Fondo Degradado de Lujo: De #181614 a #2B2521
$rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
$c1 = [System.Drawing.ColorTranslator]::FromHtml("#181614")
$c2 = [System.Drawing.ColorTranslator]::FromHtml("#28221D")
$brushBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, 45.0
$g.FillRectangle($brushBg, $rect)
$brushBg.Dispose()

# Destello ambiental Cámara Orange
$glowColor = [System.Drawing.Color]::FromArgb(45, 200, 90, 50)
$glowBrush = New-Object System.Drawing.SolidBrush $glowColor
$g.FillEllipse($glowBrush, [int]($width * 0.6), -100, 500, 500)
$glowBrush.Dispose()

# Dibujar Logo
if (Test-Path $srcLogoPath) {
    $srcImg = [System.Drawing.Image]::FromFile($srcLogoPath)
    $logoSize = 250
    $logoX = 80
    $logoY = [int](($height - $logoSize) / 2)
    $g.DrawImage($srcImg, $logoX, $logoY, $logoSize, $logoSize)
    $srcImg.Dispose()
}

# Tipografía y Textos con tipos Float explícitos
$fontTitle = New-Object System.Drawing.Font ("Georgia", [float]32, [System.Drawing.FontStyle]::Bold)
$fontSubtitle = New-Object System.Drawing.Font ("Arial", [float]15, [System.Drawing.FontStyle]::Regular)
$fontBadge = New-Object System.Drawing.Font ("Arial", [float]11, [System.Drawing.FontStyle]::Bold)
$fontBullet = New-Object System.Drawing.Font ("Arial", [float]12, [System.Drawing.FontStyle]::Regular)

$brushWhite = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$brushOrange = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#FF7A45"))
$brushGold = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#FBBF24"))
$brushMuted = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#D8CFBE"))

$textX = 360
$textY = 125

# Badge Superior
$g.DrawString("APP OFICIAL • CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA", $fontBadge, $brushOrange, [float]$textX, [float]$textY)

# Título Principal
$g.DrawString("Mérida Gastronómica", $fontTitle, $brushWhite, [float]$textX, [float]($textY + 32))

# Subtítulo Descriptivo
$g.DrawString("El Sabor & el Turismo de los Andes en tu Bolsillo", $fontSubtitle, $brushGold, [float]$textX, [float]($textY + 95))

# Viñetas de Funcionalidades
$bullets = @(
    "🍽️ Restaurantes, Posadas & Cafeterías Certificadas",
    "🚡 Teleférico Mukumbarí, Rutas & Guía del Viajero",
    "💬 Reservas Directas por WhatsApp sin Comisiones"
)

$bulletY = $textY + 145
foreach ($b in $bullets) {
    $g.DrawString($b, $fontBullet, $brushMuted, [float]$textX, [float]$bulletY)
    $bulletY += 28
}

# Liberar recursos
$fontTitle.Dispose()
$fontSubtitle.Dispose()
$fontBadge.Dispose()
$fontBullet.Dispose()
$brushWhite.Dispose()
$brushOrange.Dispose()
$brushGold.Dispose()
$brushMuted.Dispose()
$g.Dispose()

# Guardar en Android y en Public
$bmp.Save($outAndroidPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($outPublicPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Feature Graphic Generated Cleanly: 1024x500 at $outAndroidPath and $outPublicPath"
