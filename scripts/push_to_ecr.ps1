# PowerShell script to Build and Push Docker images to ECR (Sequential)

$AccountId = "500234530871"
$Region = "us-east-1"
$EcrRegistry = "$AccountId.dkr.ecr.$Region.amazonaws.com"

Write-Host "Logging into ECR..." -ForegroundColor Cyan
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $EcrRegistry

Function Build-And-Push {
    param (
        [string]$ServiceName,
        [string]$DockerContext
    )
    Write-Host "------------------------------------------------"
    Write-Host "Processing $ServiceName..." -ForegroundColor Yellow
    
    $ImageUri = "${EcrRegistry}/alikohub-${ServiceName}:latest"
    
    # Build
    Write-Host "Building $ServiceName..."
    docker build -t $ImageUri $DockerContext
    if ($LASTEXITCODE -ne 0) { Write-Error "Build failed for $ServiceName"; return }
    
    # Push
    Write-Host "Pushing $ServiceName..."
    docker push $ImageUri
    if ($LASTEXITCODE -ne 0) { Write-Error "Push failed for $ServiceName"; return }
    
    Write-Host "$ServiceName Done!" -ForegroundColor Green
    
    # Restart Pod to pull new image
    kubectl rollout restart deployment/$ServiceName -n alikohub
    
    # Prune to save space
    docker image prune -f
}

# Build sequantially to avoid overloading local Docker daemon
Build-And-Push "auth-service" "./domains/core-platform-services/auth-service"
Build-And-Push "academy" "./domains/academy/backend"
Build-And-Push "contech" "./domains/con-tech/backend"
Build-And-Push "events" "./domains/events/backend"
Build-And-Push "careers" "./domains/core-platform-services/careers-service"
Build-And-Push "api-gateway" "./domains/core-platform-services/api-gateway-service"

Write-Host "All services built and pushed!" -ForegroundColor Cyan
