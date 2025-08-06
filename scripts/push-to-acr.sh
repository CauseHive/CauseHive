#!/bin/bash

# Azure Container Registry details
ACR_LOGIN_SERVER="causehiveacr.azurecr.io"
TAG="latest"

echo "Tagging and pushing images to Azure Container Registry..."

# Tag and push user-service
echo "Pushing user-service..."
docker tag causehive_user-service:latest $ACR_LOGIN_SERVER/user-service:$TAG
docker push $ACR_LOGIN_SERVER/user-service:$TAG

# Tag and push cause-service
echo "Pushing cause-service..."
docker tag causehive_cause-service:latest $ACR_LOGIN_SERVER/cause-service:$TAG
docker push $ACR_LOGIN_SERVER/cause-service:$TAG

# Tag and push donation-processing-service
echo "Pushing donation-processing-service..."
docker tag causehive_donation-processing-service:latest $ACR_LOGIN_SERVER/donation-processing-service:$TAG
docker push $ACR_LOGIN_SERVER/donation-processing-service:$TAG

# Tag and push admin-reporting-service
echo "Pushing admin-reporting-service..."
docker tag causehive_admin-reporting-service:latest $ACR_LOGIN_SERVER/admin-reporting-service:$TAG
docker push $ACR_LOGIN_SERVER/admin-reporting-service:$TAG

# Tag and push withdrawal-service
echo "Pushing withdrawal-service..."
docker tag causehive_withdrawal-service:latest $ACR_LOGIN_SERVER/withdrawal-service:$TAG
docker push $ACR_LOGIN_SERVER/withdrawal-service:$TAG

echo "All images pushed successfully to $ACR_LOGIN_SERVER" 