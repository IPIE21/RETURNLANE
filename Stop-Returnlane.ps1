$ErrorActionPreference = 'Stop'
$appUrl = 'http://127.0.0.1:4317'
try { $health = Invoke-RestMethod -Uri "$appUrl/api/state" -TimeoutSec 2 }
catch { Write-Host 'No Returnlane server is running on port 4317.'; exit 0 }
if ($health.policy.version -ne 'TRADE-1.0') { throw 'The service on port 4317 is not the expected Returnlane demo.' }
Invoke-RestMethod -Uri "$appUrl/api/shutdown" -Method Post -ContentType 'application/json' -Headers @{ 'X-Returnlane-Client' = 'local-demo' } -Body '{}' -TimeoutSec 5 | Out-Null
Write-Host 'Returnlane stopped. Your saved demo conversations and appointments are retained.'
