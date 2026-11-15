# launch-reprocess.ps1
# Reads .env.local and launches 5 parallel reprocess instances
# WARNING: the local .env.local (April 2026) points at the OLD database, not
# production (see CLAUDE.md > Database). Check the endpoint printed below before
# letting it run; --force reprocesses every paper and spends AI credit.

$appDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envFile = Join-Path $appDir ".env.local"
$env_vars = @{}

foreach ($line in Get-Content $envFile) {
    if ($line -match '^([^#=]+)=(.*)$') {
        $key = $Matches[1].Trim()
        $val = $Matches[2].Trim()
        # Strip surrounding quotes
        $val = $val -replace '^"(.*)"$', '$1'
        $val = $val -replace "^'(.*)'$", '$1'
        # Strip literal \n at end
        $val = $val -replace '\\n$', ''
        $env_vars[$key] = $val
    }
}

Write-Host "Loaded $($env_vars.Count) env vars from .env.local"
# Print only the Neon endpoint id and whether the key is set, never credential characters.
$endpoint = if ($env_vars['DATABASE_URL'] -match '@(ep-[a-z0-9-]+)') { $Matches[1] } else { '(not found)' }
Write-Host "DATABASE_URL endpoint: $endpoint"
Write-Host "ANTHROPIC_API_KEY set: $([bool]$env_vars['ANTHROPIC_API_KEY'])"

# Child processes inherit this process's environment, so set the .env.local
# values here (this PowerShell session only) rather than per process.
foreach ($kv in $env_vars.GetEnumerator()) {
    Set-Item -Path "Env:$($kv.Key)" -Value $kv.Value
}

$instances = @(
    @{ n=1; offset=0;     limit=5231 },
    @{ n=2; offset=5231;  limit=5231 },
    @{ n=3; offset=10462; limit=5231 },
    @{ n=4; offset=15693; limit=5231 },
    @{ n=5; offset=20924; limit=5307 }
)

# Each run writes its own stdout and stderr files, opened by the OS, so logging
# keeps working after this script exits. (The old version wrote from PowerShell
# event handlers: every handler resolved $logFile to the last writer opened, and
# the pipes lost their reader when this script ended.)
foreach ($inst in $instances) {
    $outLog = Join-Path $appDir "scripts/reprocess-$($inst.n).log"
    $errLog = Join-Path $appDir "scripts/reprocess-$($inst.n).err.log"
    $cmdArgs = @("tsx", "scripts/process-past-papers.ts", "--force",
        "--offset", $inst.offset, "--limit", $inst.limit, "--concurrency", "4")

    $proc = Start-Process -FilePath "npx.cmd" -ArgumentList $cmdArgs `
        -WorkingDirectory $appDir -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput $outLog -RedirectStandardError $errLog

    Write-Host "Run $($inst.n): offset=$($inst.offset) PID=$($proc.Id) -> scripts/reprocess-$($inst.n).log (+ .err.log)"
}

Write-Host ""
Write-Host "All 5 runs launched. Monitor with:"
Write-Host "  Get-Content scripts/reprocess-1.log -Tail 10 -Wait"
Write-Host "  Get-Content scripts/reprocess-1.err.log -Tail 10"
