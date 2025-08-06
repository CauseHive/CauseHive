#!/bin/bash

# Azure Container Registry and Environment details
ACR_LOGIN_SERVER="causehiveacr.azurecr.io"
RESOURCE_GROUP="causehive-rg"
ENVIRONMENT="causehive-env"
TAG="latest"

echo "Deploying all services to Azure Container Apps..."

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name causehiveacr --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name causehiveacr --query passwords[0].value --output tsv)

# Deploy user-service
echo "Deploying user-service..."
az containerapp create \
  --name user-service \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_LOGIN_SERVER/user-service:$TAG \
  --target-port 8000 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3

# Deploy cause-service
echo "Deploying cause-service..."
az containerapp create \
  --name cause-service \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_LOGIN_SERVER/cause-service:$TAG \
  --target-port 8001 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3

# Deploy donation-processing-service
echo "Deploying donation-processing-service..."
az containerapp create \
  --name donation-processing-service \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_LOGIN_SERVER/donation-processing-service:$TAG \
  --target-port 8002 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3

# Deploy admin-reporting-service
echo "Deploying admin-reporting-service..."
az containerapp create \
  --name admin-reporting-service \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_LOGIN_SERVER/admin-reporting-service:$TAG \
  --target-port 8003 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3

# Deploy withdrawal-service
echo "Deploying withdrawal-service..."
az containerapp create \
  --name withdrawal-service \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_LOGIN_SERVER/withdrawal-service:$TAG \
  --target-port 8004 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3

echo "All services deployed successfully!"
echo ""
echo "Service URLs:"
echo "User Service: https://user-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io"
echo "Cause Service: https://cause-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io"
echo "Donation Processing Service: https://donation-processing-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io"
echo "Admin Reporting Service: https://admin-reporting-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io"
echo "Withdrawal Service: https://withdrawal-service.grayocean-5aa1da5f.ukwest.azurecontainerapps.io" 