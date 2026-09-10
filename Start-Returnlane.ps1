param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$appRoot = $PSScriptRoot
$appUrl = 'http://127.0.0.1:4317'
try {
    $existing = Invoke-RestMethod -Uri "$appUrl/api/state" -TimeoutSec 2
    if ($existing.policy.version -eq 'TRADE-1.0') {
        Write-Host "Returnlane is already running at $appUrl"
        if (-not $NoBrowser) { Start-Process $appUrl }
        exit 0
    }
} catch { }
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) { $nodeExecutable = $nodeCommand.Source }
else {
    $bundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
    if (Test-Path -LiteralPath $bundledNode) { $nodeExecutable = $bundledNode }
    else { throw 'Node.js 24 or newer is required. Install it, then run this launcher again.' }
}
$majorVersion = [int]((& $nodeExecutable --version).TrimStart('v').Split('.')[0])
if ($majorVersion -lt 24) { throw 'Please use Node.js 24 or newer.' }
$dataDirectory = Join-Path $appRoot 'data'
New-Item -ItemType Directory -Path $dataDirectory -Force | Out-Null
$serverFile = Join-Path $appRoot 'server.mjs'
$process = Start-Process -FilePath $nodeExecutable -ArgumentList @('"' + $serverFile + '"') -WorkingDirectory $appRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $dataDirectory 'server.log') -RedirectStandardError (Join-Path $dataDirectory 'server-error.log')
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 200
    if ($process.HasExited) { throw "Returnlane could not start. Check data\server-error.log. Port 4317 may be in use." }
    try {
        $health = Invoke-RestMethod -Uri "$appUrl/api/state" -TimeoutSec 1
        if ($health.policy.version -eq 'TRADE-1.0') {
            Write-Host "Returnlane is running at $appUrl"
            if (-not $NoBrowser) { Start-Process $appUrl }
            exit 0
        }
    } catch { }
}
throw 'Startup timed out. Check data\server-error.log.'
