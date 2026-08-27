# Set the website's real address, everywhere, in one go.
#
#   Right-click this file  ->  "Run with PowerShell"
#   then type your domain when it asks, for example:  baleramjewellers.com
#
# Run this ONCE, after you know the address the site will live at, and
# BEFORE you zip the site folder. It fills in the canonical links, the
# social sharing tags, robots.txt and sitemap.xml.
#
# Safe to run again later if the address ever changes.

param([string]$Domain)

$ErrorActionPreference = "Stop"
$site = Join-Path $PSScriptRoot "site"
$placeholder = "REPLACE-WITH-YOUR-DOMAIN"

if (-not $Domain) {
  Write-Host ""
  Write-Host "  What address will the site live at?" -ForegroundColor Yellow
  Write-Host "  Type it without https, for example:  baleramjewellers.com"
  Write-Host ""
  $Domain = Read-Host "  Domain"
}

# tidy whatever they typed into a bare host name
$Domain = $Domain.Trim()
$Domain = $Domain -replace '^https?://', ''
$Domain = $Domain -replace '/+$', ''

if ([string]::IsNullOrWhiteSpace($Domain)) {
  Write-Host "  No domain given, nothing changed." -ForegroundColor Red
  exit 1
}
if ($Domain -notmatch '^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') {
  Write-Host "  '$Domain' does not look like a domain. Nothing changed." -ForegroundColor Red
  exit 1
}

$files = Get-ChildItem -Path $site -Recurse -Include *.html,*.xml,*.txt -File
$changed = 0

foreach ($f in $files) {
  $text = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
  if ($text.Contains($placeholder)) {
    $text = $text.Replace($placeholder, $Domain)
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($f.FullName, $text, $utf8)
    $changed++
    Write-Host "  updated  $($f.Name)" -ForegroundColor Green
  }
}

Write-Host ""
if ($changed -eq 0) {
  Write-Host "  Nothing needed changing. The address may already be set." -ForegroundColor Yellow
} else {
  Write-Host "  Done. $changed files now point at https://$Domain" -ForegroundColor Green
}
Write-Host ""
Write-Host "  Next: zip the CONTENTS of the site folder, so that index.html"
Write-Host "  sits at the top of the zip, and upload that."
Write-Host ""
