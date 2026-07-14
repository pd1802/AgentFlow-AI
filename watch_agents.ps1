$fw = New-Object System.IO.FileSystemWatcher -ArgumentList '.\research','agents.py'
$fw.NotifyFilter = [System.IO.NotifyFilters]::LastWrite
$fw.IncludeSubdirectories = $false
$fw.EnableRaisingEvents = $true
Register-ObjectEvent -InputObject $fw -EventName Changed -SourceIdentifier AgentsFileChanged -Action {
    "CHANGED: $(Get-Date)" | Out-File .\file_changes.log -Append
    "Processes at change:" | Out-File .\file_changes.log -Append
    Get-Process | Out-File .\file_changes.log -Append
}
Write-Output 'Watcher started'
while ($true) { Start-Sleep -Seconds 3600 }
