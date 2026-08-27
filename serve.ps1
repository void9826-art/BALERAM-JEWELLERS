# Preview the site on this computer.
#
#   Right-click this file  ->  "Run with PowerShell"
#   then open  http://localhost:8175  in your browser.
#
# You only need this while editing. Once the site is uploaded to a host,
# it runs on its own. Press Ctrl+C in the window to stop.

param(
  [string]$Root = (Join-Path $PSScriptRoot "site"),
  [int]$Port = 8175
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host ""
Write-Host "  Baleram Ramashankar Jewellers - local preview" -ForegroundColor Yellow
Write-Host "  Open http://localhost:$Port in your browser"
Write-Host "  Press Ctrl+C to stop."
Write-Host ""

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".png"  = "image/png"
  ".webp" = "image/webp"
  ".svg"  = "image/svg+xml"
  ".txt"  = "text/plain; charset=utf-8"
  ".ico"  = "image/x-icon"
  ".md"   = "text/plain; charset=utf-8"
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $Root ($path.TrimStart("/") -replace "/", "\")

    # never serve anything from outside this folder
    $full = [System.IO.Path]::GetFullPath($file)
    if (-not $full.StartsWith([System.IO.Path]::GetFullPath($Root))) {
      $ctx.Response.StatusCode = 403
      $ctx.Response.OutputStream.Close()
      continue
    }

    $ctx.Response.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate")

    if (Test-Path $full -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $type = $mime[$ext]
      if (-not $type) { $type = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $ctx.Response.ContentType = $type
      $ctx.Response.ContentLength64 = $bytes.Length
      if ($ctx.Request.HttpMethod -ne "HEAD") {
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("Not found: $path")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.OutputStream.Close()
  } catch {
    Write-Host "error: $_"
  }
}
