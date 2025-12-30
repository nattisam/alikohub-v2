# AlikoHub: Whole-Project AWS Deployment Strategy

This plan details the end-to-end deployment of the AlikoHub microservices ecosystem on AWS using Kubernetes (EKS).

## Architecture Strategy

> [!NOTE]
> The deployment leverages **AWS EKS** for high availability, **AWS ECR** for image storage, and **AWS RDS (PostgreSQL)** for persistence. The **API Gateway** acts as the ingress point reachable via an **AWS Application Load Balancer (ALB)**.

## Proposed Components

### 1. Networking Infrastructure
- VPC with Public and Private subnets.
- Load Balancer exposing the `api-gateway-service` on port 80/443.

### 2. Microservice Deployment
- **Auth Service**: Core identity provider (TCP port 3001).
- **Domain Services**: Academy (3005), Con-Tech (3002), Events (3003) as independent deployments.
- **Service Discovery**: Internal K8s DNS (e.g., `auth-service.alikohub.svc.cluster.local`).

### 3. State & Messaging
- **RDS Instances**: Managed Postgres for each service.
- **Amazon MQ**: (Optional) For services requiring RabbitMQ integration.

## Verification Plan

### Automated Verification
1. Dry-run deployment using Kustomize:
   ```bash
   kubectl apply -k ./k8s --dry-run=client
   ```
2. Connectivity check script (local simulation):
   ```bash
   node domains/con-tech/backend/test-profiles-direct.js
   ```

### Manual Verification
1. Inspect the `docs/aws_deployment_strategy.md` for architectural alignment.
