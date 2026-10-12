# 청약홈 데이터 매일 갱신 (PC, 2026-10-12). 작업 스케줄러 "CheongyakDailyFetch" 09:30
# 수집 -> 변경 있으면 커밋·푸시 -> Vercel 재배포. 깃허브 시크릿 없이 로컬 .env 키를 쓴다.
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
$log = Join-Path $PSScriptRoot "daily-cheongyak.log"
# Get-Content/Add-Content는 이 PC에서 한글·-Encoding이 깨져 .NET으로 읽고 쓴다
$utf8 = New-Object Text.UTF8Encoding($false)
function Log($m) { [IO.File]::AppendAllText($log, ("[{0}] {1}`r`n" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $m), $utf8) }

$envFile = "D:\2_antigravity\01_수익브랜드\BLOG_총괄\Keyword Extraction Service Development_Blog Intelligence\blog_benchmark_system\.env"
$line = [IO.File]::ReadAllLines($envFile, $utf8) | Where-Object { $_ -match '^DATA_GO_KR_KEY=' } | Select-Object -First 1
if (-not $line) { Log "DATA_GO_KR_KEY 없음"; exit 1 }
$env:DATA_GO_KR_KEY = ($line -replace '^DATA_GO_KR_KEY=', '').Trim()

Log "시작"
$out = & node "scripts\fetch-cheongyak.mjs" 2>&1
$out | ForEach-Object { Log $_ }
if ($LASTEXITCODE -ne 0) { Log "수집 실패"; exit 1 }

& git add src/data/cheongyak.json
& git diff --cached --quiet
if ($LASTEXITCODE -eq 0) { Log "변경 없음"; exit 0 }
& git -c core.safecrlf=false commit -q -m ("data: 청약홈 {0} 갱신" -f (Get-Date -Format "yyyy-MM-dd"))
& git push origin main 2>&1 | ForEach-Object { Log $_ }
if ($LASTEXITCODE -eq 0) { Log "푸시 완료" } else { Log "푸시 실패" }
