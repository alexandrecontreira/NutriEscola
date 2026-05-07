Add-Type -AssemblyName System.Drawing
$files = @(
  'arroz-branco.png',
  'arroz-integral.png',
  'macarrao.png',
  'batata-cozida.png',
  'salada-mix.png',
  'cenoura-ralada.png',
  'frango-grelhado.png',
  'carne-bovina.png',
  'ovo-cozido.png',
  'feijao.png'
)
foreach ($f in $files) {
  $path = Join-Path 'src/assets/images' $f
  if (Test-Path $path) {
    $img = [System.Drawing.Image]::FromFile($path)
    $new = New-Object System.Drawing.Bitmap 512,512
    $g = [System.Drawing.Graphics]::FromImage($new)
    $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $ratio = [Math]::Min(512.0 / $img.Width, 512.0 / $img.Height)
    $nw = [int]($img.Width * $ratio)
    $nh = [int]($img.Height * $ratio)
    $x = [int]((512 - $nw) / 2)
    $y = [int]((512 - $nh) / 2)
    $g.DrawImage($img, $x, $y, $nw, $nh)
    $g.Dispose()
    $img.Dispose()
    $new.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $new.Dispose()
    Write-Host "$f -> resized to 512x512"
  } else {
    Write-Host "$f missing"
  }
}
