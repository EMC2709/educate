# launch-reprocess.ps1
# Reads .env.local and launches 5 parallel reprocess instances
# WARNING: the local .env.local (April 2026) points at the OLD database, not
# production (see CLAUDE.md > Database). Check the endpoint printed below before
# letting it run; --force reprocesses every paper and spends AI credit.

$envFile = Join-Path $PSScriptRoot ".." ".env.local"
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

$appDir = Join-Path $PSScriptRoot ".."

$instances = @(
    @{ offset=0;     limit=5231; log="scripts/reprocess-1.log" },
    @{ offset=5231;  limit=5231; log="scripts/reprocess-2.log" },
    @{ offset=10462; limit=5231; log="scripts/reprocess-3.log" },
    @{ offset=15693; limit=5231; log="scripts/reprocess-4.log" },
    @{ offset=20924; limit=5307; log="scripts/reprocess-5.log" }
)

foreach ($inst in $instances) {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "npx"
    $psi.Arguments = "tsx scripts/process-past-papers.ts --force --offset $($inst.offset) --limit $($inst.limit) --concurrency 4"
    $psi.WorkingDirectory = $appDir
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true

    # Set all env vars
    foreach ($kv in $env_vars.GetEnumerator()) {
        $psi.EnvironmentVariables[$kv.Key] = $kv.Value
    }
    # Also inherit PATH etc from current process
    foreach ($kv in [System.Environment]::GetEnvironmentVariables([System.EnvironmentVariableTarget]::Process).GetEnumerator()) {
        if (-not $psi.EnvironmentVariables.ContainsKey($kv.Key)) {
            $psi.EnvironmentVariables[$kv.Key] = $kv.Value
        }
    }

    $logPath = Join-Path $appDir $inst.log
    $proc = New-Object System.Diagnostics.Process
    $proc.StartInfo = $psi

    # Async log writing
    $logFile = [System.IO.StreamWriter]::new($logPath, $false, [System.Text.Encoding]::UTF8)
    $offset = $inst.offset
    $proc.OutputDataReceived += { param($s,$e); if ($e.Data) { $logFile.WriteLine($e.Data) } }
    $proc.ErrorDataReceived  += { param($s,$e); if ($e.Data) { $logFile.WriteLine("[ERR] " + $e.Data) } }

    $proc.Start() | Out-Null
    $proc.BeginOutputReadLine()
    $proc.BeginErrorReadLine()

    Write-Host "Instance offset=$($inst.offset) PID=$($proc.Id) -> $($inst.log)"
}

Write-Host ""
Write-Host "All 5 instances launched. Monitor with:"
Write-Host "  Get-Content scripts/reprocess-1.log -Tail 10"
