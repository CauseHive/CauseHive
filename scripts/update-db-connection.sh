#!/bin/bash

echo "Updating Container Apps with Azure database connection..."

# Azure Database connection details
DB_HOST="causehive-dba.postgres.database.azure.com"
DB_USER="user_niicommey"
DB_NAME="causehive"
DB_PORT="5432"

# You'll need to provide the actual password
echo "Please enter your Azure database password:"
read -s DB_PASSWORD

# Common environment variables with actual Azure database
COMMON_ENV_VARS="--set-env-vars \
DEBUG=false \
DB_NAME=$DB_NAME \
DB_USER=$DB_USER \
DB_PASSWORD=$DB_PASSWORD \
DB_HOST=$DB_HOST \
DB_PORT=$DB_PORT \
SECRET_KEY=django-insecure-your-secret-key-here-change-in-production \
ADMIN_SERVICE_API_KEY=your-admin-api-key-here \
FRONTEND_URL=https://your-frontend-url.com \
BACKEND_URL=https://your-backend-url.com"

# Update each service with the correct database connection
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

echo "Database connection updated successfully!"
echo ""
echo "Database Details:"
echo "- Host: $DB_HOST"
echo "- User: $DB_USER"
echo "- Database: $DB_NAME"
echo "- Port: $DB_PORT" 