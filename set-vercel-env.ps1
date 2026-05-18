# ═══════════════════════════════════════════════════════════════════════════
# Push toutes les variables d'environnement Vercel d'un coup
#
# USAGE :
#   1. cd dans ton dossier de projet (sitevolleyclub avec package.json)
#   2. npm i -g vercel        (si tu n'as pas Vercel CLI)
#   3. vercel login           (te connecter à ton compte)
#   4. vercel link            (lier ce dossier à ton projet Vercel)
#   5. .\set-vercel-env.ps1   (lance ce script)
# ═══════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Continue"

# URL de production — mets à jour après le 1er déploiement si le domaine diffère
$SITE_URL = "https://sitevolleyclub.vercel.app"

$envFile = Join-Path $PSScriptRoot ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Fichier .env.local introuvable : $envFile" -ForegroundColor Red
    exit 1
}

function Read-DotEnv([string]$path) {
    $map = @{}
    Get-Content $path -Encoding UTF8 | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq "" -or $line.StartsWith("#")) { return }
        if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*"?([^"#]*)"?\s*(#.*)?$') {
            $map[$Matches[1]] = $Matches[2].Trim()
        }
    }
    return $map
}

function Ensure-VercelCli {
    if (Get-Command vercel -ErrorAction SilentlyContinue) { return }
    Write-Host "Vercel CLI introuvable. Installation globale..." -ForegroundColor Yellow
    npm i -g vercel
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        throw "Impossible de trouver 'vercel' après installation. Relance le terminal."
    }
}

function Set-VercelEnv([string]$name, [string]$value, [object[]]$targets) {
    foreach ($target in $targets) {
        $env = $target.env
        $branch = $target.branch
        if ($branch) {
            $null = & vercel env add $name $env $branch --value $value --force --yes 2>&1
        } else {
            $null = & vercel env add $name $env --value $value --force --yes 2>&1
        }
        if ($LASTEXITCODE -ne 0) {
            throw "Échec pour $name ($env$(if ($branch) { "/$branch" }))"
        }
    }
}

$local = Read-DotEnv $envFile

# Connexion directe Prisma (migrations) — host db.*, pas le pooler
$directUrl = "postgresql://postgres.gasyvupfimymreeyitur:Maxpab%2E222@db.gasyvupfimymreeyitur.supabase.co:5432/postgres"

$envVars = @{
    "DATABASE_URL"                         = $local["DATABASE_URL"]
    "DIRECT_URL"                           = $directUrl
    "AUTH_SECRET"                          = $local["AUTH_SECRET"]
    "AUTH_URL"                             = $SITE_URL
    "NEXT_PUBLIC_APP_URL"                  = $SITE_URL
    "NEXT_PUBLIC_SITE_URL"                 = $SITE_URL
    "NEXT_PUBLIC_SUPABASE_URL"             = $local["NEXT_PUBLIC_SUPABASE_URL"]
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" = $local["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]
    "RESEND_API_KEY"                       = $local["RESEND_API_KEY"]
    "RESEND_FROM_NAME"                     = $local["RESEND_FROM_NAME"]
    "RESEND_FROM_EMAIL"                    = $local["RESEND_FROM_EMAIL"]
}

# Preview exige une branche Git en mode non-interactif (CLI Vercel récente)
$gitBranch = "main"
$targets = @(
    @{ env = "production" },
    @{ env = "development" },
    @{ env = "preview"; branch = $gitBranch }
)

Write-Host "Configuration des variables Vercel..." -ForegroundColor Cyan
Write-Host "Site URL : $SITE_URL" -ForegroundColor DarkGray
Write-Host ""

Ensure-VercelCli

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Host "  $key (vide, ignore)" -ForegroundColor DarkGray
        continue
    }
    Write-Host "  $key" -ForegroundColor Yellow
    Set-VercelEnv -name $key -value $value -targets $targets
}

Write-Host ""
Write-Host "Variables Vercel configurees (production, preview, development)." -ForegroundColor Green
Write-Host ""
Write-Host "Etapes suivantes :" -ForegroundColor Cyan
Write-Host "  vercel --prod"
Write-Host "  Si le domaine Vercel differe, modifie `$SITE_URL en haut du script puis relance."
