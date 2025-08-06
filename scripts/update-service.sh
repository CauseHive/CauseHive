#!/bin/bash

# Usage: ./update-service.sh <service-name>
# Example: ./update-service.sh withdrawal-service

if [ $# -eq 0 ]; then
    echo "Usage: $0 <service-name>"
    echo "Available services: user-service, cause-service, donation-processing-service, admin-reporting-service, withdrawal-service"
    exit 1
fi

SERVICE_NAME=$1
ACR_LOGIN_SERVER="causehiveacr.azurecr.io"
RESOURCE_GROUP="causehive-rg"
TAG="latest"

echo "Updating $SERVICE_NAME..."

# Rebuild the specific service
echo "Building $SERVICE_NAME..."
docker-compose build $SERVICE_NAME

# Tag and push the updated image
echo "Tagging and pushing $SERVICE_NAME..."
docker tag causehive_${SERVICE_NAME}:latest $ACR_LOGIN_SERVER/${SERVICE_NAME}:$TAG
docker push $ACR_LOGIN_SERVER/${SERVICE_NAME}:$TAG

# Update the Container App
echo "Updating Container App for $SERVICE_NAME..."
az containerapp update \
  --name $SERVICE_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_LOGIN_SERVER/${SERVICE_NAME}:$TAG

echo "$SERVICE_NAME updated successfully!"
echo "New image deployed to: https://$SERVICE_NAME.grayocean-5aa1da5f.ukwest.azurecontainerapps.io" 