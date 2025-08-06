#!/bin/bash

echo "Adding environment variables to Container Apps..."

# Common environment variables for all services
COMMON_ENV_VARS="--set-env-vars \
DEBUG=false \
DB_NAME=causehive \
DB_USER=nii01 \
DB_PASSWORD=Nii01@pSQL \
DB_HOST=causehive-db.postgres.database.azure.com \
DB_PORT=5432 \
SECRET_KEY=django-insecure-your-secret-key-here-change-in-production \
ADMIN_SERVICE_API_KEY=your-admin-api-key-here \
FRONTEND_URL=https://your-frontend-url.com \
BACKEND_URL=https://your-backend-url.com"

# Update each service with environment variables
echo "Updating user-service..."
az containerapp update \
  --name user-service \
  --resource-group causehive-rg \
  $COMMON_ENV_VARS

echo "Updating cause-service..."
az containerapp update \
  --name cause-service \
  --resource-group causehive-rg \
  $COMMON_ENV_VARS

echo "Updating donation-processing-service..."
az containerapp update \
  --name donation-processing-service \
  --resource-group causehive-rg \
  $COMMON_ENV_VARS

echo "Updating admin-reporting-service..."
az containerapp update \
  --name admin-reporting-service \
  --resource-group causehive-rg \
  $COMMON_ENV_VARS

echo "Updating withdrawal-service..."
az containerapp update \
  --name withdrawal-service \
  --resource-group causehive-rg \
  $COMMON_ENV_VARS

echo "Environment variables updated successfully!"
echo ""
echo "Note: You may need to update the following values for production:"
echo "- SECRET_KEY: Generate a proper Django secret key"
echo "- ADMIN_SERVICE_API_KEY: Set a secure API key"
echo "- FRONTEND_URL: Your actual frontend URL"
echo "- BACKEND_URL: Your actual backend URL"
echo "- DB_HOST: Your actual database host" 