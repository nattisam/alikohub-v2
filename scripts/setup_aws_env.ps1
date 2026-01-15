# PowerShell script to help setup AWS CLI and eksctl

Write-Host "Setting up AWS Environment Tools..." -ForegroundColor Cyan

# 1. AWS CLI
$AwsCliUrl = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$AwsCliInstaller = "AWSCLIV2.msi"

if (Get-Command "aws" -ErrorAction SilentlyContinue) {
    Write-Host "AWS CLI is already installed." -ForegroundColor Green
} else {
    Write-Host "Downloading AWS CLI Installer..."
    Invoke-WebRequest -Uri $AwsCliUrl -OutFile $AwsCliInstaller
    Write-Host "Installing AWS CLI... (A UAC prompt may appear)"
    Start-Process msiexec.exe -Wait -ArgumentList "/i $AwsCliInstaller /passive"
    Write-Host "AWS CLI installed." -ForegroundColor Green
    Remove-Item $AwsCliInstaller
}

# 2. eksctl
if (Get-Command "eksctl" -ErrorAction SilentlyContinue) {
    Write-Host "eksctl is already installed." -ForegroundColor Green
} else {
    Write-Host "Installing eksctl..."
    
    # Create bin directory if not exists
    $BinDir = "$HOME\bin"
    if (-not (Test-Path $BinDir)) {
        New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
    }

    # Download latest release info to find version (simplified: hardcoding a recent stable version or using generic link if available)
    # Using specific version to ensure url validity
    $EksctlUrl = "https://github.com/eksctl-io/eksctl/releases/download/v0.194.0/eksctl_Windows_amd64.zip"
    $EksctlZip = "eksctl.zip"
    
    Write-Host "Downloading eksctl..."
    Invoke-WebRequest -Uri $EksctlUrl -OutFile $EksctlZip
    
    Write-Host "Extracting eksctl..."
    Expand-Archive -Path $EksctlZip -DestinationPath $BinDir -Force
    
    # Add to user PATH if not present
    $UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($UserPath -notlike "*$BinDir*") {
        Write-Host "Adding $BinDir to User PATH..."
        [Environment]::SetEnvironmentVariable("Path", "$UserPath;$BinDir", "User")
        Write-Host "PATH updated. You will need to RESTART your terminal." -ForegroundColor Yellow
    }
    
    Remove-Item $EksctlZip
    Write-Host "eksctl installed to $BinDir" -ForegroundColor Green
}

Write-Host "Setup Complete! Please restart your terminal." -ForegroundColor Cyan
