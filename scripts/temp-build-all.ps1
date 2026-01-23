$services = @(
    "domains/academy/backend",
    "domains/con-tech/backend",
    "domains/events/backend",
    "domains/core-platform-services/api-gateway-service",
    "domains/core-platform-services/auth-service",
    "domains/core-platform-services/careers-service",
    "domains/core-platform-services/file-upload-service"
)

foreach ($service in $services) {
    Write-Host "--- Building $service ---" -ForegroundColor Cyan
    $fullPath = "C:/Users/X1/pro/alikohub/alikohub-reimplementation/$service"
    pushd $fullPath
    npm run build
    popd
}
