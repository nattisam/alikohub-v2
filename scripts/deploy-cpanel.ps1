# AlikoHub cPanel Deployment Script (from Local)

$hostUrl = "sunset.hostns.io"
$username = "alikohop"
$keyFile = "cpanel_deploy_key"
$targetDir = "alikohub-backend" # This will be under /home/alikohop/

$services = @(
    "domains/academy/backend",
    "domains/con-tech/backend",
    "domains/events/backend",
    "domains/core-platform-services/api-gateway-service",
    "domains/core-platform-services/auth-service",
    "domains/core-platform-services/careers-service",
    "domains/core-platform-services/file-upload-service"
)

Write-Host "--- Starting Build Process ---" -ForegroundColor Cyan
foreach ($service in $services) {
    Write-Host "Building $service ..."
    # Check if directory exists
    if (Test-Path $service) {
        pushd $service
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Build failed for $service! Deployment aborted."
            popd
            exit $LASTEXITCODE
        }
        popd
    }
}

Write-Host "--- Archiving Files for Transfer ---" -ForegroundColor Cyan
if (Test-Path "deploy.zip") { Remove-Item "deploy.zip" }

# Collect all dist folders and main config files
# Note: Compress-Archive can be picky with wildcards in some PS versions.
# We'll create a temporary list of files to archive.
$itemsToArchive = @("package.json", "ecosystem.config.cjs")
foreach ($service in $services) {
    if (Test-Path "$service/dist") {
        $itemsToArchive += "$service/dist"
    }
}

# Zip the collected items
Compress-Archive -Path $itemsToArchive -DestinationPath "deploy.zip"

Write-Host "--- Transferring Files to cPanel ---" -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no -i $keyFile $username@$hostUrl "mkdir -p $targetDir"
scp -o StrictHostKeyChecking=no -i $keyFile "deploy.zip" "${username}@${hostUrl}:${targetDir}/"

Write-Host "--- Extracting and Installing on Server ---" -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no -i $keyFile $username@$hostUrl "cd $targetDir && unzip -o deploy.zip && npm install --production"

Write-Host "--- Starting Services via PM2 ---" -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no -i $keyFile $username@$hostUrl "cd $targetDir && (pm2 delete all; pm2 start ecosystem.config.cjs) || (pm2 start ecosystem.config.cjs)"

Write-Host "--- Deployment Complete! ---" -ForegroundColor Green
Write-Host "Access cPanel at: https://alikohub.com:2083" -ForegroundColor Yellow
